interface ActivityItem {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  time: string;
  source: string;
}

const activities: ActivityItem[] = [
  { id: 1, type: 'success', message: 'GodMode AI model updated to v2.4.1', time: '2m ago', source: 'GodMode' },
  { id: 2, type: 'info', message: 'Project "TokenV2" deployment completed', time: '15m ago', source: 'Projects' },
  { id: 3, type: 'warning', message: 'API rate limit at 78% capacity', time: '32m ago', source: 'System' },
  { id: 4, type: 'success', message: 'New agent "ContractAuditor" initialized', time: '1h ago', source: 'GodMode' },
  { id: 5, type: 'info', message: 'Backup completed for all projects', time: '2h ago', source: 'System' },
  { id: 6, type: 'error', message: 'Connection timeout on proxy endpoint', time: '3h ago', source: 'Network' },
  { id: 7, type: 'success', message: 'ERC-20 migration script validated', time: '4h ago', source: 'Contracts' },
];

const typeStyles: Record<string, { dot: string; badge: string }> = {
  info: { dot: 'bg-blue-400', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  success: { dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  warning: { dot: 'bg-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  error: { dot: 'bg-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export function NexusActivityFeed() {
  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Activity Feed</h3>
        <span className="text-xs text-slate-500">{activities.length} events</span>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${typeStyles[item.type].dot} mt-1.5`} />
              {item.id < activities.length && (
                <div className="w-px h-full bg-slate-700/50 mt-2 flex-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${typeStyles[item.type].badge}`}>
                  {item.source}
                </span>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
