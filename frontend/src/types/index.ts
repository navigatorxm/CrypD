export interface DeployedContract {
  id: string;
  name: string;
  address: string;
  chainId: number;
  abi: any[];
  bytecode?: string;
  deployedAt: number;
  txHash: string;
  type: 'TokenV2' | 'ERC1967Proxy' | 'Custom';
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  chainId: number;
  blockNumber?: number;
  gasUsed?: string;
  method?: string;
  contractAddress?: string;
  contractName?: string;
}

export interface ContractFunction {
  name: string;
  inputs: FunctionInput[];
  outputs: FunctionOutput[];
  stateMutability: string;
  type: string;
}

export interface FunctionInput {
  name: string;
  type: string;
  internalType?: string;
}

export interface FunctionOutput {
  name: string;
  type: string;
  internalType?: string;
}

export interface NetworkConfig {
  id: number;
  name: string;
  nativeCurrency: string;
  rpcUrl: string;
  blockExplorer: string;
}
