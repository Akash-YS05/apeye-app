'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import RequestBuilder from '../request-builder/RequestBuilder';
import ResponseViewer from '../response-viewer/ResponseViewer';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 overflow-auto">
            <Sidebar />
          </div>
        )}

        {/* Main Content - Split 50/50 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Request Builder - Top 50% */}
          <div className="h-1/2 border-b overflow-hidden">
            <RequestBuilder />
          </div>

          {/* Response Viewer - Bottom 50% */}
          <div className="h-1/2 overflow-hidden">
            <ResponseViewer />
          </div>
        </div>
      </div>
    </div>
  );
}