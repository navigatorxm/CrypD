import { NexusStatCard } from '@/components/nexus/NexusStatCard';
import { NexusSystemMonitor } from '@/components/nexus/NexusSystemMonitor';
import { NexusActivityFeed } from '@/components/nexus/NexusActivityFeed';
import { NexusQuickActions } from '@/components/nexus/NexusQuickActions';

export default function NexusDashboard() {
  const stats = [
    {
      title: 'GodMode Status',
      value: 'Active',
      change: '+99.9% uptime',
      icon: 'brain',
      color: 'emerald',
    },
    {
      title: 'Active Projects',
      value: '12',
      change: '+3 this week',
      icon: 'folder',
      color: 'indigo',
    },
    {
      title: 'API Calls Today',
      value: '24.8K',
      change: '+12.5% vs yesterday',
      icon: 'chart',
      color: 'cyan',
    },
    {
      title: 'AI Tokens Used',
      value: '1.2M',
      change: '850K remaining',
      icon: 'zap',
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Welcome back, Operator. Here&apos;s your system status.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-indigo-300 font-medium">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <NexusStatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NexusSystemMonitor />
        </div>
        <div>
          <NexusActivityFeed />
        </div>
      </div>

      <NexusQuickActions />
    </div>
  );
}
