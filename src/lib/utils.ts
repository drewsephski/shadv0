import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatModelName(modelId?: string): string {
  if (!modelId) return '';
  
  // Remove common prefixes
  const prefixPattern = new RegExp(
    '^(z-ai/|openai/|anthropic/|google/|meta-llama/|' +
    'mistralai/|deepseek-ai/|qwen/|moonshotai/|llama-|llama:|/free$|:free$)',
    'g'
  );
  
  let formatted = modelId
    .replace(prefixPattern, '')
    .replace(/[-_]/g, ' ')
    .trim();

  // Capitalize first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Handle common model name formatting
  formatted = formatted
    .replace(/Gpt/g, 'GPT')
    .replace(/Llama/g, 'Llama')
    .replace(/Claude/g, 'Claude')
    .replace(/Gemini/g, 'Gemini')
    .replace(/Mistral/g, 'Mistral')
    .replace(/Deepseek/g, 'DeepSeek')
    .replace(/Qwen/g, 'Qwen')
    .replace(/Kimi/g, 'Kimi');

  // Handle version numbers
  formatted = formatted.replace(/(\d+)([A-Za-z])/g, '$1 $2');

  return formatted;
}
