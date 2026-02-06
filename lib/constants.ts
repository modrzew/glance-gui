import type { WidgetType, PageWidth, ColumnSize } from './types';

export const WIDGET_TYPES: { value: WidgetType; label: string; category: string }[] = [
  // Feed widgets
  { value: 'rss', label: 'RSS Feed', category: 'Feeds' },
  { value: 'videos', label: 'Videos (YouTube)', category: 'Feeds' },
  { value: 'hacker-news', label: 'Hacker News', category: 'Feeds' },
  { value: 'reddit', label: 'Reddit', category: 'Feeds' },
  { value: 'lobsters', label: 'Lobsters', category: 'Feeds' },
  { value: 'releases', label: 'Releases (GitHub)', category: 'Feeds' },

  // Information widgets
  { value: 'weather', label: 'Weather', category: 'Information' },
  { value: 'calendar', label: 'Calendar', category: 'Information' },
  { value: 'markets', label: 'Markets (Stocks)', category: 'Information' },
  { value: 'clock', label: 'Clock', category: 'Information' },

  // Productivity widgets
  { value: 'search', label: 'Search', category: 'Productivity' },
  { value: 'bookmarks', label: 'Bookmarks', category: 'Productivity' },
  { value: 'todo', label: 'Todo List', category: 'Productivity' },

  // Monitoring widgets
  { value: 'monitor', label: 'Monitor (Sites)', category: 'Monitoring' },
  { value: 'repository', label: 'Repository (GitHub)', category: 'Monitoring' },
  { value: 'docker-containers', label: 'Docker Containers', category: 'Monitoring' },
  { value: 'server-stats', label: 'Server Stats', category: 'Monitoring' },
  { value: 'dns-stats', label: 'DNS Stats', category: 'Monitoring' },
  { value: 'change-detection', label: 'Change Detection', category: 'Monitoring' },

  // Streaming widgets
  { value: 'twitch-channels', label: 'Twitch Channels', category: 'Streaming' },
  { value: 'twitch-games', label: 'Twitch Games', category: 'Streaming' },

  // Custom widgets
  { value: 'custom-api', label: 'Custom API', category: 'Custom' },
  { value: 'extension', label: 'Extension', category: 'Custom' },
  { value: 'iframe', label: 'IFrame', category: 'Custom' },
  { value: 'html', label: 'HTML', category: 'Custom' },

  // Layout widgets
  { value: 'group', label: 'Group (Tabs)', category: 'Layout' },
  { value: 'split-column', label: 'Split Column', category: 'Layout' },
];

export const PAGE_WIDTHS: { value: PageWidth; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'slim', label: 'Slim' },
  { value: 'wide', label: 'Wide' },
];

export const COLUMN_SIZES: { value: ColumnSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'full', label: 'Full' },
];

// Valid column layout patterns
export const VALID_COLUMN_LAYOUTS = [
  ['full'],
  ['small', 'full'],
  ['full', 'small'],
  ['small', 'full', 'small'],
  ['full', 'full'],
] as const;
