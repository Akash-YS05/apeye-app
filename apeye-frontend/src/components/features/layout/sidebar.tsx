'use client';

import { useEffect, useState } from 'react';
import { Plus, Folder, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollectionsStore } from '@/stores/collectionsStore';
import CreateCollectionDialog from '../collections/CreateCollectionDialog';
import CollectionItem from '../collections/CollectionItem';
import HistoryPanel from '../history/HistoryPanel';

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
      <Tabs defaultValue="collections" className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
          <TabsTrigger value="collections" className="gap-2">
            <Folder className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Collections Tab */}
        <TabsContent value="collections" className="flex-1 flex flex-col m-0 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
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
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="flex-1 m-0 overflow-hidden">
          <HistoryPanel />
        </TabsContent>
      </Tabs>

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={defaultWorkspaceId}
      />
    </div>
  );
}