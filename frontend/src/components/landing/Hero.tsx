'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      {/* Rotating ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] border border-indigo-500/10 rounded-full spin-slow" />
        <div className="absolute w-[400px] h-[400px] border border-cyan-500/10 rounded-full" style={{ animation: 'spin-slow 30s linear infinite reverse' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full pulse-slow" />
          Launching Soon — Join the Revolution
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
          <span className="block text-white">U-OS</span>
          <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animated-gradient text-glow">
            Token
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 mb-4 max-w-3xl mx-auto">
          The decentralized operating system for Web3 infrastructure.
        </p>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
          U-OS powers the next generation of on-chain applications. Earn, govern, and participate through tokens and exclusive NFTs.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) =>
              mounted ? (
                <button
                  onClick={openConnectModal}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all glow-indigo text-lg"
                >
                  Connect Wallet
                </button>
              ) : null
            }
          </ConnectButton.Custom>

          <Link
            href="/admin"
            className="px-8 py-4 border border-indigo-500/40 hover:border-indigo-500/70 text-indigo-300 hover:text-white font-bold rounded-xl transition-all hover:bg-indigo-500/10 text-lg"
          >
            Admin Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: 'Max Supply', value: '1B', unit: 'U-OS' },
            { label: 'Networks', value: '15+', unit: 'Chains' },
            { label: 'Token Type', value: 'ERC20', unit: 'Upgradeable' },
            { label: 'Status', value: 'Soon', unit: 'Airdrop' },
          ].map((stat) => (
            <div key={stat.label} className="card-dark rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-indigo-400 font-medium">{stat.unit}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-slate-600 rounded-full float" />
        </div>
      </div>
    </section>
  );
}
