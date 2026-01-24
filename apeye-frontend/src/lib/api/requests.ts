import axiosInstance from './axios';
import { RequestConfig, ApiResponse, KeyValue } from '@/types';

// Check if URL points to localhost or private IP
function isPrivateURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;

    // Check localhost
    if (host === 'localhost') return true;

    // Check loopback and private IPs
    const ip = host.split('.').map(Number);
    if (ip.length === 4 && ip.every(n => !isNaN(n))) {
      // 127.x.x.x (loopback)
      if (ip[0] === 127) return true;
      // 10.x.x.x (private)
      if (ip[0] === 10) return true;
      // 172.16-31.x.x (private)
      if (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) return true;
      // 192.168.x.x (private)
      if (ip[0] === 192 && ip[1] === 168) return true;
    }

    // IPv6 loopback
    if (host === '::1' || host === '[::1]') return true;

    return false;
  } catch {
    return false;
  }
}

// Build URL with query parameters
function buildURL(baseURL: string, params: KeyValue[]): string {
  const url = new URL(baseURL);
  params.forEach(p => {
    if (p.enabled && p.key) {
      url.searchParams.append(p.key, p.value);
    }
  });
  return url.toString();
}

// Execute request directly from browser (for localhost/private URLs)
async function executeLocally(config: RequestConfig): Promise<ApiResponse> {
  const startTime = performance.now();

  const url = buildURL(config.url, config.params);

  // Build headers
  const headers: Record<string, string> = {};
  config.headers.forEach(h => {
    if (h.enabled && h.key) {
      headers[h.key] = h.value;
    }
  });

  // Set auth headers
  if (config.auth.type === 'bearer' && config.auth.token) {
    headers['Authorization'] = `Bearer ${config.auth.token}`;
  } else if (config.auth.type === 'basic' && config.auth.username && config.auth.password) {
    headers['Authorization'] = `Basic ${btoa(`${config.auth.username}:${config.auth.password}`)}`;
  } else if (config.auth.type === 'api-key' && config.auth.apiKey && config.auth.apiValue) {
    headers[config.auth.apiKey] = config.auth.apiValue;
  }

  // Build body
  let body: string | FormData | undefined;
  if (config.method !== 'GET' && config.method !== 'HEAD') {
    if (config.body.type === 'json') {
      headers['Content-Type'] = 'application/json';
      body = config.body.content;
    } else if (config.body.type === 'raw') {
      headers['Content-Type'] = 'text/plain';
      body = config.body.content;
    } else if (config.body.type === 'x-www-form-urlencoded' && config.body.formData) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      const params = new URLSearchParams();
      config.body.formData.forEach(f => {
        if (f.enabled && f.key) params.append(f.key, f.value);
      });
      body = params.toString();
    } else if (config.body.type === 'form-data' && config.body.formData) {
      const formData = new FormData();
      config.body.formData.forEach(f => {
        if (f.enabled && f.key) formData.append(f.key, f.value);
      });
      body = formData;
    }
  }

  try {
    const response = await fetch(url, {
      method: config.method,
      headers,
      body,
    });

    const endTime = performance.now();
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    // Extract headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      time: Math.round(endTime - startTime),
      size: new Blob([responseText]).size,
    };
  } catch (error: any) {
    // Network error or CORS
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(
        'CORS Error: The target server is not allowing requests from this browser. Add CORS headers to your server or ensure the server is running.'
      );
    }
    throw new Error(`Request failed: ${error.message}`);
  }
}

export const requestsApi = {
  // Execute an API request
  execute: async (config: RequestConfig): Promise<ApiResponse> => {
    // Use browser fetch for localhost/private URLs (backend can't reach them)
    if (isPrivateURL(config.url)) {
      const response = await executeLocally(config);
      
      // Save to history via dedicated API route (not proxy)
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          method: config.method,
          url: config.url,
          requestData: config,
          responseData: response,
          statusCode: response.status,
          responseTime: response.time,
        }),
      }).catch(() => {
        // Silently fail - history save is not critical
      });
      
      return response;
    }
    
    // Use backend proxy for public URLs (avoids CORS issues)
    // Backend automatically saves to history
    const response = await axiosInstance.post('/requests/execute', config);
    return response.data;
  },

  // Future: Save request to collection
  // save: async (collectionId: string, request: SavedRequest) => { ... },
};
