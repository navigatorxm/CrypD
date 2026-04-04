import { ContractDeployer } from '@/components/admin/ContractDeployer';

export const metadata = { title: 'Deploy Contract — U-OS' };

export default function DeployPage() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Contract Deployer</h1>
        <p className="text-xs text-[#555] mt-0.5">Deploy any contract — use templates or paste custom bytecode/ABI</p>
      </div>
      <ContractDeployer />
    </div>
  );
}
