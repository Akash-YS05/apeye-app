'use client';

import { useState } from 'react';
import { Send, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequestStore } from '@/stores/requestStore';
import { HTTP_METHODS } from '@/config/constants';
import KeyValueInput from './KeyValueInput';
import AuthTab from './AuthTab';
import BodyTab from './BodyTab';
import SaveRequestDialog from '../collections/SaveRequestDialog';

export default function RequestBuilder() {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSectionCount = (section: string) => {
    switch (section) {
      case 'params':
        return config.params.filter(p => p.enabled).length;
      case 'headers':
        return config.headers.filter(h => h.enabled).length;
      case 'auth':
        return config.auth.type !== 'none' ? 1 : 0;
      case 'body':
        return config.body.type !== 'none' ? 1 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Request Line */}
      <div className="p-4 border-b bg-white dark:bg-gray-800 flex-shrink-0">
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
            variant="outline"
            onClick={() => setSaveDialogOpen(true)}
            disabled={!config.url.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

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

      {/* Collapsible Sections */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {/* Params Section */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('params')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedSection === 'params' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Query Params</span>
                {getSectionCount('params') > 0 && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {getSectionCount('params')}
                  </span>
                )}
              </div>
            </button>
            {expandedSection === 'params' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <KeyValueInput
                  items={config.params}
                  onAdd={addParam}
                  onUpdate={updateParam}
                  onRemove={removeParam}
                  placeholder={{ key: 'Parameter', value: 'Value' }}
                />
              </div>
            )}
          </div>

          {/* Headers Section */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('headers')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedSection === 'headers' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Headers</span>
                {getSectionCount('headers') > 0 && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {getSectionCount('headers')}
                  </span>
                )}
              </div>
            </button>
            {expandedSection === 'headers' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <KeyValueInput
                  items={config.headers}
                  onAdd={addHeader}
                  onUpdate={updateHeader}
                  onRemove={removeHeader}
                  placeholder={{ key: 'Header', value: 'Value' }}
                />
              </div>
            )}
          </div>

          {/* Authorization Section */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('auth')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedSection === 'auth' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Authorization</span>
                {getSectionCount('auth') > 0 && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {config.auth.type}
                  </span>
                )}
              </div>
            </button>
            {expandedSection === 'auth' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <AuthTab />
              </div>
            )}
          </div>

          {/* Body Section */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('body')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedSection === 'body' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">Body</span>
                {getSectionCount('body') > 0 && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    {config.body.type}
                  </span>
                )}
              </div>
            </button>
            {expandedSection === 'body' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <BodyTab />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Request Dialog */}
      <SaveRequestDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />
    </div>
  );
}