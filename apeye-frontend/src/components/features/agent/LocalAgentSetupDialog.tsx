'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AGENT_BASE_URL, AGENT_WINDOWS_DOWNLOAD_URL } from '@/config/constants';

interface LocalAgentSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry?: () => Promise<void> | void;
}

function detectWindows(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.navigator.userAgent.toLowerCase().includes('windows');
}

export default function LocalAgentSetupDialog({
  open,
  onOpenChange,
  onRetry,
}: LocalAgentSetupDialogProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isWindows = useMemo(() => detectWindows(), []);
  const runCommand = 'apeye-agent.exe';

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(runCommand);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      setIsCopied(false);
    }
  };

  const handleRetry = async () => {
    if (!onRetry) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Enable local URL testing (Windows)</DialogTitle>
          <DialogDescription>
            Install the APEye local agent once, then localhost and private network requests will work from the web app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {!isWindows ? (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="font-medium">Windows-only right now</p>
              <p className="text-muted-foreground mt-1">
                Local agent download is currently available for Windows only.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="font-medium">Step 1: download the Windows agent</p>
                <p className="text-muted-foreground mt-1">
                  Download the latest `apeye-agent.exe` from releases.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="mt-3"
                >
                  <a href={AGENT_WINDOWS_DOWNLOAD_URL} target="_blank" rel="noreferrer">
                    Download Agent
                  </a>
                </Button>
              </div>

              <div className="rounded-md border bg-muted/30 p-3">
                <p className="font-medium">Step 2: run the agent</p>
                <p className="text-muted-foreground mt-1">
                  Open PowerShell in the download folder and run:
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-background p-2 text-xs">{runCommand}</pre>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleCopyCommand}>
                  {isCopied ? 'Copied' : 'Copy command'}
                </Button>
              </div>

              <div className="rounded-md border bg-muted/30 p-3">
                <p className="font-medium">Step 3: verify and retry</p>
                <pre className="mt-2 overflow-x-auto rounded bg-background p-2 text-xs">
curl {AGENT_BASE_URL}/health
                </pre>
                <p className="text-muted-foreground mt-2">
                  Keep this process running while testing local URLs.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={handleRetry} disabled={!onRetry || isRetrying}>
            {isRetrying ? 'Checking...' : 'Retry connection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
