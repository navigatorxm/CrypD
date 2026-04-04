'use client';

import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters, encodeFunctionData } from 'viem';
import { TOKEN_V2_ABI } from '@/lib/contracts/abis';
import { ERC1967_PROXY_BYTECODE, TOKEN_V2_BYTECODE } from '@/lib/contracts/bytecodes';
import { saveDeployedContract, saveTransaction } from '@/lib/store';
import { getChainName, shortenAddress } from '@/lib/utils';
import { DeployedContract } from '@/types';

type DeployMode = 'implementation' | 'proxy' | 'custom';

export function ContractDeployer() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [mode, setMode] = useState<DeployMode>('implementation');
  const [status, setStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [error, setError] = useState('');

  // TokenV2 init params
  const [initParams, setInitParams] = useState({
    v2Pool: '0x0000000000000000000000000000000000000000',
    v3Pool: '0x0000000000000000000000000000000000000000',
    name: 'U-OS Token',
    symbol: 'U-OS',
    meta: 'https://uos.io/metadata.json',
    maxSupply: '1000000000000000000000000000',
  });

  // Proxy params
  const [proxyParams, setProxyParams] = useState({
    implementation: '',
    calldata: '',
  });

  // Custom deployment
  const [customParams, setCustomParams] = useState({
    bytecode: '',
    abi: '[]',
    constructorArgs: '',
  });

  const [contractName, setContractName] = useState('TokenV2');

  const deploy = async () => {
    if (!walletClient || !publicClient || !address) return;
    setStatus('deploying');
    setError('');
    setTxHash('');
    setDeployedAddress('');

    try {
      let hash: `0x${string}`;
      let deployType: DeployedContract['type'] = 'TokenV2';
      let deployAbi: any[] = TOKEN_V2_ABI as unknown as any[];

      if (mode === 'implementation') {
        // Deploy TokenV2 implementation only (no init)
        hash = await walletClient.deployContract({
          abi: TOKEN_V2_ABI,
          bytecode: TOKEN_V2_BYTECODE as `0x${string}`,
        });
        deployType = 'TokenV2';
        deployAbi = TOKEN_V2_ABI as unknown as any[];
      } else if (mode === 'proxy') {
        // Encode initialize calldata
        const initData = encodeFunctionData({
          abi: TOKEN_V2_ABI,
          functionName: 'initialize',
          args: [
            proxyParams.calldata
              ? (proxyParams.calldata as `0x${string}`)
              : initParams.v2Pool as `0x${string}`,
            initParams.v3Pool as `0x${string}`,
            initParams.name,
            initParams.symbol,
            initParams.meta,
            BigInt(initParams.maxSupply),
          ],
        });

        const impl = proxyParams.implementation || '';
        const data = proxyParams.calldata || initData;

        hash = await walletClient.deployContract({
          abi: [
            {
              inputs: [
                { name: '_logic', type: 'address' },
                { name: '_data', type: 'bytes' },
              ],
              stateMutability: 'payable',
              type: 'constructor',
            },
          ],
          bytecode: ERC1967_PROXY_BYTECODE as `0x${string}`,
          args: [impl as `0x${string}`, data as `0x${string}`],
        });
        deployType = 'ERC1967Proxy';
        deployAbi = TOKEN_V2_ABI as unknown as any[]; // proxied token ABI
      } else {
        // Custom
        let args: any[] = [];
        if (customParams.constructorArgs.trim()) {
          try {
            args = JSON.parse(customParams.constructorArgs);
          } catch {
            args = [];
          }
        }
        let parsedAbi: any[] = [];
        try {
          parsedAbi = JSON.parse(customParams.abi);
        } catch {
          parsedAbi = [];
        }

        hash = await walletClient.deployContract({
          abi: parsedAbi,
          bytecode: customParams.bytecode as `0x${string}`,
          args,
        });
        deployType = 'Custom';
        deployAbi = parsedAbi;
      }

      setTxHash(hash);

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const addr = receipt.contractAddress || '';
      setDeployedAddress(addr);
      setStatus('success');

      // Save to store
      const contract: DeployedContract = {
        id: `${chainId}-${addr}`,
        name: contractName,
        address: addr,
        chainId,
        abi: deployAbi,
        deployedAt: Date.now(),
        txHash: hash,
        type: deployType,
      };
      saveDeployedContract(contract);

      saveTransaction({
        hash,
        from: address,
        to: '',
        value: '0',
        data: '',
        status: 'success',
        timestamp: Date.now(),
        chainId,
        blockNumber: Number(receipt.blockNumber),
        method: 'deploy',
        contractAddress: addr,
        contractName,
      });
    } catch (e: any) {
      setStatus('error');
      setError(e.message || 'Deployment failed');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-48 card-dark rounded-2xl border-dashed border-2 border-indigo-500/30">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-3">🔌</div>
          <p>Connect your wallet to deploy contracts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Deploy Contract</h2>
          <p className="text-slate-400 text-sm mt-1">
            Deploy on <span className="text-indigo-400 font-medium">{getChainName(chainId)}</span>
          </p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
        {([
          { id: 'implementation', label: '🔧 Implementation' },
          { id: 'proxy', label: '🔄 Proxy (Full Deploy)' },
          { id: 'custom', label: '📝 Custom' },
        ] as { id: DeployMode; label: string }[]).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card-dark rounded-2xl p-6 space-y-4">
          {/* Contract name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Contract Name (label)</label>
            <input
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {mode === 'implementation' && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
              <p className="text-sm text-slate-400">
                Deploys the <strong className="text-indigo-300">TokenV2 implementation</strong> contract only.
                No initialization — this is the logic contract for proxy deployment.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                After deploying, use the address as the <code className="text-cyan-400">_logic</code> parameter when deploying a proxy.
              </p>
            </div>
          )}

          {mode === 'proxy' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Implementation Address <span className="text-red-400">*</span>
                </label>
                <input
                  value={proxyParams.implementation}
                  onChange={(e) => setProxyParams({ ...proxyParams, implementation: e.target.value })}
                  placeholder="0x... (TokenV2 implementation)"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Initialize Parameters</h4>
                {[
                  { key: 'v2Pool', label: 'Uniswap V2 Pool', placeholder: '0x...' },
                  { key: 'v3Pool', label: 'Uniswap V3 Pool', placeholder: '0x...' },
                  { key: 'name', label: 'Token Name', placeholder: 'U-OS Token' },
                  { key: 'symbol', label: 'Token Symbol', placeholder: 'U-OS' },
                  { key: 'meta', label: 'Metadata URI', placeholder: 'https://...' },
                  { key: 'maxSupply', label: 'Max Supply (wei)', placeholder: '1000000000000000000000000000' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="mb-3">
                    <label className="block text-xs text-slate-500 mb-1">{label}</label>
                    <input
                      value={initParams[key as keyof typeof initParams]}
                      onChange={(e) => setInitParams({ ...initParams, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Custom Init Calldata (optional — overrides params above)
                </label>
                <input
                  value={proxyParams.calldata}
                  onChange={(e) => setProxyParams({ ...proxyParams, calldata: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {mode === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Bytecode</label>
                <textarea
                  value={customParams.bytecode}
                  onChange={(e) => setCustomParams({ ...customParams, bytecode: e.target.value })}
                  placeholder="0x608060..."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">ABI (JSON)</label>
                <textarea
                  value={customParams.abi}
                  onChange={(e) => setCustomParams({ ...customParams, abi: e.target.value })}
                  placeholder='[{"inputs":[],"type":"constructor"}]'
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Constructor Args (JSON array)</label>
                <input
                  value={customParams.constructorArgs}
                  onChange={(e) => setCustomParams({ ...customParams, constructorArgs: e.target.value })}
                  placeholder='["0x...", 1000]'
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <button
            onClick={deploy}
            disabled={status === 'deploying'}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
          >
            {status === 'deploying' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying...
              </span>
            ) : (
              '🚀 Deploy Contract'
            )}
          </button>
        </div>

        {/* Result panel */}
        <div className="card-dark rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Deployment Result</h3>

          {status === 'idle' && (
            <div className="flex items-center justify-center h-40 text-slate-600 text-center">
              <div>
                <div className="text-5xl mb-3">🚀</div>
                <p>Configure and deploy your contract</p>
              </div>
            </div>
          )}

          {status === 'deploying' && (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Broadcasting transaction...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-2xl">✓</span>
                <span className="font-bold text-lg">Deployed Successfully!</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Contract Address</div>
                  <div className="font-mono text-sm text-indigo-300 break-all">{deployedAddress}</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
                  <div className="font-mono text-sm text-cyan-300 break-all">{txHash}</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Network</div>
                  <div className="text-sm text-white">{getChainName(chainId)} (ID: {chainId})</div>
                </div>
              </div>

              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
                Contract saved to your dashboard. View it in the <strong>Contracts</strong> tab.
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-2xl">✗</span>
                <span className="font-bold text-lg">Deployment Failed</span>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-300 text-sm break-all">{error}</p>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="text-sm text-slate-400 hover:text-slate-200 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
