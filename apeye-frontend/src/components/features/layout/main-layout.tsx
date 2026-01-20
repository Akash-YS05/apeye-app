'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import RequestBuilder from '../request-builder/RequestBuilder';
import ResponseViewer from '../response-viewer/ResponseViewer';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-80 border-r bg-gray-50 dark:bg-gray-900 overflow-auto">
            <Sidebar />
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="vertical" className="h-full">
            
            {/* Request Builder */}
            <ResizablePanel defaultSize={30} minSize={15}>
              <div className="h-full overflow-auto border-b">
                <RequestBuilder />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Response Viewer */}
            <ResizablePanel defaultSize={70} minSize={20}>
              <div className="h-full overflow-hidden">
                <ResponseViewer />
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}