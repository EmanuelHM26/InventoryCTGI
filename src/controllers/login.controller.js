import { getAllLogins, getLoginById, createLogin } from '../models/LoginModel.js';

export const getLogins = async (req, res) => {
    try {
        const logins = await getAllLogins();
        res.json(logins);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros', error });
    }
};

export const getLogin = async (req, res) => {
    try {
        const login = await getLoginById(req.params.id);
        if (!login) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(login);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro', error });
    }
};

export const addLogin = async (req, res) => {
    try {
        const newLoginId = await createLogin(req.body);
        res.status(201).json({ message: 'Registro creado', id: newLoginId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el registro', error });
    }
};
