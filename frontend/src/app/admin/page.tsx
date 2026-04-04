'use client';

import { useAccount, useBalance, useChainId, usePublicClient } from 'wagmi';
import { useContractStore, useTxStore } from '@/store';
import { getNetwork, getExplorerUrl } from '@/lib/constants/networks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { contracts } = useContractStore();
  const { transactions } = useTxStore();
  const publicClient = usePublicClient();
  const [block, setBlock] = useState('—');
  const [gasPrice, setGasPrice] = useState('—');
  const network = getNetwork(chainId);

  useEffect(() => {
    if (!publicClient) return;
    let mounted = true;
    const poll = async () => {
      try {
        const [bn, gp] = await Promise.all([publicClient.getBlockNumber(), publicClient.getGasPrice()]);
        if (!mounted) return;
        setBlock(bn.toLocaleString());
        setGasPrice((Number(gp) / 1e9).toFixed(1) + ' gwei');
      } catch {}
    };
    poll();
    const id = setInterval(poll, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, [publicClient, chainId]);

  return (
    <div className="p-5 space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-[#555] mt-0.5">{network ? network.name : 'No network connected'}</p>
        </div>
        {!isConnected && <ConnectButton />}
      </div>

      {!isConnected ? (
        <div className="p-12 bg-[#111] border border-[#1f1f1f] rounded-xl text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-[#555] text-sm mb-5">Connect MetaMask or any Web3 wallet to start</p>
          <ConnectButton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Wallet', value: `${address?.slice(0,6)}…${address?.slice(-4)}`, sub: balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '' },
              { label: 'Block', value: block, sub: network?.shortName ?? '' },
              { label: 'Gas Price', value: gasPrice, sub: '' },
              { label: 'Contracts', value: String(contracts.length), sub: `${transactions.length} transactions` },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-[#111] border border-[#1f1f1f] rounded-lg">
                <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-lg font-black text-white">{s.value}</div>
                {s.sub && <div className="text-[10px] text-[#555]">{s.sub}</div>}
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: '/admin/editor', icon: '⌨', label: 'IDE + Compiler', color: 'text-indigo-400' },
                { href: '/admin/tokens', icon: '◎', label: 'Token Factory', color: 'text-cyan-400' },
                { href: '/admin/nft', icon: '◈', label: 'NFT Studio', color: 'text-purple-400' },
                { href: '/admin/deploy', icon: '⬆', label: 'Deploy Contract', color: 'text-green-400' },
                { href: '/admin/contracts', icon: '⬡', label: 'My Contracts', color: 'text-orange-400' },
                { href: '/admin/transactions', icon: '◈', label: 'Transactions', color: 'text-yellow-400' },
                { href: '/admin/terminal', icon: '$', label: 'Terminal', color: 'text-green-300' },
                { href: '/', icon: '⌂', label: 'Landing Page', color: 'text-[#555]' },
              ].map((a) => (
                <Link key={a.href} href={a.href}
                  className="p-4 bg-[#111] border border-[#1f1f1f] hover:border-[#333] rounded-lg flex items-center gap-3 transition-all group">
                  <span className={`text-xl ${a.color}`}>{a.icon}</span>
                  <span className="text-sm text-[#888] group-hover:text-white transition-colors">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">Contracts</span>
                <Link href="/admin/contracts" className="text-[10px] text-indigo-400">View all</Link>
              </div>
              {contracts.length === 0 ? (
                <p className="text-[#333] text-xs py-4 text-center">None deployed yet</p>
              ) : contracts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                    {c.type?.charAt(0) ?? 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{c.name}</div>
                    <div className="text-[10px] text-[#444] font-mono">{c.address?.slice(0,14)}…</div>
                  </div>
                  {getExplorerUrl(c.chainId, 'address', c.address) !== '#' && (
                    <a href={getExplorerUrl(c.chainId, 'address', c.address)} target="_blank" rel="noreferrer"
                      className="text-[10px] text-[#333] hover:text-indigo-400">↗</a>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">Transactions</span>
                <Link href="/admin/transactions" className="text-[10px] text-cyan-400">View all</Link>
              </div>
              {transactions.length === 0 ? (
                <p className="text-[#333] text-xs py-4 text-center">No transactions yet</p>
              ) : transactions.slice(0, 5).map((tx) => (
                <div key={tx.hash} className="flex items-center gap-3 py-1.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.status === 'success' ? 'bg-green-400' : tx.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-mono">{tx.method ?? 'deploy'}()</div>
                    <div className="text-[10px] text-[#444] truncate">{tx.contractName}</div>
                  </div>
                  {getExplorerUrl(tx.chainId, 'tx', tx.hash) !== '#' && (
                    <a href={getExplorerUrl(tx.chainId, 'tx', tx.hash)} target="_blank" rel="noreferrer"
                      className="text-[10px] text-[#333] hover:text-cyan-400">↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
