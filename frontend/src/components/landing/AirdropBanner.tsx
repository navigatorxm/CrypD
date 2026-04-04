'use client';

import { useState } from 'react';

export function AirdropBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-violet-900/60 to-cyan-900/40" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 p-10 md:p-16 text-center">
            {/* NFT Preview placeholder */}
            <div className="inline-flex mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl glow-indigo float">
                  🔮
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm">
                  ✨
                </div>
              </div>
            </div>

            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 border border-indigo-500/40 text-indigo-300 text-sm font-bold mb-4">
              AIRDROP INCOMING
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Don&apos;t Miss the{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Drop
              </span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Register your wallet address to be whitelisted for the upcoming U-OS token airdrop and exclusive NFT mint.
              Early community members get priority access.
            </p>

            {submitted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/40 text-green-400 rounded-xl font-medium">
                <span>✓</span> You&apos;re on the list! We&apos;ll notify you.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-black/40 border border-indigo-500/30 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-indigo-500/70 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all whitespace-nowrap glow-indigo"
                >
                  Register Now
                </button>
              </form>
            )}

            <p className="text-slate-600 text-xs mt-4">
              No spam. Unsubscribe anytime. We&apos;ll only send airdrop notifications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
