import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

// 📌 Crear carrito
router.post("/", async (req, res) => {
  const newCart = await Cart.create({ products: [] });
  res.status(201).json(newCart);
});

// 📌 Obtener carrito por ID
router.get("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate("products.product");
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

// 📌 Agregar producto a un carrito
router.post("/:id/products/:pid", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const { pid } = req.params;
  const existingProduct = cart.products.find((p) => p.product.toString() === pid);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});

export default router;
