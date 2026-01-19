'use client';

import { Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { History } from '@/types';
import { formatTime } from '@/lib/utils/response';

interface HistoryItemProps {
  item: History;
  onRerun: (item: History) => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ item, onRerun, onDelete }: HistoryItemProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
      <Badge className={`${getStatusColor(item.statusCode)} text-white px-2 py-1 text-xs`}>
        {item.statusCode}
      </Badge>

      <Badge variant="outline" className="font-mono text-xs">
        {item.method}
      </Badge>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.url}</p>
        <p className="text-xs text-gray-500">
          {formatDate(item.createdAt)} • {formatTime(item.responseTime)}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRerun(item)}
          title="Re-run request"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}