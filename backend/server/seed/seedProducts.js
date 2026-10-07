import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { martProducts } from './martData.js';

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const seedProducts = async () => {
  await connectDB();
  console.log('Clearing products...');
  await Product.deleteMany({});

  const products = martProducts.map((p) => ({
    ...p,
    slug: slugify(p.name),
    description: p.description || `${p.name} — quality you can trust, everyday low prices at ShopMart.`,
    stock: p.stock ?? 150,
    isLuxury: false,
  }));

  await Product.insertMany(products);
  console.log(`${products.length} products seeded successfully!`);
  
  await mongoose.disconnect();
};

seedProducts().catch((e) => {
  console.error(e);
  process.exit(1);
});
