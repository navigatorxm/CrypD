'use client';

import { useState } from 'react';
import { GodModeControlPanel } from '@/components/nexus/GodModeControlPanel';
import { GodModeAgentList } from '@/components/nexus/GodModeAgentList';
import { GodModeTerminal } from '@/components/nexus/GodModeTerminal';
import { GodModeModelSelector } from '@/components/nexus/GodModeModelSelector';

export default function GodModePage() {
  const [godModeActive, setGodModeActive] = useState(true);
  const [selectedModel, setSelectedModel] = useState('nexus-omni-4.0');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">GodMode AI Co-pilot</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your AI agentic co-pilot and autonomous agents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGodModeActive(!godModeActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              godModeActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${godModeActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {godModeActive ? 'GodMode Active' : 'GodMode Inactive'}
          </button>
        </div>
      </div>

      <GodModeControlPanel
        active={godModeActive}
        model={selectedModel}
        temperature={temperature}
        maxTokens={maxTokens}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GodModeAgentList />
        <div className="space-y-6">
          <GodModeModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
          <GodModeTerminal />
        </div>
      </div>
    </div>
  );
}
