'use client';

import { Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { History } from '@/types';

interface HistoryItemProps {
  item: History;
  onRerun: (item: History) => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ item, onRerun, onDelete }: HistoryItemProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success';
    if (status >= 300 && status < 400) return 'bg-info';
    if (status >= 400 && status < 500) return 'bg-warning';
    return 'bg-error';
  };

  const formatTime = (ms: number) => {
    if (!ms || isNaN(ms)) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex items-start gap-2 p-2 rounded hover:bg-accent group">
      <div className="flex flex-col gap-1 pt-1">
        <Badge className={`${getStatusColor(item.statusCode)} text-white px-1.5 py-0.5 text-xs font-mono`}>
          {item.statusCode}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs px-1.5 py-0.5">
          {item.method}
        </Badge>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate text-foreground">
          {item.url}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTime(item.responseTime)}
        </p>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onRerun(item);
          }}
          title="Re-run request"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}