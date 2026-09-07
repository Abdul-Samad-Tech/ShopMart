import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import { martCategories } from './martData.js';

const seedCategories = async () => {
  await connectDB();
  console.log('Clearing categories...');
  await Category.deleteMany({});

  await Category.insertMany(martCategories);
  console.log('Categories seeded successfully!');
  
  await mongoose.disconnect();
};

seedCategories().catch((e) => {
  console.error(e);
  process.exit(1);
});
