"use client";

import { useConnect } from "@stacks/connect-react";
import TreasuryTable from "@/components/TreasuryTable";

export default function HistoryPage() {
  const { userSession } = useConnect();
  
  // Get the signed-in user's address
  const userAddress = userSession.isUserSignedIn() 
    ? userSession.loadUserData().profile.stxAddress.testnet 
    : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      
      {/* We "pass" the address to the table as a prop named 'address' */}
      <TreasuryTable address={userAddress} />
    </div>
  );
}