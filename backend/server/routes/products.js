import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const buildMatch = (query) => {
  const match = { isActive: { $ne: false } };
  if (query.category) {
    // Try exact match first, then case-insensitive match
    match.category = { $regex: `^${query.category}$`, $options: 'i' };
  }
  if (query.brand) match.brand = query.brand;
  if (query.color) match.colors = query.color;
  if (query.search) {
    const q = String(query.search).trim();
    if (q.length >= 2) {
      match.$or = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ];
    }
  }
  if (query.luxury === 'true') match.isLuxury = true;
  if (query.featured === 'true') match.isFeatured = true;
  const minRating = query.minRating != null ? Number(query.minRating) : null;
  if (minRating != null && minRating > 0) match.rating = { $gte: minRating };
  const min = query.minPrice != null ? Number(query.minPrice) : null;
  const max = query.maxPrice != null ? Number(query.maxPrice) : null;
  if (min != null || max != null) {
    match.price = {};
    if (min != null) match.price.$gte = min;
    if (max != null) match.price.$lte = max;
  }
  return match;
};

const buildSort = (sortBy) => {
  switch (sortBy) {
    case 'price-low':
      return { price: 1 };
    case 'price-high':
      return { price: -1 };
    case 'rating':
      return { rating: -1, reviews: -1 };
    case 'popularity':
      return { popularity: -1 };
    case 'luxury':
      return { isLuxury: -1, rating: -1 };
    case 'newest':
      return { createdAt: -1 };
    default:
      return { isFeatured: -1, popularity: -1 };
  }
};

router.get('/', async (req, res) => {
  try {
    const match = buildMatch(req.query);
    const sort = buildSort(req.query.sort || 'default');
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const skip = Number(req.query.skip) || 0;

    console.log('Products query:', req.query);
    console.log('Match:', JSON.stringify(match));

    const pipeline = [{ $match: match }, { $sort: sort }, { $skip: skip }, { $limit: limit }];

    const [products, countResult] = await Promise.all([
      Product.aggregate(pipeline),
      Product.aggregate([{ $match: match }, { $count: 'total' }]),
    ]);

    const total = countResult[0]?.total || 0;
    const data = products.map((p) => ({
      ...p,
      id: p._id?.toString(),
    }));

    console.log('Found products:', data.length, 'Total:', total);
    res.json({ data, total, page: Math.floor(skip / limit) + 1, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/suggest', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json([]);

    const products = await Product.find({
      isActive: { $ne: false },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name price image category brand slug')
      .limit(8)
      .lean();

    res.json(
      products.map((p) => ({
        ...p,
        id: p._id?.toString(),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/filters/meta', async (_req, res) => {
  try {
    const [categories, brands, colors, priceRange] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('brand'),
      Product.distinct('colors'),
      Product.aggregate([
        { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      ]),
    ]);
    res.json({
      categories,
      brands,
      colors: colors.filter(Boolean).flat(),
      priceRange: priceRange[0] || { min: 0, max: 1000 },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: { $ne: false },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Image-based product search
router.post('/search-by-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // For now, return products based on category and price similarity
    // In a production environment, you would use image recognition/AI services
    // like Google Vision API, AWS Rekognition, or a custom ML model
    
    // Get all products and return them with a random similarity score for demo
    // This is a placeholder implementation
    const products = await Product.find({ isActive: { $ne: false } })
      .select('name price image category brand slug')
      .limit(10)
      .lean();

    // Add similarity scores (random for demo - in production use actual image comparison)
    const results = products.map(p => ({
      ...p,
      id: p._id?.toString(),
      similarity: Math.random() * 0.4 + 0.5 // Random similarity between 0.5 and 0.9
    })).sort((a, b) => b.similarity - a.similarity);

    res.json(results);
  } catch (err) {
    console.error('Image search error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
