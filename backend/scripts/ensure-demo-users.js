/**
 * Reset demo + admin passwords without wiping the whole database.
 * Usage: npm run users:reset
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../server/config/db.js';
import { ensureDemoUsers } from '../server/utils/ensureDemoUsers.js';

await connectDB();
await ensureDemoUsers();
console.log('Updated demo + admin accounts.');

console.log('\nDemo: demo@shophub.com / demo123');
console.log('Admin: admin@shophub.com / ShopHub@Admin2026\n');

await mongoose.disconnect();
