import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';

const SYSTEM_PROMPT = `You are ShopHub Assistant for a supermarket (like Metro or Imtiaz Mart).
Help with groceries, fresh produce, household items, deals, delivery, returns, and store navigation.
Be concise and practical. Use USD for prices.
Suggest browsing /products or departments. For orders, direct users to their dashboard.`;

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

const PLACEHOLDER_MARKERS = ['PASTE_YOUR', 'YOUR_KEY', 'xxx', 'placeholder', 'API_KEY_HERE'];

export function normalizeApiKey(raw) {
  return String(raw || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

export function isValidGeminiKey(key) {
  const k = normalizeApiKey(key);
  if (k.length < 20) return false;
  const upper = k.toUpperCase();
  if (PLACEHOLDER_MARKERS.some((m) => upper.includes(m))) return false;
  if (k.includes('.apps.googleusercontent.com') || k.includes('@') || /\s/.test(k)) return false;
  return /^[A-Za-z0-9_.\-]+$/.test(k);
}

export function getEnvApiKey() {
  return normalizeApiKey(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
}

export function resolveApiKey(override) {
  const env = getEnvApiKey();
  if (isValidGeminiKey(env)) return env;
  const client = normalizeApiKey(override);
  if (isValidGeminiKey(client)) return client;
  return '';
}

export function isGeminiConfigured(override) {
  return Boolean(resolveApiKey(override));
}

export function getGeminiKeyHint(override) {
  const key = resolveApiKey(override);
  if (!key) return 'missing';
  if (key.startsWith('AQ.')) return 'aq-key';
  return 'ok';
}

async function getProductContext() {
  try {
    const products = await Product.find()
      .sort({ popularity: -1 })
      .limit(12)
      .select('name category price brand isLuxury')
      .lean();
    if (!products.length) return '';
    const lines = products.map(
      (p) => `- ${p.name} (${p.category}) $${p.price}${p.isLuxury ? ' [Luxury]' : ''}`
    );
    return `\n\nFeatured catalog:\n${lines.join('\n')}`;
  } catch {
    return '';
  }
}

function buildPrompt(message, history, catalog) {
  const lines = [SYSTEM_PROMPT, ''];
  for (const m of history.slice(-8)) {
    const who = m.role === 'assistant' ? 'Assistant' : 'User';
    lines.push(`${who}: ${m.content}`);
  }
  lines.push(`User: ${message}`);
  lines.push(catalog);
  lines.push('', 'Assistant:');
  return lines.join('\n');
}

function formatGoogleError(data, status) {
  const msg = data?.error?.message || data?.message || status || 'Unknown error';
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
    return (
      'API key invalid. AI Studio → API Keys → delete old key → Create API key. ' +
      'Prefer key starting with AIza (not AQ). https://aistudio.google.com/apikey'
    );
  }
  if (msg.includes('Multiple authentication')) {
    return (
      'AQ. key issue: In AI Studio delete this key and create a NEW key (AIza format works best).'
    );
  }
  if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
    return `Access denied (403): ${msg}. Enable "Generative Language API" or create new AIza key.`;
  }
  if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
    return 'Gemini free quota full for this model — wait 1 minute or we will try another model.';
  }
  return msg;
}

/** AQ. keys: x-goog-api-key ONLY. AIza keys: ?key= query ONLY. Never both. */
async function requestGeminiRest(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const isAq = apiKey.startsWith('AQ.');

  const res = isAq
    ? await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      })
    : await fetch(`${url}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatGoogleError(data, res.status));
  }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Gemini. Try another model.');
  return text;
}

async function chatViaRest(apiKey, prompt) {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const models = [...new Set([preferred, ...FALLBACK_MODELS].filter(Boolean))];

  let lastError;
  for (const model of models) {
    try {
      return await requestGeminiRest(apiKey, model, prompt);
    } catch (err) {
      lastError = err;
      const msg = String(err.message || '');
      if (
        msg.includes('not found') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('404') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('429')
      ) {
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error('No Gemini model available for this key.');
}

async function chatViaSdk(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const preferred = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const models = [...new Set([preferred, ...FALLBACK_MODELS])];

  let lastError;
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const reply = result.response?.text?.()?.trim();
      if (reply) return reply;
      lastError = new Error('Empty response from Gemini');
    } catch (err) {
      lastError = err;
      const msg = String(err.message || err);
      if (msg.includes('404') || msg.includes('not found')) continue;
      throw new Error(formatGoogleError({ error: { message: msg } }, ''));
    }
  }
  throw lastError || new Error('Gemini SDK request failed');
}

export async function testGeminiKey(apiKeyOverride) {
  const apiKey = normalizeApiKey(apiKeyOverride);
  if (!isValidGeminiKey(apiKey)) {
    throw new Error('Invalid key format. Copy the full key from aistudio.google.com/apikey');
  }

  const prompt = `${SYSTEM_PROMPT}\n\nUser: Say hello in one sentence.\n\nAssistant:`;

  if (apiKey.startsWith('AQ.')) {
    const reply = await chatViaRest(apiKey, prompt);
    return { ok: true, preview: reply.slice(0, 60), keyType: 'AQ' };
  }

  try {
    const reply = await chatViaSdk(apiKey, prompt);
    return { ok: true, preview: reply.slice(0, 60), keyType: 'AIza' };
  } catch {
    const reply = await chatViaRest(apiKey, prompt);
    return { ok: true, preview: reply.slice(0, 60), keyType: 'AIza-rest' };
  }
}

export async function chatWithGemini(message, history = [], apiKeyOverride) {
  const apiKey = resolveApiKey(apiKeyOverride);
  if (!apiKey) {
    throw new Error(
      'Gemini API key missing. Paste key in chat setup or set GEMINI_API_KEY in .env, then restart npm run dev.'
    );
  }

  const catalog = await getProductContext();
  const prompt = buildPrompt(String(message).slice(0, 2000), history, catalog);

  if (apiKey.startsWith('AQ.')) {
    return chatViaRest(apiKey, prompt);
  }

  try {
    return await chatViaSdk(apiKey, prompt);
  } catch {
    return chatViaRest(apiKey, prompt);
  }
}
