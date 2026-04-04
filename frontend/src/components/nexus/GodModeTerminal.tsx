'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  type: 'input' | 'output' | 'system';
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  { id: 1, type: 'system', content: 'NEXUS-01 GodMode Terminal v2.4.1', timestamp: '00:00:00' },
  { id: 2, type: 'system', content: 'Connected to GodMode AI Co-pilot engine', timestamp: '00:00:01' },
  { id: 3, type: 'system', content: 'Type a command or ask me anything...', timestamp: '00:00:02' },
];

export function GodModeTerminal() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now(),
      type: 'input',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        help: 'Available commands: status, deploy, audit, agents, clear, help',
        status: 'GodMode Status: ACTIVE | Model: nexus-omni-4.0 | Uptime: 14h 32m | Memory: 2.4GB',
        deploy: 'Initiating deployment sequence... All 3 contracts validated. Deploying to mainnet...',
        audit: 'Running security audit on TokenV2... 0 critical issues found. 2 minor warnings.',
        agents: '6 agents registered: ContractAuditor (active), CodeArchitect (active), DeployBot (idle), DataAnalyst (active), TokenMigrator (error), DocWriter (idle)',
        clear: '__CLEAR__',
      };

      const responseContent = responses[input.toLowerCase()] || `Processing "${input}"... Analysis complete. Ready for next command.`;

      if (responseContent === '__CLEAR__') {
        setMessages(initialMessages);
      } else {
        const outputMsg: Message = {
          id: Date.now() + 1,
          type: 'output',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        };
        setMessages((prev) => [...prev, outputMsg]);
      }
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="card-dark rounded-xl border border-indigo-500/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">GodMode Terminal</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Connected</span>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="h-64 overflow-y-auto bg-black/40 rounded-lg p-3 font-mono text-xs mb-3 border border-white/5"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="text-slate-600">[{msg.timestamp}]</span>{' '}
            {msg.type === 'input' && (
              <>
                <span className="text-indigo-400">operator@nexus</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400">~</span>
                <span className="text-slate-500">$ </span>
                <span className="text-white">{msg.content}</span>
              </>
            )}
            {msg.type === 'output' && (
              <span className="text-emerald-400">{msg.content}</span>
            )}
            {msg.type === 'system' && (
              <span className="text-amber-400">{msg.content}</span>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="text-slate-500 animate-pulse">Processing...</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex items-center text-xs text-slate-500 font-mono">
          <span className="text-indigo-400">$</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or ask anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-500/30 transition-all disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
