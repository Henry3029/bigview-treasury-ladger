'use client'; // This is essential for Privy hooks

import { usePrivy } from '@privy-io/react-auth';

export default function WalletButton() {
  const { authenticated, login, logout, user } = usePrivy();

  if (authenticated) {
    // If logged in, show a "Logout" or "Connected" button
    return (
      <button 
        onClick={() => logout()}
        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
      >
        {/* Shows a shortened address if available */}
        {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
      </button>
    );
  }

  // If not logged in, show "Connect Wallet"
  return (
    <button 
      onClick={() => login()}
      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
    >
      Connect Wallet
    </button>
  );
}