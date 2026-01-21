'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import HistoryItem from './HistoryItem';
import type { History } from '@/types';

interface HistoryDateGroupProps {
  date: string;
  items: History[];
  onRerun: (item: History) => void;
  onDelete: (id: string) => void;
}

export default function HistoryDateGroup({ 
  date, 
  items, 
  onRerun, 
  onDelete 
}: HistoryDateGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-left"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="text-sm font-medium text-foreground">
          {date}
        </span>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </button>

      {isExpanded && (
        <div className="ml-2 space-y-1">
          {items.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onRerun={onRerun}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}