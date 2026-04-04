'use client';

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  tasksCompleted: number;
  lastActive: string;
  avatar: string;
}

const agents: Agent[] = [
  { id: '1', name: 'ContractAuditor', role: 'Smart Contract Security', status: 'active', tasksCompleted: 142, lastActive: 'Just now', avatar: 'CA' },
  { id: '2', name: 'CodeArchitect', role: 'System Design & Architecture', status: 'active', tasksCompleted: 89, lastActive: '2m ago', avatar: 'CA' },
  { id: '3', name: 'DeployBot', role: 'CI/CD & Deployment', status: 'idle', tasksCompleted: 256, lastActive: '15m ago', avatar: 'DB' },
  { id: '4', name: 'DataAnalyst', role: 'Analytics & Reporting', status: 'active', tasksCompleted: 67, lastActive: '5m ago', avatar: 'DA' },
  { id: '5', name: 'TokenMigrator', role: 'ERC-20 Migration Specialist', status: 'error', tasksCompleted: 34, lastActive: '1h ago', avatar: 'TM' },
  { id: '6', name: 'DocWriter', role: 'Documentation Generation', status: 'idle', tasksCompleted: 198, lastActive: '30m ago', avatar: 'DW' },
];

const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
  active: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  idle: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  error: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

export function GodModeAgentList() {
  const [filter, setFilter] = useState<string>('all');

  const filteredAgents = filter === 'all' ? agents : agents.filter((a) => a.status === filter);

  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Agents</h3>
        <div className="flex items-center gap-2">
          {['all', 'active', 'idle', 'error'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded transition-all ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:border-indigo-500/30 cursor-pointer ${
              statusStyles[agent.status].bg
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">{agent.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{agent.name}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${statusStyles[agent.status].dot}`} />
              </div>
              <div className="text-xs text-slate-400">{agent.role}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-slate-300">{agent.tasksCompleted} tasks</div>
              <div className="text-[10px] text-slate-500">{agent.lastActive}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
