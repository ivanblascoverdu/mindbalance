import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key:", apiKey);
    if (!apiKey) {
        console.error("Falta la API Key");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    try {
        console.log("Intentando conectar con Gemini...");
        const result = await model.generateContent("Hola, ¿funcionas?");
        console.log("Respuesta:", result.response.text());
    }
    catch (e) {
        console.error("Error detallado:", e);
    }
}
test();
//# sourceMappingURL=test-gemini.js.map