'use client';

import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - overlay on mobile, static on desktop */}
        {sidebarOpen && (
          <>
            {/* Overlay backdrop for mobile */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={handleOverlayClick}
              />
            )}
            <div className={`
              ${isMobile 
                ? 'fixed left-0 top-14 bottom-0 z-50 w-80' 
                : 'w-64 lg:w-80'
              } 
              border-r bg-sidebar overflow-auto
            `}>
              <Sidebar />
            </div>
          </>
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