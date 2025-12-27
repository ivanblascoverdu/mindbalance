import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY no encontrada.");
      res.status(503).json({ 
        message: "El servicio de IA no está configurado (Falta API Key)." 
      });
      return;
    }

    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ message: "El mensaje es requerido." });
      return;
    }

    // Construir el cuerpo de la petición para la API REST de Gemini
    const contents = [
      ...(history || []),
      { role: "user", parts: [{ text: message }] }
    ];

    // Modelos disponibles para tu cuenta (basado en tus logs)
    const models = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-exp",
      "gemini-2.5-flash"
    ];

    let lastError = null;
    let reply = null;

    // Función auxiliar para esperar
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const model of models) {
      // Intentamos hasta 2 veces por modelo si hay error de cuota (429)
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`🔄 Intentando con modelo: ${model} (Intento ${attempt + 1})...`);
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: contents,
              generationConfig: { maxOutputTokens: 500 },
              systemInstruction: {
                parts: [{ text: "Eres un asistente virtual amigable para la aplicación MindBalance. Ayuda a los usuarios con bienestar mental y navegación de la app. Sé conciso y empático." }]
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json() as any;
            
            // Si es error de cuota (429), esperamos y reintentamos
            if (response.status === 429) {
              console.warn(`⏳ Cuota excedida en ${model}. Esperando 5 segundos...`);
              await wait(5000); // Esperar 5 segundos
              lastError = new Error("Cuota excedida, reintentando...");
              continue; // Reintentar el mismo modelo
            }
            
            // Si no existe (404), pasamos al siguiente modelo
            if (response.status === 404) {
              console.warn(`⚠️ Modelo ${model} no encontrado (404).`);
              lastError = new Error(`Modelo ${model} no encontrado.`);
              break; // Romper el bucle de intentos para pasar al siguiente modelo
            }

            throw new Error(errorData.error?.message || `Error ${response.status}`);
          }

          const data = await response.json() as any;
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (reply) {
            console.log(`✅ Éxito con modelo: ${model}`);
            res.json({ reply });
            return; // Terminamos exitosamente
          }

        } catch (error) {
          console.error(`❌ Error intentando ${model}:`, error);
          lastError = error;
        }
      }
    }

    if (!reply) {
      throw lastError || new Error("El servicio de IA está saturado momentáneamente. Por favor intenta en unos segundos.");
    }

  } catch (error: any) {
    console.error("Error en el chat de IA:", error);
    res.status(500).json({ message: error.message || "Error al comunicarse con la IA." });
  }
};
