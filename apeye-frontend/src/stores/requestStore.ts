import { create } from 'zustand';
import { RequestConfig, ApiResponse, KeyValue, SavedRequest } from '@/types';
import { nanoid } from 'nanoid';
import { requestsApi } from '@/lib/api/requests';
import { resolveConfigVariables } from '@/lib/variables';
import { useEnvironmentsStore } from './environmentsStore';
import toast from 'react-hot-toast';
import { useAgentStore } from './agentStore';

function isLocalOrPrivateURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;

    if (host === 'localhost' || host === '::1' || host === '[::1]') {
      return true;
    }

    const ip = host.split('.').map(Number);
    if (ip.length === 4 && ip.every((n) => !Number.isNaN(n))) {
      if (ip[0] === 127) return true;
      if (ip[0] === 10) return true;
      if (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) return true;
      if (ip[0] === 192 && ip[1] === 168) return true;
    }

    return false;
  } catch {
    return false;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { error?: string } } }).response;
    if (response?.data?.error) {
      return response.data.error;
    }
  }

  return 'Request failed';
}

interface RequestState {
  config: RequestConfig;
  response: ApiResponse | null;
  isLoading: boolean;
  showAgentSetupDialog: boolean;
  
  setMethod: (method: RequestConfig['method']) => void;
  setUrl: (url: string) => void;
  
  addParam: () => void;
  updateParam: (id: string, field: keyof KeyValue, value: string | boolean) => void;
  removeParam: (id: string) => void;
  
  addHeader: () => void;
  updateHeader: (id: string, field: keyof KeyValue, value: string | boolean) => void;
  removeHeader: (id: string) => void;
  
  setAuthType: (type: RequestConfig['auth']['type']) => void;
  setAuthToken: (token: string) => void;
  setAuthBasic: (username: string, password: string) => void;
  setAuthApiKey: (apiKey: string, apiValue: string) => void;
  
  setBodyType: (type: RequestConfig['body']['type']) => void;
  setBodyContent: (content: string) => void;
  
  addFormData: () => void;
  updateFormData: (id: string, field: keyof KeyValue, value: string | boolean) => void;
  removeFormData: (id: string) => void;
  
