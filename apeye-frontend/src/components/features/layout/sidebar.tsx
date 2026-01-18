'use client';

import { useEffect, useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollectionsStore } from '@/stores/collectionsStore';
import CreateCollectionDialog from '../collections/CreateCollectionDialog';
import CollectionItem from '../collections/CollectionItem';

export default function Sidebar() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { collections, isLoading, fetchCollections } = useCollectionsStore();

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const defaultWorkspaceId = 'default';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Collections</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCreateDialogOpen(true)}
            title="Create Collection"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Collections List */}
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Folder className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">No collections yet</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {collections.map((collection) => (
              <CollectionItem key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={defaultWorkspaceId}
      />
    </div>
  );
}