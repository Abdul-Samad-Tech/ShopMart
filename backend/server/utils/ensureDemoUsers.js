import User from '../models/User.js';

const DEMO_ACCOUNTS = [
  { name: 'Demo Member', email: 'demo@shophub.com', password: 'demo123', role: 'user' },
  {
    name: process.env.ADMIN_NAME || 'ShopHub Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@shophub.com').toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || 'ShopHub@Admin2026',
    role: 'admin',
  },
];

/** Ensures demo/admin can always sign in with password (dev + after seed). */
export async function ensureDemoUsers() {
  for (const acc of DEMO_ACCOUNTS) {
    const email = acc.email.toLowerCase().trim();
    let user = await User.findOne({ email }).select('+password');
    if (user) {
      user.name = acc.name;
      user.password = acc.password;
      user.role = acc.role;
      user.authProvider = 'local';
      user.set('googleId', undefined);
      await user.save();
    } else {
      await User.create({ ...acc, email, authProvider: 'local' });
    }
  }
}
