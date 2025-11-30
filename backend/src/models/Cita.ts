import mongoose, { Document, Schema } from "mongoose";

export interface ICita extends Document {
  cliente: mongoose.Types.ObjectId;
  profesional: mongoose.Types.ObjectId;
  fecha: Date;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
  notas?: string;
  linkReunion?: string;
  createdAt: Date;
}

const citaSchema = new Schema<ICita>({
  cliente: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  profesional: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  fecha: { type: Date, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "cancelada", "completada"],
    default: "pendiente",
  },
  notas: { type: String },
  linkReunion: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICita>("Cita", citaSchema);
