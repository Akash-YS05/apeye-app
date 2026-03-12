import { create } from 'zustand';
import { checkAgentHealth, getAgentVersion } from '@/lib/api/agent';

type AgentStatus = 'unknown' | 'checking' | 'connected' | 'disconnected';

interface AgentState {
  status: AgentStatus;
  lastCheckedAt: number | null;
  version: string | null;

  checkHealth: () => Promise<boolean>;
}

export const useAgentStore = create<AgentState>((set) => ({
  status: 'unknown',
  lastCheckedAt: null,
  version: null,

  checkHealth: async () => {
    set({ status: 'checking' });

    const isHealthy = await checkAgentHealth();

    let version: string | null = null;
    if (isHealthy) {
      version = await getAgentVersion();
    }

    set({
      status: isHealthy ? 'connected' : 'disconnected',
      lastCheckedAt: Date.now(),
      version,
    });

    return isHealthy;
  },
}));
