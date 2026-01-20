'use client';

import { useEffect, useState } from 'react';
import { Trash2, Filter, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHistoryStore } from '@/stores/historyStore';
import { useRequestStore } from '@/stores/requestStore';
import HistoryDateGroup from './HistoryDateGroup';
import type { History, HttpMethod } from '@/types';
import { HTTP_METHODS } from '@/config/constants';

export default function HistoryPanel() {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    history,
    isLoading,
    filters,
    fetchHistory,
    deleteHistoryItem,
    clearAllHistory,
    setMethodFilter,
    setStatusFilter,
    setSearchQuery,
    getFilteredHistory,
  } = useHistoryStore();

  const { setMethod, setUrl } = useRequestStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = getFilteredHistory();

  // Group history by date
  const groupByDate = (items: History[]) => {
    const groups: Record<string, History[]> = {};
    
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        dateKey = date.toLocaleDateString('en-US', { weekday: 'long' });
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return groups;
  };

  const groupedHistory = groupByDate(filteredHistory);
  const dateKeys = Object.keys(groupedHistory);

  const handleRerun = (item: History) => {
    setMethod(item.method);
    setUrl(item.url);
  };

  const handleClearAll = () => {
    if (confirm('Clear all history? This cannot be undone.')) {
      clearAllHistory();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-sm">History</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="h-7 px-2"
            >
              <Filter className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="h-7 px-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-2">
            <Input
              placeholder="Search URL..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="flex gap-2">
              <Select
                value={filters.method}
                onValueChange={(value) => setMethodFilter(value as HttpMethod | 'all')}
              >
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">2xx</SelectItem>
                  <SelectItem value="error">4xx/5xx</SelectItem>
                </SelectContent>
              </Select>

              {(filters.method !== 'all' || filters.status !== 'all' || filters.searchQuery) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setMethodFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="h-8 px-2"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          {filteredHistory.length} {filteredHistory.length === 1 ? 'request' : 'requests'}
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : dateKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-xs">
              {history.length === 0
                ? 'No history yet'
                : 'No requests match filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dateKeys.map((dateKey) => (
              <HistoryDateGroup
                key={dateKey}
                date={dateKey}
                items={groupedHistory[dateKey]}
                onRerun={handleRerun}
                onDelete={deleteHistoryItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}