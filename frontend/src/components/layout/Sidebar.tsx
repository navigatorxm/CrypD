'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

interface NavItem { href: string; label: string; icon: string; badge?: string; }

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '⊞' },
      { href: '/admin/transactions', label: 'Transactions', icon: '◈' },
    ],
  },
  {
    section: 'IDE',
    items: [
      { href: '/admin/editor', label: 'Code Editor', icon: '⌨', badge: 'IDE' },
    ],
  },
  {
    section: 'Deploy',
    items: [
      { href: '/admin/deploy', label: 'Contract Deployer', icon: '⬆' },
      { href: '/admin/tokens', label: 'Token Factory', icon: '◎' },
      { href: '/admin/nft', label: 'NFT Studio', icon: '◈' },
    ],
  },
  {
    section: 'Manage',
    items: [
      { href: '/admin/contracts', label: 'My Contracts', icon: '⬡' },
    ],
  },
  {
    section: 'Tools',
    items: [
      { href: '/admin/terminal', label: 'Terminal', icon: '$', badge: 'NEW' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#0d0d0d] border-r border-[#1f1f1f] transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-12 border-b border-[#1f1f1f] flex-shrink-0">
        <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">U</div>
        {!sidebarCollapsed && (
          <span className="font-bold text-white text-sm tracking-wide">U-OS</span>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto text-[#555] hover:text-white transition-colors text-xs"
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {NAV.map((group) => (
          <div key={group.section} className="mb-2">
            {!sidebarCollapsed && (
              <div className="px-4 py-1.5 text-[10px] font-semibold text-[#444] uppercase tracking-widest">
                {group.section}
              </div>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 mx-2 px-2 py-2 rounded text-sm transition-all',
                    active
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30'
                      : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                  )}
                >
                  <span className="flex-shrink-0 w-5 text-center font-mono">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-600/30 text-indigo-400 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#1f1f1f] p-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-2 rounded text-[#555] hover:text-white hover:bg-[#1a1a1a] text-sm transition-all"
          title={sidebarCollapsed ? 'Landing Page' : undefined}
        >
          <span className="flex-shrink-0 w-5 text-center">⌂</span>
          {!sidebarCollapsed && <span>Landing Page</span>}
        </Link>
      </div>
    </aside>
  );
}
