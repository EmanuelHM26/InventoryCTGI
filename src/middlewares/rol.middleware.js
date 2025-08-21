export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { rolId } = req.user;

    if (!rolesPermitidos.includes(rolId)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
