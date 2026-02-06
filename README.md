# Glance GUI

A web-based configuration manager for [Glance](https://github.com/glanceapp/glance) dashboard. This tool lets you create and edit Glance configurations visually instead of writing YAML by hand.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- Visual page management with column layouts
- Support for all 26+ Glance widget types with pre-filled templates
- Monaco editor for widget-specific YAML properties
- Import existing configurations and export to `glance.yml`
- Layout validation to prevent invalid column configurations
- Local storage persistence

## Installation

Requirements:
- Node.js 20 or higher
- npm, pnpm, or yarn

```bash
git clone <repository-url>
cd glance-gui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing with an Example

You can import the official Glance example configuration to see how it works:

1. Click Import in the header
2. Select `glance/docs/glance.yml` from this repository
3. Browse the imported pages, columns, and widgets
4. Make changes and export when done

## Usage

### Creating a Configuration

1. Add a page using the + button in the sidebar
2. Configure page settings (name, width, display options)
3. Add columns to the page using the layout builder
4. Add widgets to each column
5. Edit widget properties and type-specific configuration
6. Export the configuration as `glance.yml`

### Column Layout Rules

Glance has specific requirements for column layouts:
- One column: `[full]`
- Two columns: `[small, full]`, `[full, small]`, or `[full, full]`
- Three columns: `[small, full, small]`

Slim pages can have at most 2 columns.

## Supported Widget Types

**Feeds**: RSS, Videos (YouTube), Hacker News, Reddit, Lobsters, Releases (GitHub)

**Information**: Weather, Calendar, Markets, Clock

**Productivity**: Search, Bookmarks, Todo List

**Monitoring**: Monitor (Sites), Repository, Docker Containers, Server Stats, DNS Stats, Change Detection

**Streaming**: Twitch Channels, Twitch Games

**Custom**: Custom API, Extension, IFrame, HTML

**Layout**: Group (Tabs), Split Column

## Project Structure

```
glance-gui/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── layout/      # Header, sidebar
│   ├── pages/       # Page management
│   ├── columns/     # Column layout
│   ├── widgets/     # Widget components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities and types
├── stores/          # Zustand state management
└── hooks/           # Custom React hooks
```

## Technology Stack

- Next.js 16 with Turbopack
- TypeScript 5
- Tailwind CSS v4
- Zustand for state management
- shadcn/ui components
- js-yaml for YAML parsing
- Monaco Editor for code editing
- lucide-react icons

## Known Limitations

- YAML comments are not preserved during import/export
- Only validates YAML syntax, not widget-specific schemas
- Theme and branding settings are not included
- Widget drag-and-drop reordering is not implemented

## Development

```bash
npm run dev        # Start development server
npm run build      # Production build
npm start          # Start production server
npx tsc --noEmit   # Type checking
npm run lint       # Linting
```

## Documentation

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for implementation details and architecture decisions.

## Contributing

This is a configuration tool for Glance. For the main Glance project, visit [glanceapp/glance](https://github.com/glanceapp/glance).

## License

MIT License - See LICENSE file for details

---

**Note**: The code in this repository was generated with assistance from AI (Claude).
