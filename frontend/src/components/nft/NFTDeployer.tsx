'use client';

import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { useContractStore, useTxStore } from '@/store';
import { CONTRACT_TEMPLATES } from '@/lib/constants/templates';
import { getNetwork } from '@/lib/constants/networks';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type NFTType = 'erc721' | 'erc1155';

export function NFTDeployer() {
  const [nftType, setNftType] = useState<NFTType>('erc721');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState('');
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    maxSupply: '10000',
    mintPrice: '0.01',
    notRevealedURI: 'https://your-api.com/hidden.json',
    baseURI: '',
  });

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { addContract } = useContractStore();
  const { addTx } = useTxStore();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const deployNFT = async () => {
    if (!walletClient || !publicClient || !address || !form.name) return;
    setDeploying(true);
    try {
      const tmpl = CONTRACT_TEMPLATES[nftType];
      const source = tmpl.source
        .replace(/{{NAME}}/g, form.symbol || 'MyNFT');

      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, fileName: `${form.symbol}.sol` }),
      });
      const compiled = await res.json();
      if (compiled.error || compiled.errors?.length) {
        throw new Error(compiled.error || compiled.errors[0]);
      }

      const mintPriceWei = BigInt(Math.floor(parseFloat(form.mintPrice) * 1e18));
      const args = nftType === 'erc721'
        ? [form.name, form.symbol, BigInt(form.maxSupply), mintPriceWei, form.notRevealedURI]
        : [form.name, form.symbol, form.baseURI || 'https://your-api.com/{id}.json'];

      const hash = await walletClient.deployContract({
        abi: compiled.abi,
        bytecode: ('0x' + compiled.bytecode) as `0x${string}`,
        args,
      });

      toast.loading('Deploying NFT contract…', { id: hash });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      toast.dismiss(hash);

      const addr = receipt.contractAddress || '';
      setDeployed(addr);

      addContract({
        id: uuid(),
        name: `${form.name} NFT`,
        address: addr,
        chainId,
        abi: compiled.abi,
        deployedAt: Date.now(),
        txHash: hash,
        type: nftType === 'erc721' ? 'ERC721' : 'ERC1155',
        network: getNetwork(chainId)?.shortName ?? String(chainId),
      });

      addTx({
        hash, from: address, to: '', value: '0', status: 'success',
        timestamp: Date.now(), chainId,
        blockNumber: Number(receipt.blockNumber),
        method: 'deploy', contractAddress: addr,
        contractName: form.name,
      });

      toast.success(`${form.name} NFT deployed!`);
    } catch (e: any) {
      toast.error(e.message?.slice(0, 80) || 'Deploy failed');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Type selector */}
      <div className="flex gap-2 p-1 bg-[#111] rounded-lg border border-[#1f1f1f] w-fit">
        {([
          { id: 'erc721', label: 'ERC-721', desc: 'Unique NFTs' },
          { id: 'erc1155', label: 'ERC-1155', desc: 'Multi-token' },
        ] as { id: NFTType; label: string; desc: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => { setNftType(t.id); setDeployed(''); }}
            className={cn(
              'px-4 py-2 rounded text-sm font-medium transition-all',
              nftType === t.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30' : 'text-[#555] hover:text-white'
            )}
          >
            {t.label} <span className="text-[10px] text-[#555]">({t.desc})</span>
          </button>
        ))}
      </div>

      {deployed ? (
        <div className="card-dark rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-lg font-bold text-white mb-2">{form.name} Deployed!</h3>
          <div className="p-3 bg-[#111] rounded text-xs font-mono text-indigo-300 break-all mb-3">{deployed}</div>
          <button
            onClick={() => { setDeployed(''); setForm({ name: '', symbol: '', maxSupply: '10000', mintPrice: '0.01', notRevealedURI: 'https://your-api.com/hidden.json', baseURI: '' }); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm transition-all"
          >
            Deploy Another
          </button>
        </div>
      ) : (
        <div className="card-dark rounded-xl p-5 space-y-4">
          {[
            { key: 'name', label: 'Collection Name', placeholder: 'My NFT Collection' },
            { key: 'symbol', label: 'Symbol', placeholder: 'MNFT' },
            ...(nftType === 'erc721' ? [
              { key: 'maxSupply', label: 'Max Supply', placeholder: '10000' },
              { key: 'mintPrice', label: 'Mint Price (ETH)', placeholder: '0.01' },
              { key: 'notRevealedURI', label: 'Hidden URI (pre-reveal)', placeholder: 'https://...' },
            ] : [
              { key: 'baseURI', label: 'Base URI', placeholder: 'https://api.example.com/{id}.json' },
            ]),
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-[#555] mb-1">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-[#111] border border-[#2a2a2a] text-white rounded text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}

          {!isConnected && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
              Connect wallet to deploy
            </div>
          )}

          <button
            onClick={deployNFT}
            disabled={deploying || !isConnected || !form.name}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded transition-all"
          >
            {deploying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying…
              </span>
            ) : `🚀 Deploy ${nftType === 'erc721' ? 'ERC-721' : 'ERC-1155'} Collection`}
          </button>
        </div>
      )}
    </div>
  );
}
