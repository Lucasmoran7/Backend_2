const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartManager {
  async getCartById(cid) {
    return await Cart.findById(cid).populate('products.product');
  }

  async addCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const index = cart.products.findIndex(p => p.product.toString() === pid);
    if (index !== -1) cart.products[index].quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    return cart;
  }

  async updateCart(cid, productsArray) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = productsArray;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return null;
    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart;
  }
}

module.exports = CartManager;
const fs = require('fs');
const cartsFile = './data/carts.json';


