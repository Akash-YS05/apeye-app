export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type AuthType = 'none' | 'bearer' | 'basic' | 'api-key';

export type BodyType = 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw';

export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  auth: {
    type: AuthType;
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiValue?: string;
  };
  body: {
    type: BodyType;
    content: string;
    formData?: KeyValue[];
  };
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  plan: 'free' | 'pro';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  requests?: SavedRequest[];
  created_at: string;
  updated_at: string;
}

export interface SavedRequest {
  id: string;
  collection_id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, any>;
  params: Record<string, any>;
  auth: Record<string, any>;
  body: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Environment {
  id: string;
  workspace_id: string;
  name: string;
  variables: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface History {
  id: string;
  userId: string;
  method: HttpMethod;
  url: string;
  requestData: any;
  responseData: any;
  statusCode: number;
  responseTime: number;
  createdAt: string;
}