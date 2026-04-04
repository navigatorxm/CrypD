'use client';

import { useState } from 'react';
import { useEditorStore, useContractStore, useTxStore } from '@/store';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { getNetwork } from '@/lib/constants/networks';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';

type Panel = 'compile' | 'deploy' | 'interact';

export function CompilerPanel() {
  const [panel, setPanel] = useState<Panel>('compile');
  const { files, activeFileId, compileResult, isCompiling, setCompileResult, setIsCompiling } = useEditorStore();
  const { contracts, addContract, selected, setSelected } = useContractStore();
  const { addTx } = useTxStore();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const activeFile = files.find((f) => f.id === activeFileId);

  // ── Compile ──────────────────────────────────────────────────────────────
  const compile = async () => {
    if (!activeFile) return toast.error('No active file');
    setIsCompiling(true);
    setCompileResult(null);

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: activeFile.content, fileName: activeFile.name }),
      });
      const data = await res.json();
      if (data.error) {
        setCompileResult({ abi: [], bytecode: '', errors: [data.error], warnings: [], contractName: '' });
        toast.error('Compilation failed');
      } else {
        setCompileResult(data);
        toast.success(`Compiled: ${data.contractName}`);
        setPanel('deploy');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsCompiling(false);
    }
  };

  // ── Deploy ────────────────────────────────────────────────────────────────
  const [constructorArgs, setConstructorArgs] = useState('');
  const [deploying, setDeploying] = useState(false);

  const deploy = async () => {
    if (!compileResult || !walletClient || !publicClient || !address) return;
    setDeploying(true);
    try {
      let args: any[] = [];
      if (constructorArgs.trim()) {
        try { args = JSON.parse(constructorArgs); }
        catch { args = constructorArgs.split(',').map((a) => a.trim()); }
      }

      const hash = await walletClient.deployContract({
        abi: compileResult.abi,
        bytecode: ('0x' + compileResult.bytecode) as `0x${string}`,
        args,
      });

      toast.loading('Waiting for confirmation...', { id: hash });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      toast.dismiss(hash);

      const addr = receipt.contractAddress || '';
      const contract = {
        id: uuid(),
        name: compileResult.contractName,
        address: addr,
        chainId,
        abi: compileResult.abi,
        bytecode: compileResult.bytecode,
        deployedAt: Date.now(),
        txHash: hash,
        type: 'Custom',
        network: getNetwork(chainId)?.shortName ?? String(chainId),
      };
      addContract(contract);
      setSelected(contract);

      addTx({
        hash, from: address, to: '', value: '0', status: 'success',
        timestamp: Date.now(), chainId,
        blockNumber: Number(receipt.blockNumber),
        method: 'deploy', contractAddress: addr,
        contractName: compileResult.contractName,
      });

      toast.success(`Deployed at ${addr.slice(0, 10)}…`);
      setPanel('interact');
    } catch (e: any) {
      toast.error(e.message?.slice(0, 80) || 'Deploy failed');
    } finally {
      setDeploying(false);
    }
  };

  // ── Interact ──────────────────────────────────────────────────────────────
  const [selectedFn, setSelectedFn] = useState('');
  const [fnArgs, setFnArgs] = useState<Record<string, string>>({});
  const [callResult, setCallResult] = useState<any>(null);
  const [calling, setCalling] = useState(false);

  const callFunction = async () => {
    if (!selected || !selectedFn || !publicClient) return;
    const fn = selected.abi.find((f: any) => f.name === selectedFn && f.type === 'function');
    if (!fn) return;
    setCalling(true);
    setCallResult(null);
    try {
      const parsedArgs = fn.inputs.map((inp: any) => {
        const v = fnArgs[inp.name] || '';
        if (inp.type.includes('uint') || inp.type.includes('int')) return BigInt(v || '0');
        if (inp.type === 'bool') return v === 'true';
        if (inp.type.includes('[]')) { try { return JSON.parse(v); } catch { return v.split(',').map((x: string) => x.trim()); } }
        return v;
      });

      const isRead = fn.stateMutability === 'view' || fn.stateMutability === 'pure';
      if (isRead) {
        const result = await publicClient.readContract({
          address: selected.address as `0x${string}`,
          abi: selected.abi,
          functionName: selectedFn,
          args: parsedArgs,
        });
        setCallResult(result);
      } else {
        if (!walletClient || !address) throw new Error('Wallet not connected');
        const hash = await walletClient.writeContract({
          address: selected.address as `0x${string}`,
          abi: selected.abi,
          functionName: selectedFn,
          args: parsedArgs,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        setCallResult({ txHash: hash, status: receipt.status });
        addTx({
          hash, from: address, to: selected.address, value: '0',
          status: receipt.status === 'success' ? 'success' : 'failed',
          timestamp: Date.now(), chainId,
          blockNumber: Number(receipt.blockNumber),
          method: selectedFn, contractAddress: selected.address,
          contractName: selected.name,
        });
        toast.success(`${selectedFn}() confirmed`);
      }
    } catch (e: any) {
      toast.error(e.message?.slice(0, 80) || 'Call failed');
    } finally {
      setCalling(false);
    }
  };

  const currentContract = selected ?? contracts[0];
  const fns = currentContract?.abi.filter((f: any) => f.type === 'function') ?? [];
  const readFns = fns.filter((f: any) => f.stateMutability === 'view' || f.stateMutability === 'pure');
  const writeFns = fns.filter((f: any) => f.stateMutability !== 'view' && f.stateMutability !== 'pure');
  const selectedFnDef = fns.find((f: any) => f.name === selectedFn);

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border-l border-[#1f1f1f] w-72 flex-shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-[#1f1f1f]">
        {(['compile', 'deploy', 'interact'] as Panel[]).map((p) => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              panel === p ? 'text-indigo-400 border-b border-indigo-500' : 'text-[#555] hover:text-[#aaa]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ── COMPILE ── */}
        {panel === 'compile' && (
          <>
            <div className="space-y-1">
              <div className="text-[10px] text-[#444] uppercase tracking-wider">Active File</div>
              <div className="font-mono text-xs text-[#aaa] truncate">{activeFile?.name ?? 'none'}</div>
            </div>

            <button
              onClick={compile}
              disabled={isCompiling || !activeFile}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded transition-all"
            >
              {isCompiling ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Compiling…
                </span>
              ) : '⬡  Compile'}
            </button>

            {compileResult && (
              <div className="space-y-2">
                {compileResult.errors.length > 0 && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-[11px] text-red-400 space-y-1">
                    {compileResult.errors.map((e, i) => <div key={i}>{e}</div>)}
                  </div>
                )}
                {compileResult.warnings.length > 0 && (
                  <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[11px] text-yellow-400 space-y-1">
                    {compileResult.warnings.map((w, i) => <div key={i}>{w}</div>)}
                  </div>
                )}
                {compileResult.abi.length > 0 && (
                  <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-[11px] text-green-400">
                    ✓ {compileResult.contractName} — {compileResult.abi.length} functions
                  </div>
                )}
                {compileResult.abi.length > 0 && (
                  <details className="text-[10px]">
                    <summary className="text-[#555] cursor-pointer hover:text-white">View ABI</summary>
                    <pre className="mt-1 p-2 bg-[#111] rounded overflow-x-auto text-[#888] max-h-40">
                      {JSON.stringify(compileResult.abi, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </>
        )}

        {/* ── DEPLOY ── */}
        {panel === 'deploy' && (
          <>
            {!isConnected ? (
              <div className="text-center py-8 text-[#555] text-sm">Connect wallet to deploy</div>
            ) : !compileResult?.bytecode ? (
              <div className="text-center py-8 text-[#555] text-sm">Compile a contract first</div>
            ) : (
              <>
                <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-[11px] text-green-400">
                  ✓ Ready: {compileResult.contractName}
                </div>

                <div>
                  <label className="block text-[10px] text-[#444] uppercase tracking-wider mb-1">
                    Constructor Args (JSON array)
                  </label>
                  <input
                    value={constructorArgs}
                    onChange={(e) => setConstructorArgs(e.target.value)}
                    placeholder='["arg1", 1000]'
                    className="w-full px-2 py-1.5 bg-[#111] border border-[#2a2a2a] text-white rounded text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={deploy}
                  disabled={deploying}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-semibold rounded transition-all"
                >
                  {deploying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deploying…
                    </span>
                  ) : '🚀  Deploy Contract'}
                </button>

                {contracts.length > 0 && (
                  <div>
                    <div className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Recent Deployments</div>
                    {contracts.slice(0, 3).map((c) => (
                      <div key={c.id} className="p-2 bg-[#111] rounded mb-1 text-[10px]">
                        <div className="text-white font-medium">{c.name}</div>
                        <div className="font-mono text-[#555] truncate">{c.address}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── INTERACT ── */}
        {panel === 'interact' && (
          <>
            {/* Contract selector */}
            <div>
              <label className="block text-[10px] text-[#444] uppercase tracking-wider mb-1">Contract</label>
              <select
                value={currentContract?.id ?? ''}
                onChange={(e) => {
                  const c = contracts.find((x) => x.id === e.target.value);
                  if (c) setSelected(c);
                }}
                className="w-full px-2 py-1.5 bg-[#111] border border-[#2a2a2a] text-white rounded text-xs focus:outline-none focus:border-indigo-500"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.address.slice(0, 8)}…)</option>
                ))}
              </select>
            </div>

            {currentContract && (
              <>
                {/* Read functions */}
                <div>
                  <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-1">Read</div>
                  <div className="space-y-0.5 max-h-28 overflow-y-auto">
                    {readFns.map((f: any) => (
                      <button
                        key={f.name}
                        onClick={() => { setSelectedFn(f.name); setFnArgs({}); setCallResult(null); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-mono transition-all ${
                          selectedFn === f.name ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#777] hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        {f.name}()
                      </button>
                    ))}
                  </div>
                </div>

                {/* Write functions */}
                <div>
                  <div className="text-[10px] text-orange-500 uppercase tracking-wider mb-1">Write</div>
                  <div className="space-y-0.5 max-h-28 overflow-y-auto">
                    {writeFns.map((f: any) => (
                      <button
                        key={f.name}
                        onClick={() => { setSelectedFn(f.name); setFnArgs({}); setCallResult(null); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-mono transition-all ${
                          selectedFn === f.name ? 'bg-orange-500/20 text-orange-400' : 'text-[#777] hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        {f.name}()
                      </button>
                    ))}
                  </div>
                </div>

                {/* Function executor */}
                {selectedFnDef && (
                  <div className="border-t border-[#1f1f1f] pt-3 space-y-2">
                    <div className="font-mono text-xs text-white">{selectedFn}()</div>
                    {selectedFnDef.inputs?.map((inp: any) => (
                      <div key={inp.name}>
                        <label className="block text-[9px] text-[#555] mb-0.5">
                          {inp.name} <span className="text-[#333]">{inp.type}</span>
                        </label>
                        <input
                          value={fnArgs[inp.name] || ''}
                          onChange={(e) => setFnArgs({ ...fnArgs, [inp.name]: e.target.value })}
                          placeholder={inp.type}
                          className="w-full px-2 py-1 bg-[#111] border border-[#2a2a2a] text-white rounded text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={callFunction}
                      disabled={calling}
                      className={`w-full py-2 text-xs font-semibold rounded transition-all disabled:opacity-40 ${
                        selectedFnDef.stateMutability === 'view' || selectedFnDef.stateMutability === 'pure'
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'bg-orange-600 hover:bg-orange-500 text-white'
                      }`}
                    >
                      {calling ? '…' : `Call ${selectedFn}()`}
                    </button>

                    {callResult !== null && (
                      <pre className="p-2 bg-[#111] rounded text-[10px] text-green-400 break-all whitespace-pre-wrap overflow-x-auto max-h-28">
                        {typeof callResult === 'bigint'
                          ? callResult.toString()
                          : JSON.stringify(callResult, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
