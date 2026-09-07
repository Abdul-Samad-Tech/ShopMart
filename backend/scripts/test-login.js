/**
 * Quick login test: node scripts/test-login.js
 */
import 'dotenv/config';
import axios from 'axios';

const base = process.env.API_URL || 'http://localhost:5000/api';

try {
  const { data } = await axios.post(`${base}/auth/login`, {
    email: 'demo@shophub.com',
    password: 'demo123',
  });
  console.log('OK — logged in as', data.user?.email, '| role:', data.user?.role);
} catch (err) {
  console.error('FAIL:', err.response?.data?.message || err.message);
  process.exit(1);
}
