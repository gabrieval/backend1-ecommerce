import Cart from '../../models/cart.model.js';

export default class CartDAO {
  async create() {
    return Cart.create({ products: [] });
  }

  async getById(id) {
    return Cart.findById(id).populate('products.product');
  }

  async addProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return cart.save();
  }

  async removeProduct(cartId, productId) {
    return Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    );
  }

  async updateProducts(cartId, products) {
    return Cart.findByIdAndUpdate(cartId, { products }, { new: true });
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return Cart.findOneAndUpdate(
      { _id: cartId, 'products.product': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );
  }

  async clear(cartId) {
    return Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
  }
}
