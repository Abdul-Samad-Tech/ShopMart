import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { sendContactNotificationEmail } from '../services/mail.js';
import { contactSchema } from '../validation/schemas.js';

const router = express.Router();

router.post('/', optionalAuth, validateBody(contactSchema), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const emailNorm = String(email).trim().toLowerCase();

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
