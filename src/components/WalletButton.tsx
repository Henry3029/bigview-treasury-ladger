'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletButton() {
  const { authenticated, login, logout, user } = usePrivy();

  // Finds the Stacks address in the Privy user object
  const stacksAddress = user?.linkedAccounts?.find(
    (acc: any) => acc.type === 'wallet' && acc.chainType === 'stacks'
  )?.address || user?.wallet?.address;

  // Condition 1: User is Logged In
  if (authenticated && stacksAddress) {
    return (
      <button 
        onClick={() => logout()}
        className="btn-grain-outline py-2 px-6 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {stacksAddress.slice(0, 4)}...{stacksAddress.slice(-4)}
      </button>
    );
  }

  // Condition 2: User is NOT Logged In
  return (
    <button 
  onClick={() => {
    console.log("Login button was clicked!"); // This will show in your browser console
    login();
  }}
  className="btn-grain py-2 px-8 font-bold tracking-tight shadow-lg"
>
  Login or Sign Up
</button>
  );
}