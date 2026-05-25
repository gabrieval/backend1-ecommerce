import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, '../../../data/carts.json');

export default class CartManager {
  async #read() {
    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #write(carts) {
    await fs.writeFile(FILE_PATH, JSON.stringify(carts, null, 2));
  }

  async create() {
    const carts = await this.#read();
    const id = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const cart = { id, products: [] };
    carts.push(cart);
    await this.#write(carts);
    return cart;
  }

  async getById(id) {
    const carts = await this.#read();
    return carts.find((c) => c.id === id) || null;
  }

  async addProduct(cartId, productId) {
    const carts = await this.#read();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const index = cart.products.findIndex((p) => p.product === productId);
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.#write(carts);
    return cart;
  }

  async clear(cartId) {
    const carts = await this.#read();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;
    cart.products = [];
    await this.#write(carts);
    return cart;
  }
}