  executeRequest: () => Promise<void>;
  setResponse: (response: ApiResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setShowAgentSetupDialog: (open: boolean) => void;
  resetRequest: () => void;
  loadSavedRequest: (request: SavedRequest) => void; // ADD THIS LINE
}

const initialConfig: RequestConfig = {
  method: 'GET',
  url: '',
  params: [],
  headers: [
    { id: nanoid(), key: 'Content-Type', value: 'application/json', enabled: true },
  ],
  auth: {
    type: 'none',
  },
  body: {
    type: 'none',
    content: '',
    formData: [],
  },
};

export const useRequestStore = create<RequestState>((set, get) => ({
  config: initialConfig,
  response: null,
  isLoading: false,
  showAgentSetupDialog: false,

  setMethod: (method) => set((state) => ({
    config: { ...state.config, method },
  })),

  setUrl: (url) => set((state) => ({
    config: { ...state.config, url },
  })),

  // Params
  addParam: () => set((state) => ({
    config: {
      ...state.config,
      params: [...state.config.params, { id: nanoid(), key: '', value: '', enabled: true }],
    },
  })),

  updateParam: (id, field, value) => set((state) => ({
    config: {
      ...state.config,
      params: state.config.params.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    },
  })),

  removeParam: (id) => set((state) => ({
    config: {
      ...state.config,
      params: state.config.params.filter((param) => param.id !== id),
    },
  })),

  // Headers
  addHeader: () => set((state) => ({
    config: {
      ...state.config,
      headers: [...state.config.headers, { id: nanoid(), key: '', value: '', enabled: true }],
    },
  })),

  updateHeader: (id, field, value) => set((state) => ({
    config: {
      ...state.config,
      headers: state.config.headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      ),
    },
  })),

  removeHeader: (id) => set((state) => ({
    config: {
      ...state.config,
      headers: state.config.headers.filter((header) => header.id !== id),
    },
  })),

  // Auth
  setAuthType: (type) => set((state) => ({
    config: {
      ...state.config,
      auth: { type },
    },
  })),

  setAuthToken: (token) => set((state) => ({
    config: {
      ...state.config,
      auth: { ...state.config.auth, token },
    },
  })),

  setAuthBasic: (username, password) => set((state) => ({
    config: {
      ...state.config,
      auth: { ...state.config.auth, username, password },
    },
  })),

  setAuthApiKey: (apiKey, apiValue) => set((state) => ({
    config: {
      ...state.config,
      auth: { ...state.config.auth, apiKey, apiValue },
    },
  })),

  // Body
  setBodyType: (type) => set((state) => ({
    config: {
      ...state.config,
      body: { ...state.config.body, type },
    },
  })),

  setBodyContent: (content) => set((state) => ({
    config: {
      ...state.config,
      body: { ...state.config.body, content },
    },
  })),

  // Form Data
  addFormData: () => set((state) => ({
    config: {
      ...state.config,
      body: {
        ...state.config.body,
        formData: [
          ...(state.config.body.formData || []),
          { id: nanoid(), key: '', value: '', enabled: true },
        ],
      },
    },
  })),

  updateFormData: (id, field, value) => set((state) => ({
    config: {
      ...state.config,
      body: {
        ...state.config.body,
        formData: (state.config.body.formData || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    },
  })),

  removeFormData: (id) => set((state) => ({
    config: {
      ...state.config,
      body: {
        ...state.config.body,
        formData: (state.config.body.formData || []).filter((item) => item.id !== id),
      },
    },
  })),

  // Execute Request
  executeRequest: async () => {
    const { config } = get();
    
    if (!config.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    set({ isLoading: true, response: null });

    const isLocalhost = isLocalOrPrivateURL(config.url);

    if (isLocalhost) {
      const isAgentHealthy = await useAgentStore.getState().checkHealth();
      const { isVersionCompatible } = useAgentStore.getState();

      if (!isAgentHealthy) {
        set({ isLoading: false, showAgentSetupDialog: true });
        toast.error('Local agent is not connected. Complete setup to continue.', { duration: 4000 });
        return;
      }

      if (!isVersionCompatible) {
        set({ isLoading: false, showAgentSetupDialog: true });
        toast.error('Local agent update required. Download latest agent and retry.', { duration: 4000 });
        return;
      }
    }

    try {
      // Get active environment variables and resolve them in the config
      const activeEnv = useEnvironmentsStore.getState().getActiveEnvironment();
      const variables = activeEnv?.variables || {};
      const resolvedConfig = resolveConfigVariables(config, variables);

      const response = await requestsApi.execute(resolvedConfig);
      set({ response, isLoading: false });
      toast.success('Request completed');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      const isLocalhost = isLocalOrPrivateURL(config.url);
      
      // Check for CORS/network error on localhost
      if (isLocalhost && (errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))) {
        // Set a helpful error response so user sees it in the response panel
        set({ 
          isLoading: false,
          response: {
            status: 0,
            statusText: 'CORS / Network Error',
            headers: {},
            data: {
              error: 'Could not reach your local server',
              tips: [
                '1. Make sure your server is running on the specified port',
                '2. Add CORS headers to your server. Example for Express.js:',
                '   app.use(cors({ origin: "*" }))',
                '3. Or use a browser extension like "Allow CORS" to bypass restrictions',
              ]
            },
            time: 0,
            size: 0,
          }
        });
        toast.error('Cannot reach local server - see response for tips', { duration: 4000 });
      } else if (errorMessage.includes('CORS')) {
        set({ 
          isLoading: false,
          response: {
            status: 0,
            statusText: 'CORS Error',
            headers: {},
            data: { error: 'The target server is blocking browser requests. The server needs to allow CORS from this origin.' },
            time: 0,
            size: 0,
          }
        });
        toast.error('CORS Error - server is blocking requests', { duration: 4000 });
      } else {
        set({ isLoading: false });
        if (isLocalhost && (errorMessage.toLowerCase().includes('local agent') || errorMessage.toLowerCase().includes('token'))) {
          set({ showAgentSetupDialog: true });
          useAgentStore.getState().checkHealth();
        }
        toast.error(errorMessage);
      }
    }
  },

  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ isLoading: loading }),
  setShowAgentSetupDialog: (open) => set({ showAgentSetupDialog: open }),
  resetRequest: () => set({ config: initialConfig, response: null }),
  loadSavedRequest: (request: SavedRequest) => {
    // Convert saved request data back to KeyValue arrays
    const headersArray: KeyValue[] = request.headers 
      ? Object.entries(request.headers).map(([key, value]) => ({
          id: nanoid(),
          key,
          value: String(value),
          enabled: true,
        }))
      : [];
  
    const paramsArray: KeyValue[] = request.params
      ? Object.entries(request.params).map(([key, value]) => ({
          id: nanoid(),
          key,
          value: String(value),
          enabled: true,
        }))
      : [];
  
    const formDataArray: KeyValue[] = request.body?.formData
      ? Object.entries(request.body.formData).map(([key, value]) => ({
          id: nanoid(),
          key,
          value: String(value),
          enabled: true,
        }))
      : [];
  
    set({
      config: {
        method: request.method,
        url: request.url,
        params: paramsArray,
        headers: headersArray.length > 0 ? headersArray : [
          { id: nanoid(), key: 'Content-Type', value: 'application/json', enabled: true },
        ],
        // @ts-expect-error saved request auth shape is loosely typed from API
        auth: request.auth || { type: 'none' },
        body: {
          type: request.body?.type || 'none',
          content: request.body?.content || '',
          formData: formDataArray,
        },
      },
      response: null, // Clear previous response
    });
  },
}));
