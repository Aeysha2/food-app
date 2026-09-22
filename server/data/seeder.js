import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import { initialMenuItems } from './mockData.js';

export const seedDatabase = async () => {
  try {
    // --- Seed Users ---
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Initialisation des utilisateurs par défaut...');

      await User.create([
        {
          name: 'Restaurant Manager',
          email: 'admin@example.com',
          password: 'admin123', // will be hashed by pre-save hook
          role: 'admin',
          phone: '+1 (555) 019-2834'
        },
        {
          name: 'Sarah Connor',
          email: 'user@example.com',
          password: 'password123', // will be hashed by pre-save hook
          role: 'user',
          phone: '+1 (555) 345-6789',
          address: '742 Evergreen Terrace, Springfield'
        }
      ]);

      console.log('✅ Utilisateurs créés : admin@example.com & user@example.com');
    } else {
      console.log(`ℹ️  ${userCount} utilisateur(s) déjà en base — seed ignoré.`);
    }

    // --- Seed Menu Items ---
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      console.log('🌱 Initialisation du menu...');
      // Remove legacy string IDs — MongoDB will assign _id
      const cleanItems = initialMenuItems.map(({ id, ...rest }) => rest);
      await MenuItem.insertMany(cleanItems);
      console.log(`✅ ${cleanItems.length} plats insérés dans le menu.`);
    } else {
      console.log(`ℹ️  ${menuCount} plat(s) déjà en base — seed ignoré.`);
    }

    // --- Seed Orders (only if completely empty) ---
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('🌱 Initialisation des commandes de démonstration...');
      const adminUser = await User.findOne({ role: 'admin' });
      const demoUser = await User.findOne({ email: 'user@example.com' });
      const menuItems = await MenuItem.find().lean();

      if (menuItems.length > 0 && demoUser && adminUser) {
        const m = (name) => menuItems.find(i => i.name.includes(name.split(' ')[0]));
        const now = new Date();
        const d = (daysAgo, hour = 12) => {
          const dt = new Date(now);
          dt.setDate(dt.getDate() - daysAgo);
          dt.setHours(hour, 0, 0, 0);
          return dt;
        };

        const sampleOrders = [
          // Today
          {
            userId: demoUser._id.toString(), customerName: 'Sarah Connor', customerEmail: 'user@example.com',
            items: [{ itemId: m('Truffle')._id.toString(), name: m('Truffle').name, price: m('Truffle').price, quantity: 2, category: 'Burgers', image: m('Truffle').image },
                    { itemId: m('Passionfruit')._id.toString(), name: m('Passionfruit').name, price: m('Passionfruit').price, quantity: 1, category: 'Drinks', image: m('Passionfruit').image }],
            subtotal: 35.48, tax: 2.84, deliveryFee: 3.50, totalAmount: 41.82,
            deliveryAddress: '742 Evergreen Terrace, Springfield', phone: '+1 (555) 345-6789',
            paymentMethod: 'Credit Card', status: 'Preparing Food', createdAt: d(0, 12)
          },
          {
            userId: 'guest-user', customerName: 'Alexandre Martin', customerEmail: 'alex.martin@gmail.com',
            items: [{ itemId: m('Margherita')._id.toString(), name: m('Margherita').name, price: m('Margherita').price, quantity: 2, category: 'Pizza', image: m('Margherita').image }],
            subtotal: 33.00, tax: 2.64, deliveryFee: 0, totalAmount: 35.64,
            deliveryAddress: '14 Rue de Rivoli, Paris', phone: '+33 6 12 34 56 78',
            paymentMethod: 'Apple Pay', status: 'Out for Delivery', createdAt: d(0, 10)
          },
          // Yesterday
          {
            userId: demoUser._id.toString(), customerName: 'Sarah Connor', customerEmail: 'user@example.com',
            items: [{ itemId: m('Fettuccine')._id.toString(), name: m('Fettuccine').name, price: m('Fettuccine').price, quantity: 2, category: 'Pasta', image: m('Fettuccine').image },
                    { itemId: m('Molten')._id.toString(), name: m('Molten').name, price: m('Molten').price, quantity: 2, category: 'Desserts', image: m('Molten').image }],
            subtotal: 51.98, tax: 4.16, deliveryFee: 0, totalAmount: 56.14,
            deliveryAddress: '742 Evergreen Terrace, Springfield', phone: '+1 (555) 345-6789',
            paymentMethod: 'Credit Card', status: 'Delivered', createdAt: d(1, 19)
          },
          // 2 days ago
          {
            userId: 'guest-user', customerName: 'Lucas Moreau', customerEmail: 'lucas.m@yahoo.fr',
            items: [{ itemId: m('Truffle')._id.toString(), name: m('Truffle').name, price: m('Truffle').price, quantity: 3, category: 'Burgers', image: m('Truffle').image },
                    { itemId: m('Spicy')._id.toString(), name: m('Spicy').name, price: m('Spicy').price, quantity: 1, category: 'Pizza', image: m('Spicy').image }],
            subtotal: 63.22, tax: 5.06, deliveryFee: 0, totalAmount: 68.28,
            deliveryAddress: '7 Quai Branly, Paris', phone: '+33 6 77 88 99 00',
            paymentMethod: 'Credit Card', status: 'Delivered', createdAt: d(2, 20)
          },
          // 4 days ago
          {
            userId: 'guest-user', customerName: 'Emma Watson', customerEmail: 'emma.w@gmail.com',
            items: [{ itemId: m('Avocado')._id.toString(), name: m('Avocado').name, price: m('Avocado').price, quantity: 2, category: 'Healthy', image: m('Avocado').image }],
            subtotal: 27.00, tax: 2.16, deliveryFee: 3.50, totalAmount: 32.66,
            deliveryAddress: '33 Rue de la Paix, Paris', phone: '+33 6 44 33 22 11',
            paymentMethod: 'Credit Card', status: 'Delivered', createdAt: d(4, 12)
          },
          // 7 days ago
          {
            userId: 'guest-user', customerName: 'Antoine Girard', customerEmail: 'antoine.g@free.fr',
            items: [{ itemId: m('Dragon')._id.toString(), name: m('Dragon').name, price: m('Dragon').price, quantity: 3, category: 'Asian', image: m('Dragon').image },
                    { itemId: m('Passionfruit')._id.toString(), name: m('Passionfruit').name, price: m('Passionfruit').price, quantity: 3, category: 'Drinks', image: m('Passionfruit').image }],
            subtotal: 64.47, tax: 5.16, deliveryFee: 0, totalAmount: 69.63,
            deliveryAddress: '90 Rue de Rennes, Paris', phone: '+33 6 22 33 44 55',
            paymentMethod: 'Apple Pay', status: 'Delivered', createdAt: d(7, 19)
          },
          // 12 days ago
          {
            userId: 'guest-user', customerName: 'Camille Roux', customerEmail: 'camille.r@gmail.com',
            items: [{ itemId: m('BBQ')._id.toString(), name: m('BBQ').name, price: m('BBQ').price, quantity: 2, category: 'Burgers', image: m('BBQ').image },
                    { itemId: m('Molten')._id.toString(), name: m('Molten').name, price: m('Molten').price, quantity: 2, category: 'Desserts', image: m('Molten').image }],
            subtotal: 49.48, tax: 3.96, deliveryFee: 0, totalAmount: 53.44,
            deliveryAddress: '15 Rue de Vaugirard, Paris', phone: '+33 6 33 22 11 00',
            paymentMethod: 'Credit Card', status: 'Delivered', createdAt: d(12, 13)
          },
          // 17 days ago
          {
            userId: 'guest-user', customerName: 'Nicolas Petit', customerEmail: 'nicolas.p@gmail.com',
            items: [{ itemId: m('Margherita')._id.toString(), name: m('Margherita').name, price: m('Margherita').price, quantity: 2, category: 'Pizza', image: m('Margherita').image },
                    { itemId: m('Fettuccine')._id.toString(), name: m('Fettuccine').name, price: m('Fettuccine').price, quantity: 1, category: 'Pasta', image: m('Fettuccine').image }],
            subtotal: 50.00, tax: 4.00, deliveryFee: 0, totalAmount: 54.00,
            deliveryAddress: '42 Avenue des Gobelins, Paris', phone: '+33 6 99 88 77 66',
            paymentMethod: 'Credit Card', status: 'Delivered', createdAt: d(17, 20)
          },
          // 21 days ago
          {
            userId: 'guest-user', customerName: 'Laura Mercier', customerEmail: 'laura.m@laposte.net',
            items: [{ itemId: m('Truffle')._id.toString(), name: m('Truffle').name, price: m('Truffle').price, quantity: 2, category: 'Burgers', image: m('Truffle').image }],
            subtotal: 29.98, tax: 2.40, deliveryFee: 3.50, totalAmount: 35.88,
            deliveryAddress: '19 Boulevard Saint-Germain, Paris', phone: '+33 6 12 98 34 76',
            paymentMethod: 'Apple Pay', status: 'Delivered', createdAt: d(21, 12)
          },
        ];

        for (const orderData of sampleOrders) {
          const order = new Order(orderData);
          await order.save();
        }
        console.log(`✅ ${sampleOrders.length} commandes de démonstration créées.`);
      }
    } else {
      console.log(`ℹ️  ${orderCount} commande(s) déjà en base — seed ignoré.`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
  }
};
