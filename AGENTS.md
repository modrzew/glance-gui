# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Glance GUI is a visual configuration manager for the Glance dashboard. It allows users to create and edit Glance configurations through a web interface instead of manually writing YAML files. The application manages a hierarchy of Pages → Columns → Widgets with strict validation rules.

## Development Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm start          # Start production server
npx tsc --noEmit   # Type checking only (no build artifacts)
npm run lint       # Run ESLint
```

## Core Architecture

### State Management Pattern

The application uses a **single Zustand store** (`stores/configStore.ts`) with Zustand persist middleware for automatic localStorage persistence. All state mutations go through this store - never mutate state directly in components.

**Key store operations:**
- Config-level: `loadFromYAML()`, `exportToYAML()`, `resetConfig()`
- Page operations: `addPage()`, `updatePage()`, `deletePage()`, `selectPage()`
- Column operations: `addColumn()`, `updateColumn()`, `deleteColumn()`
- Widget operations: `addWidget()`, `updateWidget()`, `deleteWidget()`, `moveWidget()`, `reorderWidgets()`

The store persists to localStorage under key `glance-gui-storage`.

### Internal IDs vs YAML Export

**Critical architectural pattern:** The application maintains internal React IDs separate from YAML:

- **Internal model** (in store): `Page`, `Column`, `Widget` all have `id: string` fields for React keys
- **YAML export model**: `PageYAML`, `ColumnYAML`, `WidgetYAML` types strip out IDs
- **Conversion functions** in `lib/yamlUtils.ts`:
  - `parseYAMLToConfig()` - adds generated IDs when importing
  - `configToYAML()` - removes IDs when exporting

Widget properties are stored as `properties: Record<string, any>` internally but spread at root level in YAML export.

### Column Layout Validation

Glance enforces strict column layout rules defined in `lib/constants.ts`:

```typescript
VALID_COLUMN_LAYOUTS = [
  ['full'],
  ['small', 'full'],
  ['full', 'small'],
  ['small', 'full', 'small'],
  ['full', 'full']
]
```

**Additional constraints:**
- Slim pages: max 2 columns
- All pages: max 3 columns
- Must have at least 1 column

Validation logic is in `lib/validation.ts`. Use `useColumnValidation` hook in components to get real-time validation feedback.

### Drag-and-Drop Implementation

Widget drag-and-drop uses `@dnd-kit`:

- `ColumnLayout.tsx` wraps everything in `DndContext`
- `ColumnDropZone.tsx` uses `useDroppable` and `SortableContext`
- `WidgetCard.tsx` uses `useSortable` with grip handle
- IDs are prefixed: `column-{columnId}` and `widget-{widgetId}`
- Drag handlers parse these prefixes to determine source/destination

### Widget Template System

All 26+ widget types are defined in `lib/widgetTemplates.ts`:

- `WIDGET_TYPES` - metadata array with value, label, category
- `WIDGET_TEMPLATES` - pre-filled YAML templates for each type
- `WIDGET_DESCRIPTIONS` - user-facing descriptions

When adding a new widget type:
1. Add to `WidgetType` union in `lib/types.ts`
2. Add entry to all three exports in `lib/widgetTemplates.ts`

## Component Organization

```
components/
├── layout/          # Header (import/export), PageListSidebar
├── pages/           # PageListItem, PageSettings dialog
├── columns/         # ColumnLayout, ColumnDropZone, ColumnSizeSelector, ColumnLayoutValidator
├── widgets/         # WidgetCard, WidgetEditor, WidgetTypeSelector, YAMLEditor, WidgetDragOverlay
├── config/          # ImportDialog, ExportDialog
└── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
```

**Data flow:** User interaction → Component calls store method → Store updates state → React re-renders

## UI Patterns

### Modal/Dialog Pattern
All modals use shadcn/ui Dialog with controlled `open` and `onOpenChange` props. Parent components manage open state.

### Icon Extraction
Icons are extracted to named components at top of file:
```typescript
const SettingsIcon = Settings;
const TrashIcon = Trash2;
```

### Confirmation Dialogs
Destructive actions (delete page/column/widget) use AlertDialog with explicit confirmation before calling store methods.

## Column Width Configuration

Small columns are `400px` fixed width, full columns use `1fr` (defined in `ColumnLayout.tsx` grid template). Adjust the `400px` value if widget content needs more/less space.

## Known Constraints

- YAML comments are not preserved (js-yaml limitation)
- Only validates YAML syntax, not widget-specific schemas
- Theme/branding/server config is not managed by this tool
- Widget properties validation happens in Glance backend, not here

## Testing Workflow

Import the example config to test:
1. Click Import in header
2. Select `glance/docs/glance.yml` from this repo
3. Verify pages, columns, widgets render correctly
4. Test drag-and-drop, editing, exporting
