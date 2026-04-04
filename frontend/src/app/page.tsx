import { NavBar } from '@/components/shared/NavBar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Tokenomics } from '@/components/landing/Tokenomics';
import { Roadmap } from '@/components/landing/Roadmap';
import { AirdropBanner } from '@/components/landing/AirdropBanner';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="pt-16">
        <Hero />
        <Features />
        <Tokenomics />
        <Roadmap />
        <AirdropBanner />
        <footer className="border-t border-indigo-500/20 py-8 px-4 text-center text-slate-600 text-sm">
          <p>© 2024 U-OS Token Platform. Built on Ethereum and beyond.</p>
        </footer>
      </main>
    </>
  );
}
