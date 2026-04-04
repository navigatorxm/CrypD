import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatBigInt(value: bigint, decimals = 18, displayDecimals = 4): string {
  const divisor = 10n ** BigInt(decimals);
  const intPart = value / divisor;
  const fracPart = value % divisor;
  const fracStr = fracPart.toString().padStart(decimals, '0').slice(0, displayDecimals);
  return `${intPart.toLocaleString()}.${fracStr}`;
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getExplorerUrl(chainId: number, type: 'tx' | 'address', value: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    56: 'https://bscscan.com',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    8453: 'https://basescan.org',
    43114: 'https://snowtrace.io',
    31337: '',
  };
  const base = explorers[chainId] || '';
  if (!base) return '#';
  return `${base}/${type}/${value}`;
}

export function getChainName(chainId: number): string {
  const names: Record<number, string> = {
    1: 'Ethereum',
    11155111: 'Sepolia',
    56: 'BNB Chain',
    97: 'BNB Testnet',
    137: 'Polygon',
    80001: 'Mumbai',
    42161: 'Arbitrum One',
    421614: 'Arbitrum Sepolia',
    10: 'Optimism',
    11155420: 'OP Sepolia',
    8453: 'Base',
    84532: 'Base Sepolia',
    43114: 'Avalanche',
    43113: 'Fuji',
    31337: 'Hardhat',
  };
  return names[chainId] || `Chain ${chainId}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function isValidBytes32(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export function parseInputValue(value: string, type: string): any {
  if (type === 'uint256' || type === 'uint8' || type.startsWith('uint')) {
    return BigInt(value);
  }
  if (type === 'bool') {
    return value === 'true' || value === '1';
  }
  if (type === 'address') {
    return value as `0x${string}`;
  }
  if (type.startsWith('bytes')) {
    return value as `0x${string}`;
  }
  if (type.includes('[]')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',').map((v) => v.trim());
    }
  }
  return value;
}
