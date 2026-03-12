'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAgentStore } from '@/stores/agentStore';

export default function AgentStatusChip() {
  const { status, version, checkHealth } = useAgentStore();

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
    return (
      <Badge variant="outline" className="text-xs border-green-500/40 text-green-700 dark:text-green-400">
        {version ? `Agent Connected v${version}` : 'Agent Connected'}
      </Badge>
    );
  }

  if (status === 'disconnected') {
    return (
      <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-700 dark:text-amber-400">
        Agent Offline
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs">
      Agent Checking
    </Badge>
  );
}
