import axiosInstance from './axios';
import type { History, RequestConfig, ApiResponse } from '@/types';

export const historyApi = {
  // Get user's request history
  list: async (limit: number = 50): Promise<History[]> => {
    const response = await axiosInstance.get('/history', {
      params: { limit },
    });
    return response.data;
  },

  // Save a history record (for locally executed requests)
  save: async (config: RequestConfig, apiResponse: ApiResponse): Promise<void> => {
    await axiosInstance.post('/history', {
      method: config.method,
      url: config.url,
      requestData: config,
      responseData: apiResponse,
      statusCode: apiResponse.status,
      responseTime: apiResponse.time,
    });
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