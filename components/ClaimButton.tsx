import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';

export const ClaimButton = () => {
  const { doContractCall } = useConnect();

  const handleClaim = async () => {
    await doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || '',
      functionName: 'claim-rewards', // Must match your .clar file!
      functionArgs: [], // Rewards usually don't need arguments
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction sent:', data.txId);
        alert('Claim Request Sent! Check your wallet history.');
      },
      onCancel: () => {
        console.log('User cancelled the claim.');
      },
    });
  };

  return (
    <button 
      onClick={handleClaim}
      className="w-full bg-white text-green-700 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 active:scale-95 transition-all"
    >
      Claim Now
    </button>
  );
};