const Product = require('../models/Product');

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const filter = query ? { category: query } : {};
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };
    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const totalDocs = await Product.countDocuments(filter);
    const products = await Product.find(filter, null, options);
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page-1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page+1}` : null
    };
  }

  async getProductById(pid) {
    return await Product.findById(pid);
  }

  async addProduct(data) {
    const product = new Product(data);
    return await product.save();
  }

  async updateProduct(pid, updatedFields) {
    return await Product.findByIdAndUpdate(pid, updatedFields, { new: true });
  }

  async deleteProduct(pid) {
    return await Product.findByIdAndDelete(pid);
  }
}

module.exports = ProductManager;
const fs = require('fs');
const productsFile = './data/products.json';
