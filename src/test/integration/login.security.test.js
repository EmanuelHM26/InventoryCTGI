/**
 * @fileoverview Pruebas unitarias para el middleware de autenticación verifyToken
 * @description Este archivo contiene todas las pruebas de seguridad para validar
 *              el correcto funcionamiento del middleware que verifica tokens JWT
 * @author Tu nombre
 * @version 1.0.0
 */

import request from "supertest";
import { expect } from "chai";
import express from "express";
import sinon from "sinon";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import RegistroLogin from "../../models/LoginModel.js";
import Role from "../../models/RolModel.js";
import jwt from "jsonwebtoken";

/**
 * Suite de pruebas para el middleware de seguridad verifyToken
 * Valida diferentes escenarios de autenticación y autorización
 */
describe("Middleware de seguridad - verifyToken", () => {
  let app; // Instancia de Express para pruebas
  let sandbox; // Entorno aislado para mocks de Sinon
  let findByPkStub; // Mock de la función de búsqueda en BD

  /**
   * Configuración que se ejecuta antes de cada prueba individual
   * Prepara el entorno limpio para cada test
   */
  beforeEach(() => {
    // Crear sandbox de Sinon para aislar mocks
    sandbox = sinon.createSandbox();
    
    // Configurar aplicación Express de prueba
    app = express();
    app.use(express.json());

    // Middleware personalizado para parsear cookies sin dependencias externas
    app.use((req, res, next) => {
      // Simular cookie parser básico para pruebas
      if (req.headers.cookie) {
        req.cookies = {};
        // Dividir cookies por punto y coma y procesar cada una
        req.headers.cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.split('=').map(c => c.trim());
          req.cookies[name] = value;
        });
      } else {
        req.cookies = {};
      }
      next();
    });

    // Ruta ficticia protegida solo para pruebas del middleware
    app.get("/api/test-secure", verifyToken, (req, res) => {
      res.json({ message: "Acceso permitido", user: req.user });
    });

    // Mock del método findByPk de RegistroLogin para simular consultas a BD
    findByPkStub = sandbox.stub(RegistroLogin, "findByPk");
    
    // Asegurar que JWT_SECRET esté disponible para las pruebas
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = "test_secret_key_for_testing";
    }
  });

  /**
   * Limpieza que se ejecuta después de cada prueba
   * Restaura todos los mocks y stubs para evitar interferencias
   */
  afterEach(() => {
    sandbox.restore();
  });

  /**
   * PRUEBA 1: Verificar rechazo cuando no se proporciona token
   * Escenario: Petición sin header Authorization ni cookies
   * Resultado esperado: 403 Forbidden
   */
  it("debería rechazar acceso sin token", async () => {
    const res = await request(app).get("/api/test-secure");
    
    expect(res.status).to.equal(403);
    expect(res.body).to.have.property("message", "Token no proporcionado");
  });

  /**
   * PRUEBA 2: Verificar rechazo con token malformado o inválido
   * Escenario: Token que no puede ser decodificado por JWT
   * Resultado esperado: 401 Unauthorized
   */
  it("debería rechazar acceso con token inválido", async () => {
    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token inválido");
  });

  /**
   * PRUEBA 3: Verificar acceso exitoso con token válido
   * Escenario: Token JWT válido y usuario existente en BD
   * Resultado esperado: 200 OK con información del usuario
   */
  it("debería permitir acceso con token válido", async () => {
    // Mock de usuario válido con la estructura correcta de Sequelize
    const mockUser = {
      IdRegistroLogin: 1,
      Usuario: "testuser",
      IdRol: 1,
      Rol: { 
        NombreRol: "Administrador" 
      }
    };

    // Configurar el stub para que resuelva con el usuario mock
    findByPkStub.resolves(mockUser);

    // Generar token válido con datos de prueba
    const validToken = jwt.sign(
      { id: 1, Correo: "test@example.com", Rol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${validToken}`);

    // Validar respuesta exitosa
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Acceso permitido");
    expect(res.body.user).to.have.property("id", 1);
    expect(res.body.user).to.have.property("nombre", "testuser");
    expect(res.body.user).to.have.property("rol", "Administrador");
  });

  /**
   * PRUEBA 4: Verificar rechazo cuando el usuario no existe en BD
   * Escenario: Token válido pero usuario fue eliminado de la base de datos
   * Resultado esperado: 404 Not Found
   */
  it("debería rechazar acceso si el usuario no existe", async () => {
    // Mock para usuario no encontrado (null)
    findByPkStub.resolves(null);

    const validToken = jwt.sign(
      { id: 999, Correo: "nonexistent@example.com", Rol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Usuario no encontrado");
  });

  /**
   * PRUEBA 5: Verificar extracción de token desde cookies
   * Escenario: Token enviado en cookie en lugar de header Authorization
   * Resultado esperado: 200 OK - debe funcionar igual que con header
   */
  it("debería extraer token de cookies si no está en headers", async () => {
    const mockUser = {
      IdRegistroLogin: 2,
      Usuario: "cookieuser",
      IdRol: 2,
      Rol: { 
        NombreRol: "Almacenista" 
      }
    };

    findByPkStub.resolves(mockUser);

    const validToken = jwt.sign(
      { id: 2, Correo: "cookie@example.com", Rol: 2 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Simular cookie con token usando el formato correcto
    const res = await request(app)
      .get("/api/test-secure")
      .set("Cookie", [`token=${validToken}`]);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Acceso permitido");
    expect(res.body.user).to.have.property("id", 2);
    expect(res.body.user).to.have.property("rol", "Almacenista");
  });

  /**
   * PRUEBA 6: Verificar manejo de usuario sin rol asignado
   * Escenario: Usuario válido pero sin rol en la base de datos
   * Resultado esperado: 200 OK con rol por defecto "Sin rol"
   */
  it("debería manejar usuario sin rol asignado", async () => {
    const mockUser = {
      IdRegistroLogin: 3,
      Usuario: "noroluser",
      IdRol: null,
      Rol: null
    };

    findByPkStub.resolves(mockUser);

    const validToken = jwt.sign(
      { id: 3, Correo: "norol@example.com", Rol: null },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Acceso permitido");
    expect(res.body.user).to.have.property("rol", "Sin rol");
  });

  /**
   * PRUEBA 7: Verificar rechazo de token expirado
   * Escenario: Token JWT que ya superó su tiempo de vida
   * Resultado esperado: 401 Unauthorized
   */
  it("debería rechazar token expirado", async () => {
    // Crear token con expiración inmediata
    const expiredToken = jwt.sign(
      { id: 1, Correo: "test@example.com", Rol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "0s" } // Expira inmediatamente
    );

    // Esperar un poco para asegurar que el token expire
    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token inválido");
  });

  /**
   * PRUEBA 8: Verificar manejo de errores de base de datos
   * Escenario: Error en la consulta a la base de datos
   * Resultado esperado: 401 Unauthorized (por seguridad)
   */
  it("debería rechazar si hay error en la base de datos", async () => {
    // Simular error de base de datos
    findByPkStub.rejects(new Error("Database connection error"));

    const validToken = jwt.sign(
      { id: 1, Correo: "test@example.com", Rol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token inválido");
  });

  /**
   * PRUEBA 9: Verificar rechazo de header Authorization con formato incorrecto
   * Escenario: Header Authorization que no usa el formato "Bearer <token>"
   * Resultado esperado: 403 Forbidden
   */
  it("debería manejar Authorization header sin Bearer", async () => {
    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", "Basic dGVzdDp0ZXN0"); // Basic auth en lugar de Bearer

    expect(res.status).to.equal(403);
    expect(res.body).to.have.property("message", "Token no proporcionado");
  });
});