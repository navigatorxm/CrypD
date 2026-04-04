'use client';

const allocations = [
  { label: 'Community & Airdrop', pct: 30, color: '#6366f1' },
  { label: 'Ecosystem & Dev', pct: 25, color: '#06b6d4' },
  { label: 'Team & Advisors', pct: 15, color: '#8b5cf6' },
  { label: 'Treasury', pct: 15, color: '#10b981' },
  { label: 'Liquidity', pct: 10, color: '#f59e0b' },
  { label: 'Marketing', pct: 5, color: '#ef4444' },
];

export function Tokenomics() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Tokenomics
          </h2>
          <p className="text-slate-400 text-lg">
            Fair, community-first distribution designed for long-term sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual bars */}
          <div className="space-y-4">
            {allocations.map((a) => (
              <div key={a.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{a.label}</span>
                  <span className="font-bold" style={{ color: a.color }}>{a.pct}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${a.pct}%`, background: a.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Token details */}
          <div className="card-dark rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-white">Token Details</h3>
            {[
              { key: 'Token Name', value: 'U-OS Token' },
              { key: 'Symbol', value: 'U-OS' },
              { key: 'Standard', value: 'ERC-20 (Upgradeable)' },
              { key: 'Max Supply', value: '1,000,000,000' },
              { key: 'Decimals', value: '18' },
              { key: 'Proxy', value: 'ERC-1967' },
              { key: 'Permit', value: 'EIP-2612' },
              { key: 'Network', value: 'Multi-Chain' },
            ].map(({ key, value }) => (
              <div key={key} className="flex justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-500 text-sm">{key}</span>
                <span className="text-slate-200 font-medium text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
