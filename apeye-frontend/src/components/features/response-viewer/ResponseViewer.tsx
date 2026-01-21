'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { useRequestStore } from '@/stores/requestStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CodeBlock from './CodeBlock';
import {
  formatBytes,
  formatTime,
  getContentType,
  isJSON,
  isXML,
  isHTML,
  formatJSON,
  copyToClipboard,
  downloadFile,
} from '@/lib/utils/response';
import toast from 'react-hot-toast';

export default function ResponseViewer() {
  const { response, isLoading } = useRequestStore();
  const [activeTab, setActiveTab] = useState('body');
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [bodyCopied, setBodyCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Sending request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No response yet</p>
          <p className="text-sm mt-2">Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success';
    if (status >= 300 && status < 400) return 'bg-info';
    if (status >= 400 && status < 500) return 'bg-warning';
    return 'bg-error';
  };

  const contentType = getContentType(response.headers);
  const isJsonResponse = isJSON(contentType);
  const isXmlResponse = isXML(contentType);
  const isHtmlResponse = isHTML(contentType);

  const getResponseBody = () => {
    if (!response.data) return '';
    
    if (isJsonResponse && prettyPrint) {
      return formatJSON(response.data);
    }
    
    if (typeof response.data === 'string') {
      return response.data;
    }
    
    return JSON.stringify(response.data, null, prettyPrint ? 2 : 0);
  };

  const getLanguage = () => {
    if (isJsonResponse) return 'json';
    if (isXmlResponse) return 'xml';
    if (isHtmlResponse) return 'html';
    return 'text';
  };

  const handleCopyBody = async () => {
    try {
      await copyToClipboard(getResponseBody());
      setBodyCopied(true);
      toast.success('Response copied to clipboard');
      setTimeout(() => setBodyCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy response');
    }
  };

  const handleDownload = () => {
    const body = getResponseBody();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = isJsonResponse ? 'json' : isXmlResponse ? 'xml' : isHtmlResponse ? 'html' : 'txt';
    const filename = `response_${timestamp}.${extension}`;
    
    downloadFile(body, filename, contentType);
    toast.success('Response downloaded');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Response Status Bar */}
      <div className="p-4 py-2 border-b flex items-center justify-between flex-shrink-0 bg-card">
        <div className="flex items-center gap-4">
          <Badge className={`${getStatusColor(response.status)} text-white px-3 py-1`}>
            {response.statusText}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Time: <span className="font-medium text-foreground">{formatTime(response.time)}</span>
          </span>
          <span className="text-sm text-muted-foreground">
            Size: <span className="font-medium text-foreground">{formatBytes(response.size)}</span>
          </span>
        </div>
  
        <div className="flex items-center gap-2">
          {(isJsonResponse || isXmlResponse || isHtmlResponse) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrettyPrint(!prettyPrint)}
            >
              {prettyPrint ? 'Raw' : 'Pretty'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyBody}
          >
            {bodyCopied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
  
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
  
      {/* Response Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-fit justify-start border-b px-4 flex-shrink-0 rounded">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers ({Object.keys(response.headers).length})</TabsTrigger>
          </TabsList>
  
          <TabsContent value="body" className="flex-1 p-4 overflow-auto m-0">
            {response.data ? (
              <CodeBlock
                code={getResponseBody()}
                language={getLanguage()}
                showLineNumbers={prettyPrint}
                wrapLines={prettyPrint}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No response body</p>
              </Card>
            )}
          </TabsContent>
  
          <TabsContent value="headers" className="flex-1 p-4 overflow-auto m-0">
            <Card className="p-4">
              <div className="space-y-3">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-4 text-sm border-b pb-2 last:border-0">
                    <span className="font-medium text-foreground min-w-[200px]">{key}:</span>
                    <span className="text-muted-foreground break-all flex-1">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}