'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequestStore } from '@/stores/requestStore';
import { AUTH_TYPES } from '@/config/constants';

export default function AuthTab() {
  const { config, setAuthType, setAuthToken, setAuthBasic, setAuthApiKey } = useRequestStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Auth Type</Label>
        <Select value={config.auth.type} onValueChange={setAuthType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUTH_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.auth.type === 'bearer' && (
        <div className="space-y-2">
          <Label>Token</Label>
          <Input
            placeholder="Bearer token"
            value={config.auth.token || ''}
            onChange={(e) => setAuthToken(e.target.value)}
          />
        </div>
      )}

      {config.auth.type === 'basic' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              placeholder="Username"
              value={config.auth.username || ''}
              onChange={(e) => setAuthBasic(e.target.value, config.auth.password || '')}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={config.auth.password || ''}
              onChange={(e) => setAuthBasic(config.auth.username || '', e.target.value)}
            />
          </div>
        </div>
      )}

      {config.auth.type === 'api-key' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Key</Label>
            <Input
              placeholder="API Key name (e.g., X-API-Key)"
              value={config.auth.apiKey || ''}
              onChange={(e) => setAuthApiKey(e.target.value, config.auth.apiValue || '')}
            />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              placeholder="API Key value"
              value={config.auth.apiValue || ''}
              onChange={(e) => setAuthApiKey(config.auth.apiKey || '', e.target.value)}
            />
          </div>
        </div>
      )}

      {config.auth.type === 'none' && (
        <div className="text-sm text-gray-500">
          This request does not use any authorization.
        </div>
      )}
    </div>
  );
}