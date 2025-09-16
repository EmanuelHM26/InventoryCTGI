export const usuarioTest = {
  IdUsuario: 1,
  Nombre: "Test",
  Apellido: "User",
  TipoDocumento: "CC",
  NumeroDocumento: 123456789,
  Usuario: "testuser",
  Correo: "test@example.com",
  IdTiposDocumentos: 1,
  IdRol: 1,
  FechaCreacion: new Date(),
  FechaActualizacion: new Date(),
  HoraCreacion: "12:00:00",
  HoraActualizacion: "12:00:00"
};

export const createUsuarioTest = () => ({
  ...usuarioTest,
  IdUsuario: Math.floor(Math.random() * 1000) + 1
});