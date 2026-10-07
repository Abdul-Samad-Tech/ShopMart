import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';

dns.setDefaultResultOrder('ipv4first');

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/shophub';

if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.error('FAIL — MONGODB_URI is missing in .env');
  console.error('Add: MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.../shophub?...');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000, family: 4 });
  console.log('OK — MongoDB connected:', mongoose.connection.host);
  console.log('Database:', mongoose.connection.name);
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('FAIL — Could not connect to MongoDB');
  console.error(err.message);
  process.exit(1);
}
