"use client";
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'; // Privy core
import { useConnect } from '@stacks/connect-react'; // You need this for Stacks logic
import { stringAsciiCV } from '@stacks/transactions';

export default function ProposalForm() {
  // 1. We use the 'doContractCall' from Stacks Connect instead of Privy's sendTransaction
  const { doContractCall } = useConnect(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get('description') as string;

    // 2. This structure is what the Stacks library "knows"
    await doContractCall({
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
      functionName: 'create-proposal',
      functionArgs: [stringAsciiCV(description)],
      onFinish: (data) => console.log("Proposal Created!", data),
      onCancel: () => console.log("User denied the proposal"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-xl bg-white shadow-sm">
      <input name="description" placeholder="Proposal Title" className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
      <button type="submit" className="bg-orange-600 text-white font-bold p-3 mt-4 w-full rounded-lg hover:bg-orange-700 transition-colors">
        Submit Proposal
      </button>
    </form>
  );
}