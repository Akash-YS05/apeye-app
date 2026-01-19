'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollectionsStore } from '@/stores/collectionsStore';
import { useRequestStore } from '@/stores/requestStore';

interface SaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const kvArrayToObject = (arr: any[] = []) =>
  arr.reduce((acc, item) => {
    if (item.key) acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, any>);


export default function SaveRequestDialog({ open, onOpenChange }: SaveRequestDialogProps) {
  const [name, setName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { collections, saveRequest } = useCollectionsStore();
  const { config } = useRequestStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !selectedCollectionId) return;
    const headersObject = kvArrayToObject(config.headers);
    const paramsObject = kvArrayToObject(config.params);
    
    setIsSubmitting(true);
    try {
      await saveRequest(selectedCollectionId, name, {
        method: config.method,
        url: config.url,
        headers: headersObject,
        params: paramsObject,
        auth: config.auth,
        body: config.body,
      });
      setName('');
      setSelectedCollectionId('');
      onOpenChange(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription>
            Save this request to a collection for later use.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="request-name">Request Name</Label>
              <Input
                id="request-name"
                placeholder="Get User Details"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {collections.length === 0 && (
              <p className="text-sm text-gray-500">
                No collections yet. Create one first!
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !selectedCollectionId}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}