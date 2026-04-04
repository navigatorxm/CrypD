'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  avalanche,
  avalancheFuji,
  hardhat,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'U-OS Token Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'uos-token-platform',
  chains: [
    mainnet,
    sepolia,
    bsc,
    bscTestnet,
    polygon,
    polygonMumbai,
    arbitrum,
    arbitrumSepolia,
    optimism,
    optimismSepolia,
    base,
    baseSepolia,
    avalanche,
    avalancheFuji,
    hardhat,
  ],
  ssr: true,
});
