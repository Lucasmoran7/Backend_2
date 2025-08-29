import bcrypt from "bcrypt";

/**
 * Genera hash de la contraseña (bcrypt.hashSync)
 */
export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compara la contraseña plana con el hash guardado
 */
export const isValidPassword = (user, plainPassword) => {
  return bcrypt.compareSync(plainPassword, user.password);
};
