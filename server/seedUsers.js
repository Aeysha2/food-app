import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB pour le seed...');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Restaurant Manager',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1 (555) 019-2834'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('Admin already exists');
    }

    // Check if demo user exists
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      await User.create({
        name: 'Sarah Connor',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1 (555) 345-6789',
        address: '742 Evergreen Terrace, Springfield'
      });
      console.log('✅ Demo user created');
    } else {
      console.log('Demo user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seed();
