import { env, isProduction } from "./config/env.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import programaRoutes from "./routes/programa.js";
import recursoRoutes from "./routes/recurso.js";
import postRoutes from "./routes/post.js";
import citaRoutes from "./routes/cita.js";
import metaRoutes from "./routes/meta.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";

const app = express();

// CORS — restrictivo si FRONTEND_URL está configurado; abierto si no (con warning)
const allowedOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(",").map((s) => s.trim())
  : [];

const isVercelPreview = (origin: string) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, curl, healthchecks)
      if (!origin) return callback(null, true);
      // En desarrollo: todo permitido
      if (!isProduction) return callback(null, true);
      // Si no se configuró whitelist, no bloquear (mejor disponible que caído)
      if (allowedOrigins.length === 0) return callback(null, true);
      // Whitelist explícita
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Tolerar previews automáticas de Vercel
      if (isVercelPreview(origin)) return callback(null, true);
      return callback(new Error(`Origen no permitido: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Healthcheck — para monitoring y readiness probes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/programas", programaRoutes);
app.use("/api/recursos", recursoRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/metas", metaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "MindBalance API funcionando correctamente ✅" });
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Error conectando a MongoDB:`, error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Servidor backend corriendo en http://localhost:${env.PORT} (${env.NODE_ENV})`
    );
  });
});
