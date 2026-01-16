'use client';

import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyValue } from '@/types';

interface KeyValueInputProps {
  items: KeyValue[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof KeyValue, value: string | boolean) => void;
  onRemove: (id: string) => void;
  placeholder?: { key: string; value: string };
}

export default function KeyValueInput({
  items,
  onAdd,
  onUpdate,
  onRemove,
  placeholder = { key: 'Key', value: 'Value' },
}: KeyValueInputProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            checked={item.enabled}
            onCheckedChange={(checked) => onUpdate(item.id, 'enabled', checked as boolean)}
          />
          <Input
            placeholder={placeholder.key}
            value={item.key}
            onChange={(e) => onUpdate(item.id, 'key', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder={placeholder.value}
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {placeholder.key}
      </Button>
    </div>
  );
}