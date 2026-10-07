import dns from 'dns';
import mongoose from 'mongoose';

// Helps on some Windows networks where SRV lookup prefers IPv6 incorrectly
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/shophub';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  });
  console.log(`MongoDB connected: ${mongoose.connection.host} (${mongoose.connection.name})`);
};

export default connectDB;
