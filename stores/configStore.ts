import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GlanceConfig, Page, Column, Widget, ColumnSize, WidgetType } from '@/lib/types';
import { parseYAMLToConfig, configToYAML } from '@/lib/yamlUtils';

interface ConfigStore {
  config: GlanceConfig;
  selectedPageId: string | null;

  // Config operations
  loadFromYAML: (yamlString: string) => void;
  exportToYAML: () => string;
  resetConfig: () => void;

  // Page operations
  addPage: (name: string) => string;
  updatePage: (pageId: string, updates: Partial<Omit<Page, 'id' | 'columns'>>) => void;
  deletePage: (pageId: string) => void;
  reorderPages: (startIndex: number, endIndex: number) => void;
  selectPage: (pageId: string | null) => void;

  // Column operations
  addColumn: (pageId: string, size: ColumnSize) => string;
  updateColumn: (pageId: string, columnId: string, size: ColumnSize) => void;
  deleteColumn: (pageId: string, columnId: string) => void;
  reorderColumns: (pageId: string, startIndex: number, endIndex: number) => void;

  // Widget operations
  addWidget: (pageId: string, columnId: string, type: WidgetType) => string;
  updateWidget: (pageId: string, columnId: string, widgetId: string, updates: Partial<Omit<Widget, 'id'>>) => void;
  deleteWidget: (pageId: string, columnId: string, widgetId: string) => void;
  moveWidget: (
    sourcePageId: string,
    sourceColumnId: string,
    sourceIndex: number,
    destPageId: string,
    destColumnId: string,
    destIndex: number
  ) => void;
  reorderWidgets: (pageId: string, columnId: string, startIndex: number, endIndex: number) => void;

  // Helper methods
  getPage: (pageId: string) => Page | undefined;
  getColumn: (pageId: string, columnId: string) => Column | undefined;
  getWidget: (pageId: string, columnId: string, widgetId: string) => Widget | undefined;
}

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const emptyConfig: GlanceConfig = {
  pages: [],
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: emptyConfig,
      selectedPageId: null,

  // Config operations
  loadFromYAML: (yamlString: string) => {
    const config = parseYAMLToConfig(yamlString);
    set({
      config,
      selectedPageId: config.pages.length > 0 ? config.pages[0].id : null,
    });
  },

  exportToYAML: () => {
    return configToYAML(get().config);
  },

  resetConfig: () => {
    set({ config: emptyConfig, selectedPageId: null });
  },

  // Page operations
  addPage: (name: string) => {
    const id = generateId();
    set((state) => ({
      config: {
        ...state.config,
        pages: [
          ...state.config.pages,
          {
            id,
            name,
            columns: [],
          },
        ],
      },
      selectedPageId: id,
    }));
    return id;
  },

  updatePage: (pageId: string, updates: Partial<Omit<Page, 'id' | 'columns'>>) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId ? { ...page, ...updates } : page
        ),
      },
    }));
  },

  deletePage: (pageId: string) => {
    set((state) => {
      const newPages = state.config.pages.filter((page) => page.id !== pageId);
      return {
        config: {
          ...state.config,
          pages: newPages,
        },
        selectedPageId:
          state.selectedPageId === pageId
            ? newPages.length > 0
              ? newPages[0].id
              : null
            : state.selectedPageId,
      };
    });
  },

  reorderPages: (startIndex: number, endIndex: number) => {
    set((state) => {
      const pages = [...state.config.pages];
      const [removed] = pages.splice(startIndex, 1);
      pages.splice(endIndex, 0, removed);
      return {
        config: {
          ...state.config,
          pages,
        },
      };
    });
  },

  selectPage: (pageId: string | null) => {
    set({ selectedPageId: pageId });
  },

  // Column operations
  addColumn: (pageId: string, size: ColumnSize) => {
    const id = generateId();
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: [...page.columns, { id, size, widgets: [] }],
              }
            : page
        ),
      },
    }));
    return id;
  },

  updateColumn: (pageId: string, columnId: string, size: ColumnSize) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.map((column) =>
                  column.id === columnId ? { ...column, size } : column
                ),
              }
            : page
        ),
      },
    }));
  },

  deleteColumn: (pageId: string, columnId: string) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.filter((column) => column.id !== columnId),
              }
            : page
        ),
      },
    }));
  },

  reorderColumns: (pageId: string, startIndex: number, endIndex: number) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) => {
          if (page.id !== pageId) return page;
          const columns = [...page.columns];
          const [removed] = columns.splice(startIndex, 1);
          columns.splice(endIndex, 0, removed);
          return { ...page, columns };
        }),
      },
    }));
  },

  // Widget operations
  addWidget: (pageId: string, columnId: string, type: WidgetType) => {
    const id = generateId();
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        widgets: [...column.widgets, { id, type, properties: {} }],
                      }
                    : column
                ),
              }
            : page
        ),
      },
    }));
    return id;
  },

  updateWidget: (pageId: string, columnId: string, widgetId: string, updates: Partial<Omit<Widget, 'id'>>) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        widgets: column.widgets.map((widget) =>
                          widget.id === widgetId ? { ...widget, ...updates } : widget
                        ),
                      }
                    : column
                ),
              }
            : page
        ),
      },
    }));
  },

  deleteWidget: (pageId: string, columnId: string, widgetId: string) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        widgets: column.widgets.filter((widget) => widget.id !== widgetId),
                      }
                    : column
                ),
              }
            : page
        ),
      },
    }));
  },

  moveWidget: (
    sourcePageId: string,
    sourceColumnId: string,
    sourceIndex: number,
    destPageId: string,
    destColumnId: string,
    destIndex: number
  ) => {
    set((state) => {
      const config = { ...state.config };

      // Find source and destination
      const sourcePage = config.pages.find((p) => p.id === sourcePageId);
      const sourceColumn = sourcePage?.columns.find((c) => c.id === sourceColumnId);
      const destPage = config.pages.find((p) => p.id === destPageId);
      const destColumn = destPage?.columns.find((c) => c.id === destColumnId);

      if (!sourceColumn || !destColumn) return state;

      // Remove from source
      const [widget] = sourceColumn.widgets.splice(sourceIndex, 1);

      // Add to destination
      destColumn.widgets.splice(destIndex, 0, widget);

      return { config };
    });
  },

  reorderWidgets: (pageId: string, columnId: string, startIndex: number, endIndex: number) => {
    set((state) => ({
      config: {
        ...state.config,
        pages: state.config.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                columns: page.columns.map((column) => {
                  if (column.id !== columnId) return column;
                  const widgets = [...column.widgets];
                  const [removed] = widgets.splice(startIndex, 1);
                  widgets.splice(endIndex, 0, removed);
                  return { ...column, widgets };
                }),
              }
            : page
        ),
      },
    }));
  },

  // Helper methods
  getPage: (pageId: string) => {
    return get().config.pages.find((page) => page.id === pageId);
  },

  getColumn: (pageId: string, columnId: string) => {
    const page = get().getPage(pageId);
    return page?.columns.find((column) => column.id === columnId);
  },

  getWidget: (pageId: string, columnId: string, widgetId: string) => {
    const column = get().getColumn(pageId, columnId);
    return column?.widgets.find((widget) => widget.id === widgetId);
  },
    }),
    {
      name: 'glance-gui-storage',
      version: 1,
    }
  )
);
