import { create } from 'zustand';
import { checkAgentHealth, getAgentVersion } from '@/lib/api/agent';
import { MIN_AGENT_VERSION } from '@/config/constants';
import { getStoredAgentToken } from '@/lib/agent-auth';

type AgentStatus = 'unknown' | 'checking' | 'connected' | 'disconnected';

interface AgentState {
  status: AgentStatus;
  lastCheckedAt: number | null;
  version: string | null;
  requiresPairing: boolean;
  isVersionCompatible: boolean;

  checkHealth: () => Promise<boolean>;
  setRequiresPairing: (requiresPairing: boolean) => void;
}

function normalizeVersion(version: string): number[] {
  return version
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((value) => (Number.isNaN(value) ? 0 : value));
}

function isVersionAtLeast(current: string, minimum: string): boolean {
  const currentParts = normalizeVersion(current);
  const minimumParts = normalizeVersion(minimum);
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let i = 0; i < length; i += 1) {
    const currentValue = currentParts[i] || 0;
    const minimumValue = minimumParts[i] || 0;

    if (currentValue > minimumValue) return true;
    if (currentValue < minimumValue) return false;
  }

  return true;
}

export const useAgentStore = create<AgentState>((set) => ({
  status: 'unknown',
  lastCheckedAt: null,
  version: null,
  requiresPairing: false,
  isVersionCompatible: true,

  checkHealth: async () => {
    const hasToken = !!getStoredAgentToken();
    if (!hasToken) {
      set({
        status: 'disconnected',
        lastCheckedAt: Date.now(),
        version: null,
        isVersionCompatible: true,
        requiresPairing: true,
      });
      return false;
    }

    set({ status: 'checking' });

    const isHealthy = await checkAgentHealth();

    let version: string | null = null;
    let isVersionCompatible = true;
    if (isHealthy) {
      version = await getAgentVersion();
      if (version) {
        isVersionCompatible = isVersionAtLeast(version, MIN_AGENT_VERSION);
      }
    }

    set({
      status: isHealthy ? 'connected' : 'disconnected',
      lastCheckedAt: Date.now(),
      version,
      isVersionCompatible,
      requiresPairing: false,
    });

    return isHealthy;
  },

  setRequiresPairing: (requiresPairing) => set({ requiresPairing }),
}));
