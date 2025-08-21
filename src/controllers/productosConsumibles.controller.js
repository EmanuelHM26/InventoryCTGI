import {
  getAllProductosService,
  getProductoByIdService,
  createProductoService,
  updateProductoService,
  deleteProductoService,
} from '../services/productosConsumibles.service.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await getAllProductosService();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProductoByIdService(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

export const createProductoHandler = async (req, res) => {
  try {
    const producto = await createProductoService(req.body);
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

export const updateProductoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await updateProductoService(id, req.body);
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

export const deleteProductoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProductoService(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};