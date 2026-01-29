import axiosInstance from './axios';
import type { Environment } from '@/types';

export interface CreateEnvironmentInput {
  workspace_id?: string;
  name: string;
  variables?: Record<string, string>;
}

export interface UpdateEnvironmentInput {
  name?: string;
  variables?: Record<string, string>;
}

export const environmentsApi = {
  // List all environments
  list: async (): Promise<Environment[]> => {
    const response = await axiosInstance.get('/environments');
    return response.data;
  },

  // Create a new environment
  create: async (data: CreateEnvironmentInput): Promise<Environment> => {
    const response = await axiosInstance.post('/environments', data);
    return response.data;
  },

  // Get single environment
  get: async (id: string): Promise<Environment> => {
    const response = await axiosInstance.get(`/environments/${id}`);
    return response.data;
  },

  // Update environment
  update: async (id: string, data: UpdateEnvironmentInput): Promise<Environment> => {
    const response = await axiosInstance.put(`/environments/${id}`, data);
    return response.data;
  },

  // Delete environment
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/environments/${id}`);
  },
};
