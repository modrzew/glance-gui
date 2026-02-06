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

const PlusIcon = Plus;

interface ColumnLayoutProps {
  pageId: string;
}

export function ColumnLayout({ pageId }: ColumnLayoutProps) {
  const { getPage, addColumn } = useConfigStore();
  const page = getPage(pageId);
  const { validation, canAddColumn: checkCanAddColumn, suggestedSizes } = useColumnValidation(page);
  const [newColumnSize, setNewColumnSize] = useState<ColumnSize>('full');

  if (!page) return null;

  const handleAddColumn = () => {
    const result = checkCanAddColumn(newColumnSize);
    if (result.canAdd) {
      addColumn(pageId, newColumnSize);
    }
  };

  const canAdd = checkCanAddColumn(newColumnSize);

  return (
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
  );
}
