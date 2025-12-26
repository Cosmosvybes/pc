import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// 1. Get Key from .env.local
let apiKey = "";
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
        console.log("✅ Found API Key.");
    } else {
        console.error("❌ Could not find VITE_GEMINI_KEY in .env.local");
        process.exit(1);
    }
} catch (e) {
    console.error("❌ Error reading .env.local:", e.message);
    process.exit(1);
}

// 2. Init AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001", // Explicit version
    generationConfig: { temperature: 0.9 }
});

// 3. The Logic (Replicating usage)
const approaches = [
    "Clinical Focus: Somatic/Sensory Regulation",
    "Clinical Focus: Radical Validation",
    "Clinical Focus: Firm Boundaries",
    "Clinical Focus: Playful/Unexpected",
    "Clinical Focus: Connection First",
    "Clinical Focus: The 'Whisper' Method",
    "Clinical Focus: 'Sportscaster' Mode",
    "Clinical Focus: Animal Style",
    "Clinical Focus: Minimalist",
    "Clinical Focus: Partner-In-Crime"
];

async function testRun(i) {
    const approach = approaches[Math.floor(Math.random() * approaches.length)];
    const twist = Math.random() > 0.5 ? "Context: You are in a public place." : "";

    console.log(`\n--- Test Run #${i} ---`);
    console.log(`🧠 Strategy: ${approach}`);
    if (twist) console.log(`🔀 Twist: ${twist}`);
    console.log("⏳ Generating...");

    const prompt = `
        You are an expert child psychologist.
        Generate a script for a parent.
        Situation: Toddler hitting.
        ${approach}
        ${twist}
        Return JSON { "say": "...", "do": "..." }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        console.log("📝 Result:", JSON.parse(clean).say);
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

// Run 3 times
(async () => {
    await testRun(1);
    await testRun(2);
    await testRun(3);
})();
