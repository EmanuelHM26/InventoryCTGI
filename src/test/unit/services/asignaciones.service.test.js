import { expect } from 'chai';
import sinon from 'sinon';
import { createAsignacionService } from '../../../services/asignaciones.service.js';
import { Usuario, Asignaciones } from '../../../models/index.js';

describe('Asignaciones Service - Unit Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createAsignacionService', () => {
    it('debería crear una asignación cuando el usuario existe', async () => {
      // Arrange
      const usuarioId = 1;
      const asignacionData = {
        IdUsuario: usuarioId,
        Nombre: "John",
        Apellido: "Doe",
        Documento: "123456789",
        FechaAsignacion: "2023-12-01",
        HoraAsignacion: "10:00:00",
        Observacion: "Test",
        Cantidad: "5",
        Item: "Laptop"
      };

      const usuarioMock = { IdUsuario: usuarioId };
      const asignacionCreada = { ...asignacionData, IdAsignaciones: 1 };

      sandbox.stub(Usuario, 'findByPk').resolves(usuarioMock);
      sandbox.stub(Asignaciones, 'create').resolves(asignacionCreada);

      // Act
      const result = await createAsignacionService(asignacionData);

      // Assert
      expect(Usuario.findByPk.calledWith(usuarioId)).to.be.true;
      expect(Asignaciones.create.calledWith(sinon.match({
        ...asignacionData,
        Estado: 'Activo'
      }))).to.be.true;
      expect(result).to.deep.equal(asignacionCreada);
    });

    it('debería lanzar error cuando el usuario no existe', async () => {
      // Arrange
      const usuarioId = 999;
      const asignacionData = {
        IdUsuario: usuarioId,
        Nombre: "John",
        Apellido: "Doe",
        Documento: "123456789",
        FechaAsignacion: "2023-12-01",
        HoraAsignacion: "10:00:00",
        Observacion: "Test",
        Cantidad: "5",
        Item: "Laptop"
      };

      sandbox.stub(Usuario, 'findByPk').resolves(null);

      // Act & Assert usando try/catch (solución sin chai-as-promised)
      try {
        await createAsignacionService(asignacionData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error.message).to.include('El usuario especificado no existe');
      }
      
      expect(Usuario.findByPk.calledWith(usuarioId)).to.be.true;
    });

    it('debería establecer Estado como "Activo" por defecto', async () => {
      // Arrange
      const usuarioId = 1;
      const asignacionData = {
        IdUsuario: usuarioId,
        Nombre: "John",
        Apellido: "Doe",
        Documento: "123456789",
        FechaAsignacion: "2023-12-01",
        HoraAsignacion: "10:00:00",
        Observacion: "Test",
        Cantidad: "5",
        Item: "Laptop"
      };

      const usuarioMock = { IdUsuario: usuarioId };
      const asignacionCreada = { ...asignacionData, IdAsignaciones: 1, Estado: 'Activo' };

      sandbox.stub(Usuario, 'findByPk').resolves(usuarioMock);
      sandbox.stub(Asignaciones, 'create').resolves(asignacionCreada);

      // Act
      const result = await createAsignacionService(asignacionData);

      // Assert
      expect(Asignaciones.create.calledWith(sinon.match({
        Estado: 'Activo'
      }))).to.be.true;
      expect(result.Estado).to.equal('Activo');
    });
  });
});