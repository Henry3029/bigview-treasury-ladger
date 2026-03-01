// src/components/ProposalForm.tsx
"use client";
import { usePrivy } from '@privy-io/react-auth';
import { stringAsciiCV } from '@stacks/transactions';
import { Proposal } from '@/types/contract'

export default function ProposalForm() {
  const { sendTransaction } = usePrivy();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get('description') as string;

    // Privy handles the wallet signature
    await sendTransaction({
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
      functionName: 'create-proposal',
      functionArgs: [stringAsciiCV(description)],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <input name="description" placeholder="Proposal Title" className="border p-2 w-full" />
      <button type="submit" className="bg-black text-white p-2 mt-2 w-full">Submit</button>
    </form>
  );
}