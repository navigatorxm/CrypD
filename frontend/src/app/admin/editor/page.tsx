'use client';

import dynamic from 'next/dynamic';
import { FileTree } from '@/components/editor/FileTree';
import { CompilerPanel } from '@/components/editor/CompilerPanel';
import { useEditorStore } from '@/store';

const MonacoEditor = dynamic(() => import('@/components/editor/MonacoEditor').then(m => ({ default: m.MonacoEditor })), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#111] text-[#333] text-sm">
      Loading editor…
    </div>
  ),
});

export default function EditorPage() {
  const { files, activeFileId } = useEditorStore();
  const activeFile = files.find((f) => f.id === activeFileId);

  return (
    <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
      {/* File tree */}
      <FileTree />

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#111]">
        {/* Tab bar */}
        {activeFile && (
          <div className="flex items-center h-8 bg-[#0d0d0d] border-b border-[#1f1f1f] px-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#1f1f1f] rounded-t text-xs text-[#aaa]">
              <span className="text-indigo-400">◈</span>
              {activeFile.name}
              {activeFile.modified && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </div>
          </div>
        )}
        <MonacoEditor />
      </div>

      {/* Compiler/Deploy/Interact panel */}
      <CompilerPanel />
    </div>
  );
}
