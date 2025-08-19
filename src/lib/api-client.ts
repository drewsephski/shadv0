// Use empty string as base URL since Next.js API routes are relative to /api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP error! status: ${response.status}`,
        }));
        return { error: errorData.error || 'An error occurred' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  static async streamResponse<T = unknown>(
    endpoint: string,
    body: T,
    onData: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      console.log('ApiClient sending request to:', `${API_BASE_URL}${endpoint}`);
      console.log('ApiClient request body:', body);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(error.error || 'Failed to fetch');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const read = async () => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            onComplete();
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          onData(chunk);
          read();
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Error reading stream');
        }
      };

      read();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Request failed');
    }
  }
}
