import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import express from "express";
import { Usuario, Asignaciones } from "../../models/index.js";
import { createUsuarioTest } from "../fixtures/usuario.fixture.js";
import { createAsignacionTest } from "../fixtures/asignacion.fixture.js";

// Importar el router de asignaciones directamente
import asignacionesRouter from "../../routes/asignaciones.routes.js";

// Crear app de prueba específica
const testApp = express();
testApp.use(express.json());

// Mock middlewares directamente en la app de prueba
testApp.use((req, res, next) => {
  req.user = { IdUsuario: 1, IdRol: 1 };
  next();
});

// Montar el router de asignaciones
testApp.use("/api/asignaciones", asignacionesRouter);

describe("Asignaciones API - Integration Tests", () => {
  let sandbox;
  let testUsuario;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    
    // Crear usuario de prueba
    testUsuario = createUsuarioTest();

    // Mock de modelos
    sandbox.stub(Usuario, "findByPk").callsFake((id) => {
      return id === testUsuario.IdUsuario
        ? Promise.resolve(testUsuario)
        : Promise.resolve(null);
    });

    sandbox.stub(Asignaciones, "create").callsFake((data) => {
      return Promise.resolve({
        ...data,
        IdAsignaciones: Math.floor(Math.random() * 1000) + 1,
        FechaDevolucion: null,
        HoraDevolucion: null,
        Novedad: null,
      });
    });

    sandbox.stub(Asignaciones, "findAll").resolves([]);
    sandbox.stub(Asignaciones, "findOne").resolves(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("POST /api/asignaciones", () => {
    it("debería crear una asignación exitosamente cuando el usuario existe", async () => {
      // Arrange
      const asignacionData = createAsignacionTest(testUsuario.IdUsuario);

      // Act
      const response = await request(testApp)
        .post("/api/asignaciones")
        .send(asignacionData);

      // Assert
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("IdAsignaciones");
      expect(response.body.IdUsuario).to.equal(testUsuario.IdUsuario);
      expect(response.body.Estado).to.equal("Activo");
    });

    it("debería retornar error 400 cuando el usuario no existe", async () => {
      // Arrange
      const usuarioInexistenteId = 999;
      const asignacionData = createAsignacionTest(usuarioInexistenteId);

      // Act
      const response = await request(testApp)
        .post("/api/asignaciones")
        .send(asignacionData);

      // Assert
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("El usuario especificado no existe");
    });

    it("debería retornar error 400 cuando faltan campos requeridos", async () => {
      // Arrange
      const asignacionIncompleta = {
        IdUsuario: testUsuario.IdUsuario,
        Nombre: "John",
        // Faltan otros campos requeridos
      };

      // Act
      const response = await request(testApp)
        .post("/api/asignaciones")
        .send(asignacionIncompleta);

      // Assert
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error");
    });

    it('debería establecer Estado como "Activo" por defecto', async () => {
      // Arrange
      const asignacionData = createAsignacionTest(testUsuario.IdUsuario);
      delete asignacionData.Estado; // No enviar Estado

      // Act
      const response = await request(testApp)
        .post("/api/asignaciones")
        .send(asignacionData);

      // Assert
      expect(response.status).to.equal(201);
      expect(response.body.Estado).to.equal("Activo");
    });
  });

  // Puedes añadir más tests para otros endpoints (GET, PUT, DELETE)
  describe("GET /api/asignaciones", () => {
    it("debería retornar lista de asignaciones", async () => {
      // Act
      const response = await request(testApp)
        .get("/api/asignaciones");

      // Assert
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });
});