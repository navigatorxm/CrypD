'use client';

import { useEditorStore } from '@/store';
import { CONTRACT_TEMPLATES } from '@/lib/constants/templates';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';

export function FileTree() {
  const { files, activeFileId, setActiveFile, addFile, removeFile, renameFile } = useEditorStore();

  const newFile = () => {
    addFile({
      id: uuid(),
      name: `Contract_${Date.now()}.sol`,
      content: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract MyContract {\n    \n}\n`,
      language: 'sol',
      modified: false,
    });
  };

  const loadTemplate = (key: string) => {
    const tmpl = CONTRACT_TEMPLATES[key];
    if (!tmpl) return;
    addFile({
      id: uuid(),
      name: tmpl.name.replace(/ /g, '') + '.sol',
      content: tmpl.source.replace(/{{NAME}}/g, tmpl.name.replace(/ /g, '')),
      language: 'sol',
      modified: false,
    });
  };

  const handleRename = (id: string, oldName: string) => {
    const name = prompt('Rename file:', oldName);
    if (name && name !== oldName) renameFile(id, name);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border-r border-[#1f1f1f] w-44 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1f1f1f]">
        <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">Files</span>
        <button onClick={newFile} className="text-[#555] hover:text-white text-sm leading-none" title="New file">+</button>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto py-1">
        {files.map((f) => (
          <div
            key={f.id}
            onClick={() => setActiveFile(f.id)}
            onDoubleClick={() => handleRename(f.id, f.name)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs group',
              activeFileId === f.id
                ? 'bg-indigo-600/20 text-indigo-300'
                : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
            )}
          >
            <span className="text-[#555]">
              {f.name.endsWith('.sol') ? '◈' : f.name.endsWith('.js') ? '◉' : '◦'}
            </span>
            <span className="flex-1 truncate">{f.name}</span>
            {f.modified && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />}
            <button
              onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
              className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 ml-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="border-t border-[#1f1f1f] p-2">
        <div className="text-[9px] font-semibold text-[#444] uppercase tracking-widest mb-1 px-1">Templates</div>
        <div className="space-y-0.5">
          {Object.entries(CONTRACT_TEMPLATES).map(([key, tmpl]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key)}
              className="w-full text-left px-2 py-1 text-[10px] text-[#666] hover:text-white hover:bg-[#1a1a1a] rounded transition-all truncate"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
