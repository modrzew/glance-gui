'use client';

import { useConfigStore } from '@/stores/configStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Page } from '@/lib/types';
import { PAGE_WIDTHS } from '@/lib/constants';
import { useState, useEffect } from 'react';

interface PageSettingsProps {
  page: Page;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageSettings({ page, open, onOpenChange }: PageSettingsProps) {
  const { updatePage } = useConfigStore();
  const [formData, setFormData] = useState({
    name: page.name,
    slug: page.slug || '',
    width: page.width || 'default',
    centerVertically: page['center-vertically'] || false,
    hideDesktopNavigation: page['hide-desktop-navigation'] || false,
    showMobileHeader: page['show-mobile-header'] || false,
  });

  // Update form data when page changes
  useEffect(() => {
    setFormData({
      name: page.name,
      slug: page.slug || '',
      width: page.width || 'default',
      centerVertically: page['center-vertically'] || false,
      hideDesktopNavigation: page['hide-desktop-navigation'] || false,
      showMobileHeader: page['show-mobile-header'] || false,
    });
  }, [page]);

  const handleSave = () => {
    updatePage(page.id, {
      name: formData.name,
      slug: formData.slug || undefined,
      width: formData.width === 'default' ? undefined : formData.width,
      'center-vertically': formData.centerVertically || undefined,
      'hide-desktop-navigation': formData.hideDesktopNavigation || undefined,
      'show-mobile-header': formData.showMobileHeader || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Page Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Home"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., home"
            />
            <p className="text-xs text-muted-foreground">URL path for this page</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Page Width</Label>
            <Select
              value={formData.width}
              onValueChange={(value) => setFormData({ ...formData, width: value as any })}
            >
              <SelectTrigger id="width">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_WIDTHS.map((width) => (
                  <SelectItem key={width.value} value={width.value}>
                    {width.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="center-vertically"
                checked={formData.centerVertically}
                onChange={(e) => setFormData({ ...formData, centerVertically: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="center-vertically" className="text-sm font-normal cursor-pointer">
                Center vertically
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hide-desktop-navigation"
                checked={formData.hideDesktopNavigation}
                onChange={(e) => setFormData({ ...formData, hideDesktopNavigation: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="hide-desktop-navigation" className="text-sm font-normal cursor-pointer">
                Hide desktop navigation
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-mobile-header"
                checked={formData.showMobileHeader}
                onChange={(e) => setFormData({ ...formData, showMobileHeader: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="show-mobile-header" className="text-sm font-normal cursor-pointer">
                Show mobile header
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
