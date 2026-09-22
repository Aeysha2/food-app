import bcrypt from 'bcryptjs';
import { initialMenuItems, initialCategories } from './mockData.js';

// In-memory persistent database store with real-world seed records
class DataStore {
  constructor() {
    this.categories = [...initialCategories];
    this.menuItems = [...initialMenuItems];
    this.orders = [];
    this.users = [];

    this.initDefaultUsers();
  }

  async initDefaultUsers() {
    const userPass = await bcrypt.hash('password123', 10);
    const adminPass = await bcrypt.hash('admin123', 10);

    this.users = [
      {
        id: 'usr-admin',
        name: 'Restaurant Manager',
        email: 'admin@example.com',
        password: adminPass,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-demo',
        name: 'Sarah Connor',
        email: 'user@example.com',
        password: userPass,
        role: 'user',
        phone: '+1 (555) 345-6789',
        address: '742 Evergreen Terrace, Springfield',
        createdAt: new Date().toISOString()
      }
    ];

    // Seed realistic past and today orders for reporting visualization
    this.orders = this.getSeedOrders();
  }

  getSeedOrders() {
    return [
      // Today: 2026-09-22
      {
        id: 'ORD-9201',
        userId: 'usr-demo',
        customerName: 'Sarah Connor',
        customerEmail: 'user@example.com',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 2, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 1, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 35.48, tax: 2.84, deliveryFee: 3.50, totalAmount: 41.82,
        deliveryAddress: '742 Evergreen Terrace, Springfield',
        phone: '+1 (555) 345-6789', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Preparing Food', createdAt: '2026-09-22T12:45:00.000Z', estimatedDeliveryTime: '30-40 min'
      },
      {
        id: 'ORD-9202',
        userId: 'guest-user',
        customerName: 'Alexandre Martin',
        customerEmail: 'alex.martin@gmail.com',
        items: [
          { id: 'item-2', name: 'Artisan Margherita Pizza', price: 16.50, quantity: 2, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-8', name: 'Molten Belgian Lava Cake', price: 8.99, quantity: 1, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 41.99, tax: 3.36, deliveryFee: 0, totalAmount: 45.35,
        deliveryAddress: '14 Rue de Rivoli, Paris',
        phone: '+33 6 12 34 56 78', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Out for Delivery', createdAt: '2026-09-22T12:10:00.000Z', estimatedDeliveryTime: '15-20 min'
      },
      {
        id: 'ORD-9203',
        userId: 'guest-user',
        customerName: 'Julie Dupont',
        customerEmail: 'julie.dupont@orange.fr',
        items: [
          { id: 'item-5', name: 'Crispy Avocado Crunch Bowl', price: 13.50, quantity: 1, category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 24.50, tax: 1.96, deliveryFee: 3.50, totalAmount: 29.96,
        deliveryAddress: '88 Boulevard Haussmann, Paris',
        phone: '+33 6 98 76 54 32', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-22T11:20:00.000Z', estimatedDeliveryTime: 'Delivered'
      },
      {
        id: 'ORD-9204',
        userId: 'guest-user',
        customerName: 'Marc Tremblay',
        customerEmail: 'marc.t@outlook.com',
        items: [
          { id: 'item-3', name: 'Spicy Pepperoni & Hot Honey', price: 18.25, quantity: 1, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-4', name: 'Dragon Salmon Sushi Roll', price: 15.99, quantity: 1, category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 34.24, tax: 2.74, deliveryFee: 3.50, totalAmount: 40.48,
        deliveryAddress: '25 Avenue Montaigne, Paris',
        phone: '+33 7 45 67 89 01', paymentMethod: 'Cash on Delivery', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-22T10:05:00.000Z', estimatedDeliveryTime: 'Delivered'
      },
      {
        id: 'ORD-9205',
        userId: 'guest-user',
        customerName: 'Thomas Bernard',
        customerEmail: 't.bernard@gmail.com',
        items: [
          { id: 'item-7', name: 'Smoked BBQ Pulled Pork Burger', price: 15.75, quantity: 2, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 42.50, tax: 3.40, deliveryFee: 0, totalAmount: 45.90,
        deliveryAddress: '5 Place de la Concorde, Paris',
        phone: '+33 6 11 22 33 44', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-22T09:30:00.000Z', estimatedDeliveryTime: 'Delivered'
      },
      // Past days of September 2026
      {
        id: 'ORD-9190',
        userId: 'usr-demo',
        customerName: 'Sarah Connor',
        customerEmail: 'user@example.com',
        items: [
          { id: 'item-6', name: 'Creamy Fettuccine Alfredo', price: 17.00, quantity: 2, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-8', name: 'Molten Belgian Lava Cake', price: 8.99, quantity: 2, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 51.98, tax: 4.16, deliveryFee: 0, totalAmount: 56.14,
        deliveryAddress: '742 Evergreen Terrace, Springfield',
        phone: '+1 (555) 345-6789', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-21T19:40:00.000Z'
      },
      {
        id: 'ORD-9191',
        userId: 'guest-user',
        customerName: 'Sophie Leroy',
        customerEmail: 'sophie.l@gmail.com',
        items: [
          { id: 'item-2', name: 'Artisan Margherita Pizza', price: 16.50, quantity: 2, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 44.00, tax: 3.52, deliveryFee: 3.50, totalAmount: 51.02,
        deliveryAddress: '12 Rue Saint-Honoré, Paris',
        phone: '+33 6 55 44 33 22', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-21T13:15:00.000Z'
      },
      {
        id: 'ORD-9180',
        userId: 'guest-user',
        customerName: 'Lucas Moreau',
        customerEmail: 'lucas.m@yahoo.fr',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 3, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-3', name: 'Spicy Pepperoni & Hot Honey', price: 18.25, quantity: 1, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 63.22, tax: 5.06, deliveryFee: 0, totalAmount: 68.28,
        deliveryAddress: '7 Quai Branly, Paris',
        phone: '+33 6 77 88 99 00', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-20T20:10:00.000Z'
      },
      {
        id: 'ORD-9170',
        userId: 'guest-user',
        customerName: 'Emma Watson',
        customerEmail: 'emma.w@gmail.com',
        items: [
          { id: 'item-5', name: 'Crispy Avocado Crunch Bowl', price: 13.50, quantity: 2, category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 27.00, tax: 2.16, deliveryFee: 3.50, totalAmount: 32.66,
        deliveryAddress: '33 Rue de la Paix, Paris',
        phone: '+33 6 44 33 22 11', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-18T12:30:00.000Z'
      },
      {
        id: 'ORD-9160',
        userId: 'guest-user',
        customerName: 'Antoine Girard',
        customerEmail: 'antoine.g@free.fr',
        items: [
          { id: 'item-4', name: 'Dragon Salmon Sushi Roll', price: 15.99, quantity: 3, category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 3, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 64.47, tax: 5.16, deliveryFee: 0, totalAmount: 69.63,
        deliveryAddress: '90 Rue de Rennes, Paris',
        phone: '+33 6 22 33 44 55', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-15T19:00:00.000Z'
      },
      {
        id: 'ORD-9150',
        userId: 'guest-user',
        customerName: 'Camille Roux',
        customerEmail: 'camille.r@gmail.com',
        items: [
          { id: 'item-7', name: 'Smoked BBQ Pulled Pork Burger', price: 15.75, quantity: 2, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-8', name: 'Molten Belgian Lava Cake', price: 8.99, quantity: 2, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 49.48, tax: 3.96, deliveryFee: 0, totalAmount: 53.44,
        deliveryAddress: '15 Rue de Vaugirard, Paris',
        phone: '+33 6 33 22 11 00', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-10T13:45:00.000Z'
      },
      {
        id: 'ORD-9140',
        userId: 'guest-user',
        customerName: 'Nicolas Petit',
        customerEmail: 'nicolas.p@gmail.com',
        items: [
          { id: 'item-2', name: 'Artisan Margherita Pizza', price: 16.50, quantity: 2, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-6', name: 'Creamy Fettuccine Alfredo', price: 17.00, quantity: 1, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 50.00, tax: 4.00, deliveryFee: 0, totalAmount: 54.00,
        deliveryAddress: '42 Avenue des Gobelins, Paris',
        phone: '+33 6 99 88 77 66', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-05T20:20:00.000Z'
      },
      {
        id: 'ORD-9130',
        userId: 'guest-user',
        customerName: 'Laura Mercier',
        customerEmail: 'laura.m@laposte.net',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 2, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 40.98, tax: 3.28, deliveryFee: 3.50, totalAmount: 47.76,
        deliveryAddress: '19 Boulevard Saint-Germain, Paris',
        phone: '+33 6 12 98 34 76', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-09-01T12:15:00.000Z'
      },
      // Earlier months of 2026
      {
        id: 'ORD-8890',
        userId: 'guest-user',
        customerName: 'Romain Bonnet',
        customerEmail: 'romain.b@gmail.com',
        items: [
          { id: 'item-3', name: 'Spicy Pepperoni & Hot Honey', price: 18.25, quantity: 3, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 54.75, tax: 4.38, deliveryFee: 0, totalAmount: 59.13,
        deliveryAddress: '8 Rue Lafayette, Paris',
        phone: '+33 6 88 77 66 55', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-08-25T19:30:00.000Z'
      },
      {
        id: 'ORD-8870',
        userId: 'guest-user',
        customerName: 'Claire Fontaine',
        customerEmail: 'claire.f@yahoo.com',
        items: [
          { id: 'item-4', name: 'Dragon Salmon Sushi Roll', price: 15.99, quantity: 2, category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-8', name: 'Molten Belgian Lava Cake', price: 8.99, quantity: 2, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 49.96, tax: 4.00, deliveryFee: 0, totalAmount: 53.96,
        deliveryAddress: '6 Rue de Sèvres, Paris',
        phone: '+33 6 45 78 12 34', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-08-12T13:00:00.000Z'
      },
      {
        id: 'ORD-8750',
        userId: 'guest-user',
        customerName: 'Julien Richard',
        customerEmail: 'j.richard@gmail.com',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 4, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 4, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 81.96, tax: 6.56, deliveryFee: 0, totalAmount: 88.52,
        deliveryAddress: '10 Place de la Bastille, Paris',
        phone: '+33 6 54 32 10 98', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-07-20T20:45:00.000Z'
      },
      {
        id: 'ORD-8620',
        userId: 'guest-user',
        customerName: 'Pauline Guerin',
        customerEmail: 'pauline.g@gmail.com',
        items: [
          { id: 'item-2', name: 'Artisan Margherita Pizza', price: 16.50, quantity: 3, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 49.50, tax: 3.96, deliveryFee: 0, totalAmount: 53.46,
        deliveryAddress: '55 Rue Oberkampf, Paris',
        phone: '+33 6 11 99 22 88', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-06-15T12:30:00.000Z'
      },
      {
        id: 'ORD-8510',
        userId: 'guest-user',
        customerName: 'Fabien Colin',
        customerEmail: 'f.colin@gmail.com',
        items: [
          { id: 'item-6', name: 'Creamy Fettuccine Alfredo', price: 17.00, quantity: 2, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-7', name: 'Smoked BBQ Pulled Pork Burger', price: 15.75, quantity: 1, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 49.75, tax: 3.98, deliveryFee: 0, totalAmount: 53.73,
        deliveryAddress: '2 Rue Beaubourg, Paris',
        phone: '+33 6 33 44 55 66', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-05-18T19:15:00.000Z'
      },
      {
        id: 'ORD-8400',
        userId: 'guest-user',
        customerName: 'Elodie Marchand',
        customerEmail: 'elodie.m@gmail.com',
        items: [
          { id: 'item-3', name: 'Spicy Pepperoni & Hot Honey', price: 18.25, quantity: 2, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 47.50, tax: 3.80, deliveryFee: 0, totalAmount: 51.30,
        deliveryAddress: '14 Boulevard Diderot, Paris',
        phone: '+33 6 77 11 22 33', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-04-10T13:00:00.000Z'
      },
      {
        id: 'ORD-8300',
        userId: 'guest-user',
        customerName: 'Maxime Vidal',
        customerEmail: 'm.vidal@gmail.com',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 3, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 44.97, tax: 3.60, deliveryFee: 3.50, totalAmount: 52.07,
        deliveryAddress: '28 Rue de Charonne, Paris',
        phone: '+33 6 90 80 70 60', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-03-22T20:00:00.000Z'
      },
      {
        id: 'ORD-8200',
        userId: 'guest-user',
        customerName: 'Chloe Dumas',
        customerEmail: 'chloe.d@gmail.com',
        items: [
          { id: 'item-8', name: 'Molten Belgian Lava Cake', price: 8.99, quantity: 4, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-9', name: 'Iced Passionfruit Mint Fizz', price: 5.50, quantity: 2, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 46.96, tax: 3.76, deliveryFee: 0, totalAmount: 50.72,
        deliveryAddress: '17 Rue de Belleville, Paris',
        phone: '+33 6 12 34 00 99', paymentMethod: 'Apple Pay', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-02-14T21:00:00.000Z'
      },
      {
        id: 'ORD-8100',
        userId: 'guest-user',
        customerName: 'Hugo Simon',
        customerEmail: 'hugo.s@gmail.com',
        items: [
          { id: 'item-2', name: 'Artisan Margherita Pizza', price: 16.50, quantity: 2, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
          { id: 'item-7', name: 'Smoked BBQ Pulled Pork Burger', price: 15.75, quantity: 1, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 48.75, tax: 3.90, deliveryFee: 0, totalAmount: 52.65,
        deliveryAddress: '3 Place d’Italie, Paris',
        phone: '+33 6 66 55 44 33', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2026-01-18T19:30:00.000Z'
      },
      // Previous year 2025
      {
        id: 'ORD-7500',
        userId: 'guest-user',
        customerName: 'Marine Robin',
        customerEmail: 'm.robin@gmail.com',
        items: [
          { id: 'item-1', name: 'Truffle Mushroom Burger', price: 14.99, quantity: 2, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 29.98, tax: 2.40, deliveryFee: 3.50, totalAmount: 35.88,
        deliveryAddress: '8 Rue Monge, Paris',
        phone: '+33 6 99 00 11 22', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2025-11-20T12:00:00.000Z'
      },
      {
        id: 'ORD-7600',
        userId: 'guest-user',
        customerName: 'David Meyer',
        customerEmail: 'd.meyer@gmail.com',
        items: [
          { id: 'item-3', name: 'Spicy Pepperoni & Hot Honey', price: 18.25, quantity: 3, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' }
        ],
        subtotal: 54.75, tax: 4.38, deliveryFee: 0, totalAmount: 59.13,
        deliveryAddress: '21 Rue Mouffetard, Paris',
        phone: '+33 6 88 99 00 11', paymentMethod: 'Credit Card', paymentStatus: 'Paid',
        status: 'Delivered', createdAt: '2025-12-15T19:45:00.000Z'
      }
    ];
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  addUser(user) {
    this.users.push(user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Menu methods
  getMenu() {
    return this.menuItems;
  }

  getCategories() {
    return this.categories;
  }

  getMenuItemById(id) {
    return this.menuItems.find((item) => item.id === id);
  }

  addMenuItem(item) {
    const newItem = {
      id: `item-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: true,
      ...item
    };
    this.menuItems.unshift(newItem);
    return newItem;
  }

  updateMenuItem(id, updates) {
    const index = this.menuItems.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.menuItems[index] = { ...this.menuItems[index], ...updates };
    return this.menuItems[index];
  }

  deleteMenuItem(id) {
    const index = this.menuItems.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.menuItems.splice(index, 1);
    return true;
  }

  // Order methods
  getOrders() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrdersByUser(userId) {
    return this.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(orderData) {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      paymentStatus: 'Paid',
      estimatedDeliveryTime: '30-45 min',
      ...orderData
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export const db = new DataStore();
