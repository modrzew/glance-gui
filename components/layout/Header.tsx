'use client';

import { Button } from '@/components/ui/button';
import { useConfigStore } from '@/stores/configStore';
import { ImportDialog } from '@/components/config/ImportDialog';
import { ExportDialog } from '@/components/config/ExportDialog';
import { FileText, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const UploadIcon = Upload;
const FileTextIcon = FileText;

export function Header() {
  const { exportToYAML } = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [yamlToImport, setYamlToImport] = useState('');
  const [yamlToExport, setYamlToExport] = useState('');

  const handleExport = () => {
    const yaml = exportToYAML();
    setYamlToExport(yaml);
    setExportDialogOpen(true);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setYamlToImport(content);
      setImportDialogOpen(true);
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Glance GUI</h1>
            <p className="text-sm text-muted-foreground">Visual configuration manager for Glance dashboard</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".yml,.yaml"
              onChange={handleImport}
              className="hidden"
              aria-label="Import YAML file"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleExport}>
              <FileTextIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        yamlContent={yamlToImport}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        yamlContent={yamlToExport}
      />
    </>
  );
}
