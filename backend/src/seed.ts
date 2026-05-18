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
        password: "admin", // El modelo lo hasheará
        rol: "admin",
      });
      console.log("👤 Usuario Admin creado");
    } else {
      // Actualizar contraseña si ya existe
      adminExistente.password = "admin";
      await adminExistente.save();
      console.log("ℹ️ Usuario Admin actualizado con nueva contraseña");
    }

    // 2. Crear Programas
    const programas = [
      {
        titulo: "Mindfulness para Principiantes",
        descripcion: "Aprende las bases de la atención plena para reducir el estrés diario.",
        duracion: "4 semanas",
        sesiones: 5,
        categoria: "mindfulness",
        color: "primary",
        contenido: [
          { titulo: "Qué es el Mindfulness", descripcion: "Introducción a la práctica de la atención plena.", videoUrl: "lFcSrYw-ARY", puntos: 50, duracion: "10 min" },
          { titulo: "Escaneo corporal", descripcion: "Conecta con las sensaciones de tu cuerpo.", videoUrl: "ZToicYcHIOU", puntos: 50, duracion: "15 min" },
          { titulo: "Atención a la respiración", descripcion: "Usa tu respiración como ancla al presente.", videoUrl: "w7aIdbwX6Ts", puntos: 60, duracion: "12 min" },
          { titulo: "Mindfulness en movimiento", descripcion: "Lleva la atención plena a tus actividades diarias.", videoUrl: "inpok4MKVLM", puntos: 70, duracion: "20 min" },
          { titulo: "Integración diaria", descripcion: "Cómo mantener la práctica día a día.", videoUrl: "1ZYbU82GVz4", puntos: 80, duracion: "15 min" },
        ],
      },
      {
        titulo: "Gestión de la Ansiedad",
        descripcion: "Herramientas cognitivo-conductuales para manejar la ansiedad.",
        duracion: "6 semanas",
        sesiones: 8,
        categoria: "estrés",
        color: "warning",
        contenido: [
          { titulo: "Entendiendo la ansiedad", descripcion: "Comprende los mecanismos biológicos y psicológicos de la ansiedad.", videoUrl: "inpok4MKVLM", puntos: 50, duracion: "10 min" },
          { titulo: "Respiración diafragmática", descripcion: "Técnica fundamental para reducir la activación fisiológica.", videoUrl: "w7aIdbwX6Ts", puntos: 50, duracion: "15 min" },
          { titulo: "Identificando disparadores", descripcion: "Aprende a reconocer qué situaciones detonan tu ansiedad.", videoUrl: "1ZYbU82GVz4", puntos: 60, duracion: "12 min" },
          { titulo: "Reestructuración cognitiva", descripcion: "Cambia los pensamientos que alimentan la ansiedad.", videoUrl: "lFcSrYw-ARY", puntos: 70, duracion: "20 min" },
          { titulo: "Exposición gradual", descripcion: "Enfrenta tus miedos paso a paso de forma segura.", videoUrl: "nmFUDkj1Aq0", puntos: 80, duracion: "18 min" },
          { titulo: "Mindfulness para ansiedad", descripcion: "Atención plena para reducir el estrés.", videoUrl: "ZToicYcHIOU", puntos: 60, duracion: "15 min" },
          { titulo: "Prevención de recaídas", descripcion: "Mantén tus logros a largo plazo.", videoUrl: "tEmt1Znux58", puntos: 90, duracion: "25 min" },
          { titulo: "Plan de acción personal", descripcion: "Crea tu propia caja de herramientas anti-ansiedad.", videoUrl: "inpok4MKVLM", puntos: 100, duracion: "30 min" },
        ],
      },
      {
        titulo: "Mejora tu Sueño",
        descripcion: "Higiene del sueño y técnicas de relajación para dormir mejor.",
        duracion: "3 semanas",
        sesiones: 4,
        categoria: "sueño",
        color: "info",
        contenido: [
          { titulo: "Rutinas nocturnas", descripcion: "Crea hábitos que preparen tu cuerpo para dormir.", videoUrl: "ZToicYcHIOU", puntos: 50, duracion: "12 min" },
          { titulo: "Relajación muscular progresiva", descripcion: "Libera la tensión acumulada del día.", videoUrl: "w7aIdbwX6Ts", puntos: 60, duracion: "20 min" },
          { titulo: "Higiene del sueño", descripcion: "Adapta tu entorno para descansar mejor.", videoUrl: "lFcSrYw-ARY", puntos: 60, duracion: "15 min" },
          { titulo: "Diario de sueño", descripcion: "Detecta patrones y mejora tu descanso.", videoUrl: "tEmt1Znux58", puntos: 80, duracion: "18 min" },
        ],
      },
      {
        titulo: "Autoestima y Autocompasión",
        descripcion: "Fortalece tu relación contigo mismo.",
        duracion: "5 semanas",
        sesiones: 6,
        categoria: "emoción",
        color: "secondary",
        isPremium: true,
        contenido: [
          { titulo: "Autoconocimiento", descripcion: "Descubre quién eres realmente.", videoUrl: "tEmt1Znux58", puntos: 50, duracion: "15 min" },
          { titulo: "El crítico interno", descripcion: "Identifica y suaviza tu voz crítica.", videoUrl: "lFcSrYw-ARY", puntos: 60, duracion: "20 min" },
          { titulo: "Autocompasión", descripcion: "Trátate con la amabilidad que mereces.", videoUrl: "ZToicYcHIOU", puntos: 70, duracion: "18 min" },
          { titulo: "Valores personales", descripcion: "Identifica lo que es importante para ti.", videoUrl: "nmFUDkj1Aq0", puntos: 70, duracion: "20 min" },
          { titulo: "Límites saludables", descripcion: "Aprende a decir no sin culpa.", videoUrl: "w7aIdbwX6Ts", puntos: 80, duracion: "25 min" },
          { titulo: "Autocuidado integral", descripcion: "Cuida de ti en cuerpo y mente.", videoUrl: "inpok4MKVLM", puntos: 90, duracion: "20 min" },
        ],
      },
    ];

    for (const p of programas) {
      await Programa.findOneAndUpdate(
        { titulo: p.titulo },
        p,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log("📚 Programas verificados/actualizados");

    // 3. Crear Recursos (Biblioteca)
    const recursos = [
      {
        titulo: "5 Técnicas de Respiración",
        descripcion: "Guía rápida para calmarte en momentos de crisis.",
        tipo: "articulo",
        url: "https://example.com/respiracion",
        categoria: "Ansiedad",
        tags: ["respiración", "calma", "crisis"],
        esPremium: false,
      },
      {
        titulo: "Meditación Guiada: Escaneo Corporal",
        descripcion: "Audio de 15 minutos para relajar el cuerpo.",
        tipo: "audio",
        url: "https://example.com/audio1.mp3",
        categoria: "Mindfulness",
        tags: ["meditación", "relajación"],
        esPremium: true,
      },
      {
        titulo: "¿Qué es la Terapia Cognitivo Conductual?",
        descripcion: "Video explicativo sobre cómo funcionan nuestros pensamientos.",
        tipo: "video",
        url: "https://youtube.com/watch?v=example",
        categoria: "Psicología",
        tags: ["educación", "terapia"],
        esPremium: false,
      },
      {
        titulo: "Diario de Gratitud",
        descripcion: "Plantilla para empezar a practicar la gratitud diaria.",
        tipo: "articulo",
        url: "https://example.com/gratitud",
        categoria: "Bienestar",
        tags: ["gratitud", "positividad"],
        esPremium: true,
      },
      {
        titulo: "Gestión del Tiempo para Reducir Estrés",
        descripcion: "Consejos prácticos para organizar tu día a día.",
        tipo: "articulo",
        url: "https://example.com/tiempo",
        categoria: "Productividad",
        tags: ["organización", "estrés"],
        esPremium: false,
      },
      {
        titulo: "Masterclass: Yoga para la Ansiedad",
        descripcion: "Sesión completa de 45 minutos de yoga restaurativo.",
        tipo: "video",
        url: "https://example.com/yoga",
        categoria: "Yoga",
        tags: ["yoga", "cuerpo", "ansiedad"],
        esPremium: true,
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
