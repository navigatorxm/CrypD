'use client';

interface Model {
  id: string;
  name: string;
  version: string;
  description: string;
  speed: string;
  quality: string;
  contextWindow: string;
  recommended?: boolean;
}

const models: Model[] = [
  { id: 'nexus-omni-4.0', name: 'Nexus Omni', version: '4.0', description: 'Most capable model for complex tasks', speed: 'Fast', quality: 'Highest', contextWindow: '128K', recommended: true },
  { id: 'nexus-fast-3.5', name: 'Nexus Fast', version: '3.5', description: 'Optimized for speed and efficiency', speed: 'Fastest', quality: 'High', contextWindow: '64K' },
  { id: 'nexus-code-2.0', name: 'Nexus Code', version: '2.0', description: 'Specialized for code generation', speed: 'Fast', quality: 'Highest', contextWindow: '32K' },
  { id: 'nexus-lite-1.0', name: 'Nexus Lite', version: '1.0', description: 'Lightweight model for simple tasks', speed: 'Fastest', quality: 'Medium', contextWindow: '16K' },
];

interface GodModeModelSelectorProps {
  selectedModel: string;
  onSelectModel: (id: string) => void;
}

export function GodModeModelSelector({ selectedModel, onSelectModel }: GodModeModelSelectorProps) {
  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Model Selection</h3>
      <div className="space-y-2">
        {models.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-500/20 border-indigo-500/40'
                  : 'bg-white/5 border-white/5 hover:border-indigo-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                  <span className="text-sm font-medium text-white">
                    {model.name} v{model.version}
                  </span>
                  {model.recommended && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>{model.speed}</span>
                  <span>{model.contextWindow}</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-1 ml-4">{model.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
