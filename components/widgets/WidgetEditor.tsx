'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetPropertiesForm } from './WidgetPropertiesForm';
import { YAMLEditor } from './YAMLEditor';
import { useConfigStore } from '@/stores/configStore';
import type { Widget } from '@/lib/types';
import { useState, useEffect } from 'react';
import { widgetPropertiesToYAML, parseWidgetPropertiesYAML } from '@/lib/yamlUtils';
import { WIDGET_TEMPLATES } from '@/lib/widgetTemplates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ErrorIcon = AlertCircle;

interface WidgetEditorProps {
  widget: Widget;
  pageId: string;
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WidgetEditor({ widget, pageId, columnId, open, onOpenChange }: WidgetEditorProps) {
  const { updateWidget } = useConfigStore();
  const [formData, setFormData] = useState<Partial<Widget>>({});
  const [yamlValue, setYamlValue] = useState('');
  const [yamlError, setYamlError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: widget.title,
      'title-url': widget['title-url'],
      cache: widget.cache,
      'css-class': widget['css-class'],
      'hide-header': widget['hide-header'],
    });

    // Initialize YAML editor with existing properties or template
    const existingYAML = widgetPropertiesToYAML(widget.properties);
    setYamlValue(existingYAML || WIDGET_TEMPLATES[widget.type]);
    setYamlError(null);
  }, [widget]);

  const handleYAMLChange = (value: string) => {
    setYamlValue(value);
    setYamlError(null);
  };

  const handleSave = () => {
    try {
      // Parse YAML to validate and convert to properties object
      const properties = parseWidgetPropertiesYAML(yamlValue);

      updateWidget(pageId, columnId, widget.id, {
        ...formData,
        properties,
      });
      onOpenChange(false);
    } catch (error) {
      setYamlError(error instanceof Error ? error.message : 'Invalid YAML');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Widget
            <Badge variant="outline">{widget.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="shared" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shared">Shared Properties</TabsTrigger>
              <TabsTrigger value="specific">Widget-Specific Properties</TabsTrigger>
            </TabsList>

            <TabsContent value="shared" className="space-y-4 mt-4">
              <WidgetPropertiesForm
                widget={formData}
                onChange={(updates) => setFormData({ ...formData, ...updates })}
              />
            </TabsContent>

            <TabsContent value="specific" className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Edit the YAML configuration for {widget.type}-specific properties. The template is pre-populated for you.
                </p>
                {yamlError && (
                  <Alert variant="destructive" className="mb-3">
                    <ErrorIcon className="h-4 w-4" />
                    <AlertDescription>{yamlError}</AlertDescription>
                  </Alert>
                )}
                <YAMLEditor value={yamlValue} onChange={handleYAMLChange} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
