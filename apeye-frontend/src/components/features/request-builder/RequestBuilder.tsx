'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequestStore } from '@/stores/requestStore';
import { HTTP_METHODS } from '@/config/constants';
import KeyValueInput from './KeyValueInput';
import AuthTab from './AuthTab';
import BodyTab from './BodyTab';

export default function RequestBuilder() {
  const {
    config,
    isLoading,
    setMethod,
    setUrl,
    addParam,
    updateParam,
    removeParam,
    addHeader,
    updateHeader,
    removeHeader,
    executeRequest,
  } = useRequestStore();

  return (
    <div className="h-full flex flex-col">
      {/* Request Line */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Select value={config.method} onValueChange={setMethod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter request URL"
            value={config.url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />

          <Button
            onClick={executeRequest}
            disabled={isLoading || !config.url.trim()}
            className="px-6"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Request Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="params" className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="auth">Authorization</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="params" className="mt-0">
              <KeyValueInput
                items={config.params}
                onAdd={addParam}
                onUpdate={updateParam}
                onRemove={removeParam}
                placeholder={{ key: 'Parameter', value: 'Value' }}
              />
            </TabsContent>

            <TabsContent value="headers" className="mt-0">
              <KeyValueInput
                items={config.headers}
                onAdd={addHeader}
                onUpdate={updateHeader}
                onRemove={removeHeader}
                placeholder={{ key: 'Header', value: 'Value' }}
              />
            </TabsContent>

            <TabsContent value="auth" className="mt-0">
              <AuthTab />
            </TabsContent>

            <TabsContent value="body" className="mt-0">
              <BodyTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}