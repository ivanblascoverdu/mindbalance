import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../src/models/Usuario.js";

// Create a minimal Express app for testing
const app = express();
app.use(express.json());

// Import routes
import programaRoutes from "../src/routes/programa.js";
app.use("/api/programas", programaRoutes);

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";

describe("Programas API", () => {
    let testUser: any;
    let authToken: string;

    beforeEach(async () => {
        // Create a test user and generate token
        testUser = await Usuario.create({
            nombre: "Test Programas User",
            email: "programas@example.com",
            password: "password123",
            estado: "activo",
        });

        authToken = jwt.sign({ id: testUser._id }, JWT_SECRET, {
            expiresIn: "30d",
        });
    });

    describe("GET /api/programas", () => {
        it("should return 401 without authentication token", async () => {
            const response = await request(app)
                .get("/api/programas")
                .expect(401);

            expect(response.body.mensaje).toBe("No autorizado, token no proporcionado");
        });

        it("should return programs list with valid token", async () => {
            const response = await request(app)
                .get("/api/programas")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe("POST /api/programas", () => {
        it("should return 401 without authentication token", async () => {
            const programData = {
                nombre: "Test Program",
                descripcion: "Test Description",
                duracionSemanas: 4,
            };

            const response = await request(app)
                .post("/api/programas")
                .send(programData)
                .expect(401);

            expect(response.body.mensaje).toBe("No autorizado, token no proporcionado");
        });
    });
});
