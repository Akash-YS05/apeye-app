import axiosInstance from './axios';
import { RequestConfig, ApiResponse } from '@/types';
import { AGENT_BASE_URL } from '@/config/constants';
import { getStoredAgentToken } from '@/lib/agent-auth';

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

async function executeViaLocalAgent(config: RequestConfig): Promise<ApiResponse> {
  try {
    const token = getStoredAgentToken();
    if (!token) {
      throw new Error('Local agent token is missing. Pair the app with your running agent.');
    }

    const response = await fetch(`${AGENT_BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-APEYE-Agent-Token': token,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error || `Local agent request failed (${response.status})`;
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error(
        'Local agent is unavailable. Ensure apeye-agent is running and paired with this app token.'
      );
    }

    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Local agent is unavailable. Ensure apeye-agent is running and paired with this app token.'
      );
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'Local agent request failed');
    }

    throw new Error('Local agent request failed');
  }
}

export const requestsApi = {
  // Execute an API request
  execute: async (config: RequestConfig): Promise<ApiResponse> => {
    // Use local agent for localhost/private URLs
    if (isPrivateURL(config.url)) {
      const response = await executeViaLocalAgent(config);
      
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
