'use client';

import { useState, useEffect } from 'react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  color: string;
  data: number[];
}

function generateData(base: number, variance: number, length: number): number[] {
  return Array.from({ length }, () => base + Math.random() * variance - variance / 2);
}

export function NexusSystemMonitor() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'CPU Usage', value: 34, unit: '%', color: 'indigo', data: generateData(34, 20, 20) },
    { label: 'Memory', value: 62, unit: '%', color: 'cyan', data: generateData(62, 15, 20) },
    { label: 'GPU Load', value: 45, unit: '%', color: 'emerald', data: generateData(45, 25, 20) },
    { label: 'Network I/O', value: 128, unit: 'MB/s', color: 'amber', data: generateData(128, 80, 20) },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const newValue = Math.max(0, m.value + (Math.random() * 10 - 5));
          const newData = [...m.data.slice(1), newValue];
          return { ...m, value: Math.round(newValue), data: newData };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colorMap: Record<string, string> = {
    indigo: 'stroke-indigo-400',
    cyan: 'stroke-cyan-400',
    emerald: 'stroke-emerald-400',
    amber: 'stroke-amber-400',
  };

  const barColorMap: Record<string, string> = {
    indigo: 'bg-indigo-400',
    cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
  };

  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">System Monitor</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{metric.label}</span>
              <span className="text-sm font-mono text-white">
                {metric.value}
                {metric.unit}
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColorMap[metric.color]}`}
                style={{ width: `${Math.min(100, metric.value)}%` }}
              />
            </div>
            <div className="flex items-end gap-px h-8">
              {metric.data.map((val, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${barColorMap[metric.color]} opacity-60 transition-all duration-300`}
                  style={{ height: `${Math.min(100, Math.max(5, val))}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
