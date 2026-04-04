'use client';

import { useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { getTransactions, clearTransactions } from '@/lib/store';
import { Transaction } from '@/types';
import { formatTimestamp, shortenAddress, getChainName, getExplorerUrl } from '@/lib/utils';

export function TransactionsDashboard() {
  const chainId = useChainId();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');

  useEffect(() => {
    setTxs(getTransactions());
  }, []);

  const reload = () => setTxs(getTransactions());

  const filtered = txs.filter((tx) => filter === 'all' || tx.status === filter);

  const stats = {
    total: txs.length,
    success: txs.filter((t) => t.status === 'success').length,
    failed: txs.filter((t) => t.status === 'failed').length,
    pending: txs.filter((t) => t.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">History of all contract interactions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload}
            className="px-3 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg text-sm transition-all">
            ↻ Refresh
          </button>
          {txs.length > 0 && (
            <button
              onClick={() => { if (confirm('Clear all transactions?')) { clearTransactions(); reload(); } }}
              className="px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Success', value: stats.success, color: 'text-green-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="card-dark rounded-xl p-4 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'success', 'failed', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <div className="card-dark rounded-2xl p-12 text-center text-slate-600">
          <div className="text-5xl mb-4">📋</div>
          <p>No transactions yet.</p>
          <p className="text-sm mt-2">Deploy a contract or call a function to see transactions here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((tx) => (
            <div key={tx.hash} className="card-dark rounded-xl p-4 hover:border-indigo-500/30 transition-all">
              <div className="flex flex-wrap items-start gap-4">
                {/* Status badge */}
                <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                  tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {tx.status}
                </div>

                {/* Method */}
                {tx.method && (
                  <div className="font-mono text-sm text-white font-medium">
                    {tx.method}()
                  </div>
                )}

                {/* Contract */}
                {tx.contractName && (
                  <div className="text-sm text-slate-400">
                    → <span className="text-indigo-300">{tx.contractName}</span>
                  </div>
                )}

                {/* Time */}
                <div className="ml-auto text-xs text-slate-600">
                  {formatTimestamp(tx.timestamp)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Transaction Hash</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400">{shortenAddress(tx.hash, 8)}</span>
                    {getExplorerUrl(tx.chainId, 'tx', tx.hash) !== '#' && (
                      <a
                        href={getExplorerUrl(tx.chainId, 'tx', tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-600 hover:text-slate-400"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </div>

                {tx.contractAddress && (
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Contract Address</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-indigo-400">{shortenAddress(tx.contractAddress, 6)}</span>
                      {getExplorerUrl(tx.chainId, 'address', tx.contractAddress) !== '#' && (
                        <a
                          href={getExplorerUrl(tx.chainId, 'address', tx.contractAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-600 hover:text-slate-400"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-slate-600 mb-1">Network</div>
                  <span className="text-xs text-slate-400">{getChainName(tx.chainId)}</span>
                </div>

                {tx.blockNumber && (
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Block</div>
                    <span className="text-xs text-slate-400">#{tx.blockNumber}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
