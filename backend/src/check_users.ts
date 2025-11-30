import mongoose from "mongoose";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Conectado a MongoDB");

    const users = await Usuario.find({ rol: "admin" });
    console.log("Admins encontrados:", users.length);
    console.log(JSON.stringify(users, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkUsers();
