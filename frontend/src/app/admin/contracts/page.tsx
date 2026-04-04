import { ContractInteractor } from '@/components/admin/ContractInteractor';

export const metadata = { title: 'My Contracts — U-OS' };

export default function ContractsPage() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">My Contracts</h1>
        <p className="text-xs text-[#555] mt-0.5">Manage and interact with all deployed contracts</p>
      </div>
      <ContractInteractor />
    </div>
  );
}
