import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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

// Type definitions for refinement functionality
type RefinementType = 'style' | 'functionality' | 'accessibility' | 'performance';

interface RefinementRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  existingHtml?: string;
  refinementType?: RefinementType;
  designConfig?: DesignConfig; // Design system configuration
}

// Type for design configuration
interface DesignConfig {
  mode?: string;
  colors?: Record<string, string>;
  typography?: Record<string, unknown>;
  components?: Record<string, string>;
  spacing?: Record<string, unknown>;
}

// Generate design system instructions from configuration
function generateDesignSystemPrompt(designConfig: DesignConfig): string {
  if (!designConfig) return '';

  const {
    mode = 'light',
    colors = {},
    typography = {},
    components = {},
    spacing = {}
  } = designConfig;

  const designPrompt = `
## Design System Configuration
Please adhere to the following design specifications:

### Color Palette
- Mode: ${mode}
- Primary: ${colors.primary || '#3B82F6'}
- Secondary: ${colors.secondary || '#1E40AF'}
- Accent: ${colors.accent || '#06B6D4'}
- Background: ${colors.background || '#FFFFFF'}
- Surface: ${colors.surface || '#F8FAFC'}
- Text: ${colors.text || '#1E293B'}
- Text Secondary: ${colors.textSecondary || '#64748B'}
- Border: ${colors.border || '#E2E8F0'}
- Error: ${colors.error || '#EF4444'}
- Success: ${colors.success || '#10B981'}
- Warning: ${colors.warning || '#F59E0B'}

### Typography
- Font Family: ${typography.fontFamily || 'inter'}
- Font Sizes: ${Object.entries(typography.fontSize || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Font Weights: ${Object.entries(typography.fontWeight || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Line Heights: ${Object.entries(typography.lineHeight || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}

### Component Styles
- Button Style: ${components.button || 'rounded'}
- Card Style: ${components.card || 'elevated'}
- Input Style: ${components.input || 'default'}
- Modal Style: ${components.modal || 'default'}

### Spacing
- Border Radius: ${Object.entries(spacing.borderRadius || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Spacing Scale: ${Object.entries(spacing.spacing || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}

### Implementation Requirements
1. Use the specified colors for all UI elements
2. Apply the typography settings consistently across all text elements
3. Implement the specified component variants and styles
4. Follow the spacing and border radius specifications
5. Ensure the design works in both light and dark modes if specified
6. Use modern CSS techniques and best practices
7. Make the design responsive and mobile-friendly
8. Ensure proper contrast ratios for accessibility`;

  return designPrompt;
}

// HTML content optimization for token limits
function optimizeHtmlContent(htmlContent: string, maxLength: number = 8000): string {
  if (htmlContent.length <= maxLength) {
    return htmlContent;
  }

  // Extract essential parts: head, body structure, and scripts
  const headMatch = htmlContent.match(/<head[\s\S]*?<\/head>/i);
  const bodyMatch = htmlContent.match(/<body[\s\S]*?<\/body>/i);
  const scriptsMatch = htmlContent.match(/<script[\s\S]*?<\/script>/gi);

  let optimized = '';

  // Always include head section
  if (headMatch) {
    optimized += headMatch[0] + '\n';
  }

  // Include body with smart truncation
  if (bodyMatch) {
    let bodyContent = bodyMatch[0];

    // If body is too long, prioritize semantic structure
    if (bodyContent.length > maxLength * 0.6) {
      // Keep header, main content, and footer sections
      const headerMatch = bodyContent.match(/<header[\s\S]*?<\/header>/i);
      const mainMatch = bodyContent.match(/<main[\s\S]*?<\/main>/i);
      const footerMatch = bodyContent.match(/<footer[\s\S]*?<\/footer>/i);

      bodyContent = '<body>';

      if (headerMatch) bodyContent += headerMatch[0];
      if (mainMatch) bodyContent += mainMatch[0];
      if (footerMatch) bodyContent += footerMatch[0];

      bodyContent += '\n<!-- Content truncated for optimization -->\n</body>';
    }

    optimized += bodyContent;
  }

  // Include essential scripts
  if (scriptsMatch) {
    const essentialScripts = scriptsMatch.filter(script =>
      script.includes('tailwindcss') ||
      script.includes('interactive') ||
      script.includes('functionality')
    );
    optimized += '\n' + essentialScripts.slice(0, 2).join('\n');
  }

  return optimized;
}

