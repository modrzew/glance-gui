'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Widget } from '@/lib/types';

interface WidgetPropertiesFormProps {
  widget: Partial<Widget>;
  onChange: (updates: Partial<Widget>) => void;
}

export function WidgetPropertiesForm({ widget, onChange }: WidgetPropertiesFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          value={widget.title || ''}
          onChange={(e) => onChange({ title: e.target.value || undefined })}
          placeholder="Widget title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title-url">Title URL (optional)</Label>
        <Input
          id="title-url"
          value={widget['title-url'] || ''}
          onChange={(e) => onChange({ 'title-url': e.target.value || undefined })}
          placeholder="https://example.com"
        />
        <p className="text-xs text-muted-foreground">Make the title clickable</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cache">Cache Duration (optional)</Label>
        <Input
          id="cache"
          value={widget.cache || ''}
          onChange={(e) => onChange({ cache: e.target.value || undefined })}
          placeholder="e.g., 5m, 1h, 12h, 1d"
        />
        <p className="text-xs text-muted-foreground">How long to cache the data</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="css-class">CSS Class (optional)</Label>
        <Input
          id="css-class"
          value={widget['css-class'] || ''}
          onChange={(e) => onChange({ 'css-class': e.target.value || undefined })}
          placeholder="custom-class"
        />
        <p className="text-xs text-muted-foreground">Custom CSS class for styling</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hide-header"
          checked={widget['hide-header'] || false}
          onChange={(e) => onChange({ 'hide-header': e.target.checked || undefined })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="hide-header" className="text-sm font-normal cursor-pointer">
          Hide widget header
        </Label>
      </div>
    </div>
  );
}
