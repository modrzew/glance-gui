import yaml from 'js-yaml';
import type {
  GlanceConfig,
  GlanceConfigYAML,
  Page,
  PageYAML,
  Column,
  ColumnYAML,
  Widget,
  WidgetYAML,
} from './types';

/**
 * Generate unique ID for internal use
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse YAML string to GlanceConfig (adds internal IDs)
 */
export function parseYAMLToConfig(yamlString: string): GlanceConfig {
  const parsed = yaml.load(yamlString) as GlanceConfigYAML;

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid YAML: expected an object');
  }

  if (!parsed.pages || !Array.isArray(parsed.pages)) {
    throw new Error('Invalid YAML: pages array is required');
  }

  const config: GlanceConfig = {
    pages: parsed.pages.map(parsePageFromYAML),
  };

  return config;
}

/**
 * Convert Page from YAML format to internal format (adds IDs)
 */
function parsePageFromYAML(pageYAML: PageYAML): Page {
  return {
    id: generateId(),
    name: pageYAML.name,
    slug: pageYAML.slug,
    width: pageYAML.width,
    'center-vertically': pageYAML['center-vertically'],
    'hide-desktop-navigation': pageYAML['hide-desktop-navigation'],
    'show-mobile-header': pageYAML['show-mobile-header'],
    columns: (pageYAML.columns || []).map(parseColumnFromYAML),
  };
}

/**
 * Convert Column from YAML format to internal format (adds IDs)
 */
function parseColumnFromYAML(columnYAML: ColumnYAML): Column {
  return {
    id: generateId(),
    size: columnYAML.size,
    widgets: (columnYAML.widgets || []).map(parseWidgetFromYAML),
  };
}

/**
 * Convert Widget from YAML format to internal format (adds IDs, extracts properties)
 */
function parseWidgetFromYAML(widgetYAML: WidgetYAML): Widget {
  const { type, title, 'title-url': titleUrl, 'hide-header': hideHeader, cache, 'css-class': cssClass, ...properties } = widgetYAML;

  return {
    id: generateId(),
    type,
    title,
    'title-url': titleUrl,
    'hide-header': hideHeader,
    cache,
    'css-class': cssClass,
    properties,
  };
}

/**
 * Convert GlanceConfig to YAML string (removes internal IDs)
 */
export function configToYAML(config: GlanceConfig): string {
  const configYAML: GlanceConfigYAML = {
    pages: config.pages.map(pageToYAML),
  };

  return yaml.dump(configYAML, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Convert Page to YAML format (removes IDs)
 */
function pageToYAML(page: Page): PageYAML {
  const pageYAML: PageYAML = {
    name: page.name,
    columns: page.columns.map(columnToYAML),
  };

  // Add optional properties only if they exist
  if (page.slug) pageYAML.slug = page.slug;
  if (page.width && page.width !== 'default') pageYAML.width = page.width;
  if (page['center-vertically']) pageYAML['center-vertically'] = page['center-vertically'];
  if (page['hide-desktop-navigation']) pageYAML['hide-desktop-navigation'] = page['hide-desktop-navigation'];
  if (page['show-mobile-header']) pageYAML['show-mobile-header'] = page['show-mobile-header'];

  return pageYAML;
}

/**
 * Convert Column to YAML format (removes IDs)
 */
function columnToYAML(column: Column): ColumnYAML {
  const columnYAML: ColumnYAML = {
    size: column.size,
  };

  if (column.widgets.length > 0) {
    columnYAML.widgets = column.widgets.map(widgetToYAML);
  }

  return columnYAML;
}

/**
 * Convert Widget to YAML format (removes IDs, spreads properties)
 */
function widgetToYAML(widget: Widget): WidgetYAML {
  const widgetYAML: WidgetYAML = {
    type: widget.type,
    ...widget.properties, // Spread type-specific properties
  };

  // Add shared properties only if they exist
  if (widget.title) widgetYAML.title = widget.title;
  if (widget['title-url']) widgetYAML['title-url'] = widget['title-url'];
  if (widget['hide-header']) widgetYAML['hide-header'] = widget['hide-header'];
  if (widget.cache) widgetYAML.cache = widget.cache;
  if (widget['css-class']) widgetYAML['css-class'] = widget['css-class'];

  return widgetYAML;
}

/**
 * Parse widget properties from YAML string
 */
export function parseWidgetPropertiesYAML(yamlString: string): Record<string, any> {
  if (!yamlString || yamlString.trim() === '') {
    return {};
  }

  try {
    const parsed = yaml.load(yamlString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Widget properties must be a YAML object');
    }
    return parsed as Record<string, any>;
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert widget properties object to YAML string
 */
export function widgetPropertiesToYAML(properties: Record<string, any>): string {
  if (!properties || Object.keys(properties).length === 0) {
    return '';
  }

  return yaml.dump(properties, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });
}
