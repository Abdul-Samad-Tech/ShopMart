import express from 'express';
import CareerApplication from '../models/CareerApplication.js';
import { sendCareerApplicationEmail } from '../services/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, position, 
      experience, city, coverLetter, resume 
    } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !position?.trim()) {
      return res.status(400).json({ message: 'Name, email, and position are required.' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const name = `${firstName} ${lastName}`;

    // Store career application in database
    const application = await CareerApplication.create({
      firstName,
      lastName,
      email: emailNorm,
      phone,
      position,
      experience,
      city,
      coverLetter,
      resume,
      status: 'pending',
      appliedDate: new Date()
    });

    // Send email notification
    sendCareerApplicationEmail({
      name,
      email: emailNorm,
      position,
      city: city || 'N/A'
    });

    res.status(201).json({
      ok: true,
      message: 'Thank you for your application! Our HR team will review it and contact you if your profile matches our requirements.',
      application
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not submit application' });
  }
});

export default router;
