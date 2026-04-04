'use client';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    id: 'deploy',
    label: 'Deploy Contract',
    description: 'Deploy a new smart contract',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'new-project',
    label: 'New Project',
    description: 'Create a new project workspace',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'ai-task',
    label: 'AI Task',
    description: 'Assign a task to GodMode AI',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'audit',
    label: 'Audit Contracts',
    description: 'Run security audit on contracts',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'from-amber-500 to-amber-600',
  },
];

export function NexusQuickActions() {
  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="group flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-200 text-left"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white`}>
              {action.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                {action.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
