import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

/**
 * Extrae el JWT desde la cookie 'jwtCookie'
 */
const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies["jwtCookie"] || null;
  }
  return null;
};

// Usamos variable de entorno si existe, sino default de dev.
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export const initializePassport = () => {
  // Estrategia JWT (autenticación stateless)
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
