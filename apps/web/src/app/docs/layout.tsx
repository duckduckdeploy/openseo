import type { ReactNode } from 'react';
import { DocsNav } from '@/components/docs-nav';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page grid grid-cols-1 gap-10 py-16 md:py-24 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
      <aside className="min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:rounded-lg lg:border lg:border-line lg:bg-surface lg:p-3 lg:shadow-hard-sm">
        <DocsNav />
      </aside>
      {children}
    </div>
  );
}
