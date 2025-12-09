import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const models = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro-latest"
];
async function testModels() {
    console.log("--------------------------------------------------");
    for (const model of models) {
        console.log(`TRYING: ${model}`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Hi" }] }] })
            });
            console.log(`STATUS: ${response.status}`);
            if (response.ok) {
                console.log(`SUCCESS with ${model}`);
                break;
            }
            else {
                const txt = await response.text();
                console.log(`FAIL: ${txt.substring(0, 200)}`);
            }
        }
        catch (e) {
            console.log("ERR", e);
        }
    }
    console.log("--------------------------------------------------");
}
testModels();
//# sourceMappingURL=test-models-simple.js.map