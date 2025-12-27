import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password?: string;
  googleId?: string;
  rol: "usuario" | "profesional" | "admin";
  estado: "activo" | "inactivo" | "pendiente";
  fechaRegistro: Date;
  puntos: number;
  nivel: number;
  suscripcion: string;
  matchPassword(password: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, "Email inválido"],
  },
  password: {
    type: String,
    required: false,
    minlength: [5, "La contraseña debe tener al menos 5 caracteres"],
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  rol: {
    type: String,
    enum: ["usuario", "profesional", "admin"],
    default: "usuario",
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo", "pendiente"],
    default: "activo",
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  puntos: {
    type: Number,
    default: 0,
  },
  nivel: {
    type: Number,
    default: 1,
  },
  suscripcion: {
    type: String,
    enum: ["free", "premium", "profesional"],
    default: "free",
  },
});

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

usuarioSchema.methods.matchPassword = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUsuario>("Usuario", usuarioSchema);
