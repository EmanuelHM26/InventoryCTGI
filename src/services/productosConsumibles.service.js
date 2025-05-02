import ProductosConsumibles from '../models/ProductosConsumiblesModel.js';

export const getAllProductosService = async () => {
  return await ProductosConsumibles.findAll();
};

export const getProductoByIdService = async (id) => {
  return await ProductosConsumibles.findByPk(id);
};

export const createProductoService = async (data) => {
  return await ProductosConsumibles.create(data);
};

export const updateProductoService = async (id, data) => {
  const producto = await ProductosConsumibles.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');
  return await producto.update(data);
};

export const deleteProductoService = async (id) => {
  const producto = await ProductosConsumibles.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');
  return await producto.destroy();
};