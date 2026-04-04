'use client';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'active',
    items: [
      'Smart contract development & audit',
      'ERC1967 proxy deployment system',
      'Multi-chain support',
      'Platform frontend launch',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Token Launch',
    status: 'upcoming',
    items: [
      'U-OS Token deployment',
      'Community airdrop campaign',
      'Liquidity pool creation',
      'Transfer constraints lift',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'NFT Collection',
    status: 'upcoming',
    items: [
      'U-OS NFT collection reveal',
      'NFT mint event',
      'Holder benefits & utilities',
      'Secondary market listings',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Ecosystem',
    status: 'upcoming',
    items: [
      'Governance protocol',
      'Staking & yield mechanisms',
      'Cross-chain bridge',
      'Partner integrations',
    ],
  },
];

export function Roadmap() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Roadmap</h2>
          <p className="text-slate-400 text-lg">Building the future, one milestone at a time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((p, i) => (
            <div key={p.phase} className="relative">
              {/* Connector */}
              {i < phases.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent z-0" />
              )}

              <div
                className={`card-dark rounded-2xl p-6 relative z-10 ${
                  p.status === 'active' ? 'border-indigo-500/50 glow-indigo' : ''
                }`}
              >
                {p.status === 'active' && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                    LIVE
                  </div>
                )}

                <div className="text-xs font-bold text-indigo-400 mb-1">{p.phase}</div>
                <h3 className="text-lg font-bold text-white mb-4">{p.title}</h3>

                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                          p.status === 'active'
                            ? 'bg-green-400'
                            : 'border border-slate-600'
                        }`}
                      />
                      <span className={p.status === 'active' ? 'text-slate-300' : 'text-slate-500'}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
