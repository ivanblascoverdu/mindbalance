// ──────────────────────────────────────────────────────────────────
// Base de conocimiento "Asistente MindBalance"
//
// Cuando el servicio de IA no está disponible (sin API key, cuota
// agotada, error 5xx, etc.), el asistente cae a este matcher por
// palabras clave para dar respuestas útiles sobre la plataforma.
//
// La filosofía: que la persona NUNCA se quede sin respuesta.
// ──────────────────────────────────────────────────────────────────

interface FaqEntry {
  // Si alguno de estos patrones aparece en el mensaje, responde.
  patterns: RegExp[];
  // Respuesta final (con saltos de línea \n permitidos).
  reply: string;
  // Sugerencias adicionales que el frontend puede mostrar como chips.
  followUps?: string[];
}

const KB: FaqEntry[] = [
  // ── Saludos ──
  {
    patterns: [/\b(hola|buenas|hey|qué tal|que tal|saludos|hi|hello)\b/i],
    reply:
      "¡Hola! 👋 Soy el asistente de MindBalance. Estoy aquí para ayudarte a navegar la plataforma y resolver dudas sobre bienestar mental.\n\n¿En qué te ayudo hoy?",
    followUps: [
      "¿Cómo agendo una cita?",
      "¿Qué programas hay?",
      "¿Cómo funciona el progreso?",
    ],
  },

  // ── Onboarding / primeros pasos ──
  {
    patterns: [
      /\b(empezar|empiezo|por dónde|por donde|primer.*paso|comenzar|nuev[oa].*aqu[ií]|onboarding|gu[ií]a)\b/i,
    ],
    reply:
      "¡Bienvenido/a! Para empezar te recomiendo:\n\n1. Echar un vistazo al **Dashboard** — verás tu próxima cita y recursos recomendados.\n2. Explorar **Programas** y elegir uno que te llame: hay para mindfulness, ansiedad, sueño y autoestima.\n3. Crear una **meta personal** en Progreso para empezar a ganar puntos.\n\nSi en cualquier momento te pierdes, pulsa el icono **❓ Ayuda** arriba a la derecha y te haré un tour guiado por todas las secciones.",
    followUps: ["¿Qué programas hay?", "¿Cómo funciona el progreso?"],
  },

  // ── Tour ──
  {
    patterns: [/\b(tour|recorrido|guiad[oa]|tutorial|gu[ií]a.*plataforma)\b/i],
    reply:
      "Tenemos un tour interactivo que te explica cada sección de la plataforma. Para iniciarlo pulsa el icono **❓ (interrogación)** en la barra superior, junto a tu avatar. Se reproduce automáticamente la primera vez que entras y puedes repetirlo cuando quieras.",
  },

  // ── Citas / teleconsultas ──
  {
    patterns: [
      /\b(agendar|reservar|pedir|c[oó]mo.*cita|tener.*cita|sacar.*cita|sesi[oó]n.*profesional|teleconsulta|videollamada|psic[oó]log[oa])\b/i,
    ],
    reply:
      "Para agendar una **teleconsulta** con un profesional:\n\n1. Ve a **Sesiones** en el menú lateral.\n2. Verás la lista de **Profesionales Disponibles**.\n3. Pulsa **Reservar sesión** en el profesional que prefieras.\n4. Elige fecha y hora en el calendario y confirma.\n\nRecibirás la cita en estado *pendiente* hasta que el profesional la confirme. Cuando se confirme aparecerá el botón **Unirse** para entrar a la videollamada.",
    followUps: ["¿Cómo cancelo una cita?", "¿Cuánto duran las sesiones?"],
  },

  // ── Cancelar / reprogramar cita ──
  {
    patterns: [
      /\b(cancelar|anular|reprogramar|cambiar.*cita|borrar.*cita|posponer)\b/i,
    ],
    reply:
      "Puedes **cancelar o reprogramar** desde Sesiones:\n\n• En **Mis Citas Programadas** verás cada cita con dos botones: *Reprogramar* y *Cancelar*.\n• Te recomendamos cancelar con al menos 24 h de antelación por respeto al profesional.\n• Si reprogramas, la cita actual se cancela y se abre el diálogo para elegir nueva fecha.",
  },

  // ── Programas ──
  {
    patterns: [
      /\b(programas?|intervenci[oó]n|terapia|sesiones.*programa|qu[eé].*aprender)\b/i,
    ],
    reply:
      "Tenemos 4 programas terapéuticos basados en evidencia:\n\n🌿 **Mindfulness para Principiantes** (5 sesiones) — fundamentos de atención plena.\n🌊 **Gestión de la Ansiedad** (8 sesiones) — herramientas TCC para manejar la ansiedad.\n🌙 **Mejora tu Sueño** (4 sesiones) — higiene del sueño y relajación.\n✨ **Autoestima y Autocompasión** (6 sesiones, Premium) — fortalece tu relación contigo mismo/a.\n\nEntra en **Programas**, escoge uno y completa las sesiones a tu ritmo. Cada sesión te da puntos para tu nivel.",
    followUps: ["¿Qué es Premium?", "¿Cómo funciona el progreso?"],
  },

  // ── Premium / Suscripciones ──
  {
    patterns: [
      /\b(premium|suscripci[oó]n|pago|pagar|gratuito|gratis|precio|plan|membres[ií]a)\b/i,
    ],
    reply:
      "MindBalance ofrece dos planes:\n\n• **Gratuito** — acceso a programas básicos, biblioteca pública, comunidad y registro de progreso.\n• **Premium** — incluye programas avanzados (como *Autoestima y Autocompasión*), audios exclusivos y más sesiones con profesionales al mes.\n\nPuedes ver y gestionar tu plan en **Suscripciones** (icono ⭐ en el menú).",
  },

  // ── Biblioteca ──
  {
    patterns: [
      /\b(biblioteca|recursos|art[ií]culos?|videos?|audios?|leer|escuchar|contenido|psicoeduca)\b/i,
    ],
    reply:
      "La **Biblioteca** reúne artículos, audios y vídeos validados por profesionales de la salud mental. Puedes filtrarlos por tipo (Artículos / Vídeos / Audios) y por categoría (Ansiedad, Mindfulness, Sueño, etc.).\n\nÁbrela desde el menú lateral 📚 *Biblioteca*. El contenido marcado como Premium requiere suscripción.",
  },

  // ── Comunidad ──
  {
    patterns: [
      /\b(comunidad|foro|publicar|post|grupos?|compartir|comentar|seguir.*usuario)\b/i,
    ],
    reply:
      "En **Comunidad** puedes:\n\n• Publicar cómo te sientes o lo que has aprendido (campo *¿Qué quieres compartir hoy?*).\n• Dar **me gusta** y comentar publicaciones de otras personas.\n• Filtrar el feed por hashtags de tendencia (#Mindfulness, #Ansiedad…).\n• Unirte a **Grupos de Apoyo** organizados por temáticas.\n\nEs un espacio respetuoso y moderado.",
  },

  // ── Progreso / gamificación ──
  {
    patterns: [
      /\b(progreso|metas?|nivel|xp|puntos|racha|h[aá]bitos?|estad[ií]sticas|gr[aá]ficas)\b/i,
    ],
    reply:
      "En **Progreso** vas a encontrar:\n\n• Tu **nivel** y los XP necesarios para subir.\n• **Metas personales** que tú creas (ej. *Meditar 10 minutos al día*). Tíchalas cuando las completes.\n• Una **gráfica de bienestar semanal** basada en tus registros de estado de ánimo.\n• Tu **racha** de días consecutivos cumpliendo metas.\n\nCada sesión completada de un programa también te da puntos automáticamente.",
  },

  // ── Estado de ánimo / mood ──
  {
    patterns: [
      /\b(estado.*[aá]nimo|c[oó]mo me siento|registro.*diario|mood|d[ií]a.*sentir|tracker)\b/i,
    ],
    reply:
      "Puedes registrar cómo te sientes desde el Dashboard pulsando la tarjeta **Registro diario** ❤️. Se abre un breve cuestionario que alimenta tu gráfica de progreso semanal. Hazlo a diario para detectar patrones en tu bienestar.",
  },

  // ── Perfil / cuenta ──
  {
    patterns: [
      /\b(perfil|cuenta|datos.*personales|cambiar.*nombre|cambiar.*email|cambiar.*contrase[ñn]a|foto.*perfil|avatar)\b/i,
    ],
    reply:
      "Para editar tu perfil pulsa tu **avatar** arriba a la derecha y entra en **Perfil**. Desde ahí puedes actualizar tu nombre, email y otros datos. Para preferencias y notificaciones, ve a **Configuración**.",
  },

  // ── Cerrar sesión ──
  {
    patterns: [/\b(cerrar.*sesi[oó]n|salir|logout|desconectar)\b/i],
    reply:
      "Para cerrar sesión pulsa tu **avatar** arriba a la derecha y selecciona **Cerrar sesión** (en rojo).",
  },

  // ── Ansiedad ──
  {
    patterns: [
      /\b(ansiedad|ansios[oa]|ataque.*pánico|nervi[oa]s|me siento mal|estr[eé]s|estresad[oa])\b/i,
    ],
    reply:
      "Lamento que estés pasando por esto 💚. Algunas cosas que puedes probar **ahora mismo**:\n\n• **Respiración 4-7-8**: inspira 4 s, retén 7 s, exhala 8 s. Repítelo 4 veces.\n• Abre **Programas → Gestión de la Ansiedad** y empieza la sesión de *Respiración diafragmática*.\n• Si sientes que necesitas hablar con alguien, ve a **Sesiones** y reserva una teleconsulta.\n\nSi estás en una crisis grave, contacta con un servicio de emergencias de tu país.",
  },

  // ── Sueño ──
  {
    patterns: [
      /\b(dormir|sue[ñn]o|insomnio|no puedo dormir|cansad[oa]|descansar)\b/i,
    ],
    reply:
      "Algunas claves rápidas para mejorar el descanso:\n\n• Mantén un **horario regular** de sueño.\n• Evita pantallas brillantes en la hora previa a acostarte.\n• Practica una **relajación muscular progresiva** o una respiración pausada.\n\nEl programa **Mejora tu Sueño** (Programas → Sueño) te guía durante 4 sesiones con técnicas paso a paso.",
  },

  // ── Mindfulness ──
  {
    patterns: [/\b(mindfulness|meditaci[oó]n|atenci[oó]n plena|presente|consciencia)\b/i],
    reply:
      "Si quieres empezar con mindfulness, te recomiendo el programa **Mindfulness para Principiantes** (5 sesiones cortas). Te enseña qué es la atención plena, escaneo corporal, atención a la respiración y cómo integrarlo en el día a día.\n\nEntra en **Programas** y pulsa *Comenzar* en ese programa.",
  },

  // ── Idioma / qué eres ──
  {
    patterns: [/\b(qu[eé] eres|eres un bot|eres ia|qui[eé]n eres)\b/i],
    reply:
      "Soy el **asistente de MindBalance**: un acompañante virtual para ayudarte a moverte por la plataforma y resolver dudas básicas sobre bienestar. No sustituyo a un profesional — para temas clínicos siempre reserva una teleconsulta en **Sesiones**.",
  },

  // ── Privacidad / seguridad ──
  {
    patterns: [
      /\b(privacidad|datos|seguridad|cifrado|encriptaci[oó]n|gdpr|rgpd|borrar.*cuenta)\b/i,
    ],
    reply:
      "Tu privacidad es prioridad. Las teleconsultas son cifradas extremo a extremo, tus publicaciones en la comunidad pueden ser anónimas y tus datos de bienestar nunca se comparten con terceros. Puedes ver/editar tus preferencias en **Configuración**.",
  },

  // ── Agradecimiento ──
  {
    patterns: [/\b(gracias|thank|thx|ok|vale|perfecto|genial)\b/i],
    reply: "¡Un placer ayudarte! 🌿 Si necesitas algo más, sigo por aquí.",
  },

  // ── Despedida ──
  {
    patterns: [/\b(adi[oó]s|hasta luego|bye|chao|nos vemos|hasta otra)\b/i],
    reply:
      "¡Hasta pronto! Cuídate mucho. Recuerda: pequeños pasos cada día. 💚",
  },
];

