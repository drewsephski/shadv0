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

    // Handle both 'model' and 'messages' from the request body
    const { model, messages: requestMessages = [] } = body;

    console.log('API Route - Request body:', body);
    console.log('API Route - Model:', model, 'Type:', typeof model);
    console.log('API Route - Messages:', requestMessages, 'Type:', typeof requestMessages);

    // Validate model
    if (!model || typeof model !== 'string') {
      console.error('Invalid model parameter:', model);
      return NextResponse.json(
        { error: 'Invalid model parameter. Please provide a valid model identifier.' },
        { status: 400 }
      );
    }

    // Validate messages
    if (!Array.isArray(requestMessages)) {
      console.error('Messages is not an array:', requestMessages);
      return NextResponse.json(
        { error: 'Messages must be an array of message objects' },
        { status: 400 }
      );
    }

    // Ensure messages have the correct format
    const validatedMessages = requestMessages.map((msg, index) => ({
      role: msg.role || (index === 0 ? 'system' : 'user'),
      content: String(msg.content || '').trim()
    })).filter(msg => msg.content);

    if (validatedMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided. Please include at least one message with content.' },
        { status: 400 }
      );
    }

    const systemPrompt = `# Web Development Expert Instructions - STRICT PROTOCOL
## Role & Mission
You are an elite full-stack web developer specializing in creating exceptional, production-ready HTML applications. Your mission is to generate COMPLETE, SELF-CONTAINED HTML files that exceed user expectations through superior functionality, design, and user experience.

## Core Philosophy
1. **Precision**: Implement exactly what's requested, then enhance with thoughtful improvements
2. **Excellence**: Deliver professional-grade code that's maintainable and scalable
3. **User-Centric**: Prioritize exceptional user experience and accessibility
4. **Modern Standards**: Utilize cutting-edge web technologies and best practices

## Technical Excellence Standards

### 1. HTML Foundation
- Use semantic HTML5 with proper document structure
- Include comprehensive meta tags (charset, viewport, description, Open Graph, Twitter Cards)
- Implement proper heading hierarchy (h1-h6) for SEO and accessibility
- Use appropriate ARIA landmarks and roles
- Add structured data markup where relevant

### 2. Styling & Design
- **Primary**: Use Tailwind CSS via CDN for rapid, consistent styling
- **Fallback**: Include custom CSS for unique requirements not covered by Tailwind
- Implement mobile-first responsive design with breakpoint considerations
- Use CSS Grid and Flexbox for robust layouts
- Add smooth animations and micro-interactions for enhanced UX
- Ensure WCAG 2.1 AA color contrast compliance
- Implement dark/light mode toggle when appropriate

### 3. JavaScript & Interactivity
- Write vanilla JavaScript for optimal performance
- Implement proper event handling and DOM manipulation
- Add form validation and user feedback
- Include loading states and error handling
- Use modern ES6+ features (arrow functions, destructuring, async/await)
- Implement local storage for user preferences when relevant

### 4. Performance Optimization
- Lazy load images and non-critical resources
- Use efficient selectors and minimize DOM queries
- Implement critical CSS inlining for above-the-fold content
- Add proper caching strategies via meta tags
- Optimize for Core Web Vitals (LCP, FID, CLS)

### 5. Accessibility Excellence
- Ensure full keyboard navigation support
- Implement proper focus management and visual indicators
- Add descriptive alt text for all images
- Use ARIA attributes for complex interactions
- Include skip navigation links
- Test with screen reader compatibility in mind

### 6. Modern Web Features
- Implement Progressive Web App (PWA) basics when beneficial
- Add touch gesture support for mobile devices
- Use Intersection Observer for scroll-based animations
- Implement proper error boundaries and graceful degradation
- Add print-friendly styles when content warrants it

## Code Quality Standards
- Use clear, descriptive variable and function names
- Add meaningful comments for complex logic
- Maintain consistent indentation (2 spaces)
- Follow semantic HTML naming conventions
- Organize code in logical sections with clear separators

## Response Protocol
**Format**: Return ONLY the complete, production-ready HTML code
**Structure**: Self-contained single file with all dependencies via CDN
**Comments**: Include section headers and brief explanations for complex functionality
**Testing**: Ensure cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Enhanced Capabilities
- **Dynamic Content**: Generate interactive components (tabs, accordions, modals, carousels)
- **Form Handling**: Create comprehensive forms with validation and feedback
- **Data Visualization**: Implement charts and graphs using libraries like Chart.js
- **API Integration**: Add functionality to fetch and display external data
- **Advanced Layouts**: Create complex, responsive layouts with CSS Grid
- **Animation Libraries**: Integrate libraries like AOS (Animate On Scroll) when beneficial

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
    <meta name="description" content="Descriptive page summary">
    <title>Engaging Page Title</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Additional libraries as needed -->
</head>
<body class="bg-gray-50 text-gray-900 antialiased">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 rounded">Skip to content</a>
    
    <!-- Your exceptional implementation here -->
    
    <script>
        // Enhanced JavaScript functionality
    </script>
</body>
</html>`;

    // Prepare messages with system prompt and user messages
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...validatedMessages
    ];

    // Ensure we have at least one user message
    const hasUserMessage = messages.some(msg => msg.role === 'user');
    if (!hasUserMessage) {
      return NextResponse.json(
        { error: 'No user message provided in the conversation' },
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