// Specialized refinement prompts
function createRefinementSystemPrompt(refinementType: RefinementType, existingHtml: string): string {
  const basePrompt = `# HTML Refinement Expert Instructions - STRICT PROTOCOL
## Role & Mission
You are an elite HTML refinement specialist. Your mission is to intelligently improve existing HTML code while preserving its core functionality and structure. Focus on the specific refinement type requested while maintaining backward compatibility.

## Core Philosophy
1. **Precision**: Make targeted improvements without disrupting existing functionality
2. **Preservation**: Keep all working features, data, and user interactions intact
3. **Enhancement**: Add value through thoughtful, focused improvements
4. **Compatibility**: Ensure the refined HTML works across all modern browsers

## Response Protocol
**Format**: Return ONLY the complete, refined HTML code
**Structure**: Maintain the original structure while incorporating improvements
**Comments**: Add comments explaining significant changes made
**Testing**: Ensure all existing functionality remains intact`;

  switch (refinementType) {
    case 'style':
      return `${basePrompt}

## Style Refinement Focus
- **Modern Design**: Apply contemporary design principles and trends
- **Visual Enhancement**: Improve color schemes, typography, spacing, and visual hierarchy
- **Responsive Design**: Enhance mobile and tablet responsiveness
- **Micro-interactions**: Add subtle animations and hover effects
- **Brand Consistency**: Ensure visual coherence across the interface
- **Performance**: Optimize CSS delivery and rendering

## Key Style Improvements
1. **Typography**: Implement modern font stacks and improve readability
2. **Color Palette**: Enhance color contrast and accessibility compliance
3. **Layout**: Optimize spacing, alignment, and visual balance
4. **Components**: Upgrade button styles, form elements, and interactive components
5. **Dark Mode**: Add or improve dark/light mode functionality
6. **Visual Polish**: Add subtle shadows, borders, and modern styling techniques

## Technical Excellence Standards
- Use modern CSS features (CSS Grid, Flexbox, Custom Properties)
- Implement mobile-first responsive design
- Ensure WCAG 2.1 AA color contrast compliance
- Optimize for Core Web Vitals (LCP, FID, CLS)
- Add smooth transitions and micro-interactions`;

    case 'functionality':
      return `${basePrompt}

## Functionality Refinement Focus
- **Interactive Enhancement**: Improve user interactions and feedback
- **JavaScript Optimization**: Enhance existing JavaScript with modern patterns
- **User Experience**: Add intuitive features and improve usability
- **Error Handling**: Implement robust error handling and user feedback
- **Performance**: Optimize JavaScript execution and DOM manipulation
- **Accessibility**: Ensure all interactive elements are accessible

## Key Functionality Improvements
1. **Form Enhancement**: Add validation, better UX, and feedback mechanisms
2. **Navigation**: Improve menu systems and navigation patterns
3. **Interactive Components**: Enhance tabs, accordions, modals, and carousels
4. **Data Handling**: Improve data fetching, caching, and state management
5. **User Feedback**: Add loading states, progress indicators, and success messages
6. **Error Recovery**: Implement graceful error handling and recovery mechanisms

## Technical Excellence Standards
- Use modern JavaScript (ES6+, async/await, destructuring)
- Implement proper event delegation and DOM manipulation
- Add comprehensive form validation and user feedback
- Optimize for performance with efficient selectors and minimal DOM queries
- Ensure keyboard navigation and screen reader compatibility`;

    case 'accessibility':
      return `${basePrompt}

## Accessibility Refinement Focus
- **WCAG 2.1 AA Compliance**: Ensure full accessibility compliance
- **Keyboard Navigation**: Implement complete keyboard accessibility
- **Screen Reader Support**: Optimize for screen reader compatibility
- **Focus Management**: Add proper focus indicators and management
- **Semantic HTML**: Enhance semantic structure and ARIA usage
- **Color Contrast**: Ensure proper color contrast ratios

## Key Accessibility Improvements
1. **ARIA Enhancement**: Add comprehensive ARIA labels and descriptions
2. **Focus Management**: Implement proper focus flow and visual indicators
3. **Semantic Structure**: Improve heading hierarchy and landmark usage
4. **Alternative Text**: Ensure all images have descriptive alt text
5. **Keyboard Support**: Add keyboard shortcuts and navigation
6. **Color Blind Support**: Implement color-blind friendly design patterns
7. **Motion Sensitivity**: Add options to reduce or eliminate animations

## Technical Excellence Standards
- Implement proper ARIA landmarks and roles
- Ensure full keyboard navigation support
- Add skip navigation links and proper heading hierarchy
- Implement focus management for complex interactions
- Test with multiple screen readers (NVDA, JAWS, VoiceOver)
- Ensure color contrast meets WCAG 2.1 AA standards`;

    case 'performance':
      return `${basePrompt}

## Performance Refinement Focus
- **Loading Optimization**: Improve initial load times and perceived performance
- **Runtime Efficiency**: Optimize JavaScript execution and DOM manipulation
- **Resource Management**: Implement efficient resource loading strategies
- **Caching Strategy**: Add proper caching headers and local storage usage
- **Bundle Optimization**: Minimize and optimize asset delivery
- **Core Web Vitals**: Optimize for LCP, FID, and CLS metrics

## Key Performance Improvements
1. **Critical CSS**: Inline critical CSS for above-the-fold content
2. **Lazy Loading**: Implement lazy loading for images and non-critical resources
3. **Code Splitting**: Optimize JavaScript bundle size and loading
4. **Caching**: Implement proper caching strategies for static assets
5. **DOM Optimization**: Reduce DOM queries and optimize rendering
6. **Network Optimization**: Implement efficient API calls and data fetching
7. **Memory Management**: Optimize memory usage and prevent leaks

## Technical Excellence Standards
- Optimize for Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Implement efficient selectors and minimize DOM manipulation
- Add proper loading states and skeleton screens
- Use modern web APIs (Intersection Observer, Web Workers when beneficial)
- Implement proper error boundaries and graceful degradation`;

    default:
      return basePrompt;
  }
}

