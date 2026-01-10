import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

// Using Nano Banana model as requested (gemini-2.5-flash-image)
const MODEL_NAME = 'gemini-2.5-flash-image';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateMockupImage = async (
  inputs: UploadedImage[],
  scenarioPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Sort inputs to ensure order (though model is generally smart enough)
  // We pass all three reference images
  const imageParts = inputs.map(input => ({
    inlineData: {
      mimeType: input.mimeType,
      data: input.data
    }
  }));

  // Construct the full prompt
  const fullPrompt = `
    You are an expert 3D packaging designer and renderer.
    I have provided three flat design images for a product package: 
    1. The Front Face
    2. The Side Face
    3. The Top Face.
    
    Your task is to:
    ${scenarioPrompt}
    
    Ensure the perspective matches the scene. Apply the provided designs accurately to the 3D box shape. 
    The generated image must be highly realistic.
  `;

  const maxRetries = 3;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            ...imageParts,
            { text: fullPrompt }
          ]
        }
      });

      // Extract the image from the response
      // Nano banana usually returns the image in the parts list
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${part.inlineData.data}`;
          }
        }
      }

      throw new Error("No image data found in response");

    } catch (error: any) {
      console.warn(`Attempt ${attempt + 1} failed:`, error.message);
      
      // Check if error is 429 (Resource Exhausted) or similar
      const isRateLimit = error.message?.includes('429') || error.status === 429 || error.code === 429;
      
      // If it is a rate limit error and we haven't exhausted retries, wait and retry.
      if (isRateLimit && attempt < maxRetries) {
        // Aggressive Exponential backoff: 5s, 10s, 20s
        // This gives the quota bucket time to refill
        const delayMs = 5000 * Math.pow(2, attempt);
        console.log(`Rate limit hit (429). Retrying in ${delayMs/1000}s...`);
        await wait(delayMs);
        continue;
      }
      
      // If it's not a rate limit error, or we ran out of retries, throw the error immediately
      throw error;
    }
  }

  throw new Error("Failed to generate image after max retries.");
};