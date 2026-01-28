
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { VeoSegment } from "./types";

const SYSTEM_PROMPT = `You are a world-class AI Cinematographer & Pipeline Director. 
Your goal is to generate continuous, long-form video scripts without visual cuts for the Veo 3.1 model.

CONSTRAINTS:
1. NO CUTS: Every segment must flow from the previous one. Use "Single-take," "Continuous tracking," and "Uninterrupted camera movement."
2. CONTINUITY: For every 10-second segment, you must describe the exact final position of characters and objects.
3. SCENE EXTENSION LOGIC: You will output "Reference Frame Descriptions" for the next segment to ensure the Veo "Scene Extension" feature works perfectly.
4. DETAIL: Use cinematic lighting (Volumetric, HDR), camera lens specs (35mm, Anamorphic), and specific motion (Slow Pan, Orbit, Crane shot).

OUTPUT: Provide exactly the number of segments requested in a strict JSON array format.`;

export async function generateVeoScript(prompt: string, numSegments: number = 6): Promise<VeoSegment[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a continuous ${numSegments * 10}-second single-take script for the following concept: "${prompt}". Provide ${numSegments} segments.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            segment_id: { type: Type.INTEGER },
            visual_prompt: { type: Type.STRING, description: "High-detail description for Veo including lens and lighting." },
            continuity_anchor: { type: Type.STRING, description: "Description of the final 1 second for frame continuity." },
            audio_instruction: { type: Type.STRING, description: "Description of the continuous soundtrack/ambient noise." }
          },
          required: ["segment_id", "visual_prompt", "continuity_anchor", "audio_instruction"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as VeoSegment[];
  } catch (err) {
    console.error("Failed to parse script JSON", err);
    throw new Error("The AI director failed to output a valid script format.");
  }
}

export async function generateVeoVideo(prompt: string, aspectRatio: "16:9" | "9:16" = "16:9", resolution: "720p" | "1080p" = "720p") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
}
