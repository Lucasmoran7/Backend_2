import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/proyectofinal")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error en la conexión:", err));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
