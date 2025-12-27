import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1); // Opcional: parar el servidor si no hay DB
  }
};

// Rutas de prueba
app.get("/", (_req, res) => {
  res.send("MindBalance backend funcionando");
});

// Arrancar servidor solo cuando la DB esté lista
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
  });
});
