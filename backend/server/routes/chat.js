import express from 'express';
import {
  chatWithGemini,
  isGeminiConfigured,
  getGeminiKeyHint,
  resolveApiKey,
  testGeminiKey,
  isValidGeminiKey,
  normalizeApiKey,
} from '../services/gemini.js';
import { validateBody } from '../middleware/validate.js';
import { chatKeySchema, chatSchema } from '../validation/schemas.js';

const router = express.Router();

function clientKeyFromRequest(req) {
  return req.headers['x-gemini-api-key'] || req.body?.apiKey;
}

router.get('/status', (req, res) => {
  const clientKey = clientKeyFromRequest(req);
  res.json({
    enabled: isGeminiConfigured(clientKey),
    keyHint: getGeminiKeyHint(clientKey),
    envConfigured: isGeminiConfigured(),
  });
});

router.post('/validate-key', validateBody(chatKeySchema), async (req, res) => {
  try {
    const apiKey = normalizeApiKey(req.body?.apiKey || req.headers['x-gemini-api-key']);
    if (!isValidGeminiKey(apiKey)) {
      return res.status(400).json({ message: 'Invalid key format. Paste the full key from AI Studio.' });
    }
    await testGeminiKey(apiKey);
    res.json({ ok: true, message: 'Key works! You can chat now.' });
  } catch (err) {
    const message = err.message || 'Key validation failed';
    console.error('[chat/validate]', message);
    res.status(400).json({ message });
  }
});

router.post('/', validateBody(chatSchema), async (req, res) => {
  try {
    const { message, history, apiKey } = req.body;
    const clientKey = apiKey || req.headers['x-gemini-api-key'];

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!resolveApiKey(clientKey)) {
      return res.status(503).json({
        message:
          'Gemini API key missing. Paste your key in the chat setup box below, or set GEMINI_API_KEY in .env and restart npm run dev.',
      });
    }

    const reply = await chatWithGemini(message, history, clientKey);
    res.json({ reply });
  } catch (err) {
    console.error('[chat]', err.message);
    const status =
      err.message?.includes('missing') ||
      err.message?.includes('Invalid API key')
        ? 503
        : 500;
    res.status(status).json({ message: err.message || 'Chat failed' });
  }
});

export default router;
