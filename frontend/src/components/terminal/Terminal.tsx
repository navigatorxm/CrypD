'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '@/store';

export function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const fitRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { terminalHeight, setTerminalHeight, setTerminalOpen } = useUIStore();

  // Resize handle
  const dragRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartH = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = true;
    dragStartY.current = e.clientY;
    dragStartH.current = terminalHeight;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragStartY.current - e.clientY;
      const newH = Math.max(80, Math.min(600, dragStartH.current + delta));
      setTerminalHeight(newH);
    };
    const onMouseUp = () => {
      dragRef.current = false;
      document.body.style.userSelect = '';
      fitRef.current?.fit();
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [setTerminalHeight]);

  // Init xterm
  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    let term: any;
    let fitAddon: any;

    const init = async () => {
      const { Terminal: XTerm } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');
      await import('@xterm/xterm/css/xterm.css');

      term = new XTerm({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
        theme: {
          background: '#0a0a0a',
          foreground: '#d4d4d4',
          cursor: '#528bff',
          selectionBackground: '#264f78',
          black: '#1e1e1e',
          red: '#f14c4c',
          green: '#23d18b',
          yellow: '#e5e510',
          blue: '#2472c8',
          magenta: '#bc3fbc',
          cyan: '#11a8cd',
          white: '#e5e5e5',
          brightBlack: '#666666',
          brightGreen: '#23d18b',
          brightYellow: '#f5f543',
          brightBlue: '#3b8eea',
          brightRed: '#f14c4c',
          brightMagenta: '#d670d6',
          brightCyan: '#29b8db',
          brightWhite: '#e5e5e5',
        },
        allowProposedApi: true,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());
      term.open(containerRef.current!);
      fitAddon.fit();
      termRef.current = term;
      fitRef.current = fitAddon;

      // Connect WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.hostname}:3001`);
      wsRef.current = ws;

      ws.onopen = () => {
        term.writeln('\x1b[32mConnected to shell.\x1b[0m Press Enter to start.');
        term.writeln('\x1b[90mBash · Python · Node · curl · git · all CLI tools available\x1b[0m\r\n');
      };

      ws.onmessage = (e) => {
        term.write(e.data);
      };

      ws.onerror = () => {
        term.writeln('\x1b[33m⚠ WebSocket not available. Run: node server.js\x1b[0m');
        term.writeln('\x1b[90mOr use the terminal in a separate tab.\x1b[0m\r\n');
        // Fallback: local echo
        setupLocalFallback(term);
      };

      ws.onclose = () => {
        if (!term.element) return;
        term.writeln('\r\n\x1b[31mDisconnected.\x1b[0m');
      };

      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
    };

    init();

    return () => {
      wsRef.current?.close();
      termRef.current?.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, []);

  // Refit on height change
  useEffect(() => {
    const t = setTimeout(() => fitRef.current?.fit(), 50);
    return () => clearTimeout(t);
  }, [terminalHeight]);

  return (
    <div className="flex flex-col h-full">
      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        className="h-1 cursor-ns-resize bg-[#1f1f1f] hover:bg-indigo-500/50 flex-shrink-0 transition-colors"
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-1 border-b border-[#1f1f1f] flex-shrink-0">
        <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">Terminal</span>
        <div className="flex items-center gap-1 ml-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setTerminalOpen(false)}
          className="text-[#444] hover:text-white text-xs leading-none"
        >
          ✕
        </button>
      </div>

      {/* Terminal */}
      <div ref={containerRef} className="flex-1 min-h-0 p-1" />
    </div>
  );
}

function setupLocalFallback(term: any) {
  let input = '';
  term.write('\x1b[32m$\x1b[0m ');

  term.onData((data: string) => {
    const code = data.charCodeAt(0);
    if (code === 13) {
      term.write('\r\n');
      const cmd = input.trim();
      input = '';
      if (cmd === 'help') {
        term.writeln('\x1b[33mAvailable in fallback mode:\x1b[0m');
        term.writeln('  help, clear, echo <text>, date, version');
        term.writeln('\x1b[90mFor full shell: npm run server (starts WebSocket terminal)\x1b[0m');
      } else if (cmd === 'clear') {
        term.clear();
      } else if (cmd.startsWith('echo ')) {
        term.writeln(cmd.slice(5));
      } else if (cmd === 'date') {
        term.writeln(new Date().toString());
      } else if (cmd === 'version') {
        term.writeln('U-OS Platform v1.0.0');
      } else if (cmd) {
        term.writeln(`\x1b[31mFallback mode: "${cmd}" not available. Start server.js for full shell.\x1b[0m`);
      }
      term.write('\x1b[32m$\x1b[0m ');
    } else if (code === 127) {
      if (input.length > 0) {
        input = input.slice(0, -1);
        term.write('\b \b');
      }
    } else if (code >= 32) {
      input += data;
      term.write(data);
    }
  });
}
