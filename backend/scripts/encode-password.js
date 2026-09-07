/**
 * Encode password for MONGODB_URI (special chars: @ ! $ # etc.)
 *
 * Usage:
 *   node scripts/encode-password.js "your-password-here"
 *
 * PowerShell tip — use single quotes so $ is not stripped:
 *   node scripts/encode-password.js 'P@k!$t@n'
 */
import { readFileSync } from 'fs';

let password = process.argv[2];
if (password) {
  password = password.replace(/^['"]|['"]$/g, '');
}

if (!password && process.argv.includes('--file')) {
  const file = process.argv[process.argv.indexOf('--file') + 1] || '.mongo-password.txt';
  password = readFileSync(file, 'utf8').trim();
}

if (!password) {
  console.error('Usage: node scripts/encode-password.js "password"');
  console.error('   or: node scripts/encode-password.js --file .mongo-password.txt');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log(encoded);
console.log('');
console.log('Paste this line into .env:');
console.log(
  `MONGODB_URI=mongodb+srv://E-Commerce:${encoded}@cluster0.zbrjltw.mongodb.net/shophub?retryWrites=true&w=majority&authSource=admin`
);
