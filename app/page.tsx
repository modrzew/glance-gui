'use client';

import { Header } from '@/components/layout/Header';
import { PageListSidebar } from '@/components/layout/PageListSidebar';
import { ColumnLayout } from '@/components/columns/ColumnLayout';
import { useConfigStore } from '@/stores/configStore';

export default function Home() {
  const { config, selectedPageId } = useConfigStore();
  const selectedPage = config.pages.find(p => p.id === selectedPageId);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <PageListSidebar />
        <main className="flex-1 overflow-auto p-6">
          {!selectedPage ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">No Page Selected</h2>
                <p className="text-muted-foreground">
                  {config.pages.length === 0
                    ? 'Create a page to get started'
                    : 'Select a page from the sidebar'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold">{selectedPage.name}</h2>
                {selectedPage.slug && (
                  <p className="text-sm text-muted-foreground">/{selectedPage.slug}</p>
                )}
              </div>

              <ColumnLayout pageId={selectedPage.id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
