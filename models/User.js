import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    email:      { type: String, required: true, unique: true, index: true },
    age:        { type: Number, required: true },
    // Se guarda en formato hash con bcrypt
    password:   { type: String, required: true },

    // Referencia al carrito (colección carts)
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", default: null },

    // Rol por defecto 'user'
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

const User = mongoose.model(userCollection, userSchema);
export default User;
