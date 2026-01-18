'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollectionsStore } from '@/stores/collectionsStore';
import { useRequestStore } from '@/stores/requestStore';
import type { Collection, SavedRequest } from '@/types';

interface CollectionItemProps {
  collection: Collection;
}

export default function CollectionItem({ collection }: CollectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteCollection, deleteRequest } = useCollectionsStore();
  const { setMethod, setUrl } = useRequestStore();

  const handleLoadRequest = (request: SavedRequest) => {
    // Load basic request data
    setMethod(request.method);
    setUrl(request.url);
    
    // TODO: Load headers, params, auth, body
    // This will be implemented when we add full request loading
  };

  const handleDeleteCollection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete collection "${collection.name}"?`)) {
      deleteCollection(collection.id);
    }
  };

  const handleDeleteRequest = (
    e: React.MouseEvent,
    requestId: string,
    requestName: string
  ) => {
    e.stopPropagation();
    if (confirm(`Delete request "${requestName}"?`)) {
      deleteRequest(requestId);
    }
  };

  return (
    <div className="space-y-1">
      {/* Collection Header */}
      <div
        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0 hover:bg-transparent">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <Folder className="h-4 w-4 text-blue-500" />
        <span className="flex-1 text-sm truncate">{collection.name}</span>
        <span className="text-xs text-gray-500">
          {collection.requests?.length || 0}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={handleDeleteCollection}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {isExpanded && collection.requests && collection.requests.length > 0 && (
        <div className="ml-6 space-y-1">
          {collection.requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
              onClick={() => handleLoadRequest(request)}
            >
              <FileText className="h-3 w-3 text-gray-500" />
              <span className="flex-1 text-sm truncate">{request.name}</span>
              <span className="text-xs font-mono text-gray-500 uppercase">
                {request.method}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDeleteRequest(e, request.id, request.name)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isExpanded && (!collection.requests || collection.requests.length === 0) && (
        <div className="ml-6 px-2 py-2 text-xs text-gray-500">
          No requests yet
        </div>
      )}
    </div>
  );
}