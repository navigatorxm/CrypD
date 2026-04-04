'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/deploy', label: 'Deploy Contract', icon: '🚀' },
  { href: '/admin/contracts', label: 'Interact', icon: '⚡' },
  { href: '/admin/transactions', label: 'Transactions', icon: '📋' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-indigo-500/20 bg-[#07071a]/80 pt-6 fixed left-0 top-16 bottom-0">
        <div className="px-4 mb-6">
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Admin</div>
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all',
                pathname === item.href
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Status */}
        <div className="mt-auto px-4 pb-6">
          <div className="card-dark rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-slate-400">{isConnected ? 'Connected' : 'Not Connected'}</span>
            </div>
            {!isConnected && (
              <p className="text-slate-600">Connect wallet to use admin features</p>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-indigo-500/20 bg-[#050510]/95 flex">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center py-3 text-xs gap-1',
              pathname === item.href ? 'text-indigo-400' : 'text-slate-600'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pb-24 lg:pb-8">{children}</main>
    </div>
  );
}
