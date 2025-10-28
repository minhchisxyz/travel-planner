'use server'

import {GenerateContentResponse, GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({})

export type State = {
  result: string | null
  error?: string
}


export async function find(prevState: State, formData: FormData) {
  try {
    const input = String(formData.get('input') ?? '')
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${input}. Return only 3 to 5 points showing the most important things.`,
    })
    return {result: response}

  } catch (e: any) {
    return { result: null, error: e?.message ?? 'Unknown error' }
  }
}