export async function POST(req: Request) {
  try {
    const body: RefinementRequest = await req.json();
    console.log('Received request body:', body);

    // Handle both 'model' and 'messages' from the request body with refinement support
    const {
      model,
      messages: requestMessages = [],
      existingHtml,
      refinementType,
      designConfig
    } = body;

    console.log('API Route - Request body:', body);
    console.log('API Route - Model:', model, 'Type:', typeof model);
    console.log('API Route - Messages:', requestMessages, 'Type:', typeof requestMessages);
    console.log('API Route - Existing HTML:', existingHtml ? `${existingHtml.length} chars` : 'none');
    console.log('API Route - Refinement Type:', refinementType);
    console.log('API Route - Design Config:', designConfig ? 'present' : 'none');

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

    // Validate refinement parameters if provided
    if (existingHtml !== undefined) {
      if (typeof existingHtml !== 'string') {
        return NextResponse.json(
          { error: 'existingHtml must be a string' },
          { status: 400 }
        );
      }

      if (refinementType && !['style', 'functionality', 'accessibility', 'performance'].includes(refinementType)) {
        return NextResponse.json(
          { error: 'refinementType must be one of: style, functionality, accessibility, performance' },
          { status: 400 }
        );
      }
    }

    // Ensure messages have the correct format
    const validatedMessages = requestMessages.map((msg, index) => ({
      role: (msg.role || (index === 0 ? 'system' : 'user')) as 'system' | 'user' | 'assistant',
      content: String(msg.content || '').trim()
    })).filter(msg => msg.content);

    if (validatedMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided. Please include at least one message with content.' },
        { status: 400 }
      );
    }

    // Determine if this is a refinement request or new generation
    const isRefinement = existingHtml && refinementType;

    // Create appropriate system prompt
    let systemPrompt: string;

    if (isRefinement) {
      // Optimize HTML content for token limits
      const optimizedHtml = optimizeHtmlContent(existingHtml);

      systemPrompt = createRefinementSystemPrompt(refinementType, optimizedHtml);

      // Add existing HTML context to the system prompt
      systemPrompt += `

## Existing HTML Context
Here is the current HTML code that needs to be refined:

\`\`\`html
${optimizedHtml}
\`\`\`

## Refinement Instructions
- Analyze the existing code structure and functionality
- Apply improvements specific to the ${refinementType} refinement type
- Preserve all existing working features and user interactions
- Maintain the overall structure and purpose of the original code
- Only modify elements that benefit from ${refinementType} improvements
- Ensure the refined code is production-ready and follows best practices`;

      console.log(`API Route - Refinement request detected: ${refinementType}`);
      console.log(`API Route - Original HTML length: ${existingHtml.length} chars`);
      console.log(`API Route - Optimized HTML length: ${optimizedHtml.length} chars`);
    } else {
      // Generate design system instructions if config is provided
      const designSystemPrompt = designConfig ? generateDesignSystemPrompt(designConfig) : '';

      // Use original generation prompt for backward compatibility with design system integration
      systemPrompt = `# Web Development Expert Instructions - STRICT PROTOCOL
## Role & Mission
You are an elite full-stack web developer specializing in creating exceptional, production-ready HTML applications. Your mission is to generate COMPLETE, SELF-CONTAINED HTML files that exceed user expectations through superior functionality, design, and user experience.

${designSystemPrompt}

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

      console.log('API Route - Standard generation request detected');
    }

    // Prepare messages with system prompt and user messages
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
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

    // For refinement requests, enhance the user message with context
    if (isRefinement) {
      const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage) {
        lastUserMessage.content += `

**Refinement Context:**
- **Type**: ${refinementType}
- **Existing HTML**: Provided (${existingHtml.length} characters)
- **Goal**: Improve the existing HTML code focusing on ${refinementType} aspects while preserving functionality

Please refine the existing HTML code according to the ${refinementType} requirements while maintaining all existing functionality.`;
      }
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
    // Adjust parameters based on request type
    const requestParams = isRefinement ? {
      temperature: 0.2,        // Lower temperature for more consistent refinements
      max_tokens: 6144,        // Higher token limit for refinements
      top_p: 0.8,             // More focused token selection
      frequency_penalty: 0.3,  // Higher penalty for repetition in refinements
      presence_penalty: 0.3,   // Higher penalty to stay on refinement topic
    } : {
      temperature: 0.3,        // Standard for generation
      max_tokens: 4096,        // Standard limit for generation
      top_p: 0.9,             // Standard token selection
      frequency_penalty: 0.2,  // Standard repetition penalty
      presence_penalty: 0.2,   // Standard topic staying
    };

    console.log('API Route - Making OpenAI API call with:', {
      model: modelInfo.id,
      messagesCount: messages.length,
      requestType: isRefinement ? 'refinement' : 'generation',
      refinementType: refinementType || 'none',
      ...requestParams,
      stream: true
    });

    let response;
    try {
      console.log('Sending request to OpenRouter API...', {
        model: modelInfo.id,
        messagesCount: messages.length,
        requestType: isRefinement ? 'refinement' : 'generation',
        refinementType: refinementType || 'none'
      });

      // Create API request with optimized parameters
      response = await openai.chat.completions.create({
        model: modelInfo.id,
        messages: messages as ChatCompletionMessageParam[],
        ...requestParams,
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

    // Return the streaming response with refinement metadata
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    };

    // Add refinement metadata to headers
    if (isRefinement) {
      responseHeaders['X-Refinement-Type'] = refinementType;
      responseHeaders['X-Request-Type'] = 'refinement';
    } else {
      responseHeaders['X-Request-Type'] = 'generation';
    }

    return new Response(stream, {
      headers: responseHeaders,
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