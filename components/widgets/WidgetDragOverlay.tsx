'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Widget } from '@/lib/types';

interface WidgetDragOverlayProps {
  widget: Widget;
}

export function WidgetDragOverlay({ widget }: WidgetDragOverlayProps) {
  return (
    <Card className="p-3 opacity-80 rotate-3 shadow-lg cursor-grabbing">
      <div className="flex items-start justify-between gap-2">
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
      </div>
    </Card>
  );
}
