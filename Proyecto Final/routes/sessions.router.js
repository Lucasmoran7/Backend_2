import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import { createHash, isValidPassword } from "../utils/auth.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const JWT_EXPIRES = "1h";

/**
 * POST /api/sessions/register
 * Crea usuario con contraseña hasheada
 */
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: "error", error: "Faltan campos" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .send({ status: "error", error: "El email ya está registrado" });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });

    // Opcional: no devolver el hash
    const { password: _, ...safeUser } = user.toObject();

    res.send({ status: "success", payload: safeUser });
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

/**
 * POST /api/sessions/login
 * Verifica credenciales y entrega JWT en cookie httpOnly
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ status: "error", error: "Usuario no encontrado" });

    if (!isValidPassword(user, password))
      return res.status(401).send({ status: "error", error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Guardamos el token en cookie httpOnly
    res
      .cookie("jwtCookie", token, {
        httpOnly: true,
        // secure: true, // habilitar en producción con HTTPS
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 // 1h
      })
      .send({ status: "success", message: "Login exitoso" });
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

/**
 * GET /api/sessions/current
 * Devuelve los datos del usuario extraídos del JWT (passport-jwt)
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // req.user viene de la estrategia JWT
    const { password, ...safeUser } = req.user.toObject();
    res.send({ status: "success", payload: safeUser });
  }
);

/**
 * POST /api/sessions/logout
 * Limpia la cookie del token
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwtCookie").send({ status: "success", message: "Logout ok" });
});

export default router;
