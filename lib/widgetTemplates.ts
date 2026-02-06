import type { WidgetType } from './types';

// Widget type metadata
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

// Widget templates with example YAML for type-specific properties
export const WIDGET_TEMPLATES: Record<WidgetType, string> = {
  'rss': `feeds:
  - url: https://example.com/rss.xml
    title: Example Feed
limit: 10
collapse-after: 3`,

  'videos': `channels:
  - UCXuqSBlHAE6Xw-yeJA0Tunw # Channel ID
limit: 25
collapse-after: 5`,

  'hacker-news': `limit: 15
collapse-after: 5
comments-url-template: https://news.ycombinator.com/item?id={POST-ID}`,

  'reddit': `subreddit: technology
limit: 15
collapse-after: 5
show-thumbnails: true
comments-url-template: https://reddit.com{POST-PATH}`,

  'lobsters': `limit: 15
collapse-after: 5
comments-url-template: https://lobste.rs/s/{POST-ID}`,

  'weather': `location: London, United Kingdom
units: metric # or imperial
hour-format: 24h # or 12h
hide-location: false`,

  'calendar': `first-day-of-week: monday # or sunday`,

  'markets': `markets:
  - symbol: SPY
    name: S&P 500
  - symbol: BTC-USD
    name: Bitcoin
sort-by: absolute-change # or change, name
display-mode: percentage # or value
display-currency: USD`,

  'clock': `hour-format: 24h # or 12h
timezones:
  - timezone: Europe/London
    label: London
  - timezone: America/New_York
    label: New York`,

  'search': `bangs:
  - title: Google
    shortcut: g
    url: https://www.google.com/search?q={QUERY}
  - title: YouTube
    shortcut: yt
    url: https://www.youtube.com/results?search_query={QUERY}`,

  'bookmarks': `groups:
  - title: General
    links:
      - title: Example
        url: https://example.com
        icon: https://example.com/favicon.ico`,

  'todo': `tasks:
  - title: Example task
    done: false`,

  'monitor': `cache: 5m
sites:
  - title: Example Site
    url: https://example.com
    icon: https://example.com/favicon.ico
    max-response-time: 500
    allow-insecure-certificate: false`,

  'releases': `repositories:
  - glanceapp/glance
  - go-gitea/gitea
limit: 10
token: "" # Optional GitHub token for higher rate limits`,

  'repository': `repository: glanceapp/glance
token: "" # Optional GitHub token
pull-requests-limit: 5
issues-limit: 5`,

  'docker-containers': `urls:
  - http://localhost:2375
limit: 10
show-stopped: true
collapse-after: 5`,

  'server-stats': `interval: 1s # Update interval
use-si-units: false
widgets:
  cpu:
    show: true
  memory:
    show: true
  network:
    show: true
  disk:
    show: true`,

  'dns-stats': `server: 127.0.0.1:53
interval: 1s`,

  'twitch-channels': `channels:
  - theprimeagen
  - j_blow
sort-by: viewers # or title
collapse-after: 5`,

  'twitch-games': `channels:
  - theprimeagen
  - j_blow
sort-by: viewers # or title
collapse-after: 5`,

  'custom-api': `url: https://api.example.com/data
interval: 5m
request-timeout: 10s
allow-insecure-certificate: false
items-path: data.items
field-mappings:
  title: title
  url: url
  time: published_at
limit: 10
collapse-after: 5`,

  'extension': `name: example-extension
parameters:
  param1: value1`,

  'change-detection': `token: "" # API token from changedetection.io
instance-url: https://changedetection.io
watches:
  - uuid: 00000000-0000-0000-0000-000000000000
limit: 10
collapse-after: 5`,

  'iframe': `source: https://example.com
height: 500`,

  'html': `content: |
  <div>
    <h2>Example HTML Content</h2>
    <p>Put your HTML here</p>
  </div>`,

  'group': `widgets:
  - type: hacker-news
  - type: reddit
    subreddit: technology`,

  'split-column': `left:
  - type: weather
    location: London, United Kingdom
right:
  - type: clock`,
};

// Widget descriptions for tooltips/help
export const WIDGET_DESCRIPTIONS: Record<WidgetType, string> = {
  'rss': 'Display RSS feed items with collapsible sections',
  'videos': 'Show latest videos from YouTube channels',
  'hacker-news': 'Display posts from Hacker News',
  'reddit': 'Show posts from a subreddit',
  'lobsters': 'Display posts from Lobste.rs',
  'weather': 'Current weather and forecast',
  'calendar': 'Month view calendar',
  'markets': 'Stock and crypto market prices',
  'clock': 'Show current time in multiple timezones',
  'search': 'Search bar with custom bangs',
  'bookmarks': 'Organized bookmark links',
  'todo': 'Simple todo list',
  'monitor': 'Monitor website uptime and response times',
  'releases': 'Latest GitHub repository releases',
  'repository': 'GitHub repository info, PRs, and issues',
  'docker-containers': 'Monitor Docker containers',
  'server-stats': 'CPU, memory, network, and disk usage',
  'dns-stats': 'DNS query statistics',
  'twitch-channels': 'Live Twitch channels',
  'twitch-games': 'Top games on Twitch',
  'custom-api': 'Fetch data from custom API endpoints',
  'extension': 'Custom extension widget',
  'change-detection': 'Monitor website changes',
  'iframe': 'Embed external content via iframe',
  'html': 'Display custom HTML content',
  'group': 'Create tabbed interface with multiple widgets',
  'split-column': 'Side-by-side layout with two widget sections',
};
