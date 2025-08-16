import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with OpenRouter's base URL
const openaiApiKey = process.env.OPENROUTER_API_KEY;
const openRouterBaseUrl = 'https://openrouter.ai/api/v1';

if (!openaiApiKey) {
  console.error('OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  baseURL: openRouterBaseUrl,
  apiKey: openaiApiKey || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'ShadV0',
    'Content-Type': 'application/json',
  },
});

// Import model constants
import { MODELS } from '@/constants/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { history, model } = body;

    console.log('API Route - Received body:', body);
    console.log('API Route - History:', history, 'Type:', typeof history);
    console.log('API Route - Model:', model, 'Type:', typeof model);

    // Validate input
    if (!model || typeof model !== 'string') {
      console.error('Invalid model parameter:', model);
      return NextResponse.json({ error: 'Invalid model parameter' }, { status: 400 });
    }

    // Fix: The parameter name is 'messages' not 'history' in the request body
    const apiMessages = body.messages || [];
    console.log('API Route - Messages:', apiMessages, 'Type:', typeof apiMessages);
    console.log('API Route - Is messages array:', Array.isArray(apiMessages));

    if (!Array.isArray(apiMessages)) {
      console.error('Messages is not an array:', apiMessages, 'Type:', typeof apiMessages);
      return NextResponse.json({ error: 'History must be an array' }, { status: 400 });
    }

    const systemPrompt = `# Web Development Expert Instructions - STRICT PROTOCOL

## Role & Context
You are an expert web developer with a focus on precision and attention to detail. Your ONLY task is to generate a SINGLE, COMPLETE HTML file that implements EXACTLY what the user requests, nothing more and nothing less.

## Core Principles
1. **Instruction Adherence**: Follow the user's requirements EXACTLY as specified
2. **Completeness**: Ensure the HTML file is fully functional and self-contained
3. **Quality**: Maintain high standards for code quality, accessibility, and performance

## Technical Requirements
1. **HTML Structure**:
   - Use semantic HTML5 elements (header, nav, main, section, article, footer, etc.)
   - Include proper DOCTYPE and language attribute
   - Add necessary meta tags (charset, viewport, description)

2. **Styling**:
   - Use Tailwind CSS via CDN for all styling
   - Ensure full responsiveness across all device sizes
   - Implement proper spacing, typography, and color contrast
   - Add smooth transitions and hover effects where appropriate

3. **Accessibility**:
   - Include appropriate ARIA attributes
   - Ensure keyboard navigability
   - Add proper alt text for images
   - Maintain sufficient color contrast
   - Use semantic heading hierarchy

4. **Performance**:
   - Optimize assets and structure for fast loading
   - Use efficient CSS selectors
   - Minimize unnecessary DOM elements

## Response Format
- Return ONLY the complete HTML code
- Do not include markdown code blocks or additional text
- Include all necessary Tailwind CSS classes
- Add comments for major sections (<!-- Section: Header -->)
- Ensure proper indentation for readability

## Important Notes
- If any requirement is unclear, ask for clarification
- Do not add features not requested by the user
- Prioritize functionality over aesthetics when in doubt
- Ensure all interactive elements work as expected
- Follow modern web standards and best practices

## Example Format
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Your implementation here -->
</body>
</html>`;

    // Ensure messages are properly formatted and within token limits
    const messages = [
      { role: 'system', content: systemPrompt },
      // Only include the last 3-4 most recent messages to maintain context
      // while staying within token limits
      ...apiMessages.slice(-4).map(msg => ({
        ...msg,
        // Ensure content is a string and trim any whitespace
        content: String(msg.content || '').trim()
      }))
    ];

    // Validate message content
    const lastUserMessage = messages.findLast(msg => msg.role === 'user');
    if (!lastUserMessage?.content?.trim()) {
      return NextResponse.json(
        { error: 'No valid user message provided' },
        { status: 400 }
      );
    }

    const modelInfo = MODELS[model as keyof typeof MODELS];
    
    if (!modelInfo) {
      return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
    }

    // Validate API key and configuration before making request
    if (!openaiApiKey) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return NextResponse.json({
        error: 'Server configuration error: OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment variables.'
      }, { status: 500 });
    }

    // Verify the model is supported
    if (!MODELS[model as keyof typeof MODELS]) {
      console.error(`Requested model not found: ${model}`);
      return NextResponse.json({
        error: `Model '${model}' is not supported.`
      }, { status: 400 });
    }

    console.log('API Route - API key validation passed');
    console.log('API Route - Model info:', modelInfo);
    console.log('API Route - Final messages array:', messages);

    // Create a streaming response using the OpenAI client
    console.log('API Route - Making OpenAI API call with:', {
      model: modelInfo.id,
      messagesCount: messages.length,
      temperature: 0.7,
      stream: true
    });

    let response;
    try {
      console.log('Sending request to OpenRouter API...', {
        model: modelInfo.id,
        messagesCount: messages.length,
        temperature: 0.7
      });

      // Optimized parameters for code generation
      response = await openai.chat.completions.create({
        model: modelInfo.id,
        messages,
        temperature: 0.3,        // Very low for maximum consistency
        max_tokens: 4096,        // Maximum allowed by most models
        top_p: 0.9,             // Focus on high probability tokens
        frequency_penalty: 0.2,  // Reduce repetition
        presence_penalty: 0.2,   // Stay on topic
        stop: ['<|im_end|>', '```'],  // Prevent incomplete code blocks
        stream: true,
      });
      
      console.log('Received streaming response from OpenRouter API');
    } catch (error) {
      console.error('OpenRouter API request failed:', error);
      
      let errorMessage = 'Failed to connect to OpenRouter API';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY environment variable.';
          statusCode = 401;
        } else if (error.message.includes('404')) {
          errorMessage = 'The requested model was not found. The model ID might be incorrect or the model might not be available.';
          statusCode = 404;
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please try again later or check your OpenRouter account limits.';
          statusCode = 429;
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Could not connect to OpenRouter API. Please check your internet connection.';
          statusCode = 503;
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return NextResponse.json({
        error: errorMessage,
        details: error instanceof Error ? error.message : undefined
      }, { status: statusCode });
    }

    // Create a transform stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
    
  } catch (error) {
    console.error('Error generating website:', error);
    
    // Handle specific error types with appropriate messages
    let errorMessage = 'Failed to generate website';
    let errorDetails: string | null = null;
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Handle specific error cases
      if (error.message.includes('API key')) {
        errorMessage = 'Server configuration error: API key not configured';
      } else if (error.message.includes('Invalid model')) {
        errorMessage = 'Invalid model selected';
      } else if (error.message.includes('stream')) {
        errorMessage = 'Streaming error occurred';
      }
    }
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails
      }),
      { status: 500 }
    );
  }
}