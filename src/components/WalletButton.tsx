'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletButton() {
  const { authenticated, login, logout, user } = usePrivy();

  // Condition 1: User is Logged In
  if (authenticated && user?.wallet?.address) {
    const addr = user.wallet.address;
    return (
      <button 
        onClick={() => logout()}
        className="btn-grain-outline py-2 px-6" // Using your new CSS class!
      >
        {addr.slice(0, 4)}...{addr.slice(-4)}
      </button>
    );
  }

  // Condition 2: User is NOT Logged In
  return (
    <button 
      onClick={() => login()}
      className="btn-grain py-2 px-6" // Using the Grainlify Gold Pill!
    >
      Connect Wallet
    </button>
  );
}