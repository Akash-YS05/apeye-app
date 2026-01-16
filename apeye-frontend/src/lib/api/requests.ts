import axiosInstance from './axios';
import { RequestConfig, ApiResponse } from '@/types';

export const requestsApi = {
  // Execute an API request
  execute: async (config: RequestConfig): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/requests/execute', config);
    return response.data;
  },

  // Future: Save request to collection
  // save: async (collectionId: string, request: SavedRequest) => { ... },
};