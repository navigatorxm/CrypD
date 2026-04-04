'use client';

import dynamic from 'next/dynamic';
import { useUIStore } from '@/store';
import { useEffect } from 'react';

const Terminal = dynamic(
  () => import('@/components/terminal/Terminal').then((m) => ({ default: m.Terminal })),
  { ssr: false, loading: () => <div className="flex-1 bg-[#0a0a0a]" /> }
);

export default function TerminalPage() {
  const { setTerminalOpen } = useUIStore();

  // Hide bottom terminal when on this page (full-page terminal)
  useEffect(() => {
    setTerminalOpen(false);
    return () => setTerminalOpen(true);
  }, [setTerminalOpen]);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3rem)' }}>
      <div className="px-5 py-3 border-b border-[#1f1f1f] flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Terminal</h1>
          <p className="text-xs text-[#555]">Full bash/python/node shell — run anything</p>
        </div>
        <div className="ml-auto text-xs text-[#444] font-mono">
          ws://localhost:3001
        </div>
      </div>

      <div className="flex-1 bg-[#0a0a0a] p-2">
        <Terminal />
      </div>

      <div className="px-5 py-2 border-t border-[#1f1f1f] text-[10px] text-[#333]">
        Start WebSocket server: <span className="font-mono text-[#555]">node server.js</span> · Then refresh this page
      </div>
    </div>
  );
}
