'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Settings, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEnvironmentsStore } from '@/stores/environmentsStore';
import CreateEnvironmentDialog from './CreateEnvironmentDialog';
import EnvironmentEditorDialog from './EnvironmentEditorDialog';
import type { Environment } from '@/types';

export default function EnvironmentSelector() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
  
  const {
    environments,
    activeEnvironmentId,
    isLoading,
    fetchEnvironments,
    setActiveEnvironment,
    deleteEnvironment,
  } = useEnvironmentsStore();

  // Fetch environments on mount
  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const activeEnvironment = environments.find((env) => env.id === activeEnvironmentId);

  const handleEditEnvironment = (env: Environment) => {
    setEditingEnvironment(env);
    setEditorDialogOpen(true);
  };

  const handleDeleteEnvironment = async (e: React.MouseEvent, envId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this environment?')) {
      await deleteEnvironment(envId);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="truncate max-w-[100px]">
                {activeEnvironment?.name || 'No Environment'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Environments</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* No Environment option */}
          <DropdownMenuItem
            onClick={() => setActiveEnvironment(null)}
            className={!activeEnvironmentId ? 'bg-accent' : ''}
          >
            <span className="flex-1">No Environment</span>
          </DropdownMenuItem>

          {isLoading ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Loading...</span>
            </DropdownMenuItem>
          ) : environments.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No environments created</span>
            </DropdownMenuItem>
          ) : (
            environments.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => setActiveEnvironment(env.id)}
                className={`group ${activeEnvironmentId === env.id ? 'bg-accent' : ''}`}
              >
                <span className="flex-1 truncate">{env.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEnvironment(env);
                    }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => handleDeleteEnvironment(e, env.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Environment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateEnvironmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EnvironmentEditorDialog
        open={editorDialogOpen}
        onOpenChange={setEditorDialogOpen}
        environment={editingEnvironment}
      />
    </>
  );
}
