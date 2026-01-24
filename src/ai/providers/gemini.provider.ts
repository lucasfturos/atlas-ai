import axios from 'axios';
import { GeminiResponse } from './gemini.types';

export async function generateGeminiResponse(
  model: string,
  messages: { content: string }[],
): Promise<string> {
  const prompt = messages.map((m) => m.content).join('\n');

  const response = await axios.post<GeminiResponse>(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      params: {
        key: process.env.GEMINI_API_KEY,
      },
    },
  );

  return response.data.candidates[0].content.parts[0].text;
}
