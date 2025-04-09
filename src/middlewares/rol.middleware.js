export const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
      const { Rol } = req.user; // El rol viene del token JWT
      if (!rolesPermitidos.includes(Rol)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    };
};
