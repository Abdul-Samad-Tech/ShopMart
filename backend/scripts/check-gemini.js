import '../server/config/env.js';
import { isValidGeminiKey, normalizeApiKey, testGeminiKey } from '../server/services/gemini.js';

const key = normalizeApiKey(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);

if (!isValidGeminiKey(key)) {
  console.log('❌ Key format invalid in .env');
  console.log('   Use ONE key only: GEMINI_API_KEY=AIzaSy...');
  if (key) console.log(`   Found: ${key.slice(0, 20)}… (length ${key.length})`);
  process.exit(1);
}

if (key.includes('AQ.') && key.includes('AIza')) {
  console.log('❌ .env has TWO keys on one line. Keep only AIzaSy... key');
  process.exit(1);
}

try {
  const result = await testGeminiKey(key);
  console.log(`✓ Gemini works: ${result.preview}`);
} catch (err) {
  console.log('❌ Google rejected this key:', err.message);
  console.log('   Create new key: https://aistudio.google.com/apikey');
  process.exit(1);
}
