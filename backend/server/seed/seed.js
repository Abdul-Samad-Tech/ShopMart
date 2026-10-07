import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SiteContent from '../models/SiteContent.js';
import Navigation from '../models/Navigation.js';
import Footer from '../models/Footer.js';
import Testimonial from '../models/Testimonial.js';
import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import {
  martProducts,
  martCategories,
  martSiteContent,
  martNavigation,
  martFooter,
} from './martData.js';

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const seed = async () => {
  await connectDB();
  console.log('Clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    SiteContent.deleteMany({}),
    Navigation.deleteMany({}),
    Footer.deleteMany({}),
    Testimonial.deleteMany({}),
    Notification.deleteMany({}),
    Order.deleteMany({}),
  ]);

  await Product.insertMany(
    martProducts.map((p) => ({
      ...p,
      slug: slugify(p.name),
      description: p.description || `${p.name} — quality you can trust, everyday low prices at ShopMart.`,
      stock: p.stock ?? 150,
      isLuxury: false,
    }))
  );

  await Category.insertMany(martCategories);

  await SiteContent.create({
    key: 'main',
    ...martSiteContent,
    about: {
      heroTitle: 'About ShopMart',
      heroSubtitle: 'Your neighborhood superstore — online and in spirit since 2020.',
      story: [
        'ShopMart brings supermarket shopping online: groceries, fresh produce, household essentials, and more.',
        'We work with trusted suppliers to keep shelves full and prices fair.',
      ],
      stats: [
        { value: '14', label: 'Departments' },
        { value: '2K+', label: 'Products' },
        { value: '50+', label: 'Brands' },
        { value: '7', label: 'Days open' },
      ],
      values: [
        { title: 'Fresh & Fair', description: 'Quality products at competitive prices.' },
        { title: 'Wide Selection', description: 'From pantry staples to electronics.' },
        { title: 'Easy Shopping', description: 'Search, filter, and checkout in minutes.' },
      ],
    },
    contact: {
      address: ['Main Boulevard, Lahore', 'Pakistan'],
      emails: ['support@shopmart.com'],
      phone: '+92 300 1234567',
      hours: ['Mon – Sun: 9am – 10pm'],
    },
  });

  await Navigation.create(martNavigation);

  await Footer.create({
    key: 'main',
    ...martFooter,
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com', label: 'Instagram' },
      { platform: 'Facebook', url: 'https://facebook.com', label: 'Facebook' },
    ],
    paymentBadges: ['Visa', 'Mastercard', 'Cash on Delivery'],
  });

  await Testimonial.insertMany([
    {
      name: 'Sara Ahmed',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      rating: 5,
      quote: 'Fresh produce and groceries delivered on time. Prices are better than my local market.',
      featured: true,
      order: 1,
    },
    {
      name: 'Hassan Khan',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      rating: 5,
      quote: 'One-stop shop for home, snacks, and personal care. Checkout is quick and easy.',
      featured: true,
      order: 2,
    },
    {
      name: 'Ayesha Malik',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
      rating: 5,
      quote: 'Weekly deals save our family budget. Love the department layout online.',
      featured: true,
      order: 3,
    },
  ]);

  const demoUser = await User.create({
    name: 'Demo Member',
    email: 'demo@shophub.com',
    password: 'demo123',
  });

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@shophub.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ShopMart@Admin2026';
  const adminName = process.env.ADMIN_NAME || 'ShopMart Admin';

  const adminUser = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  const allProducts = await Product.find().limit(3).lean();
  if (allProducts.length) {
    const items = allProducts.map((p) => ({
      product: p._id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.image,
    }));
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.1;
    await Order.insertMany([
      {
        user: demoUser._id,
        items,
        shipping: { city: 'New York', country: 'US' },
        paymentMethod: 'card',
        subtotal,
        tax,
        total: subtotal + tax,
        status: 'delivered',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        items: [items[0]],
        shipping: { city: 'Los Angeles', country: 'US' },
        paymentMethod: 'card',
        subtotal: items[0].price,
        tax: items[0].price * 0.1,
        total: items[0].price * 1.1,
        status: 'processing',
      },
    ]);
  }

  void adminUser;

  await Notification.insertMany([
    {
      broadcast: true,
      type: 'promo',
      title: 'Weekly Deals Live',
      message: 'Save on groceries and household essentials — free delivery over Rs. 50.',
      link: '/products',
    },
    {
      user: demoUser._id,
      type: 'success',
      title: 'Welcome to ShopMart',
      message: 'Your account is ready. Browse all departments and weekly deals.',
      link: '/dashboard',
    },
  ]);

  console.log('Seed complete.');
  console.log('ShopMart seeded. Demo: demo@shophub.com / demo123');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  console.log('Admin panel: http://localhost:5173/admin');
  await mongoose.disconnect();
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
