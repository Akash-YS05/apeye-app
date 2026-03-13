'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAgentStore } from '@/stores/agentStore';
import { getStoredAgentToken } from '@/lib/agent-auth';

export default function AgentStatusChip() {
  const { status, version, isVersionCompatible, checkHealth } = useAgentStore();
  const hasToken = !!getStoredAgentToken();

  useEffect(() => {
    checkHealth();

    const intervalId = window.setInterval(() => {
      checkHealth();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkHealth]);

  if (status === 'connected') {
    if (!isVersionCompatible) {
      return (
        <Badge variant="outline" className="text-xs border-red-500/40 text-red-700 dark:text-red-400">
          Agent Update Required
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs border-green-500/40 text-green-700 dark:text-green-400">
        {version ? `Agent Connected v${version}` : 'Agent Connected'}
      </Badge>
    );
  }

  if (status === 'disconnected') {
    return (
      <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-700 dark:text-amber-400">
        {hasToken ? 'Agent Offline' : 'Agent Not Paired'}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs">
      Agent Checking
    </Badge>
  );
}
