import { Router } from 'express';
import ProductDAO from '../dao/mongo/ProductDAO.js';

const router = Router();
const productDAO = new ProductDAO();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const result = await productDAO.getAll({ limit, page, query, sort });

    const buildLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams({ limit, page: p, ...(query && { query }), ...(sort && { sort }) });
      return `/api/products?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productDAO.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }
    const product = await productDAO.create({ title, description, code, price, status, stock, category, thumbnails });

    const io = req.app.get('io');
    if (io) io.emit('productCreated', product);

    res.status(201).json({ status: 'success', payload: product });
  } catch (err) {
    const msg = err.code === 11000 ? 'El código de producto ya existe' : err.message;
    res.status(400).json({ status: 'error', message: msg });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const updated = await productDAO.update(req.params.pid, data);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const io = req.app.get('io');
    if (io) io.emit('productUpdated', updated);

    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productDAO.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const io = req.app.get('io');
    if (io) io.emit('productDeleted', req.params.pid);

    res.json({ status: 'success', payload: deleted });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
