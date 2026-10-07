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
console.log('Sign in with the demo emails. Passwords come from ADMIN_PASSWORD and the demo user record, and are not printed here.');

await mongoose.disconnect();
