'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyIcon = Copy;
const CheckIcon = Check;

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yamlContent: string;
}

export function ExportDialog({ open, onOpenChange, yamlContent }: ExportDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Configuration</DialogTitle>
          <DialogDescription>
            Copy the YAML configuration below to use with Glance
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <textarea
            readOnly
            value={yamlContent}
            className="w-full h-full min-h-[400px] font-mono text-sm p-4 border rounded-md resize-none"
            spellCheck={false}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleCopy}>
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
