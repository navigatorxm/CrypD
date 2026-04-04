'use client';

import { DeployedContract, Transaction } from '@/types';

const CONTRACTS_KEY = 'uos_deployed_contracts';
const TRANSACTIONS_KEY = 'uos_transactions';

export function getDeployedContracts(): DeployedContract[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CONTRACTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveDeployedContract(contract: DeployedContract): void {
  const contracts = getDeployedContracts();
  const existing = contracts.findIndex((c) => c.id === contract.id);
  if (existing >= 0) {
    contracts[existing] = contract;
  } else {
    contracts.unshift(contract);
  }
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
}

export function removeDeployedContract(id: string): void {
  const contracts = getDeployedContracts().filter((c) => c.id !== id);
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
}

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTransaction(tx: Transaction): void {
  const txs = getTransactions();
  const existing = txs.findIndex((t) => t.hash === tx.hash);
  if (existing >= 0) {
    txs[existing] = tx;
  } else {
    txs.unshift(tx);
  }
  // Keep last 200
  if (txs.length > 200) txs.splice(200);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
}

export function clearTransactions(): void {
  localStorage.setItem(TRANSACTIONS_KEY, '[]');
}
