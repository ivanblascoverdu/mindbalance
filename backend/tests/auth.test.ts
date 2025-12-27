import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import Usuario from "../src/models/Usuario.js";

// Create a minimal Express app for testing
const app = express();
app.use(express.json());

// Import routes
import authRoutes from "../src/routes/auth.js";
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
    describe("POST /api/auth/registro", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                nombre: "Test User",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            };

            const response = await request(app)
                .post("/api/auth/registro")
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("_id");
            expect(response.body.nombre).toBe("Test User");
            expect(response.body.email).toBe("test@example.com");
            expect(response.body.rol).toBe("usuario");
        });

        it("should return 400 if email already exists", async () => {
            const userData = {
                nombre: "Test User",
                email: "duplicate@example.com",
                password: "password123",
                confirmPassword: "password123",
            };

            // First registration
            await request(app).post("/api/auth/registro").send(userData);

            // Second registration with same email
            const response = await request(app)
                .post("/api/auth/registro")
                .send(userData)
                .expect(400);

            expect(response.body.mensaje).toBe("El usuario ya existe");
        });

        it("should return 400 if passwords do not match", async () => {
            const userData = {
                nombre: "Test User",
                email: "mismatch@example.com",
                password: "password123",
                confirmPassword: "differentpassword",
            };

            const response = await request(app)
                .post("/api/auth/registro")
                .send(userData)
                .expect(400);

            expect(response.body.mensaje).toBe("Las contraseñas no coinciden");
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            // Create a test user before login tests
            await Usuario.create({
                nombre: "Login Test User",
                email: "login@example.com",
                password: "password123",
                estado: "activo",
            });
        });

        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "password123",
                })
                .expect(200);

            expect(response.body).toHaveProperty("token");
            expect(response.body.email).toBe("login@example.com");
        });

        it("should return 401 with incorrect password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "wrongpassword",
                })
                .expect(401);

            expect(response.body.mensaje).toBe("Credenciales inválidas");
        });

        it("should return 401 with non-existent email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "nonexistent@example.com",
                    password: "password123",
                })
                .expect(401);

            expect(response.body.mensaje).toBe("Credenciales inválidas");
        });
    });
});
