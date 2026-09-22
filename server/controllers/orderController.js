import { db } from '../data/store.js';

// Calculate order total with server-side price enforcement
export const createOrder = (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod, deliveryNotes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: 'Delivery address is required.' });
    }

    // Secure item lookup & pricing from server state
    let subtotal = 0;
    const verifiedItems = [];

    for (const orderItem of items) {
      const dbItem = db.getMenuItemById(orderItem.id);
      if (!dbItem) {
        return res.status(400).json({ message: `Item with ID ${orderItem.id} no longer exists.` });
      }

      if (!dbItem.isAvailable) {
        return res.status(400).json({ message: `Item "${dbItem.name}" is currently sold out.` });
      }

      const qty = Math.max(1, parseInt(orderItem.quantity) || 1);
      const itemSubtotal = dbItem.price * qty;
      subtotal += itemSubtotal;

      verifiedItems.push({
        id: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: qty,
        image: dbItem.image,
        category: dbItem.category
      });
    }

    // Calculations
    const taxRate = 0.08; // 8% sales tax
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const deliveryFee = subtotal >= 45 ? 0 : 3.50; // Free delivery over $45
    const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const newOrder = db.createOrder({
      userId: req.user ? req.user.id : 'guest-user',
      customerName: req.user ? req.user.name : (req.body.customerName || 'Guest Customer'),
      customerEmail: req.user ? req.user.email : (req.body.customerEmail || 'guest@example.com'),
      items: verifiedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      deliveryFee,
      totalAmount,
      deliveryAddress,
      phone: phone || '',
      deliveryNotes: deliveryNotes || '',
      paymentMethod: paymentMethod || 'Credit Card'
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to place order.' });
  }
};

// Get current user's orders
export const getUserOrders = (req, res) => {
  try {
    const orders = db.getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your orders.' });
  }
};

// Get single order by ID (for live tracking)
export const getOrderById = (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order.' });
  }
};

// Admin: Get all orders across the restaurant
export const getAllOrders = (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders.' });
  }
};

// Admin: Update order status (Order Placed -> Preparing Food -> Out for Delivery -> Delivered)
export const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Order Placed', 'Preparing Food', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = db.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated successfully', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status.' });
  }
};

// Admin: Generate Daily, Monthly, and Annual Reports
export const getOrderReports = (req, res) => {
  try {
    const { period = 'daily', date, month, year } = req.query;
    const allOrders = db.getOrders();

    // Default dates based on current server date or query
    const todayStr = new Date().toISOString().split('T')[0]; // e.g. 2026-09-22
    const targetDate = date || todayStr;
    const targetMonth = month || targetDate.slice(0, 7); // e.g. 2026-09
    const targetYear = year || targetDate.slice(0, 4); // e.g. 2026

    let filteredOrders = [];
    let timeline = [];

    if (period === 'daily') {
      filteredOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(targetDate));

      const hoursMap = {};
      for (let h = 8; h <= 23; h++) {
        const label = `${String(h).padStart(2, '0')}:00`;
        hoursMap[label] = { label, revenue: 0, count: 0 };
      }

      filteredOrders.forEach(o => {
        const d = new Date(o.createdAt);
        const h = `${String(d.getHours()).padStart(2, '0')}:00`;
        if (hoursMap[h]) {
          hoursMap[h].revenue = Math.round((hoursMap[h].revenue + (o.totalAmount || 0)) * 100) / 100;
          hoursMap[h].count += 1;
        }
      });
      timeline = Object.values(hoursMap);
    } else if (period === 'monthly') {
      filteredOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(targetMonth));

      const [yr, mo] = targetMonth.split('-').map(Number);
      const daysInMonth = new Date(yr, mo, 0).getDate();
      const daysMap = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = String(d).padStart(2, '0');
        const key = `${targetMonth}-${dayStr}`;
        daysMap[key] = { label: `${d}`, fullDate: key, revenue: 0, count: 0 };
      }

      filteredOrders.forEach(o => {
        const dateKey = o.createdAt ? o.createdAt.slice(0, 10) : '';
        if (daysMap[dateKey]) {
          daysMap[dateKey].revenue = Math.round((daysMap[dateKey].revenue + (o.totalAmount || 0)) * 100) / 100;
          daysMap[dateKey].count += 1;
        }
      });
      timeline = Object.values(daysMap);
    } else if (period === 'annual') {
      filteredOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(targetYear));

      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const monthsMap = {};
      for (let m = 1; m <= 12; m++) {
        const mKey = `${targetYear}-${String(m).padStart(2, '0')}`;
        monthsMap[mKey] = { label: monthNames[m - 1], shortLabel: monthNames[m - 1].slice(0, 4), monthKey: mKey, revenue: 0, count: 0 };
      }

      filteredOrders.forEach(o => {
        const mKey = o.createdAt ? o.createdAt.slice(0, 7) : '';
        if (monthsMap[mKey]) {
          monthsMap[mKey].revenue = Math.round((monthsMap[mKey].revenue + (o.totalAmount || 0)) * 100) / 100;
          monthsMap[mKey].count += 1;
        }
      });
      timeline = Object.values(monthsMap);
    }

    // Key Performance Indicators (KPIs)
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const subtotal = filteredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const totalTax = filteredOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
    const totalDeliveryFees = filteredOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Item stats & categories & payment methods
    const itemStats = {};
    const categoryStats = {};
    const statusCounts = {
      'Delivered': 0,
      'Preparing Food': 0,
      'Out for Delivery': 0,
      'Order Placed': 0,
      'Cancelled': 0
    };
    const paymentMethods = {};

    filteredOrders.forEach(o => {
      // Status count
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      } else {
        statusCounts[o.status] = 1;
      }

      // Payment method
      const pm = o.paymentMethod || 'Other';
      paymentMethods[pm] = (paymentMethods[pm] || 0) + 1;

      // Item breakdown
      if (Array.isArray(o.items)) {
        o.items.forEach(it => {
          if (!itemStats[it.name]) {
            itemStats[it.name] = {
              name: it.name,
              category: it.category || 'Other',
              price: it.price || 0,
              quantity: 0,
              totalRevenue: 0,
              image: it.image
            };
          }
          const q = it.quantity || 1;
          itemStats[it.name].quantity += q;
          itemStats[it.name].totalRevenue = Math.round((itemStats[it.name].totalRevenue + (it.price || 0) * q) * 100) / 100;

          const cat = it.category || 'General';
          categoryStats[cat] = Math.round(((categoryStats[cat] || 0) + (it.price || 0) * q) * 100) / 100;
        });
      }
    });

    const topDishes = Object.values(itemStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

    const categoryBreakdown = Object.entries(categoryStats).map(([cat, rev]) => ({
      category: cat,
      revenue: rev,
      percentage: totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    res.json({
      period,
      targetDate,
      targetMonth,
      targetYear,
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        totalDeliveryFees: Math.round(totalDeliveryFees * 100) / 100,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        deliveredCount: statusCounts['Delivered'] || 0,
        statusCounts,
        paymentMethods
      },
      topDishes,
      categoryBreakdown,
      timeline,
      orders: filteredOrders
    });
  } catch (error) {
    console.error('Reports calculation error:', error);
    res.status(500).json({ message: 'Error compiling report data' });
  }
};
