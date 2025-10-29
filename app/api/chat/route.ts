import {GoogleGenAI} from "@google/genai";
import {NextResponse} from "next/server";

const ai = new GoogleGenAI({})

export async function POST(req: Request) {
  const { prompt } = await req.json();
  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: `Prompt: ${prompt}. 
      Answer in the language as in the prompt. 
      The prompt should be about planning a trip, if not return a sentence says that you can only generates answer related to travel. 
      Return only 3 to 5 points showing the most important things in the format of bullet points, also including the markdown of the bullet points so that the answer can be rendered in markdown. At the end, wish a good trip.`,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error(error);
    return new Response('Error generating content', { status: 500 });
  }
}