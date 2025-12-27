import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const models = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-001",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-pro"
];
async function testModels() {
    console.log("Probando modelos disponibles...");
    for (const model of models) {
        console.log(`\nProbando ${model}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: "Hola" }] }]
                })
            });
            if (response.ok) {
                console.log(`✅ ¡ÉXITO! El modelo ${model} funciona.`);
                return; // Encontramos uno que funciona
            }
            else {
                console.log(`❌ Falló ${model}: ${response.status} ${response.statusText}`);
                const data = await response.json().catch(() => ({}));
                if (data.error)
                    console.log(`   Error: ${data.error.message}`);
            }
        }
        catch (error) {
            console.log(`❌ Error de red con ${model}:`, error);
        }
    }
}
testModels();
//# sourceMappingURL=test-models.js.map