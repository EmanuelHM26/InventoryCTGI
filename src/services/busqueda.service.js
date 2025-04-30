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

    // Buscar en la tabla de usuarios
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { Nombre: { [Op.like]: `%${searchTerm}%` } },
          { Apellido: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['IdUsuario', 'Nombre', 'Apellido'],
      limit: 10
    });

    // Buscar en la tabla de asignaciones
    const asignaciones = await Asignaciones.findAll({
      where: {
        [Op.or]: [
          { Observacion: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      include: [
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['IdUsuario', 'Nombre', 'Apellido']
        }
      ],
      attributes: ['IdAsignaciones', 'FechaAsignacion', 'Observacion'],
      limit: 10
    });

    return {
      usuarios,
      asignaciones
    };
  } catch (error) {
    console.error('Error en el servicio de búsqueda global:', error);
    throw new Error(`Error en la búsqueda global: ${error.message}`);
  }
};