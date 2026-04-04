/**
 * U-OS Terminal WebSocket Server
 * Runs alongside Next.js — spawns real shell sessions via node-pty
 * Start: node server.js  (or: npm run server)
 */

const { WebSocketServer } = require('ws');
const pty = require('node-pty');
const os = require('os');

const PORT = 3001;
const shell = os.platform() === 'win32' ? 'cmd.exe' : (process.env.SHELL || '/bin/bash');

const wss = new WebSocketServer({ port: PORT });

console.log(`\x1b[32m[terminal]\x1b[0m WebSocket server running on ws://localhost:${PORT}`);
console.log(`\x1b[90m[terminal]\x1b[0m Shell: ${shell}`);

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`\x1b[36m[terminal]\x1b[0m New connection from ${ip}`);

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 120,
    rows: 30,
    cwd: process.env.HOME || os.homedir(),
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
    },
  });

  ptyProcess.onData((data) => {
    try { ws.send(data); } catch {}
  });

  ptyProcess.onExit(({ exitCode }) => {
    console.log(`\x1b[90m[terminal]\x1b[0m Shell exited (code ${exitCode})`);
    try { ws.close(); } catch {}
  });

  ws.on('message', (data) => {
    try { ptyProcess.write(data.toString()); } catch {}
  });

  ws.on('close', () => {
    console.log(`\x1b[90m[terminal]\x1b[0m Connection closed`);
    try { ptyProcess.kill(); } catch {}
  });

  ws.on('error', (err) => {
    console.error(`\x1b[31m[terminal]\x1b[0m Error:`, err.message);
    try { ptyProcess.kill(); } catch {}
  });
});

wss.on('error', (err) => {
  console.error(`\x1b[31m[terminal]\x1b[0m Server error:`, err.message);
});
