import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DeployedContract {
  id: string;
  name: string;
  address: string;
  chainId: number;
  abi: any[];
  bytecode?: string;
  deployedAt: number;
  txHash: string;
  type: string;
  verified?: boolean;
  network?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  chainId: number;
  blockNumber?: number;
  method?: string;
  contractAddress?: string;
  contractName?: string;
  gasUsed?: string;
}

export interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: string;
  modified: boolean;
}

export interface CompileResult {
  abi: any[];
  bytecode: string;
  errors: string[];
  warnings: string[];
  contractName: string;
}

// ── Wallet Store ─────────────────────────────────────────────────────────────

interface WalletStore {
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  setWallet: (address: string, chainId: number, balance: string) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  chainId: null,
  balance: null,
  isConnected: false,
  setWallet: (address, chainId, balance) =>
    set({ address, chainId, balance, isConnected: true }),
  clearWallet: () =>
    set({ address: null, chainId: null, balance: null, isConnected: false }),
}));

// ── Contract Store ────────────────────────────────────────────────────────────

interface ContractStore {
  contracts: DeployedContract[];
  selected: DeployedContract | null;
  addContract: (c: DeployedContract) => void;
  removeContract: (id: string) => void;
  setSelected: (c: DeployedContract | null) => void;
  updateContract: (id: string, updates: Partial<DeployedContract>) => void;
}

export const useContractStore = create<ContractStore>()(
  persist(
    (set) => ({
      contracts: [],
      selected: null,
      addContract: (c) =>
        set((s) => ({ contracts: [c, ...s.contracts.filter((x) => x.id !== c.id)] })),
      removeContract: (id) =>
        set((s) => ({ contracts: s.contracts.filter((c) => c.id !== id), selected: null })),
      setSelected: (c) => set({ selected: c }),
      updateContract: (id, updates) =>
        set((s) => ({
          contracts: s.contracts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    { name: 'uos-contracts' }
  )
);

// ── Transaction Store ─────────────────────────────────────────────────────────

interface TxStore {
  transactions: Transaction[];
  addTx: (tx: Transaction) => void;
  updateTx: (hash: string, updates: Partial<Transaction>) => void;
  clearTxs: () => void;
}

export const useTxStore = create<TxStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTx: (tx) =>
        set((s) => {
          const existing = s.transactions.findIndex((t) => t.hash === tx.hash);
          if (existing >= 0) {
            const copy = [...s.transactions];
            copy[existing] = tx;
            return { transactions: copy };
          }
          return { transactions: [tx, ...s.transactions].slice(0, 200) };
        }),
      updateTx: (hash, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.hash === hash ? { ...t, ...updates } : t)),
        })),
      clearTxs: () => set({ transactions: [] }),
    }),
    { name: 'uos-transactions' }
  )
);

// ── Editor Store ──────────────────────────────────────────────────────────────

interface EditorStore {
  files: EditorFile[];
  activeFileId: string | null;
  compileResult: CompileResult | null;
  isCompiling: boolean;
  addFile: (file: EditorFile) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  setActiveFile: (id: string) => void;
  setCompileResult: (r: CompileResult | null) => void;
  setIsCompiling: (v: boolean) => void;
  renameFile: (id: string, name: string) => void;
}

const DEFAULT_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    string public name;
    address public owner;

    event NameChanged(string newName);

    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setName(string memory _name) external onlyOwner {
        name = _name;
        emit NameChanged(_name);
    }

    function getName() external view returns (string memory) {
        return name;
    }
}`;

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      files: [
        {
          id: 'default',
          name: 'MyContract.sol',
          content: DEFAULT_CONTRACT,
          language: 'sol',
          modified: false,
        },
      ],
      activeFileId: 'default',
      compileResult: null,
      isCompiling: false,
      addFile: (file) => set((s) => ({ files: [...s.files, file], activeFileId: file.id })),
      removeFile: (id) =>
        set((s) => ({
          files: s.files.filter((f) => f.id !== id),
          activeFileId: s.activeFileId === id ? (s.files[0]?.id ?? null) : s.activeFileId,
        })),
      updateFile: (id, content) =>
        set((s) => ({
          files: s.files.map((f) => (f.id === id ? { ...f, content, modified: true } : f)),
        })),
      setActiveFile: (id) => set({ activeFileId: id }),
      setCompileResult: (r) => set({ compileResult: r }),
      setIsCompiling: (v) => set({ isCompiling: v }),
      renameFile: (id, name) =>
        set((s) => ({
          files: s.files.map((f) => (f.id === id ? { ...f, name } : f)),
        })),
    }),
    { name: 'uos-editor' }
  )
);

// ── UI Store ──────────────────────────────────────────────────────────────────

interface UIStore {
  sidebarCollapsed: boolean;
  terminalOpen: boolean;
  terminalHeight: number;
  activeTab: string;
  setSidebarCollapsed: (v: boolean) => void;
  setTerminalOpen: (v: boolean) => void;
  setTerminalHeight: (h: number) => void;
  setActiveTab: (t: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      terminalOpen: true,
      terminalHeight: 260,
      activeTab: 'compile',
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setTerminalOpen: (v) => set({ terminalOpen: v }),
      setTerminalHeight: (h) => set({ terminalHeight: h }),
      setActiveTab: (t) => set({ activeTab: t }),
    }),
    { name: 'uos-ui' }
  )
);
