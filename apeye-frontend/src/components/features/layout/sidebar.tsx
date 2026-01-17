'use client';

import { Folder } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="h-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Collections</h2>
        <div className="text-sm text-gray-500 text-center py-8">
          <Folder className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No collections yet</p>
          <p className="text-xs mt-1">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}