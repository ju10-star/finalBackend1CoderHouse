import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// GET con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

    const filter = {};
    if (query) {
      const [key, rawVal] = String(query).split('=');
      if (key && rawVal !== undefined) {
        if (key === 'available') filter.available = rawVal === 'true';
        else if (key === 'category') filter.category = rawVal;
      }
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalDocs / parsedLimit), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const hasPrevPage = parsedPage > 1;
    const hasNextPage = parsedPage < totalPages;

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const buildLink = (p) =>
      `${baseUrl}?page=${p}&limit=${parsedLimit}` +
      (sort ? `&sort=${sort}` : '') +
      (query ? `&query=${encodeURIComponent(query)}` : '');

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? parsedPage - 1 : null,
      nextPage: hasNextPage ? parsedPage + 1 : null,
      page: parsedPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(parsedPage - 1) : null,
      nextLink: hasNextPage ? buildLink(parsedPage + 1) : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;