'use client';

import { useConfigStore } from '@/stores/configStore';
import { Button } from '@/components/ui/button';
import type { Page } from '@/lib/types';
import { Settings, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PageSettings } from './PageSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SettingsIcon = Settings;
const TrashIcon = Trash2;

interface PageListItemProps {
  page: Page;
  isSelected: boolean;
}

export function PageListItem({ page, isSelected }: PageListItemProps) {
  const { selectPage, deletePage } = useConfigStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deletePage(page.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          'group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent',
          isSelected && 'bg-accent'
        )}
        onClick={() => selectPage(page.id)}
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{page.name}</div>
          <div className="text-xs text-muted-foreground">
            {page.columns.length} {page.columns.length === 1 ? 'column' : 'columns'}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
          >
            <SettingsIcon className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <PageSettings
        page={page}
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{page.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
