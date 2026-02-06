'use client';

import { useConfigStore } from '@/stores/configStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnSize } from '@/lib/types';
import { useColumnValidation } from '@/hooks/useColumnValidation';

interface ColumnSizeSelectorProps {
  pageId: string;
  columnId: string;
  currentSize: ColumnSize;
}

export function ColumnSizeSelector({ pageId, columnId, currentSize }: ColumnSizeSelectorProps) {
  const { updateColumn, getPage } = useConfigStore();
  const page = getPage(pageId);
  const { validation } = useColumnValidation(page);

  const handleSizeChange = (newSize: ColumnSize) => {
    updateColumn(pageId, columnId, newSize);
  };

  return (
    <Select value={currentSize} onValueChange={handleSizeChange}>
      <SelectTrigger className="w-24 h-7 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">Small</SelectItem>
        <SelectItem value="full">Full</SelectItem>
      </SelectContent>
    </Select>
  );
}
