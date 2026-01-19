import { create } from 'zustand';
import { historyApi } from '@/lib/api/history';
import type { History, HttpMethod } from '@/types';
import toast from 'react-hot-toast';

interface HistoryState {
  history: History[];
  isLoading: boolean;
  filters: {
    method: HttpMethod | 'all';
    status: 'all' | 'success' | 'error';
    searchQuery: string;
  };
  
  fetchHistory: () => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  setMethodFilter: (method: HttpMethod | 'all') => void;
  setStatusFilter: (status: 'all' | 'success' | 'error') => void;
  setSearchQuery: (query: string) => void;
  getFilteredHistory: () => History[];
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  filters: {
    method: 'all',
    status: 'all',
    searchQuery: '',
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const history = await historyApi.list(100);
      set({ history, isLoading: false });
    } catch (error: any) {
      toast.error('Failed to fetch history');
      set({ isLoading: false });
    }
  },

  deleteHistoryItem: async (id: string) => {
    try {
      await historyApi.delete(id);
      set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      }));
      toast.success('History item deleted');
    } catch (error: any) {
      toast.error('Failed to delete history item');
    }
  },

  clearAllHistory: async () => {
    try {
      await historyApi.clearAll();
      set({ history: [] });
      toast.success('History cleared');
    } catch (error: any) {
      toast.error('Failed to clear history');
    }
  },

  setMethodFilter: (method) =>
    set((state) => ({
      filters: { ...state.filters, method },
    })),

  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
    })),

  setSearchQuery: (query) =>
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    })),

  getFilteredHistory: () => {
    const { history, filters } = get();
    
    return history.filter((item) => {
      // Filter by method
      if (filters.method !== 'all' && item.method !== filters.method) {
        return false;
      }

      // Filter by status
      if (filters.status === 'success' && (item.statusCode < 200 || item.statusCode >= 300)) {
        return false;
      }
      if (filters.status === 'error' && (item.statusCode >= 200 && item.statusCode < 300)) {
        return false;
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return item.url.toLowerCase().includes(query);
      }

      return true;
    });
  },
}));