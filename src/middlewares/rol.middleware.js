export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rolId) {
      return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.rolId)) {
      return res.status(403).json({ message: "Acceso denegado: permisos insuficientes" });
    }

    next();
  };
};