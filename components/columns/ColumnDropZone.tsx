'use client';

import { useConfigStore } from '@/stores/configStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ColumnSizeSelector } from './ColumnSizeSelector';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { WidgetTypeSelector } from '@/components/widgets/WidgetTypeSelector';
import type { Column, WidgetType } from '@/lib/types';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TrashIcon = Trash2;
const PlusIcon = Plus;

interface ColumnDropZoneProps {
  pageId: string;
  column: Column;
}

export function ColumnDropZone({ pageId, column }: ColumnDropZoneProps) {
  const { deleteColumn, addWidget } = useConfigStore();
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);

  const handleAddWidget = (type: WidgetType) => {
    addWidget(pageId, column.id, type);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {column.size === 'small' ? 'Small' : 'Full'} Column
          </span>
          <ColumnSizeSelector pageId={pageId} columnId={column.id} currentSize={column.size} />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Column</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this column? All widgets in this column will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteColumn(pageId, column.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="min-h-[200px] border-2 border-dashed rounded-md p-4">
        {column.widgets.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center py-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">No widgets in this column</p>
              <Button size="sm" variant="outline" onClick={() => setIsWidgetSelectorOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {column.widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                pageId={pageId}
                columnId={column.id}
              />
            ))}
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setIsWidgetSelectorOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
          </div>
        )}
      </div>

      <WidgetTypeSelector
        open={isWidgetSelectorOpen}
        onOpenChange={setIsWidgetSelectorOpen}
        onSelect={handleAddWidget}
      />
    </Card>
  );
}
