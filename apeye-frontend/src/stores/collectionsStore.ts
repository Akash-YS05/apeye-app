import { create } from 'zustand';
import { collectionsApi } from '@/lib/api/collections';
import type { Collection, SavedRequest } from '@/types';
import toast from 'react-hot-toast';

interface CollectionsState {
  collections: Collection[];
  selectedCollection: Collection | null;
  isLoading: boolean;
  
  fetchCollections: () => Promise<void>;
  createCollection: (name: string, workspaceId: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  selectCollection: (collection: Collection | null) => void;
  saveRequest: (collectionId: string, requestName: string, requestData: any) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  collections: [],
  selectedCollection: null,
  isLoading: false,

  fetchCollections: async () => {
    set({ isLoading: true });
    try {
      const collections = await collectionsApi.list();
      set({ collections, isLoading: false });
    } catch (error: any) {
      toast.error('Failed to fetch collections');
      set({ isLoading: false });
    }
  },

  createCollection: async (name: string, workspaceId: string) => {
    set({ isLoading: true });
    try {
      const newCollection = await collectionsApi.create({
        workspace_id: workspaceId,
        name,
      });
      set((state) => ({
        collections: [newCollection, ...state.collections],
        isLoading: false,
      }));
      toast.success('Collection created');
    } catch (error: any) {
      toast.error('Failed to create collection');
      set({ isLoading: false });
      throw error;
    }
  },

  deleteCollection: async (id: string) => {
    try {
      await collectionsApi.delete(id);
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        selectedCollection: state.selectedCollection?.id === id ? null : state.selectedCollection,
      }));
      toast.success('Collection deleted');
    } catch (error: any) {
      toast.error('Failed to delete collection');
    }
  },

  selectCollection: (collection: Collection | null) => {
    set({ selectedCollection: collection });
  },

  saveRequest: async (collectionId: string, requestName: string, requestData: any) => {
    try {
      const savedRequest = await collectionsApi.saveRequest({
        collection_id: collectionId,
        name: requestName,
        ...requestData,
      });
      
      // Update the collection with new request
      set((state) => ({
        collections: state.collections.map((col) => {
          if (col.id === collectionId) {
            return {
              ...col,
              requests: [...(col.requests || []), savedRequest],
            };
          }
          return col;
        }),
      }));
      
      toast.success('Request saved');
    } catch (error: any) {
      toast.error('Failed to save request');
      throw error;
    }
  },

  deleteRequest: async (requestId: string) => {
    try {
      await collectionsApi.deleteRequest(requestId);
      
      // Remove request from collections
      set((state) => ({
        collections: state.collections.map((col) => ({
          ...col,
          requests: col.requests?.filter((req) => req.id !== requestId) || [],
        })),
      }));
      
      toast.success('Request deleted');
    } catch (error: any) {
      toast.error('Failed to delete request');
    }
  },
}));