/**
 * Check if admin user exists in database
 */
import 'dotenv/config';
import connectDB from '../server/config/db.js';
import User from '../server/models/User.js';
import mongoose from 'mongoose';

const email = (process.env.ADMIN_EMAIL || 'admin@shophub.com').toLowerCase().trim();

await connectDB();

const user = await User.findOne({ email }).select('+password');

if (!user) {
  console.log('❌ Admin user NOT found in database');
  console.log('Email:', email);
  console.log('Run: npm run admin:create');
} else {
  console.log('✅ Admin user found:');
  console.log('Email:', user.email);
  console.log('Name:', user.name);
  console.log('Role:', user.role);
  console.log('Has password:', Boolean(user.password));
  console.log('Google ID:', user.googleId || 'None');
  console.log('Auth Provider:', user.authProvider);
}

await mongoose.disconnect();
