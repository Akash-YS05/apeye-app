import { create } from 'zustand';
import { checkAgentHealth } from '@/lib/api/agent';

type AgentStatus = 'unknown' | 'checking' | 'connected' | 'disconnected';

interface AgentState {
  status: AgentStatus;
  lastCheckedAt: number | null;

  checkHealth: () => Promise<boolean>;
}

export const useAgentStore = create<AgentState>((set) => ({
  status: 'unknown',
  lastCheckedAt: null,

  checkHealth: async () => {
    set({ status: 'checking' });

    const isHealthy = await checkAgentHealth();
    set({
      status: isHealthy ? 'connected' : 'disconnected',
      lastCheckedAt: Date.now(),
    });

    return isHealthy;
  },
}));
