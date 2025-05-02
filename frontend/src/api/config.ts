const API_BASE_URL = import.meta.env.VITE_API_URL;

type RequestOptions = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    signal?: AbortSignal;
    cache?: RequestCache;
};

type ApiResponse<T> = {
    data: T;
    error?: never,
} | {
    data?: never;
    error: string,
};

const apiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export const apiClient = async <T>(
    endpoint: string,
    options: RequestOptions = {method: 'GET'}
): Promise<ApiResponse<T>> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/${endpoint}`;

    const urlWithCacheBusting = options.method === 'GET' && !url.includes('_t=')
    ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
        : url;

    const cacheKey = `${options.method}:${url}`;
    if (options.method === 'GET' && options.cache !== 'no-store') {
        const cachedResponse = apiCache.get(cacheKey)
        if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
            return { data: cachedResponse.data as T };
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
    };

    try {
        const response = await fetch(urlWithCacheBusting, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            return {
                error: errorData?.error || `Error ${response.status}: ${response.statusText}`,
            }
        }

        const data = await response.json();

        if (options.method === 'GET' && options.cache !== 'no-store') {
            apiCache.set(cacheKey, { data, timestamp: Date.now() });
        }

        return { data };
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw error;
            }

            return {
                error: error.message || 'Network error occurred',
            }
        }
        return {
            error: error instanceof Error ? error.message : 'Something went wrong',
        };
    }
};

export const clearApiCache = (endpoint?: string) => {
    if (endpoint) {
        const pattern = new RegExp(`^(GET|POST|PUT|DELETE):${endpoint}`);
        [...apiCache.keys()].forEach(key => {
            if (pattern.test(key)) {
                apiCache.delete(key);
            }
        });
    } else {
        apiCache.clear();
    }
};
