import type { RequestConfig, KeyValue } from '@/types';

/**
 * Resolves {{variable}} placeholders in a string using the provided variables map
 * Trims whitespace from variable values to prevent common errors
 */
export function resolveVariablesInString(
  text: string,
  variables: Record<string, string>
): string {
  if (!text) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const value = variables[varName];
    // Trim whitespace from variable values to prevent issues with accidental spaces
    return value !== undefined ? value.trim() : match;
  });
}

/**
 * Resolves variables in all fields of a KeyValue array
 */
function resolveKeyValueArray(
  items: KeyValue[],
  variables: Record<string, string>
): KeyValue[] {
  return items.map((item) => ({
    ...item,
    key: resolveVariablesInString(item.key, variables),
    value: resolveVariablesInString(item.value, variables),
  }));
}

/**
 * Resolves all {{variable}} placeholders in a RequestConfig
 * Returns a new config with all variables substituted
 */
export function resolveConfigVariables(
  config: RequestConfig,
  variables: Record<string, string>
): RequestConfig {
  if (!variables || Object.keys(variables).length === 0) {
    return config;
  }

  return {
    ...config,
    // Resolve URL
    url: resolveVariablesInString(config.url, variables),
    
    // Resolve params
    params: resolveKeyValueArray(config.params, variables),
    
    // Resolve headers
    headers: resolveKeyValueArray(config.headers, variables),
    
    // Resolve auth
    auth: {
      ...config.auth,
      token: config.auth.token
        ? resolveVariablesInString(config.auth.token, variables)
        : config.auth.token,
      username: config.auth.username
        ? resolveVariablesInString(config.auth.username, variables)
        : config.auth.username,
      password: config.auth.password
        ? resolveVariablesInString(config.auth.password, variables)
        : config.auth.password,
      apiKey: config.auth.apiKey
        ? resolveVariablesInString(config.auth.apiKey, variables)
        : config.auth.apiKey,
      apiValue: config.auth.apiValue
        ? resolveVariablesInString(config.auth.apiValue, variables)
        : config.auth.apiValue,
    },
    
    // Resolve body
    body: {
      ...config.body,
      content: resolveVariablesInString(config.body.content, variables),
      formData: config.body.formData
        ? resolveKeyValueArray(config.body.formData, variables)
        : config.body.formData,
    },
  };
}

/**
 * Extracts all variable names used in a RequestConfig
 * Useful for showing which variables are being used
 */
export function extractVariablesFromConfig(config: RequestConfig): string[] {
  const variableSet = new Set<string>();
  const pattern = /\{\{(\w+)\}\}/g;

  const extractFromString = (text: string) => {
    if (!text) return;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      variableSet.add(match[1]);
    }
  };

  const extractFromKeyValues = (items: KeyValue[]) => {
    items.forEach((item) => {
      extractFromString(item.key);
      extractFromString(item.value);
    });
  };

  extractFromString(config.url);
  extractFromKeyValues(config.params);
  extractFromKeyValues(config.headers);
  extractFromString(config.auth.token || '');
  extractFromString(config.auth.username || '');
  extractFromString(config.auth.password || '');
  extractFromString(config.auth.apiKey || '');
  extractFromString(config.auth.apiValue || '');
  extractFromString(config.body.content);
  if (config.body.formData) {
    extractFromKeyValues(config.body.formData);
  }

  return Array.from(variableSet);
}
