import mongoose, { Document, Schema } from "mongoose";

export interface IMeta extends Document {
  usuario: mongoose.Types.ObjectId;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  fechaObjetivo?: Date;
  createdAt: Date;
}

const metaSchema = new Schema<IMeta>({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  completada: { type: Boolean, default: false },
  fechaObjetivo: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMeta>("Meta", metaSchema);
