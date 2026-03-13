import { AGENT_BASE_URL } from '@/config/constants';
import { getStoredAgentToken } from '@/lib/agent-auth';

export interface AgentHealthResponse {
  status: 'ok';
  service: string;
  version?: string;
}

export interface AgentVersionResponse {
  service: string;
  version: string;
}

export async function checkAgentHealth(timeoutMs = 1500): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = getStoredAgentToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${AGENT_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'X-APEYE-Agent-Token': token,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    return payload?.status === 'ok';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getAgentVersion(timeoutMs = 1500): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = getStoredAgentToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${AGENT_BASE_URL}/version`, {
      method: 'GET',
      headers: {
        'X-APEYE-Agent-Token': token,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AgentVersionResponse;
    return payload.version || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
