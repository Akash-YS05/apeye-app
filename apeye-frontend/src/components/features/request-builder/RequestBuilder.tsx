'use client';

import { useState } from 'react';
import { Send, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequestStore } from '@/stores/requestStore';
import { HTTP_METHODS } from '@/config/constants';
import KeyValueInput from './KeyValueInput';
import AuthTab from './AuthTab';
import BodyTab from './BodyTab';
import SaveRequestDialog from '../collections/SaveRequestDialog';

export default function RequestBuilder() {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
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
      <div className="p-2 sm:p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Select value={config.method} onValueChange={setMethod}>
              <SelectTrigger className="w-24 sm:w-32 flex-shrink-0">
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
              className="flex-1 min-w-0"
            />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(true)}
              disabled={!config.url.trim()}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
              onClick={executeRequest}
              disabled={isLoading || !config.url.trim()}
              className="flex-1 sm:flex-none sm:px-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white sm:mr-2"></div>
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Request Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="params" className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b px-2 sm:px-4 overflow-x-auto">
            <TabsTrigger value="params" className="text-xs sm:text-sm">Params</TabsTrigger>
            <TabsTrigger value="headers" className="text-xs sm:text-sm">Headers</TabsTrigger>
            <TabsTrigger value="auth" className="text-xs sm:text-sm">Auth</TabsTrigger>
            <TabsTrigger value="body" className="text-xs sm:text-sm">Body</TabsTrigger>
          </TabsList>

          <div className="p-2 sm:p-4">
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

      {/* Save Request Dialog */}
      <SaveRequestDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />
    </div>
  );
}