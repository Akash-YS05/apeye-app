'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRequestStore } from '@/stores/requestStore';
import { BODY_TYPES } from '@/config/constants';
import KeyValueInput from './KeyValueInput';

export default function BodyTab() {
  const {
    config,
    setBodyType,
    setBodyContent,
    addFormData,
    updateFormData,
    removeFormData,
  } = useRequestStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Body Type</Label>
        <Select value={config.body.type} onValueChange={setBodyType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BODY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.body.type === 'json' && (
        <div className="space-y-2">
          <Label>JSON Body</Label>
          <Textarea
            placeholder='{"key": "value"}'
            value={config.body.content}
            onChange={(e) => setBodyContent(e.target.value)}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>
      )}

      {config.body.type === 'raw' && (
        <div className="space-y-2">
          <Label>Raw Body</Label>
          <Textarea
            placeholder="Enter raw body content"
            value={config.body.content}
            onChange={(e) => setBodyContent(e.target.value)}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>
      )}

      {(config.body.type === 'form-data' || config.body.type === 'x-www-form-urlencoded') && (
        <div className="space-y-2">
          <Label>Form Data</Label>
          <KeyValueInput
            items={config.body.formData || []}
            onAdd={addFormData}
            onUpdate={updateFormData}
            onRemove={removeFormData}
            placeholder={{ key: 'Key', value: 'Value' }}
          />
        </div>
      )}

      {config.body.type === 'none' && (
        <div className="text-sm text-muted-foreground">
          This request does not have a body.
        </div>
      )}
    </div>
  );
}