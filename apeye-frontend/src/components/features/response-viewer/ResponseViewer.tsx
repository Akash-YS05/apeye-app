'use client';

import { useRequestStore } from '@/stores/requestStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ResponseViewer() {
  const { response, isLoading } = useRequestStore();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Sending request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No response yet</p>
          <p className="text-sm mt-2">Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Response Status Bar */}
      <div className="p-4 border-b flex items-center gap-4">
        <Badge className={`${getStatusColor(response.status)} text-white`}>
          {response.statusText}
        </Badge>
        <span className="text-sm text-gray-600">
          Time: <span className="font-medium">{response.time}ms</span>
        </span>
        <span className="text-sm text-gray-600">
          Size: <span className="font-medium">{response.size} bytes</span>
        </span>
      </div>

      {/* Response Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="body" className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="body" className="mt-0">
              <Card className="p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="headers" className="mt-0">
              <Card className="p-4">
                <div className="space-y-2">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}