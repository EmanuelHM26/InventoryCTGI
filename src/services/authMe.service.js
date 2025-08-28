export const getAuthenticatedUserService = (user) => {
    // Retornar los datos del usuario autenticado
    return {
      id: user.id,
      nombre: user.nombre,
      rol: user.rol,
    };
  };