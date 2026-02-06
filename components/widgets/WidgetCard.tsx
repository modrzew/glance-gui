'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Widget } from '@/lib/types';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { WidgetEditor } from './WidgetEditor';
import { useConfigStore } from '@/stores/configStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
const GripIcon = GripVertical;

interface WidgetCardProps {
  widget: Widget;
  pageId: string;
  columnId: string;
}

export function WidgetCard({ widget, pageId, columnId }: WidgetCardProps) {
  const { deleteWidget } = useConfigStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `widget-${widget.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    deleteWidget(pageId, columnId, widget.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className="p-3 hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start gap-2">
          <button
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity mt-1 touch-none"
            {...attributes}
            {...listeners}
          >
            <GripIcon className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="font-medium break-words">
                {widget.title || `${widget.type} widget`}
              </span>
              <Badge variant="outline" className="text-xs shrink-0">
                {widget.type}
              </Badge>
            </div>
            {widget.cache && (
              <div className="text-xs text-muted-foreground">Cache: {widget.cache}</div>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsEditorOpen(true)}
            >
              <SettingsIcon className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <WidgetEditor
        widget={widget}
        pageId={pageId}
        columnId={columnId}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this widget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
