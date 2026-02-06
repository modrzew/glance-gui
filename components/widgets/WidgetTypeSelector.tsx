'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WIDGET_TYPES, WIDGET_DESCRIPTIONS } from '@/lib/widgetTemplates';
import type { WidgetType } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WidgetTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: WidgetType) => void;
}

export function WidgetTypeSelector({ open, onOpenChange, onSelect }: WidgetTypeSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredWidgets = useMemo(() => {
    const searchLower = search.toLowerCase();
    return WIDGET_TYPES.filter(
      (widget) =>
        widget.label.toLowerCase().includes(searchLower) ||
        widget.value.toLowerCase().includes(searchLower) ||
        widget.category.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const groupedWidgets = useMemo(() => {
    const groups: Record<string, typeof WIDGET_TYPES> = {};
    filteredWidgets.forEach((widget) => {
      if (!groups[widget.category]) {
        groups[widget.category] = [];
      }
      groups[widget.category].push(widget);
    });
    return groups;
  }, [filteredWidgets]);

  const handleSelect = (type: WidgetType) => {
    onSelect(type);
    setSearch('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Input
            placeholder="Search widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto space-y-4">
            {Object.entries(groupedWidgets).map(([category, widgets]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {widgets.map((widget) => (
                    <Button
                      key={widget.value}
                      variant="outline"
                      className="h-auto p-3 justify-start text-left"
                      onClick={() => handleSelect(widget.value)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1 truncate">{widget.label}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 break-words">
                          {WIDGET_DESCRIPTIONS[widget.value]}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
