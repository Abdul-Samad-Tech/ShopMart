/**
 * Create or reset admin user (does not wipe other data).
 * Usage: npm run admin:create
 */
import 'dotenv/config';
import connectDB from '../server/config/db.js';
import User from '../server/models/User.js';
import mongoose from 'mongoose';

const email = (process.env.ADMIN_EMAIL || 'admin@shophub.com').toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || 'ShopHub@Admin2026';
const name = process.env.ADMIN_NAME || 'ShopHub Admin';

await connectDB();

let user = await User.findOne({ email }).select('+password');

if (user) {
  user.name = name;
  user.password = password;
  user.role = 'admin';
  await user.save();
  console.log('Admin user updated.');
} else {
  user = await User.create({ name, email, password, role: 'admin' });
  console.log('Admin user created.');
}

console.log('');
console.log('Admin dashboard login:');
console.log('  Email:   ', email);
console.log('  Password:', password);
console.log('  URL:      http://localhost:5173/admin');
console.log('');

await mongoose.disconnect();
