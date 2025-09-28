// Op: es el objeto de operadores de Sequelize (p. ej. Op.or, Op.like, Op.in). Se usa para construir condiciones en where.

import { Usuario, Asignaciones } from '../models/index.js';
import { Op } from 'sequelize';

// searchTerm: texto de búsqueda que el usuario envía (por ejemplo "nicolle").
//Devuelve un objeto { usuarios: [...], asignaciones: [...] }.
// !searcTerm = si no hay termino en la busqueda, es vacio 

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


// findAll: consulta a la tabla usuarios.
// where con [Op.or]: busca coincidencias en cualquiera de las columnas listadas.
// { [Op.like]: %${searchTerm}% }: busca coincidencias parciales (antes y después) — p. ej. "nic" encuentra "Nicolle".
// attributes: selecciona solo las columnas que quieres devolver (reduce datos transferidos).
// limit: 10: devuelve hasta 10 resultados (evita traer demasiados registros).