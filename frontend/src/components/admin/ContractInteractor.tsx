'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { getDeployedContracts, saveDeployedContract, saveTransaction, removeDeployedContract } from '@/lib/store';
import { DeployedContract } from '@/types';
import { getChainName, shortenAddress, parseInputValue, getExplorerUrl } from '@/lib/utils';
import { TOKEN_V2_ABI } from '@/lib/contracts/abis';

export function ContractInteractor() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [contracts, setContracts] = useState<DeployedContract[]>([]);
  const [selected, setSelected] = useState<DeployedContract | null>(null);
  const [addManual, setAddManual] = useState(false);
  const [manualForm, setManualForm] = useState({ name: '', address: '', abi: '[]', type: 'Custom' });

  // Function caller state
  const [selectedFn, setSelectedFn] = useState('');
  const [args, setArgs] = useState<Record<string, string>>({});
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [callResult, setCallResult] = useState<any>(null);
  const [callError, setCallError] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    setContracts(getDeployedContracts());
  }, []);

  const reload = () => setContracts(getDeployedContracts());

  const addManualContract = () => {
    try {
      const abi = JSON.parse(manualForm.abi);
      const contract: DeployedContract = {
        id: `manual-${Date.now()}`,
        name: manualForm.name || 'Custom Contract',
        address: manualForm.address,
        chainId,
        abi,
        deployedAt: Date.now(),
        txHash: '',
        type: manualForm.type as any,
      };
      saveDeployedContract(contract);
      reload();
      setAddManual(false);
      setManualForm({ name: '', address: '', abi: '[]', type: 'Custom' });
    } catch (e) {
      alert('Invalid ABI JSON');
    }
  };

  const loadTokenV2 = () => {
    setManualForm((f) => ({ ...f, abi: JSON.stringify(TOKEN_V2_ABI, null, 2), type: 'TokenV2' }));
  };

  const callFunction = async () => {
    if (!selected || !selectedFn) return;
    const fn = selected.abi.find((f: any) => f.name === selectedFn && f.type === 'function');
    if (!fn) return;

    setCallStatus('calling');
    setCallResult(null);
    setCallError('');
    setTxHash('');

    try {
      const parsedArgs = fn.inputs.map((input: any) =>
        parseInputValue(args[input.name] || '', input.type)
      );

      const isRead = fn.stateMutability === 'view' || fn.stateMutability === 'pure';

      if (isRead) {
        const result = await publicClient!.readContract({
          address: selected.address as `0x${string}`,
          abi: selected.abi,
          functionName: selectedFn,
          args: parsedArgs,
        });
        setCallResult(result);
        setCallStatus('success');
      } else {
        if (!walletClient || !address) throw new Error('Wallet not connected');
        const hash = await walletClient.writeContract({
          address: selected.address as `0x${string}`,
          abi: selected.abi,
          functionName: selectedFn,
          args: parsedArgs,
        });
        setTxHash(hash);
        const receipt = await publicClient!.waitForTransactionReceipt({ hash });
        setCallStatus('success');
        setCallResult({ txHash: hash, blockNumber: receipt.blockNumber.toString(), status: receipt.status });

        saveTransaction({
          hash,
          from: address,
          to: selected.address,
          value: '0',
          data: '',
          status: receipt.status === 'success' ? 'success' : 'failed',
          timestamp: Date.now(),
          chainId,
          blockNumber: Number(receipt.blockNumber),
          method: selectedFn,
          contractAddress: selected.address,
          contractName: selected.name,
        });
      }
    } catch (e: any) {
      setCallStatus('error');
      setCallError(e.message || 'Call failed');
    }
  };

  const functions = selected?.abi.filter((f: any) => f.type === 'function') || [];
  const readFns = functions.filter((f: any) => f.stateMutability === 'view' || f.stateMutability === 'pure');
  const writeFns = functions.filter((f: any) => f.stateMutability !== 'view' && f.stateMutability !== 'pure');
  const selectedFnDef = functions.find((f: any) => f.name === selectedFn);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-48 card-dark rounded-2xl border-dashed border-2 border-indigo-500/30">
        <p className="text-slate-500">Connect your wallet to interact with contracts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contract Interactor</h2>
          <p className="text-slate-400 text-sm mt-1">{getChainName(chainId)}</p>
        </div>
        <button
          onClick={() => setAddManual(true)}
          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium transition-all"
        >
          + Add Contract
        </button>
      </div>

      {/* Add manual contract modal */}
      {addManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card-dark rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Contract</h3>
              <button onClick={() => setAddManual(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Name</label>
              <input value={manualForm.name} onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Contract Address</label>
              <input value={manualForm.address} onChange={(e) => setManualForm({ ...manualForm, address: e.target.value })}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-500">ABI (JSON)</label>
                <button onClick={loadTokenV2} className="text-xs text-indigo-400 hover:text-indigo-300">Load TokenV2 ABI</button>
              </div>
              <textarea value={manualForm.abi} onChange={(e) => setManualForm({ ...manualForm, abi: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y" />
            </div>
            <div className="flex gap-3">
              <button onClick={addManualContract}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm">
                Add Contract
              </button>
              <button onClick={() => setAddManual(false)}
                className="flex-1 py-2 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract list */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Saved Contracts</h3>

          {contracts.length === 0 ? (
            <div className="card-dark rounded-xl p-6 text-center text-slate-600 text-sm">
              No contracts yet.<br />Deploy or add one to get started.
            </div>
          ) : (
            contracts.map((c) => (
              <div
                key={c.id}
                onClick={() => { setSelected(c); setSelectedFn(''); setCallStatus('idle'); }}
                className={`card-dark rounded-xl p-4 cursor-pointer transition-all group ${
                  selected?.id === c.id ? 'border-indigo-500/50 bg-indigo-500/5' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{c.name}</div>
                    <div className="font-mono text-xs text-slate-500 truncate">{shortenAddress(c.address)}</div>
                    <div className="text-xs text-slate-600 mt-1">{getChainName(c.chainId)}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeDeployedContract(c.id); reload(); if (selected?.id === c.id) setSelected(null); }}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 ml-2 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Function caller */}
        <div className="lg:col-span-2 space-y-4">
          {!selected ? (
            <div className="card-dark rounded-2xl p-8 text-center text-slate-600 h-64 flex items-center justify-center">
              <div>
                <div className="text-5xl mb-3">⚡</div>
                <p>Select a contract to interact with its functions</p>
              </div>
            </div>
          ) : (
            <>
              {/* Contract info */}
              <div className="card-dark rounded-xl p-4 flex flex-wrap gap-4 items-center">
                <div>
                  <div className="text-xs text-slate-500">Contract</div>
                  <div className="font-bold text-white">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Address</div>
                  <div className="font-mono text-sm text-indigo-300">{shortenAddress(selected.address, 6)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Network</div>
                  <div className="text-sm text-slate-200">{getChainName(selected.chainId)}</div>
                </div>
                {getExplorerUrl(selected.chainId, 'address', selected.address) !== '#' && (
                  <a
                    href={getExplorerUrl(selected.chainId, 'address', selected.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto px-3 py-1.5 text-xs border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                  >
                    View on Explorer ↗
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Read functions */}
                <div className="card-dark rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                    Read ({readFns.length})
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {readFns.map((f: any) => (
                      <button
                        key={f.name}
                        onClick={() => { setSelectedFn(f.name); setArgs({}); setCallStatus('idle'); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm font-mono transition-all ${
                          selectedFn === f.name ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Write functions */}
                <div className="card-dark rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">
                    Write ({writeFns.length})
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {writeFns.map((f: any) => (
                      <button
                        key={f.name}
                        onClick={() => { setSelectedFn(f.name); setArgs({}); setCallStatus('idle'); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm font-mono transition-all ${
                          selectedFn === f.name ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Function executor */}
              {selectedFnDef && (
                <div className="card-dark rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedFnDef.stateMutability === 'view' || selectedFnDef.stateMutability === 'pure'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {selectedFnDef.stateMutability}
                    </span>
                    <h4 className="font-mono font-bold text-white">{selectedFnDef.name}</h4>
                  </div>

                  {selectedFnDef.inputs?.map((input: any) => (
                    <div key={input.name}>
                      <label className="block text-xs text-slate-500 mb-1">
                        {input.name} <span className="text-slate-600">({input.type})</span>
                      </label>
                      <input
                        value={args[input.name] || ''}
                        onChange={(e) => setArgs({ ...args, [input.name]: e.target.value })}
                        placeholder={input.type}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}

                  <button
                    onClick={callFunction}
                    disabled={callStatus === 'calling'}
                    className={`w-full py-3 font-bold rounded-xl transition-all disabled:opacity-50 ${
                      selectedFnDef.stateMutability === 'view' || selectedFnDef.stateMutability === 'pure'
                        ? 'bg-cyan-600/80 hover:bg-cyan-600 text-white'
                        : 'bg-orange-600/80 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {callStatus === 'calling' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Executing...
                      </span>
                    ) : (
                      `Call ${selectedFnDef.name}()`
                    )}
                  </button>

                  {callStatus === 'success' && callResult !== null && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-xs text-green-400 font-semibold mb-1">Result</div>
                      <pre className="text-sm text-green-300 break-all whitespace-pre-wrap">
                        {typeof callResult === 'bigint'
                          ? callResult.toString()
                          : typeof callResult === 'object'
                          ? JSON.stringify(callResult, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)
                          : String(callResult)}
                      </pre>
                      {txHash && (
                        <a
                          href={getExplorerUrl(chainId, 'tx', txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:underline mt-2 block"
                        >
                          View Transaction ↗
                        </a>
                      )}
                    </div>
                  )}

                  {callStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-xs text-red-400 font-semibold mb-1">Error</div>
                      <p className="text-sm text-red-300 break-all">{callError}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
