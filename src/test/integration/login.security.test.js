import request from "supertest";
import { expect } from "chai";
import express from "express";
import sinon from "sinon";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import RegistroLogin from "../../models/LoginModel.js";
import Role from "../../models/RolModel.js";
import jwt from "jsonwebtoken";

describe("Middleware de seguridad - verifyToken", () => {
  let app;
  let sandbox;
  let findByPkStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = express();
    app.use(express.json());

    // Middleware para parsear cookies
    app.use((req, res, next) => {
      // Simular cookie parser básico para pruebas
      if (req.headers.cookie) {
        req.cookies = {};
        req.headers.cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.split('=').map(c => c.trim());
          req.cookies[name] = value;
        });
      } else {
        req.cookies = {};
      }
      next();
    });

    // Ruta ficticia solo para pruebas
    app.get("/api/test-secure", verifyToken, (req, res) => {
      res.json({ message: "Acceso permitido", user: req.user });
    });

    // Mock del método findByPk de RegistroLogin
    findByPkStub = sandbox.stub(RegistroLogin, "findByPk");
    
    // Asegurar que JWT_SECRET esté disponible para las pruebas
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = "test_secret_key_for_testing";
    }
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("debería rechazar acceso sin token", async () => {
    const res = await request(app).get("/api/test-secure");
    
    expect(res.status).to.equal(403);
    expect(res.body).to.have.property("message", "Token no proporcionado");
  });

  it("debería rechazar acceso con token inválido", async () => {
    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token inválido");
  });

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

    // Generar token válido
    const validToken = jwt.sign(
      { id: 1, Correo: "test@example.com", Rol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Acceso permitido");
    expect(res.body.user).to.have.property("id", 1);
    expect(res.body.user).to.have.property("nombre", "testuser");
    expect(res.body.user).to.have.property("rol", "Administrador");
  });

  it("debería rechazar acceso si el usuario no existe", async () => {
    // Mock para usuario no encontrado
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

  it("debería manejar Authorization header sin Bearer", async () => {
    const res = await request(app)
      .get("/api/test-secure")
      .set("Authorization", "Basic dGVzdDp0ZXN0"); // Basic auth en lugar de Bearer

    expect(res.status).to.equal(403);
    expect(res.body).to.have.property("message", "Token no proporcionado");
  });
});