const AGENT_TOKEN_KEY = 'apeye_agent_token';

export function getStoredAgentToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(AGENT_TOKEN_KEY) || '';
}

export function setStoredAgentToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized = token.trim();
  if (!normalized) {
    window.localStorage.removeItem(AGENT_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(AGENT_TOKEN_KEY, normalized);
}

export function clearStoredAgentToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AGENT_TOKEN_KEY);
}
