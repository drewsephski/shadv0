import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI client with OpenRouter's base URL
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL, // Optional, for tracking on OpenRouter
    'X-Title': 'ShadV0', // Optional, shown in OpenRouter logs
  },
});

// Map of model names to their OpenRouter model IDs and display names
const MODEL_MAP = {
  // Free models
  'gpt-3.5-turbo': { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Free)' },
  'llama-3.1-8b': { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B (Free)' },
  'llama-3.1-70b': { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B (Free)' },
  'mixtral-8x7b': { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B (Free)' },
  'gemma-7b': { id: 'google/gemma-7b-it', name: 'Gemma 7B (Free)' },
  'qwen-7b': { id: 'qwen/qwen-7b-chat', name: 'Qwen 7B (Free)' },
  
  // Previously used models (kept for backward compatibility)
  'glm-4.5': { id: 'zhipu/glm-4', name: 'GLM-4.5' },
  'kimi-k2': { id: 'moonshot/moonshot-v1-128k', name: 'Kimi K2' },
} as const;

export async function POST(req: Request) {
  const { history, model } = await req.json();

  try {
    const systemPrompt = `You are an expert web developer. Create a single HTML file with Tailwind CSS based on the following prompt. The HTML should be complete and ready to be rendered. Include the Tailwind CSS script tag in the head. The response should be only the HTML code, with no extra text or explanations.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    const modelConfig = MODEL_MAP[model as keyof typeof MODEL_MAP];
    
    if (!modelConfig) {
      return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: modelConfig.id,
      messages: messages,
      temperature: 0.7,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error('Error generating website:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate website',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
}