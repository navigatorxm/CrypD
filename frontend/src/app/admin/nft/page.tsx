import { NFTDeployer } from '@/components/nft/NFTDeployer';

export const metadata = { title: 'NFT Studio — U-OS' };

export default function NFTPage() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">NFT Studio</h1>
        <p className="text-xs text-[#555] mt-0.5">Deploy ERC-721 collections or ERC-1155 multi-token contracts</p>
      </div>
      <NFTDeployer />
    </div>
  );
}
