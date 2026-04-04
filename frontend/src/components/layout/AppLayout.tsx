'use client';

import { useUIStore } from '@/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Terminal } from '@/components/terminal/Terminal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, terminalOpen, terminalHeight } = useUIStore();

  const mainPaddingLeft = sidebarCollapsed ? '3.5rem' : '13rem';

  return (
    <div className="min-h-screen bg-[#111] text-[#ccc]">
      <Sidebar />
      <Header />

      <main
        className="flex flex-col transition-all duration-200"
        style={{
          marginLeft: mainPaddingLeft,
          paddingTop: '3rem',
          minHeight: '100vh',
        }}
      >
        {/* Page content */}
        <div
          className="flex-1 overflow-auto"
          style={{ paddingBottom: terminalOpen ? terminalHeight + 'px' : '0' }}
        >
          {children}
        </div>
      </main>

      {/* Terminal panel */}
      {terminalOpen && (
        <div
          className="fixed bottom-0 right-0 z-20 bg-[#0a0a0a] border-t border-[#1f1f1f] flex flex-col transition-all duration-200"
          style={{ left: mainPaddingLeft, height: terminalHeight + 'px' }}
        >
          <Terminal />
        </div>
      )}
    </div>
  );
}
