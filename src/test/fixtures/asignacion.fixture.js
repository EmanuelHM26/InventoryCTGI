export const asignacionTest = {
  IdUsuario: 1,
  Nombre: "John",
  Apellido: "Doe",
  Documento: "123456789",
  FechaAsignacion: "2023-12-01",
  HoraAsignacion: "10:00:00",
  Observacion: "Asignación de prueba",
  Cantidad: "5",
  Item: "Laptop",
  Estado: "Activo"
};

export const createAsignacionTest = (usuarioId) => ({
  ...asignacionTest,
  IdUsuario: usuarioId
});