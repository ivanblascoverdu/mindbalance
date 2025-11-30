import mongoose from "mongoose";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";
import Programa from "./models/Programa.js";
import Recurso from "./models/Recurso.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Conectado a MongoDB para seeding");

    // 1. Crear Admin
    const adminEmail = "admin@mindbalance.com";
    const adminExistente = await Usuario.findOne({ email: adminEmail });
    
    if (!adminExistente) {
      await Usuario.create({
        nombre: "Administrador",
        email: adminEmail,
        password: "admin123password", // El modelo lo hasheará
        rol: "admin",
      });
      console.log("👤 Usuario Admin creado");
    } else {
      console.log("ℹ️ Usuario Admin ya existe");
    }

    // 2. Crear Programas
    const programas = [
      {
        titulo: "Mindfulness para Principiantes",
        descripcion: "Aprende las bases de la atención plena para reducir el estrés diario.",
        duracion: "4 semanas",
        sesiones: 8,
        categoria: "mindfulness",
        color: "#4caf50",
        contenido: ["Introducción", "Respiración", "Escaneo corporal", "Atención plena en movimiento"],
      },
      {
        titulo: "Gestión de la Ansiedad",
        descripcion: "Herramientas cognitivo-conductuales para manejar la ansiedad.",
        duracion: "6 semanas",
        sesiones: 12,
        categoria: "estrés",
        color: "#ff9800",
        contenido: ["Entendiendo la ansiedad", "Reestructuración cognitiva", "Exposición gradual"],
      },
      {
        titulo: "Mejora tu Sueño",
        descripcion: "Higiene del sueño y técnicas de relajación para dormir mejor.",
        duracion: "3 semanas",
        sesiones: 6,
        categoria: "sueño",
        color: "#3f51b5",
        contenido: ["Rutinas nocturnas", "Relajación muscular progresiva", "Diario de sueño"],
      },
      {
        titulo: "Autoestima y Autocompasión",
        descripcion: "Fortalece tu relación contigo mismo.",
        duracion: "5 semanas",
        sesiones: 10,
        categoria: "emoción",
        color: "#e91e63",
        contenido: ["El crítico interno", "Autocompasión", "Valores personales"],
      },
    ];

    for (const p of programas) {
      const existe = await Programa.findOne({ titulo: p.titulo });
      if (!existe) {
        await Programa.create(p);
      }
    }
    console.log("📚 Programas verificados/creados");

    // 3. Crear Recursos (Biblioteca)
    const recursos = [
      {
        titulo: "5 Técnicas de Respiración",
        descripcion: "Guía rápida para calmarte en momentos de crisis.",
        tipo: "articulo",
        url: "https://example.com/respiracion",
        categoria: "Ansiedad",
        tags: ["respiración", "calma", "crisis"],
      },
      {
        titulo: "Meditación Guiada: Escaneo Corporal",
        descripcion: "Audio de 15 minutos para relajar el cuerpo.",
        tipo: "audio",
        url: "https://example.com/audio1.mp3",
        categoria: "Mindfulness",
        tags: ["meditación", "relajación"],
      },
      {
        titulo: "¿Qué es la Terapia Cognitivo Conductual?",
        descripcion: "Video explicativo sobre cómo funcionan nuestros pensamientos.",
        tipo: "video",
        url: "https://youtube.com/watch?v=example",
        categoria: "Psicología",
        tags: ["educación", "terapia"],
      },
      {
        titulo: "Diario de Gratitud",
        descripcion: "Plantilla para empezar a practicar la gratitud diaria.",
        tipo: "articulo",
        url: "https://example.com/gratitud",
        categoria: "Bienestar",
        tags: ["gratitud", "positividad"],
      },
    ];

    for (const r of recursos) {
      const existe = await Recurso.findOne({ titulo: r.titulo });
      if (!existe) {
        await Recurso.create(r);
      }
    }
    console.log("📖 Recursos verificados/creados");

    console.log("✅ Seeding completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seeding:", error);
    process.exit(1);
  }
};

seedData();