// Respuesta cuando no hay match con ninguna entrada.
const FALLBACK_REPLY =
  "Hmm, no estoy seguro de haber entendido bien 🤔. Puedo ayudarte con:\n\n• **Agendar citas** con profesionales\n• Explorar **programas** terapéuticos\n• Entender tu **progreso** y puntos\n• Navegar la **biblioteca** y la **comunidad**\n• Consejos rápidos para **ansiedad** o **sueño**\n\n¿Sobre cuál te gustaría saber más?";

const DEFAULT_SUGGESTIONS = [
  "¿Cómo agendo una cita?",
  "¿Qué programas hay?",
  "Me siento con ansiedad",
  "¿Cómo funciona el progreso?",
];

export interface FallbackResult {
  reply: string;
  followUps?: string[];
  source: "fallback";
}

/**
 * Devuelve una respuesta útil sin necesidad de IA externa.
 */
export function answerFromKB(message: string): FallbackResult {
  const text = (message || "").trim();
  if (!text) {
    return {
      reply: FALLBACK_REPLY,
      followUps: DEFAULT_SUGGESTIONS,
      source: "fallback",
    };
  }

  for (const entry of KB) {
    if (entry.patterns.some((re) => re.test(text))) {
      const out: FallbackResult = { reply: entry.reply, source: "fallback" };
      if (entry.followUps) out.followUps = entry.followUps;
      return out;
    }
  }

  return {
    reply: FALLBACK_REPLY,
    followUps: DEFAULT_SUGGESTIONS,
    source: "fallback",
  };
}

export const DEFAULT_SUGGESTED_QUESTIONS = DEFAULT_SUGGESTIONS;
