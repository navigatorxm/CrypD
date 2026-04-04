'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState('nexus-sk-****-****-****-a3f9');
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Configure your NEXUS-01 Navigator OS preferences</p>
      </div>

      <div className="card-dark rounded-xl border border-indigo-500/20 p-5 space-y-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">General</h3>

        <div className="space-y-4">
          <ToggleSetting
            label="Dark Mode"
            description="Use dark theme across the dashboard"
            checked={darkMode}
            onChange={setDarkMode}
          />
          <ToggleSetting
            label="Notifications"
            description="Receive alerts for system events and agent updates"
            checked={notifications}
            onChange={setNotifications}
          />
          <ToggleSetting
            label="Auto Deploy"
            description="Automatically deploy contracts after successful validation"
            checked={autoDeploy}
            onChange={setAutoDeploy}
          />
        </div>
      </div>

      <div className="card-dark rounded-xl border border-indigo-500/20 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">API Configuration</h3>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">API Key</label>
          <div className="flex items-center gap-2">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <button className="px-3 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs hover:bg-indigo-500/30 transition-all">
              Regenerate
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Webhook URL</label>
          <input
            type="text"
            placeholder="https://your-webhook-url.com/nexus"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="card-dark rounded-xl border border-indigo-500/20 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Danger Zone</h3>

        <div className="flex items-center justify-between p-3 border border-red-500/20 rounded-lg bg-red-500/5">
          <div>
            <div className="text-sm text-white">Reset All Settings</div>
            <div className="text-xs text-slate-400">Restore all settings to their default values</div>
          </div>
          <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all">
            Reset
          </button>
        </div>

        <div className="flex items-center justify-between p-3 border border-red-500/20 rounded-lg bg-red-500/5">
          <div>
            <div className="text-sm text-white">Delete All Projects</div>
            <div className="text-xs text-slate-400">Permanently remove all project data</div>
          </div>
          <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all">
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-indigo-500' : 'bg-slate-700'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
