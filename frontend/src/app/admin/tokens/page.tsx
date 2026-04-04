import { TokenWizard } from '@/components/tokens/TokenWizard';

export const metadata = { title: 'Token Factory — U-OS' };

export default function TokensPage() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Token Factory</h1>
        <p className="text-xs text-[#555] mt-0.5">Deploy ERC20 tokens with custom features — mintable, burnable, tax, anti-whale</p>
      </div>
      <TokenWizard />
    </div>
  );
}
