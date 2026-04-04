'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId, usePublicClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getDeployedContracts, getTransactions } from '@/lib/store';
import { getChainName, shortenAddress, formatBigInt } from '@/lib/utils';
import Link from 'next/link';

export function AdminOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const publicClient = usePublicClient();

  const [contracts, setContracts] = useState(getDeployedContracts());
  const [txs, setTxs] = useState(getTransactions());
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  useEffect(() => {
    setContracts(getDeployedContracts());
    setTxs(getTransactions());
  }, []);

  useEffect(() => {
    if (!publicClient) return;
    publicClient.getBlockNumber().then(setBlockNumber).catch(() => {});
  }, [publicClient, chainId]);

  const recentTxs = txs.slice(0, 5);
  const recentContracts = contracts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">
          Control panel for U-OS token deployment and management
        </p>
      </div>

      {!isConnected ? (
        <div className="card-dark rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-slate-400 mb-6">Connect to access the admin dashboard and manage contracts</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      ) : (
        <>
          {/* Wallet info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-dark rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Connected Wallet</div>
              <div className="font-mono text-sm text-white">{shortenAddress(address!, 6)}</div>
            </div>
            <div className="card-dark rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Balance</div>
              <div className="font-bold text-white">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '—'}
              </div>
            </div>
            <div className="card-dark rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Network</div>
              <div className="text-white font-medium">{getChainName(chainId)}</div>
              <div className="text-xs text-slate-600">Chain ID: {chainId}</div>
            </div>
            <div className="card-dark rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Latest Block</div>
              <div className="font-mono text-white">{blockNumber ? `#${blockNumber.toLocaleString()}` : '—'}</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500 uppercase font-semibold">Deployed Contracts</div>
                <div className="text-2xl font-black text-indigo-400">{contracts.length}</div>
              </div>
              <Link href="/admin/contracts" className="text-xs text-indigo-400 hover:text-indigo-300">
                Manage →
              </Link>
            </div>
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500 uppercase font-semibold">Transactions</div>
                <div className="text-2xl font-black text-cyan-400">{txs.length}</div>
              </div>
              <Link href="/admin/transactions" className="text-xs text-cyan-400 hover:text-cyan-300">
                View All →
              </Link>
            </div>
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500 uppercase font-semibold">Success Rate</div>
                <div className="text-2xl font-black text-green-400">
                  {txs.length > 0
                    ? `${Math.round((txs.filter((t) => t.status === 'success').length / txs.length) * 100)}%`
                    : '—'}
                </div>
              </div>
              <div className="text-xs text-slate-600">
                {txs.filter((t) => t.status === 'success').length} success /
                {txs.filter((t) => t.status === 'failed').length} failed
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/deploy" className="card-dark rounded-xl p-5 hover:border-indigo-500/40 transition-all group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                <div className="font-bold text-white mb-1">Deploy TokenV2</div>
                <div className="text-sm text-slate-500">Deploy implementation + proxy on any chain</div>
              </Link>
              <Link href="/admin/contracts" className="card-dark rounded-xl p-5 hover:border-cyan-500/40 transition-all group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                <div className="font-bold text-white mb-1">Call Functions</div>
                <div className="text-sm text-slate-500">Read or write to deployed contracts</div>
              </Link>
              <Link href="/admin/transactions" className="card-dark rounded-xl p-5 hover:border-violet-500/40 transition-all group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                <div className="font-bold text-white mb-1">Transactions</div>
                <div className="text-sm text-slate-500">View full transaction history</div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent contracts */}
            <div className="card-dark rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm">Recent Contracts</h3>
                <Link href="/admin/contracts" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
              </div>
              {recentContracts.length === 0 ? (
                <p className="text-slate-600 text-sm">No contracts deployed yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentContracts.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {c.type === 'TokenV2' ? 'T' : c.type === 'ERC1967Proxy' ? 'P' : 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{c.name}</div>
                        <div className="font-mono text-xs text-slate-500 truncate">{shortenAddress(c.address)}</div>
                      </div>
                      <div className="text-xs text-slate-600">{getChainName(c.chainId)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent transactions */}
            <div className="card-dark rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
                <Link href="/admin/transactions" className="text-xs text-cyan-400 hover:text-cyan-300">View all</Link>
              </div>
              {recentTxs.length === 0 ? (
                <p className="text-slate-600 text-sm">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentTxs.map((tx) => (
                    <div key={tx.hash} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        tx.status === 'success' ? 'bg-green-400' :
                        tx.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-white truncate">{tx.method || 'deploy'}()</div>
                        <div className="text-xs text-slate-500">{tx.contractName}</div>
                      </div>
                      <div className="text-xs text-slate-600">{getChainName(tx.chainId)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
