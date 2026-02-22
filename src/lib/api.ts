import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? 'http://localhost:5000' : 'http://localhost:5000');

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

async function handleResponse<T>(res: Response, options?: { silent?: boolean }): Promise<T> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? body.detail ?? message;
      if (Array.isArray(body.message)) message = body.message[0] ?? res.statusText;
    } catch {
      // use default
    }

    if (res.status === 401 && typeof window !== 'undefined') {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      const path = window.location.pathname;
      const isPublicRoute =
        path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/forgot-password') ||
        path.startsWith('/reset-password');
      // Only redirect to login from protected routes where auth is required
      if (!isPublicRoute) {
        window.location.href = '/login?session=expired';
      }
      throw new ApiError('Session expired. Please sign in again.', 401);
    }

    if (!options?.silent && typeof window !== 'undefined') {
      toast.error(message);
    }

    throw new ApiError(message, res.status);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json();
  }
  return undefined as T;
}

export const api = {
  async get<T>(path: string, options?: { silent?: boolean }): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, { headers, credentials: 'include' });
    return handleResponse<T>(res, options);
  },

  async post<T>(path: string, body?: unknown, options?: { silent?: boolean }): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    return handleResponse<T>(res, options);
  },

  async patch<T>(path: string, body?: unknown, options?: { silent?: boolean }): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    return handleResponse<T>(res, options);
  },

  async put<T>(path: string, body?: unknown, options?: { silent?: boolean }): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    return handleResponse<T>(res, options);
  },

  async delete<T>(path: string, options?: { silent?: boolean }): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    return handleResponse<T>(res, options);
  },

  /** Upload an image file via backend (uses backend ImageKit credentials). Returns { url, fileId, name }. */
  async uploadImage(file: File): Promise<{ url: string; fileId: string; name: string }> {
    const headers: Record<string, string> = {};
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    return handleResponse<{ url: string; fileId: string; name: string }>(res);
  },

  getBaseUrl: () => API_BASE,
};

export { extractErrorMessage };
