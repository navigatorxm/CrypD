'use client';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'building' | 'deployed';
  type: string;
  lastUpdated: string;
  cpu: number;
  memory: number;
  port: number;
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
}

const statusStyles: Record<string, { badge: string; dot: string }> = {
  running: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  stopped: { badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' },
  building: { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400 animate-pulse' },
  deployed: { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400' },
};

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="card-dark rounded-lg border border-indigo-500/20 p-4 flex items-center gap-4 transition-all duration-200 hover:border-indigo-500/40">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{project.name.substring(0, 2).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{project.name}</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full border ${statusStyles[project.status].badge}`}>
              {project.status}
            </span>
          </div>
          <div className="text-xs text-slate-400 truncate">{project.description}</div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="font-mono">{project.type}</span>
          <span>:{project.port}</span>
          <span>{project.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5 transition-all duration-200 hover:border-indigo-500/40 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{project.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{project.name}</h4>
            <span className="text-[10px] text-slate-500">{project.type}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full border flex items-center gap-1 ${statusStyles[project.status].badge}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${statusStyles[project.status].dot}`} />
          {project.status}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{project.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xs font-mono text-white">{project.cpu}%</div>
          <div className="text-[10px] text-slate-500">CPU</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-white">{project.memory}MB</div>
          <div className="text-[10px] text-slate-500">RAM</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-white">:{project.port}</div>
          <div className="text-[10px] text-slate-500">PORT</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-[10px] bg-white/5 text-slate-400 rounded-full border border-white/5">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[10px] text-slate-500">Updated {project.lastUpdated}</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors rounded hover:bg-white/5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
