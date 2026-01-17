'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import RequestBuilder from '../request-builder/RequestBuilder';
import ResponseViewer from '../response-viewer/ResponseViewer';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 border-r bg-gray-50 dark:bg-gray-900">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Request Builder - Top Half */}
          <div className="flex-1 overflow-auto border-b">
            <RequestBuilder />
          </div>

          {/* Response Viewer - Bottom Half */}
          <div className="h-1/2 overflow-auto">
            <ResponseViewer />
          </div>
        </div>
      </div>
    </div>
  );
}