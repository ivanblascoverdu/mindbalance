import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("MindBalance backend funcionando");
});

// Aquí importarás tus routers cuando los crees:
// import usuarioRouter from "./routes/usuario.routes";
// app.use("/api/usuarios", usuarioRouter);

app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});
