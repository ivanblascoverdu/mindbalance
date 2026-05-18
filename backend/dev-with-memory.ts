import { MongoMemoryServer } from "mongodb-memory-server";

const main = async () => {
  const mongo = await MongoMemoryServer.create({ instance: { port: 27018 } });
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-mindbalance";
  process.env.PORT = process.env.PORT || "4000";
  process.env.NODE_ENV = "development";

  console.log("\n🧪 MongoDB en memoria arrancada en:", uri);

  // Seed inline (mismo contenido que src/seed.ts pero sin process.exit)
  const Usuario = (await import("./src/models/Usuario.js")).default;
  const Programa = (await import("./src/models/Programa.js")).default;
  const Recurso = (await import("./src/models/Recurso.js")).default;
  const mongoose = (await import("mongoose")).default;
  await mongoose.connect(uri);

  const adminEmail = "admin@mindbalance.com";
  const adminExistente = await Usuario.findOne({ email: adminEmail });
  if (!adminExistente) {
    await Usuario.create({
      nombre: "Administrador",
      email: adminEmail,
      password: "admin",
      rol: "admin",
      estado: "activo",
    });
    console.log("👤 Admin: admin@mindbalance.com / admin");
  }

  // Crear un profesional y un usuario normal de prueba
  if (!(await Usuario.findOne({ email: "psico@mindbalance.com" }))) {
    await Usuario.create({
      nombre: "Dra. María González",
      email: "psico@mindbalance.com",
      password: "password",
      rol: "profesional",
      estado: "activo",
    });
    console.log("👨‍⚕️ Profesional: psico@mindbalance.com / password");
  }
  if (!(await Usuario.findOne({ email: "user@mindbalance.com" }))) {
    await Usuario.create({
      nombre: "Usuario Demo",
      email: "user@mindbalance.com",
      password: "password",
      rol: "usuario",
      estado: "activo",
    });
    console.log("🙋 Usuario: user@mindbalance.com / password");
  }

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
    await Programa.findOneAndUpdate({ titulo: p.titulo }, p, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log("📚 Programas sembrados");

  const recursos = [
    { titulo: "5 Técnicas de Respiración", descripcion: "Guía rápida para calmarte.", tipo: "articulo", url: "https://example.com/respiracion", categoria: "Ansiedad", tags: ["respiración"], esPremium: false },
    { titulo: "Meditación Guiada", descripcion: "Audio de 15 min.", tipo: "audio", url: "https://example.com/a.mp3", categoria: "Mindfulness", tags: ["meditación"], esPremium: false },
    { titulo: "¿Qué es la TCC?", descripcion: "Video explicativo.", tipo: "video", url: "https://youtube.com/watch?v=x", categoria: "Psicología", tags: ["educación"], esPremium: false },
  ];
  for (const r of recursos) {
    await Recurso.findOneAndUpdate({ titulo: r.titulo }, r, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log("📖 Recursos sembrados\n");

  // Importar el servidor (esto arranca app.listen)
  await import("./src/index.js");

  const shutdown = async () => {
    console.log("\n👋 Cerrando...");
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

main().catch((err) => {
  console.error("❌ Error arrancando dev server:", err);
  process.exit(1);
});
