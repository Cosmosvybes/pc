import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AgeGroup, Situation, Prescription } from '../features/crisis/prescriptions';

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_KEY;

if (!apiKey) {
    console.warn("Missing VITE_GEMINI_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || "PLACEHOLDER");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCrisisScript(age: AgeGroup, situation: Situation): Promise<Prescription> {
    if (!apiKey) {
        throw new Error("AI Service Unavailable: Missing API Key");
    }

        const approaches = [
            "Clinical Focus: Somatic/Sensory Regulation (Focus on body/calm)",
            "Clinical Focus: Radical Validation (Focus on naming the emotion)",
            "Clinical Focus: Firm Boundaries (Focus on safety and clear rules)",
            "Clinical Focus: Playful/Unexpected (Focus on breaking the tension - if appropriate)",
            "Clinical Focus: Connection First (Focus on touch and presence)"
        ];
        const randomApproach = approaches[Math.floor(Math.random() * approaches.length)];

        const prompt = `
        You are an expert child psychologist and "Psychological First Aid" responder.
        
        Generate a specific, calming, and authoritative script for a parent handling a crisis.
        
        Child Age: ${age}
        Situation: ${situation}
        ${randomApproach}
        
        CRITICAL INSTRUCTION: Avoid generic phrases like "I see you are upset". Be unique, specific, and actionable based on the Clinical Focus above.
        
        Return ONLY a raw JSON object with these 3 keys. Do not include markdown formatting or code blocks.
        
        {
          "say": "Exact words for the parent to say. Short, calm, empathetic but firm.",
          "do": "One specific physical action (e.g., 'Sit below eye level').",
          "avoid": "One common mistake to avoid in this specific moment."
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up markdown if Gemini adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(cleanText) as Prescription;
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        
        // Specific help for 404 (Model Not Found) - usually means API not enabled or region blocked
        if (error.message.includes("404") || error.message.includes("not found")) {
             throw new Error("AI Error: Model not found. Please enable 'Generative Language API' in Google AI Studio.");
        }
        
        throw new Error(`AI Error: ${error.message || "Unknown error"}`);
    }
}

export async function generateActivity(energy: 'high' | 'low', duration: 'short' | 'long'): Promise<any> {
    if (!apiKey) throw new Error("Missing API Key");

    const prompt = `
        You are an expert occupational therapist and creative play specialist for children.
        Suggest ONE unique, regulatory offline activity for a child.
        
        STRICT RULES:
        1. Safety First: No dangerous objects.
        2. Zero Screen Time: Physical or creative only.
        3. Common Items: Use only things found in a typical home (pillows, cups, paper, etc).
        4. No "Calm Down Corner": Give an ACTIVE task.
        
        Context:
        - Child Energy Level: ${energy === 'high' ? 'High/Dysregulated (Needs heavy work/proprioceptive input)' : 'Low/Bored (Needs connection/sensory input)'}
        - Time Available: ${duration === 'short' ? 'Under 15 mins (Quick Fix)' : 'Over 15 mins (Deep Play)'}
        
        Return ONLY a raw JSON object:
        {
            "id": "ai-generated-${Date.now()}",
            "title": "Fun, catchy title (max 5 words)",
            "description": "2 clear sentences for the parent. Explain the 'Why' briefly.",
            "energy": "${energy}",
            "duration": "${duration}",
            "materials": ["Item 1", "Item 2"]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Activity Error:", error);
        throw error;
    }
}
