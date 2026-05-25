import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, '../../../data/products.json');

export default class ProductManager {
  async #read() {
    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #write(products) {
    await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2));
  }

  async getAll() {
    return this.#read();
  }

  async getById(id) {
    const products = await this.#read();
    return products.find((p) => p.id === id) || null;
  }

  async create(data) {
    const products = await this.#read();
    const id = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const product = { id, ...data };
    products.push(product);
    await this.#write(products);
    return product;
  }

  async update(id, data) {
    const products = await this.#read();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    await this.#write(products);
    return products[index];
  }

  async delete(id) {
    const products = await this.#read();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const deleted = products.splice(index, 1)[0];
    await this.#write(products);
    return deleted;
  }
}
