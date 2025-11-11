import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import programaRoutes from "./routes/programa";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";

app.use(cors());
app.use(express.json());
app.use("/api/programas", programaRoutes);

// ==================== MODELOS ====================

interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  rol: "usuario" | "profesional" | "admin";
  matchPassword(password: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  rol: {
    type: String,
    default: "usuario",
    enum: ["usuario", "profesional", "admin"],
  },
});

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Usuario = mongoose.model<IUsuario>("Usuario", usuarioSchema);

// ==================== MIDDLEWARE ====================

const autenticar = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ mensaje: "Token no proporcionado" });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.usuarioId = decoded.id;
    next();
  } catch {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// ==================== CONEXIÓN A MONGODB ====================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB:`, error);
    process.exit(1);
  }
};

connectDB();

// ==================== RUTAS ====================

// REGISTRO

app.post("/api/auth/registro", async (req, res) => {
  const { nombre, email, password, confirmPassword } = req.body;

  // 1. Validaciones básicas
  if (!nombre || !email || !password || password !== confirmPassword) {
    return res
      .status(400)
      .json({ mensaje: "Datos inválidos o no coinciden las contraseñas." });
  }

  // 2. Comprobar si el usuario existe (usa tu lógica de BBDD)
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return res.status(409).json({ mensaje: "Email ya registrado" });
  }

  // 3. Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 4. Crear usuario
  const nuevoUsuario = await Usuario.create({
    nombre,
    email,
    password: passwordHash,
    rol: "usuario",
  });

  // 5. Generar token
  const token = jwt.sign({ id: nuevoUsuario._id }, "clave_secreta", {
    expiresIn: "1d",
  });

  // 6. Responder
  res.json({
    mensaje: "Usuario registrado exitosamente",
    token,
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
    },
  });
});

// LOGIN
app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña requeridos" });
    }

    const usuario = await Usuario.findOne({ email }).select("+password");
    if (!usuario || !(await usuario.matchPassword(password))) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      mensaje: "Sesión iniciada correctamente",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// OBTENER USUARIO ACTUAL
app.get("/api/auth/me", autenticar, async (req: any, res: any) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// RUTA DE PRUEBA
app.get("/", (req: any, res: any) => {
  res.json({ message: "MindBalance API funcionando correctamente ✅" });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
