export interface Network {
  id: number;
  name: string;
  shortName: string;
  symbol: string;
  rpcUrl: string;
  explorer: string;
  faucet?: string;
  color: string;
  testnet: boolean;
  icon: string;
}

export const NETWORKS: Record<number, Network> = {
  1: {
    id: 1, name: 'Ethereum Mainnet', shortName: 'ETH', symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com', explorer: 'https://etherscan.io',
    color: '#627EEA', testnet: false, icon: '⟠',
  },
  11155111: {
    id: 11155111, name: 'Sepolia Testnet', shortName: 'SEP', symbol: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org', explorer: 'https://sepolia.etherscan.io',
    faucet: 'https://sepoliafaucet.com', color: '#627EEA', testnet: true, icon: '⟠',
  },
  56: {
    id: 56, name: 'BNB Smart Chain', shortName: 'BSC', symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org', explorer: 'https://bscscan.com',
    color: '#F3BA2F', testnet: false, icon: '⬡',
  },
  97: {
    id: 97, name: 'BSC Testnet', shortName: 'BSC-T', symbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545', explorer: 'https://testnet.bscscan.com',
    faucet: 'https://testnet.binance.org/faucet-smart', color: '#F3BA2F', testnet: true, icon: '⬡',
  },
  137: {
    id: 137, name: 'Polygon', shortName: 'MATIC', symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com', explorer: 'https://polygonscan.com',
    color: '#8247E5', testnet: false, icon: '⬟',
  },
  80001: {
    id: 80001, name: 'Polygon Mumbai', shortName: 'MUM', symbol: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com', explorer: 'https://mumbai.polygonscan.com',
    faucet: 'https://faucet.polygon.technology', color: '#8247E5', testnet: true, icon: '⬟',
  },
  42161: {
    id: 42161, name: 'Arbitrum One', shortName: 'ARB', symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc', explorer: 'https://arbiscan.io',
    color: '#28A0F0', testnet: false, icon: '◎',
  },
  421614: {
    id: 421614, name: 'Arbitrum Sepolia', shortName: 'ARB-T', symbol: 'ETH',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc', explorer: 'https://sepolia.arbiscan.io',
    faucet: 'https://faucet.triangleplatform.com/arbitrum/sepolia', color: '#28A0F0', testnet: true, icon: '◎',
  },
  10: {
    id: 10, name: 'Optimism', shortName: 'OP', symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io', explorer: 'https://optimistic.etherscan.io',
    color: '#FF0420', testnet: false, icon: '⬤',
  },
  8453: {
    id: 8453, name: 'Base', shortName: 'BASE', symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org', explorer: 'https://basescan.org',
    color: '#0052FF', testnet: false, icon: '🔵',
  },
  84532: {
    id: 84532, name: 'Base Sepolia', shortName: 'BASE-T', symbol: 'ETH',
    rpcUrl: 'https://sepolia.base.org', explorer: 'https://sepolia.basescan.org',
    faucet: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet', color: '#0052FF', testnet: true, icon: '🔵',
  },
  43114: {
    id: 43114, name: 'Avalanche', shortName: 'AVAX', symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', explorer: 'https://snowtrace.io',
    color: '#E84142', testnet: false, icon: '▲',
  },
  31337: {
    id: 31337, name: 'Hardhat / Localhost', shortName: 'LOCAL', symbol: 'ETH',
    rpcUrl: 'http://127.0.0.1:8545', explorer: '',
    color: '#FFF200', testnet: true, icon: '⚒',
  },
};

export function getNetwork(chainId: number): Network | undefined {
  return NETWORKS[chainId];
}

export function getExplorerUrl(chainId: number, type: 'tx' | 'address', value: string): string {
  const net = NETWORKS[chainId];
  if (!net?.explorer) return '#';
  return `${net.explorer}/${type}/${value}`;
}

export const MAINNET_IDS = [1, 56, 137, 42161, 10, 8453, 43114];
export const TESTNET_IDS = [11155111, 97, 80001, 421614, 84532, 31337];
