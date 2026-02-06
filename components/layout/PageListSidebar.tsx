'use client';

import { useConfigStore } from '@/stores/configStore';
import { Button } from '@/components/ui/button';
import { PageListItem } from '@/components/pages/PageListItem';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PlusIcon = Plus;

export function PageListSidebar() {
  const { config, selectedPageId, addPage } = useConfigStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r bg-muted/30 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Pages</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {config.pages.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No pages yet. Click + to add one.
            </div>
          ) : (
            config.pages.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                isSelected={page.id === selectedPageId}
              />
            ))
          )}
        </div>
      </aside>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page-name">Page Name</Label>
              <Input
                id="page-name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g., Home, News, Homelab"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPage();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPage} disabled={!newPageName.trim()}>
              Add Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
