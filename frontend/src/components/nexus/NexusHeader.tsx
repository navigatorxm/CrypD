'use client';

import { useState, useEffect } from 'react';

export function NexusHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#0a0a1a]/80 border-b border-indigo-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">NEXUS-01 Control Center</h1>
        <div className="h-4 w-px bg-indigo-500/30" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs text-slate-400 font-mono">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-indigo-500/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">OP</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-white font-medium">Operator</div>
              <div className="text-[10px] text-indigo-400">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
