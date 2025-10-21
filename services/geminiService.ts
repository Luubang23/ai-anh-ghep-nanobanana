
import { GoogleGenAI, Modality } from '@google/genai';
import { ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
});

const PROMPT = `You are an expert photo editor. Take the first image of a person and the second image of a product. Create a new, single, photorealistic image where the person is naturally interacting with the product. The final output must be seamless, with realistic lighting, shadows, perspective, and scale. The background should be cohesive and believable. Only output the final image.`;

export async function generateImage(person: ImageData, product: ImageData): Promise<string> {
  const personImagePart = {
    inlineData: {
      data: person.base64,
      mimeType: person.mimeType,
    },
  };

  const productImagePart = {
    inlineData: {
      data: product.base64,
      mimeType: product.mimeType,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [personImagePart, productImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image data found in the API response.');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate image from the API.');
  }
}
