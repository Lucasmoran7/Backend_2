import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  image: { type: String }
}, {
  timestamps: true // 👌 agrega createdAt y updatedAt
});

const Product = mongoose.model("Product", productSchema);

export default Product;
