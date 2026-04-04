'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getNetwork } from '@/lib/constants/networks';
import { useUIStore } from '@/store';

function shortenAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function Header() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { sidebarCollapsed, terminalOpen, setTerminalOpen } = useUIStore();
  const network = getNetwork(chainId);

  return (
    <header
      className="fixed top-0 right-0 z-30 h-12 flex items-center gap-3 px-4 bg-[#0d0d0d] border-b border-[#1f1f1f] transition-all"
      style={{ left: sidebarCollapsed ? '3.5rem' : '13rem' }}
    >
      {/* Network badge */}
      {isConnected && network && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-xs">
          <span>{network.icon}</span>
          <span className="text-[#aaa]">{network.shortName}</span>
          {network.testnet && (
            <span className="px-1 rounded bg-yellow-500/20 text-yellow-400 text-[9px] font-bold">TEST</span>
          )}
        </div>
      )}

      {/* Balance */}
      {isConnected && balance && (
        <div className="text-xs text-[#555] hidden md:block">
          {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
        </div>
      )}

      <div className="flex-1" />

      {/* Terminal toggle */}
      <button
        onClick={() => setTerminalOpen(!terminalOpen)}
        className={`px-2 py-1 rounded text-xs font-mono transition-all border ${
          terminalOpen
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555] hover:text-white'
        }`}
      >
        $ term
      </button>

      {/* Wallet */}
      <ConnectButton
        showBalance={false}
        chainStatus="none"
        accountStatus="avatar"
      />
    </header>
  );
}
