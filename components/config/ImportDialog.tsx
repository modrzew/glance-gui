'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConfigStore } from '@/stores/configStore';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ErrorIcon = AlertCircle;
const SuccessIcon = CheckCircle;

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yamlContent: string;
}

export function ImportDialog({ open, onOpenChange, yamlContent }: ImportDialogProps) {
  const { loadFromYAML, config } = useConfigStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImport = () => {
    try {
      loadFromYAML(yamlContent);
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import YAML');
      setSuccess(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Configuration</DialogTitle>
          <DialogDescription>
            This will replace your current configuration. Make sure to export your current config if you want to keep it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <ErrorIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <SuccessIcon className="h-4 w-4" />
              <AlertDescription>Configuration imported successfully!</AlertDescription>
            </Alert>
          )}

          {config.pages.length > 0 && !success && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have {config.pages.length} page(s) in your current configuration. They will be replaced.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={success}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
