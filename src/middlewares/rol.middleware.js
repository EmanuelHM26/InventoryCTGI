export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });
    }

    const userRoleId = req.user.rolId;
    const userRoleName = req.user.rol; // o req.user.Rol si usas mayúscula

    // Verificar por ID o por nombre
    const hasAccess = rolesPermitidos.some(role => 
      role === userRoleId || 
      role === userRoleName ||
      (typeof role === 'string' && role.toLowerCase() === userRoleName?.toLowerCase())
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Acceso denegado: permisos insuficientes" });
    }

    next();
  };
};