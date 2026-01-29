import { create } from 'zustand';
import { RequestConfig, ApiResponse, KeyValue, SavedRequest } from '@/types';
import { nanoid } from 'nanoid';
import { requestsApi } from '@/lib/api/requests';
import { resolveConfigVariables } from '@/lib/variables';
import { useEnvironmentsStore } from './environmentsStore';
import toast from 'react-hot-toast';

interface RequestState {
  config: RequestConfig;
  response: ApiResponse | null;
  isLoading: boolean;
  
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

    try {
      // Get active environment variables and resolve them in the config
      const activeEnv = useEnvironmentsStore.getState().getActiveEnvironment();
      const variables = activeEnv?.variables || {};
      const resolvedConfig = resolveConfigVariables(config, variables);

      const response = await requestsApi.execute(resolvedConfig);
      set({ response, isLoading: false });
      toast.success('Request completed');
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.error || 'Request failed';
      const isLocalhost = config.url.includes('localhost') || config.url.includes('127.0.0.1');
      
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
        toast.error(errorMessage);
      }
    }
  },

  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ isLoading: loading }),
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
        //@ts-ignore
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