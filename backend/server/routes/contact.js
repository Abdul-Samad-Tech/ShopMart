import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { optionalAuth } from '../middleware/auth.js';
import { sendContactNotificationEmail } from '../services/mail.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const doc = await ContactMessage.create({
      name: String(name).trim(),
      email: emailNorm,
      subject: String(subject).trim(),
      message: String(message).trim(),
      user: req.user?._id,
    });

    const mailResult = await sendContactNotificationEmail(doc);
    if (mailResult && !mailResult.skipped) {
      doc.emailSent = true;
      await doc.save();
    }

    res.status(201).json({
      ok: true,
      id: doc._id.toString(),
      message: 'Thank you! Your message has been received.',
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not send message' });
  }
});

export default router;
