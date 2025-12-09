import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import programaRoutes from "./routes/programa.js";
import recursoRoutes from "./routes/recurso.js";
import postRoutes from "./routes/post.js";
import citaRoutes from "./routes/cita.js";
import metaRoutes from "./routes/meta.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/programas", programaRoutes);
app.use("/api/recursos", recursoRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/metas", metaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "MindBalance API funcionando correctamente ✅" });
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI || "");
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB:`, error);
    process.exit(1);
  }
};

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
});
