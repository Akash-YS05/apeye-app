import axiosInstance from './axios';
import type { Collection, SavedRequest } from '@/types';

export interface CreateCollectionInput {
  workspace_id: string;
  name: string;
  description?: string;
}

export interface SaveRequestInput {
  collection_id: string;
  name: string;
  method: string;
  url: string;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  auth?: Record<string, any>;
  body?: Record<string, any>;
}

export const collectionsApi = {
  // List all collections
  list: async (): Promise<Collection[]> => {
    const response = await axiosInstance.get('/collections');
    return response.data;
  },

  // Create a new collection
  create: async (data: CreateCollectionInput): Promise<Collection> => {
    const response = await axiosInstance.post('/collections', data);
    return response.data;
  },

  // Get single collection
  get: async (id: string): Promise<Collection> => {
    const response = await axiosInstance.get(`/collections/${id}`);
    return response.data;
  },

  // Update collection
  update: async (id: string, data: Partial<CreateCollectionInput>): Promise<Collection> => {
    const response = await axiosInstance.put(`/collections/${id}`, data);
    return response.data;
  },

  // Delete collection
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/collections/${id}`);
  },

  // Save request to collection
  saveRequest: async (data: SaveRequestInput): Promise<SavedRequest> => {
    const response = await axiosInstance.post('/requests', data);
    return response.data;
  },

  // Delete saved request
  deleteRequest: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/requests/${id}`);
  },
};