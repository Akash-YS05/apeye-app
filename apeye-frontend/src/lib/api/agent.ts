import { AGENT_BASE_URL } from '@/config/constants';

export async function checkAgentHealth(timeoutMs = 1500): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${AGENT_BASE_URL}/health`, {
      method: 'GET',
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
