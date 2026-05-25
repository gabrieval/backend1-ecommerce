import { Router } from 'express';
import CartDAO from '../dao/mongo/CartDAO.js';

const router = Router();
const cartDAO = new CartDAO();

router.post('/', async (req, res) => {
  try {
    const cart = await cartDAO.create();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.addProduct(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.removeProduct(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'Se esperaba un array de productos' });
    }
    const cart = await cartDAO.updateProducts(req.params.cid, products);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', message: 'Quantity debe ser un número' });
    }
    const cart = await cartDAO.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.clear(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
