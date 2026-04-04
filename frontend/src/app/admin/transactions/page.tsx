import { TransactionsDashboard } from '@/components/admin/TransactionsDashboard';

export const metadata = { title: 'Transactions — U-OS' };

export default function TransactionsPage() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Transactions</h1>
        <p className="text-xs text-[#555] mt-0.5">Full history of all contract interactions and deployments</p>
      </div>
      <TransactionsDashboard />
    </div>
  );
}
