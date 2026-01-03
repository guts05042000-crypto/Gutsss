
import { GoogleGenAI, Type } from "@google/genai";
import { LoveNote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRomanticMessage(coupleName: string): Promise<LoveNote> {
  try {
    const namePart = coupleName ? `The couple name is ${coupleName}.` : "The message is for my soulmate.";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, heart-touching anniversary message for a partner. 
                 ${namePart} 
                 The tone should be deeply romantic, poetic, and sincere.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: { type: Type.STRING, description: "A poetic title for the note" },
            message: { type: Type.STRING, description: "The main romantic message (2-3 sentences)" },
            signature: { type: Type.STRING, description: "A sweet closing" }
          },
          required: ["header", "message", "signature"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as LoveNote;
  } catch (error) {
    console.error("Error generating love note:", error);
    return {
      header: "To My Soulmate",
      message: "Every day with you is a gift that I treasure more than words can say. Thank you for choosing me and for filling my life with so much light and love.",
      signature: "Forever Yours"
    };
  }
}
