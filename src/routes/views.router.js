import { Router } from 'express';
import ProductDAO from '../dao/mongo/ProductDAO.js';
import CartDAO from '../dao/mongo/CartDAO.js';

const router = Router();
const productDAO = new ProductDAO();
const cartDAO = new CartDAO();

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const result = await productDAO.getAll({ limit, page, query, sort });

    const buildLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams({ limit, page: p, ...(query && { query }), ...(sort && { sort }) });
      return `/products?${params.toString()}`;
    };

    res.render('products', {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
      query: query || '',
      sort: sort || ''
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productDAO.getById(req.params.pid);
    if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });
    res.render('productDetail', { product });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });

    const total = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    res.render('cart', { cart: cart.toObject(), total: total.toFixed(2) });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await productDAO.getAll({ limit: 100 });
    res.render('realTimeProducts', { products: result.docs });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

export default router;
