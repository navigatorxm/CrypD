'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/nexus/ProjectCard';
import { ProjectFilters } from '@/components/nexus/ProjectFilters';

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

const projects: Project[] = [
  { id: '1', name: 'TokenV2', description: 'ERC-20 token upgrade with governance features', status: 'running', type: 'Smart Contract', lastUpdated: '2m ago', cpu: 12, memory: 256, port: 8545, tags: ['Solidity', 'ERC-20', 'DeFi'] },
  { id: '2', name: 'ProxyDeployer', description: 'Automated proxy deployment system', status: 'deployed', type: 'Infrastructure', lastUpdated: '15m ago', cpu: 5, memory: 128, port: 3000, tags: ['Proxy', 'Deployment'] },
  { id: '3', name: 'NEXUS-01', description: 'Navigator OS - AI Agentic Co-pilot platform', status: 'running', type: 'Full Stack', lastUpdated: 'Just now', cpu: 34, memory: 512, port: 3001, tags: ['Next.js', 'AI', 'Dashboard'] },
  { id: '4', name: 'ContractAuditor', description: 'Automated smart contract security auditing', status: 'building', type: 'AI Agent', lastUpdated: '5m ago', cpu: 67, memory: 1024, port: 8080, tags: ['Security', 'AI', 'Audit'] },
  { id: '5', name: 'DataPipeline', description: 'Real-time blockchain data processing pipeline', status: 'running', type: 'Backend', lastUpdated: '1h ago', cpu: 23, memory: 384, port: 5432, tags: ['ETL', 'Blockchain'] },
  { id: '6', name: 'FrontendApp', description: 'U-OS Token Platform frontend', status: 'stopped', type: 'Frontend', lastUpdated: '2d ago', cpu: 0, memory: 0, port: 3002, tags: ['React', 'UI'] },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor all running projects</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </button>
      </div>

      <ProjectFilters
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalProjects={filteredProjects.length}
      />

      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      }>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode={viewMode} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-400">No projects found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or create a new project</p>
        </div>
      )}
    </div>
  );
}
