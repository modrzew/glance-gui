'use client';

import { useConfigStore } from '@/stores/configStore';
import { ColumnDropZone } from './ColumnDropZone';
import { ColumnLayoutValidator } from './ColumnLayoutValidator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useColumnValidation } from '@/hooks/useColumnValidation';
import type { ColumnSize } from '@/lib/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { WidgetDragOverlay } from '../widgets/WidgetDragOverlay';
import type { Widget } from '@/lib/types';

const PlusIcon = Plus;

interface ColumnLayoutProps {
  pageId: string;
}

export function ColumnLayout({ pageId }: ColumnLayoutProps) {
  const { getPage, addColumn, moveWidget, reorderWidgets } = useConfigStore();
  const page = getPage(pageId);
  const { validation, canAddColumn: checkCanAddColumn, suggestedSizes } = useColumnValidation(page);
  const [newColumnSize, setNewColumnSize] = useState<ColumnSize>('full');
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!page) return null;

  const handleAddColumn = () => {
    const result = checkCanAddColumn(newColumnSize);
    if (result.canAdd) {
      addColumn(pageId, newColumnSize);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const fullId = active.id as string;

    // Parse ID - format is "widget-{widgetId}"
    const widgetId = fullId.replace('widget-', '');

    // Find the widget in the page
    for (const column of page.columns) {
      const widget = column.widgets.find((w) => w.id === widgetId);
      if (widget) {
        setActiveWidget(widget);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWidget(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Parse IDs - format is "column-{columnId}" or "widget-{widgetId}"
    const parseId = (fullId: string) => {
      const match = fullId.match(/^(widget|column)-(.+)$/);
      if (!match) return { type: '', id: '' };
      return { type: match[1], id: match[2] };
    };

    const activeInfo = parseId(activeId);
    const overInfo = parseId(overId);

    // Find source column and widget index
    let sourceColumnId = '';
    let sourceIndex = -1;

    for (const column of page.columns) {
      const widgetIndex = column.widgets.findIndex((w) => w.id === activeInfo.id);
      if (widgetIndex !== -1) {
        sourceColumnId = column.id;
        sourceIndex = widgetIndex;
        break;
      }
    }

    if (sourceColumnId === '' || sourceIndex === -1) return;

    // Determine destination
    let destColumnId = '';
    let destIndex = -1;

    if (overInfo.type === 'column') {
      // Dropped on empty column
      destColumnId = overInfo.id;
      destIndex = 0;
    } else if (overInfo.type === 'widget') {
      // Dropped on or near another widget
      for (const column of page.columns) {
        const widgetIndex = column.widgets.findIndex((w) => w.id === overInfo.id);
        if (widgetIndex !== -1) {
          destColumnId = column.id;
          destIndex = widgetIndex;
          break;
        }
      }
    }

    if (destColumnId === '') return;

    // Same column reordering
    if (sourceColumnId === destColumnId) {
      if (sourceIndex !== destIndex) {
        reorderWidgets(pageId, sourceColumnId, sourceIndex, destIndex);
      }
    } else {
      // Move between columns
      moveWidget(pageId, sourceColumnId, sourceIndex, pageId, destColumnId, destIndex);
    }
  };

  const canAdd = checkCanAddColumn(newColumnSize);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <ColumnLayoutValidator validation={validation} />

      {page.columns.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No columns yet. Add your first column to start building the layout.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Select value={newColumnSize} onValueChange={(v) => setNewColumnSize(v as ColumnSize)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddColumn}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4" style={{
            gridTemplateColumns: page.columns.map(col => col.size === 'small' ? '400px' : '1fr').join(' ')
          }}>
            {page.columns.map((column) => (
              <ColumnDropZone key={column.id} pageId={pageId} column={column} />
            ))}
          </div>

          {page.columns.length < 3 && (
            <div className="flex items-center gap-2">
              <Select
                value={newColumnSize}
                onValueChange={(v) => setNewColumnSize(v as ColumnSize)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suggestedSizes.length > 0 ? (
                    suggestedSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size === 'small' ? 'Small' : 'Full'}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddColumn}
                disabled={!canAdd.canAdd}
                title={canAdd.reason}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Column
              </Button>
              {!canAdd.canAdd && canAdd.reason && (
                <span className="text-sm text-muted-foreground">{canAdd.reason}</span>
              )}
            </div>
          )}
        </>
      )}
      </div>

      <DragOverlay>
        {activeWidget ? <WidgetDragOverlay widget={activeWidget} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
