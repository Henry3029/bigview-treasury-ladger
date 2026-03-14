'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletButton() {
  const { authenticated, login, logout, user } = usePrivy();

  // --- ADD IT HERE ---
  // This looks through all linked accounts to find the Stacks one
  const stacksAddress = user?.linkedAccounts?.find(
    (acc: any) => acc.type === 'wallet' && acc.connectorType === 'stacks'
  )?.address || user?.wallet?.address;

  // Condition 1: User is Logged In
  if (authenticated && stacksAddress) {
    return (
      <button 
        onClick={() => logout()}
        className="btn-grain-outline py-2 px-6"
      >
        {/* We use stacksAddress now instead of user.wallet.address */}
        {stacksAddress.slice(0, 4)}...{stacksAddress.slice(-4)}
      </button>
    );
  }

  // Condition 2: User is NOT Logged In
  return (
    <button 
      onClick={() => login()}
      className="btn-grain py-2 px-6" // using the Grainlify Gold pill
    >
      Connect Wallet
    </button>
  );
}