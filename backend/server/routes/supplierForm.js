import express from 'express';
import { sendSupplierFormEmail } from '../services/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, address, city, 
      productCategory, productDescription, annualCapacity, 
      certifications, businessRegistration, taxNumber, additionalInfo 
    } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const name = `${firstName} ${lastName}`;
    const companyName = req.body.companyName || 'Not provided';

    // Send email notification
    sendSupplierFormEmail({
      name,
      email: emailNorm,
      company: companyName,
      productCategory: productCategory || 'N/A',
      city: city || 'N/A'
    });

    res.status(201).json({
      ok: true,
      message: 'Thank you for your interest! We will review your application and contact you within 5-7 business days.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not submit application' });
  }
});

export default router;
