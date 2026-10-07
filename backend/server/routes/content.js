import express from 'express';
import SiteContent from '../models/SiteContent.js';
import Navigation from '../models/Navigation.js';
import Footer from '../models/Footer.js';
import Category from '../models/Category.js';
import PageContent from '../models/PageContent.js';

const router = express.Router();

router.get('/site', async (_req, res) => {
  try {
    let site = await SiteContent.findOne({ key: 'main' });
    if (!site) site = await SiteContent.create({});
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/navigation', async (_req, res) => {
  try {
    let nav = await Navigation.findOne({ key: 'main' });
    if (!nav) nav = { items: [] };
    res.json(nav);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/footer', async (_req, res) => {
  try {
    let footer = await Footer.findOne({ key: 'main' });
    if (!footer) footer = {};
    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Page content endpoints
router.get('/pages/:key', async (req, res) => {
  try {
    const { key } = req.params;
    let page = await PageContent.findOne({ key, isActive: true });
    if (!page) {
      // Return default content if page doesn't exist
      page = {
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        subtitle: '',
        description: '',
        heroImage: '',
        sections: []
      };
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/pages', async (_req, res) => {
  try {
    const pages = await PageContent.find({ isActive: true }).sort({ key: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/pages', async (req, res) => {
  try {
    const page = await PageContent.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/pages/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const page = await PageContent.findOneAndUpdate(
      { key },
      req.body,
      { new: true, upsert: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
