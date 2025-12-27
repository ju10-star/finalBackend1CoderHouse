import express from 'express';
import Product from '../models/product.js';
import Cart from '../models/cart.js';

const router = express.Router();

// Vista de productos con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const apiUrl = `${req.protocol}://${req.get('host')}/api/products?limit=${limit}&page=${page}` +
      (sort ? `&sort=${sort}` : '') +
      (query ? `&query=${encodeURIComponent(query)}` : '');
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.render('index', {
      layout: 'main',
      products: data.payload,
      page: data.page,
      totalPages: data.totalPages,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.prevLink,
      nextLink: data.nextLink
    });
  } catch (err) {
    res.status(500).send('Error rendering products');
  }
});

// Vista detalle producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('product', { layout: 'main', product });
  } catch (err) {
    res.status(500).send('Error rendering product detail');
  }
});

// Vista carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { layout: 'main', cart });
  } catch (err) {
    res.status(500).send('Error rendering cart');
  }
});

export default router;