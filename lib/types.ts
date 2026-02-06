export type PageWidth = 'default' | 'slim' | 'wide';
export type ColumnSize = 'small' | 'full';

export type WidgetType =
  | 'rss'
  | 'videos'
  | 'hacker-news'
  | 'reddit'
  | 'lobsters'
  | 'weather'
  | 'calendar'
  | 'markets'
  | 'clock'
  | 'search'
  | 'bookmarks'
  | 'todo'
  | 'monitor'
  | 'releases'
  | 'repository'
  | 'docker-containers'
  | 'server-stats'
  | 'dns-stats'
  | 'twitch-channels'
  | 'twitch-games'
  | 'custom-api'
  | 'extension'
  | 'change-detection'
  | 'iframe'
  | 'html'
  | 'group'
  | 'split-column';

export interface Widget {
  id: string; // Internal React key (not in YAML)
  type: WidgetType;
  title?: string;
  'title-url'?: string;
  'hide-header'?: boolean;
  cache?: string;
  'css-class'?: string;
  properties: Record<string, any>; // Type-specific properties as object
}

export interface Column {
  id: string; // Internal React key (not in YAML)
  size: ColumnSize;
  widgets: Widget[];
}

export interface Page {
  id: string; // Internal React key (not in YAML)
  name: string;
  slug?: string;
  width?: PageWidth;
  'center-vertically'?: boolean;
  'hide-desktop-navigation'?: boolean;
  'show-mobile-header'?: boolean;
  columns: Column[];
}

export interface GlanceConfig {
  pages: Page[];
  // Future: theme, branding, server config
}

// YAML export types (without internal IDs)
export interface WidgetYAML extends Omit<Widget, 'id' | 'properties'> {
  [key: string]: any; // Type-specific properties spread at root level
}

export interface ColumnYAML {
  size: ColumnSize;
  widgets?: WidgetYAML[];
}

export interface PageYAML extends Omit<Page, 'id' | 'columns'> {
  columns: ColumnYAML[];
}

export interface GlanceConfigYAML {
  pages: PageYAML[];
  [key: string]: any; // Allow other config like theme, branding
}
