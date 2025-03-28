import pool from '../config/database.js';

// Obtener todos los registros
export const getAllLogins = async () => {
    const [rows] = await pool.query('SELECT * FROM RegistroLogin');
    return rows;
};

// Obtener un registro por ID
export const getLoginById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM RegistroLogin WHERE IdRegistroLogin = ?', [id]);
    return rows[0] || null;
};

// Crear un nuevo registro
export const createLogin = async (data) => {
    const { usuario, correo, password, idPassword, fechaInicio, fechaCierre, horaInicio, horaCierre } = data;
    const [result] = await pool.query(
        'INSERT INTO RegistroLogin (Usuario, Correo, Password, IdPassword, FechaInicioSesion, FechaCerrarSesion, HoraInicioSesion, HoraCerrarSesion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [usuario, correo, password, idPassword, fechaInicio, fechaCierre, horaInicio, horaCierre]
    );
    return result.insertId;
};
