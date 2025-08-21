import { Usuario, Asignaciones } from '../models/index.js';
import { Op } from 'sequelize';

export const searchGlobalService = async (searchTerm) => {
  try {
    if (!searchTerm) {
      return {
        usuarios: [],
        asignaciones: []
      };
    }

    // Buscar en la tabla de usuarios con búsqueda más flexible
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { Nombre: { [Op.like]: `%${searchTerm}%` } },
          { Apellido: { [Op.like]: `%${searchTerm}%` } },
          // Si tienen campo de usuario o correo, también buscar ahí
          { Correo: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['IdUsuario', 'Nombre', 'Apellido', 'Correo'],
      limit: 10
    });

    // Obtener IDs de usuarios que coinciden con la búsqueda
    const userIds = usuarios.map(user => user.IdUsuario);

    // Buscar en la tabla de asignaciones
    // - Por observación que contenga el término
    // - O por usuario que coincida con los encontrados
    const asignaciones = await Asignaciones.findAll({
      where: {
        [Op.or]: [
          { Observacion: { [Op.like]: `%${searchTerm}%` } },
          { IdUsuario: { [Op.in]: userIds.length > 0 ? userIds : [0] } }
        ]
      },
      include: [
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['IdUsuario', 'Nombre', 'Apellido']
        }
      ],
      attributes: ['IdAsignaciones', 'FechaAsignacion', 'Observacion', 'IdUsuario'],
      limit: 10
    });

    // Convertir resultados a objetos simples para evitar problemas de serialización
    const usuariosPlain = usuarios.map(u => u.get({ plain: true }));
    const asignacionesPlain = asignaciones.map(a => a.get({ plain: true }));

    return {
      usuarios: usuariosPlain,
      asignaciones: asignacionesPlain
    };
  } catch (error) {
    console.error('Error en el servicio de búsqueda global:', error);
    throw new Error(`Error en la búsqueda global: ${error.message}`);
  }
};