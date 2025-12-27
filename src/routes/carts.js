import express from 'express';
import Cart from '../models/cart.js';

const router = express.Router();

// Crear carrito vacío
router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Obtener carrito con populate
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Eliminar producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Actualizar arreglo completo
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'Products must be an array' });
    }
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true, runValidators: true }
    ).populate('products.product');

    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be a positive integer' });
    }

    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const item = cart.products.find(p => p.product.toString() === req.params.pid);
    if (!item) cart.products.push({ product: req.params.pid, quantity: qty });
    else item.quantity = qty;

    await cart.save();
    res.json({ status: 'success', message: 'Quantity updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Cart emptied' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;