interface ControlPanelProps {
  active: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

export function GodModeControlPanel({
  active,
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange,
}: ControlPanelProps) {
  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Control Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Temperature</span>
            <span className="text-xs font-mono text-indigo-300">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Max Tokens</span>
            <span className="text-xs font-mono text-indigo-300">{maxTokens.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="256"
            max="8192"
            step="256"
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>256</span>
            <span>8192</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs text-slate-400">System Status</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Engine</span>
              <span className="text-emerald-400">{active ? 'Running' : 'Stopped'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Memory</span>
              <span className="text-cyan-400">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Uptime</span>
              <span className="text-amber-400">14h 32m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
