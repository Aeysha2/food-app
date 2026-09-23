import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

const items = [
  { name: 'Truffle Mushroom Burger', price: 14.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', description: 'Gourmet burger with truffle oil and wild mushrooms.', isVeg: false, prepTime: '15 min' },
  { name: 'Artisan Margherita Pizza', price: 16.50, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80', description: 'Wood-fired crust with San Marzano tomatoes.', isVeg: true, prepTime: '20 min' },
  { name: 'Spicy Pepperoni & Hot Honey', price: 18.25, category: 'Pizza', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80', description: 'Classic pepperoni drizzled with hot honey.', isVeg: false, prepTime: '20 min' },
  { name: 'Dragon Salmon Sushi Roll', price: 15.99, category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', description: 'Fresh salmon with avocado and spicy mayo.', isVeg: false, prepTime: '10 min' },
  { name: 'Crispy Avocado Crunch Bowl', price: 13.50, category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Quinoa, crispy avocado, and tahini dressing.', isVeg: true, prepTime: '12 min' },
  { name: 'Creamy Fettuccine Alfredo', price: 17.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80', description: 'Rich parmesan cream sauce over fresh pasta.', isVeg: true, prepTime: '18 min' },
  { name: 'Smoked BBQ Pulled Pork Burger', price: 15.75, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', description: 'Slow-smoked pork with tangy BBQ sauce.', isVeg: false, prepTime: '15 min' },
  { name: 'Molten Belgian Lava Cake', price: 8.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', description: 'Warm chocolate cake with a gooey center.', isVeg: true, prepTime: '8 min' },
  { name: 'Iced Passionfruit Mint Fizz', price: 5.50, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', description: 'Refreshing sparkling passionfruit drink.', isVeg: true, prepTime: '5 min' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB pour le seed des plats...');
    
    await MenuItem.deleteMany({});
    console.log('Anciens plats supprimés.');

    await MenuItem.insertMany(items);
    console.log('✅ Nouveaux plats insérés !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seed();
