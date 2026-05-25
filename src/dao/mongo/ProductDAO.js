import Product from '../../models/product.model.js';

export default class ProductDAO {
  async getAll({ limit = 10, page = 1, query, sort } = {}) {
    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = { $regex: query, $options: 'i' };
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    return Product.paginate(filter, options);
  }

  async getById(id) {
    return Product.findById(id).lean();
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}
