'use client';

const features = [
  {
    icon: '🔐',
    title: 'Upgradeable by Design',
    desc: 'Built on ERC1967 proxy pattern. Deploy once, upgrade forever — no locked-in logic.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: '⚡',
    title: 'EIP-2612 Permit',
    desc: 'Gasless approvals via off-chain signatures. Sign once, approve without extra transactions.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: '🛡️',
    title: 'Transfer Protection',
    desc: 'Built-in Uniswap V2/V3 transfer constraints protect early holders from bot manipulation.',
    color: 'from-violet-500 to-pink-500',
  },
  {
    icon: '🌐',
    title: 'Multi-Chain',
    desc: 'Deploy on Ethereum, BNB Chain, Polygon, Arbitrum, Base, and more. One token, many chains.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: '🎨',
    title: 'NFT Collection',
    desc: 'Exclusive U-OS NFTs coming soon. Unique utility, governance power, and community access.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: '🎁',
    title: 'Airdrop Program',
    desc: 'Early community members will receive U-OS tokens and NFTs through our upcoming airdrop campaign.',
    color: 'from-rose-500 to-red-500',
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Built for the{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            U-OS is engineered from the ground up for scalability, security, and seamless cross-chain deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-dark rounded-2xl p-6 group cursor-default transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
