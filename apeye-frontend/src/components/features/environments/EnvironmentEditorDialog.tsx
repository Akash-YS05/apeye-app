'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
import { useEnvironmentsStore } from '@/stores/environmentsStore';
import type { Environment } from '@/types';

interface EnvironmentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  environment: Environment | null;
}

interface Variable {
  id: string;
  key: string;
  value: string;
}

export default function EnvironmentEditorDialog({
  open,
  onOpenChange,
  environment,
}: EnvironmentEditorDialogProps) {
  const [name, setName] = useState('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateEnvironment } = useEnvironmentsStore();

  // Initialize form when environment changes
  useEffect(() => {
    if (environment) {
      setName(environment.name);
      // Convert Record<string, string> to Variable[]
      const vars = Object.entries(environment.variables || {}).map(([key, value]) => ({
        id: crypto.randomUUID(),
        key,
        value,
      }));
      // Add an empty row if no variables
      setVariables(vars.length > 0 ? vars : [{ id: crypto.randomUUID(), key: '', value: '' }]);
    }
  }, [environment]);

  const handleAddVariable = () => {
    setVariables([...variables, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter((v) => v.id !== id));
  };

  const handleVariableChange = (id: string, field: 'key' | 'value', newValue: string) => {
    setVariables(
      variables.map((v) => (v.id === id ? { ...v, [field]: newValue } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!environment || !name.trim()) return;

    setIsSubmitting(true);
    try {
      // Convert Variable[] back to Record<string, string>
      // Trim both keys and values to prevent whitespace issues
      const variablesRecord: Record<string, string> = {};
      variables.forEach((v) => {
        const key = v.key.trim();
        if (key) {
          variablesRecord[key] = v.value.trim();
        }
      });

      await updateEnvironment(environment.id, { name: name.trim(), variables: variablesRecord });
      onOpenChange(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!environment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Environment</DialogTitle>
          <DialogDescription>
            Manage variables for this environment. Use <code className="bg-muted px-1 py-0.5 rounded text-xs">{'{{variable_name}}'}</code> in your requests.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="env-edit-name">Environment Name</Label>
              <Input
                id="env-edit-name"
                placeholder="Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Variables</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariable}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Variable
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-auto">
                {variables.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No variables defined. Click "Add Variable" to create one.
                  </p>
                ) : (
                  variables.map((variable) => (
                    <div key={variable.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Variable name"
                        value={variable.key}
                        onChange={(e) =>
                          handleVariableChange(variable.id, 'key', e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                      <Input
                        placeholder="Value"
                        value={variable.value}
                        onChange={(e) =>
                          handleVariableChange(variable.id, 'value', e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVariable(variable.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
