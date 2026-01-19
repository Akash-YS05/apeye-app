'use client';

import { useEffect, useState } from 'react';
import { Trash2, Filter, X } from 'lucide-react';
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
import HistoryItem from './HistoryItem';
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

  const { config, setMethod, setUrl } = useRequestStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = getFilteredHistory();

  const handleRerun = (item: History) => {
    // Load the request from history
    setMethod(item.method);
    setUrl(item.url);
    // TODO: Load other request data from item.requestData
  };

  const handleClearAll = () => {
    if (confirm('Clear all history? This cannot be undone.')) {
      clearAllHistory();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">History</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearAll}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-2">
            <Input
              placeholder="Search by URL..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2">
              <Select
                value={filters.method}
                onValueChange={(value) => setMethodFilter(value as HttpMethod | 'all')}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success (2xx)</SelectItem>
                  <SelectItem value="error">Error (4xx, 5xx)</SelectItem>
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
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          {filteredHistory.length} {filteredHistory.length === 1 ? 'request' : 'requests'}
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">
              {history.length === 0
                ? 'No history yet. Send some requests!'
                : 'No requests match your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
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