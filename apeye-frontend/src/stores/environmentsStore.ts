import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { environmentsApi } from '@/lib/api/environments';
import type { Environment } from '@/types';
import toast from 'react-hot-toast';

interface EnvironmentsState {
  environments: Environment[];
  activeEnvironmentId: string | null;
  isLoading: boolean;

  // Actions
  fetchEnvironments: () => Promise<void>;
  createEnvironment: (name: string, variables?: Record<string, string>) => Promise<Environment>;
  updateEnvironment: (id: string, data: { name?: string; variables?: Record<string, string> }) => Promise<void>;
  deleteEnvironment: (id: string) => Promise<void>;
  setActiveEnvironment: (id: string | null) => void;

  // Variable resolution
  getActiveEnvironment: () => Environment | null;
  resolveVariables: (text: string) => string;
}

export const useEnvironmentsStore = create<EnvironmentsState>()(
  persist(
    (set, get) => ({
      environments: [],
      activeEnvironmentId: null,
      isLoading: false,

      fetchEnvironments: async () => {
        set({ isLoading: true });
        try {
          const environments = await environmentsApi.list();
          set({ environments, isLoading: false });
        } catch (error: any) {
          toast.error('Failed to fetch environments');
          set({ isLoading: false });
        }
      },

      createEnvironment: async (name: string, variables: Record<string, string> = {}) => {
        set({ isLoading: true });
        try {
          const newEnvironment = await environmentsApi.create({ name, variables });
          set((state) => ({
            environments: [...state.environments, newEnvironment],
            isLoading: false,
          }));
          toast.success('Environment created');
          return newEnvironment;
        } catch (error: any) {
          toast.error('Failed to create environment');
          set({ isLoading: false });
          throw error;
        }
      },

      updateEnvironment: async (id: string, data: { name?: string; variables?: Record<string, string> }) => {
        try {
          const updatedEnvironment = await environmentsApi.update(id, data);
          set((state) => ({
            environments: state.environments.map((env) =>
              env.id === id ? updatedEnvironment : env
            ),
          }));
          toast.success('Environment updated');
        } catch (error: any) {
          toast.error('Failed to update environment');
          throw error;
        }
      },

      deleteEnvironment: async (id: string) => {
        try {
          await environmentsApi.delete(id);
          set((state) => ({
            environments: state.environments.filter((env) => env.id !== id),
            activeEnvironmentId: state.activeEnvironmentId === id ? null : state.activeEnvironmentId,
          }));
          toast.success('Environment deleted');
        } catch (error: any) {
          toast.error('Failed to delete environment');
        }
      },

      setActiveEnvironment: (id: string | null) => {
        set({ activeEnvironmentId: id });
      },

      getActiveEnvironment: () => {
        const { environments, activeEnvironmentId } = get();
        if (!activeEnvironmentId) return null;
        return environments.find((env) => env.id === activeEnvironmentId) || null;
      },

      resolveVariables: (text: string) => {
        const activeEnv = get().getActiveEnvironment();
        if (!activeEnv || !text) return text;

        // Replace {{variable}} with value from active environment
        return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          const value = activeEnv.variables[varName];
          return value !== undefined ? value : match;
        });
      },
    }),
    {
      name: 'apeye-environments',
      partialize: (state) => ({ activeEnvironmentId: state.activeEnvironmentId }),
    }
  )
);
