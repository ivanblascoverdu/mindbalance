import type { Request, Response } from "express";
import dotenv from "dotenv";
import { answerFromKB, DEFAULT_SUGGESTED_QUESTIONS } from "../services/chatFallback.js";

dotenv.config();

/**
 * Endpoint público que devuelve las preguntas sugeridas iniciales para
 * la primera vez que un usuario abre el chatbot.
 */
export const chatSuggestions = (_req: Request, res: Response): void => {
  res.json({ suggestions: DEFAULT_SUGGESTED_QUESTIONS });
};

/**
 * Chat principal. Si hay GEMINI_API_KEY funcional, usa IA. Si falla por
 * cualquier motivo (no key, cuota, 5xx…) cae al matcher local para que
 * el usuario nunca se quede sin respuesta útil.
 */
export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  const { message, history } = req.body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ message: "El mensaje es requerido." });
    return;
  }

  // .trim() defensivo: archivos .env con CRLF dejan un \r al final del valor
  // y eso rompe la URL de Google. La sanitización aquí evita el dolor.
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  // Sin API key → fallback inmediato (no es un error, es una funcionalidad)
  if (!apiKey) {
    const fb = answerFromKB(message);
    res.json({ reply: fb.reply, followUps: fb.followUps, source: fb.source });
    return;
  }

  try {
    const contents = [
      ...(history || []),
      { role: "user", parts: [{ text: message }] },
    ];

    // 2.0-flash primero: es rápido y NO usa "thinking tokens" (los modelos 2.5
    // gastan tokens internos pensando y dejan respuestas cortadas si el
    // maxOutputTokens es justo). Si 2.0 falla, caemos a 2.5 con thinking
    // desactivado y como último recurso al alias "latest".
    const models = [
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];

    const isThinkingModel = (name: string) => name.includes("2.5");
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    let reply: string | null = null;
    let lastError: unknown = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const generationConfig: Record<string, unknown> = {
            maxOutputTokens: 1024,
            temperature: 0.7,
          };
          // Desactiva el "thinking" en los modelos 2.5 para no malgastar tokens
          // del presupuesto en razonamiento interno (chatbot conversacional).
          if (isThinkingModel(model)) {
            generationConfig.thinkingConfig = { thinkingBudget: 0 };
          }

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig,
              systemInstruction: {
                parts: [
                  {
                    text:
                      "Eres el asistente virtual de MindBalance, una plataforma de bienestar mental con programas (mindfulness, ansiedad, sueño, autoestima), biblioteca, comunidad, teleconsultas y registro de progreso. " +
                      "Responde en español, cálido y conciso (máx. 5-6 líneas). Usa Markdown ligero: **negrita** para destacar, y listas con viñetas cuando proceda. " +
                      "Si el usuario describe síntomas serios, recomiéndale reservar una teleconsulta en la sección Sesiones. " +
                      "No sustituyas a un profesional clínico.",
                  },
                ],
              },
            }),
          });

          if (!response.ok) {
            if (response.status === 429) {
              await wait(3500);
              lastError = new Error("rate_limited");
              continue;
            }
            if (response.status === 404) {
              lastError = new Error(`model_not_found_${model}`);
              break;
            }
            const errorData = (await response.json().catch(() => ({}))) as any;
            lastError = new Error(errorData.error?.message || `gemini_${response.status}`);
            break;
          }

          const data = (await response.json()) as any;
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (reply) {
            res.json({ reply, source: "ai" });
            return;
          }
        } catch (err) {
          lastError = err;
        }
      }
    }

    // Gemini agotó intentos → caemos al fallback con la KB.
    // Logueamos el motivo pero respondemos algo útil al usuario.
    // eslint-disable-next-line no-console
    console.warn(
      "[chat] Gemini falló, usando fallback:",
      lastError instanceof Error ? lastError.message : String(lastError)
    );
    const fb = answerFromKB(message);
    res.json({
      reply: fb.reply,
      followUps: fb.followUps,
      source: fb.source,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("[chat] Error inesperado:", error?.message || error);
    // Incluso ante un error inesperado, devolvemos algo útil.
    const fb = answerFromKB(message);
    res.status(200).json({
      reply: fb.reply,
      followUps: fb.followUps,
      source: fb.source,
    });
  }
};
