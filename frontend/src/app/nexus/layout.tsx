'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexusSidebar } from '@/components/nexus/NexusSidebar';
import { NexusHeader } from '@/components/nexus/NexusHeader';

export default function NexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-[#050510] overflow-hidden">
      <NexusSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePath={pathname}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <NexusHeader />
        <main className="flex-1 overflow-y-auto p-6 grid-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
