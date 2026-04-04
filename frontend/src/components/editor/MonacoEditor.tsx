'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/store';

export function MonacoEditor() {
  const { files, activeFileId, updateFile } = useEditorStore();
  const activeFile = files.find((f) => f.id === activeFileId);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#111] text-[#333] text-sm">
        No file open
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <Editor
        key={activeFile.id}
        height="100%"
        defaultLanguage="sol"
        language={activeFile.name.endsWith('.sol') ? 'sol' : activeFile.name.endsWith('.ts') ? 'typescript' : activeFile.name.endsWith('.js') ? 'javascript' : 'plaintext'}
        value={activeFile.content}
        onChange={(value) => {
          if (value !== undefined) updateFile(activeFile.id, value);
        }}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 4,
          wordWrap: 'on',
        }}
        beforeMount={(monaco) => {
          // Register Solidity language
          monaco.languages.register({ id: 'sol' });
          monaco.languages.setMonarchTokensProvider('sol', {
            keywords: ['pragma', 'solidity', 'import', 'contract', 'interface', 'library', 'is', 'using', 'for',
              'function', 'modifier', 'event', 'error', 'struct', 'enum', 'mapping', 'returns', 'return',
              'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'throw', 'emit', 'try', 'catch',
              'new', 'delete', 'assembly', 'type', 'constructor', 'fallback', 'receive',
              'public', 'private', 'internal', 'external', 'pure', 'view', 'payable', 'virtual', 'override',
              'memory', 'storage', 'calldata', 'indexed', 'anonymous',
              'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
              'int', 'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
              'bool', 'bytes', 'bytes32', 'bytes4', 'bytes20', 'string', 'address', 'require', 'assert', 'revert',
              'msg', 'block', 'tx', 'this', 'super', 'abi'],
            tokenizer: {
              root: [
                [/[a-zA-Z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
                [/\/\/.*$/, 'comment'],
                [/\/\*/, 'comment', '@comment'],
                [/".*?"/, 'string'],
                [/'.*?'/, 'string'],
                [/\d+/, 'number'],
                [/0x[0-9a-fA-F]+/, 'number'],
              ],
              comment: [
                [/\*\//, 'comment', '@pop'],
                [/./, 'comment'],
              ],
            },
          });

          monaco.editor.defineTheme('solidity-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
              { token: 'comment', foreground: '6a9955' },
              { token: 'string', foreground: 'ce9178' },
              { token: 'number', foreground: 'b5cea8' },
              { token: 'identifier', foreground: 'd4d4d4' },
            ],
            colors: {
              'editor.background': '#111111',
              'editor.foreground': '#d4d4d4',
              'editorLineNumber.foreground': '#333',
              'editorCursor.foreground': '#528bff',
              'editor.lineHighlightBackground': '#1a1a1a',
              'editorIndentGuide.background': '#1f1f1f',
            },
          });
        }}
        onMount={(editor, monaco) => {
          monaco.editor.setTheme('solidity-dark');
        }}
      />
    </div>
  );
}
