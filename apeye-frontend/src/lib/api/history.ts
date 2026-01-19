import axiosInstance from './axios';
import type { History } from '@/types';

export const historyApi = {
  // Get user's request history
  list: async (limit: number = 50): Promise<History[]> => {
    const response = await axiosInstance.get('/history', {
      params: { limit },
    });
    return response.data;
  },

  // Delete single history item
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/history/${id}`);
  },

  // Clear all history
  clearAll: async (): Promise<void> => {
    await axiosInstance.delete('/history');
  },
};