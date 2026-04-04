'use client';

import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { useContractStore, useTxStore } from '@/store';
import { getNetwork } from '@/lib/constants/networks';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type Step = 'basic' | 'features' | 'review' | 'deploy';

const DEFAULT = {
  name: '',
  symbol: '',
  supply: '1000000',
  decimals: '18',
  mintable: true,
  burnable: true,
  pausable: false,
  taxEnabled: false,
  buyTax: '3',
  sellTax: '5',
  antiWhale: false,
  maxWallet: '2',
  maxTx: '1',
};

export function TokenWizard() {
  const [step, setStep] = useState<Step>('basic');
  const [form, setForm] = useState(DEFAULT);
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { addContract } = useContractStore();
  const { addTx } = useTxStore();

  const set = (k: keyof typeof DEFAULT, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const buildSource = () => {
    const supply = BigInt(form.supply) * BigInt(10 ** Number(form.decimals));
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ${form.symbol || 'Token'} {
    string public name = "${form.name}";
    string public symbol = "${form.symbol}";
    uint8 public decimals = ${form.decimals};
    uint256 public totalSupply;
    uint256 public maxSupply = ${supply.toString()};
    address public owner;
    bool public paused;
    ${form.taxEnabled ? `uint256 public buyTax = ${form.buyTax};\n    uint256 public sellTax = ${form.sellTax};` : ''}
    ${form.antiWhale ? `uint256 public maxWalletAmount = (maxSupply * ${form.maxWallet}) / 100;\n    uint256 public maxTxAmount = (maxSupply * ${form.maxTx}) / 100;` : ''}

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier whenNotPaused() { require(!paused, "Paused"); _; }

    constructor() {
        owner = msg.sender;
        _mint(msg.sender, maxSupply);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external whenNotPaused returns (bool) {
        allowance[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        ${form.antiWhale ? `require(balanceOf[to] + amount <= maxWalletAmount, "Max wallet exceeded");
        require(amount <= maxTxAmount, "Max tx exceeded");` : ''}
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    ${form.mintable ? `function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }` : ''}
    ${form.burnable ? `function burn(uint256 amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }` : ''}
    ${form.pausable ? `function pause() external onlyOwner { paused = true; }
    function unpause() external onlyOwner { paused = false; }` : ''}
    function transferOwnership(address newOwner) external onlyOwner { owner = newOwner; }
    function renounceOwnership() external onlyOwner { owner = address(0); }
}`;
  };

  const deployToken = async () => {
    if (!walletClient || !publicClient || !address) return;
    setDeploying(true);
    try {
      const source = buildSource();
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, fileName: `${form.symbol}.sol` }),
      });
      const compiled = await res.json();
      if (compiled.error || compiled.errors?.length) {
        throw new Error(compiled.error || compiled.errors[0]);
      }

      const hash = await walletClient.deployContract({
        abi: compiled.abi,
        bytecode: ('0x' + compiled.bytecode) as `0x${string}`,
        args: [],
      });

      toast.loading('Deploying token…', { id: hash });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      toast.dismiss(hash);

      const addr = receipt.contractAddress || '';
      setDeployedAddress(addr);

      addContract({
        id: uuid(),
        name: `${form.name} (${form.symbol})`,
        address: addr,
        chainId,
        abi: compiled.abi,
        deployedAt: Date.now(),
        txHash: hash,
        type: 'ERC20',
        network: getNetwork(chainId)?.shortName ?? String(chainId),
      });

      addTx({
        hash, from: address, to: '', value: '0', status: 'success',
        timestamp: Date.now(), chainId,
        blockNumber: Number(receipt.blockNumber),
        method: 'deploy', contractAddress: addr,
        contractName: form.name,
      });

      toast.success(`${form.symbol} deployed!`);
      setStep('deploy');
    } catch (e: any) {
      toast.error(e.message?.slice(0, 80) || 'Deploy failed');
    } finally {
      setDeploying(false);
    }
  };

  const STEPS: Step[] = ['basic', 'features', 'review', 'deploy'];
  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              i <= stepIdx ? 'bg-indigo-600 text-white' : 'bg-[#1a1a1a] text-[#444]'
            )}>
              {i + 1}
            </div>
            <span className={cn('text-xs capitalize', i === stepIdx ? 'text-white' : 'text-[#444]')}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#2a2a2a]" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card-dark rounded-xl p-5 space-y-4">
        {step === 'basic' && (
          <>
            <h3 className="font-bold text-white">Token Details</h3>
            {[
              { key: 'name', label: 'Token Name', placeholder: 'U-OS Token' },
              { key: 'symbol', label: 'Symbol', placeholder: 'UOS' },
              { key: 'supply', label: 'Total Supply', placeholder: '1000000' },
              { key: 'decimals', label: 'Decimals', placeholder: '18' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-[#555] mb-1">{label}</label>
                <input
                  value={form[key as keyof typeof DEFAULT] as string}
                  onChange={(e) => set(key as keyof typeof DEFAULT, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 bg-[#111] border border-[#2a2a2a] text-white rounded text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </>
        )}

        {step === 'features' && (
          <>
            <h3 className="font-bold text-white">Features</h3>
            {[
              { key: 'mintable', label: 'Mintable', desc: 'Owner can mint new tokens' },
              { key: 'burnable', label: 'Burnable', desc: 'Token holders can burn' },
              { key: 'pausable', label: 'Pausable', desc: 'Owner can pause transfers' },
              { key: 'taxEnabled', label: 'Tax Mechanics', desc: 'Buy/sell tax on transfers' },
              { key: 'antiWhale', label: 'Anti-Whale', desc: 'Max wallet & tx limits' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
                <div>
                  <div className="text-sm text-white">{label}</div>
                  <div className="text-xs text-[#555]">{desc}</div>
                </div>
                <button
                  onClick={() => set(key as keyof typeof DEFAULT, !form[key as keyof typeof DEFAULT])}
                  className={cn(
                    'w-10 h-5 rounded-full transition-all relative',
                    form[key as keyof typeof DEFAULT] ? 'bg-indigo-600' : 'bg-[#2a2a2a]'
                  )}
                >
                  <div className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                    form[key as keyof typeof DEFAULT] ? 'left-5' : 'left-0.5'
                  )} />
                </button>
              </div>
            ))}

            {form.taxEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[{ key: 'buyTax', label: 'Buy Tax %' }, { key: 'sellTax', label: 'Sell Tax %' }].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#555] mb-1">{label}</label>
                    <input
                      value={form[key as keyof typeof DEFAULT] as string}
                      onChange={(e) => set(key as keyof typeof DEFAULT, e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#111] border border-[#2a2a2a] text-white rounded text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {form.antiWhale && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[{ key: 'maxWallet', label: 'Max Wallet %' }, { key: 'maxTx', label: 'Max Tx %' }].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#555] mb-1">{label}</label>
                    <input
                      value={form[key as keyof typeof DEFAULT] as string}
                      onChange={(e) => set(key as keyof typeof DEFAULT, e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#111] border border-[#2a2a2a] text-white rounded text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === 'review' && (
          <>
            <h3 className="font-bold text-white">Review & Deploy</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Name', form.name],
                ['Symbol', form.symbol],
                ['Supply', Number(form.supply).toLocaleString()],
                ['Decimals', form.decimals],
                ['Mintable', form.mintable ? 'Yes' : 'No'],
                ['Burnable', form.burnable ? 'Yes' : 'No'],
                ['Pausable', form.pausable ? 'Yes' : 'No'],
                form.taxEnabled ? ['Tax', `Buy ${form.buyTax}% / Sell ${form.sellTax}%`] : null,
                form.antiWhale ? ['Anti-Whale', `Max wallet ${form.maxWallet}%, Max tx ${form.maxTx}%`] : null,
                ['Network', getNetwork(chainId)?.name ?? `Chain ${chainId}`],
              ].filter((x): x is [string, string] => x !== null).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#1a1a1a] pb-1">
                  <span className="text-[#555]">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            {!isConnected && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
                Connect wallet to deploy
              </div>
            )}
          </>
        )}

        {step === 'deploy' && deployedAddress && (
          <>
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-lg font-bold text-white mb-2">{form.symbol} Deployed!</h3>
              <div className="p-3 bg-[#111] rounded text-xs font-mono text-indigo-300 break-all mb-3">
                {deployedAddress}
              </div>
              <p className="text-[#555] text-xs">Token saved to My Contracts</p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {step !== 'basic' && step !== 'deploy' && (
          <button
            onClick={() => setStep(STEPS[stepIdx - 1])}
            className="px-4 py-2 border border-[#2a2a2a] text-[#888] hover:text-white rounded text-sm transition-all"
          >
            ← Back
          </button>
        )}
        {step !== 'review' && step !== 'deploy' && (
          <button
            onClick={() => setStep(STEPS[stepIdx + 1])}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-semibold transition-all"
          >
            Continue →
          </button>
        )}
        {step === 'review' && (
          <button
            onClick={deployToken}
            disabled={deploying || !isConnected || !form.name || !form.symbol}
            className="flex-1 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white rounded text-sm font-semibold transition-all"
          >
            {deploying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying…
              </span>
            ) : '🚀 Deploy Token'}
          </button>
        )}
        {step === 'deploy' && (
          <button
            onClick={() => { setStep('basic'); setForm(DEFAULT); setDeployedAddress(''); }}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-semibold transition-all"
          >
            Deploy Another
          </button>
        )}
      </div>
    </div>
  );
}
