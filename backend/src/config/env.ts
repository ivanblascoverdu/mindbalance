import dotenv from "dotenv";

dotenv.config();

const required = ["JWT_SECRET", "MONGODB_URI"] as const;

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `❌ Faltan variables de entorno requeridas: ${missing.join(", ")}`
  );
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET!.length < 32) {
  // eslint-disable-next-line no-console
  console.error(
    "❌ JWT_SECRET debe tener al menos 32 caracteres en producción"
  );
  process.exit(1);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 4000,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

export const isProduction = env.NODE_ENV === "production";
