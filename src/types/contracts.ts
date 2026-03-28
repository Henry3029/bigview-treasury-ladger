// 1. UPDATED DASHBOARD SUMMARY
// Uses camelCase for easier access in your React components
export interface DashboardSummary {
  totalMembers: bigint; // Solidity uint256 maps to BigInt in JS
  totalStakes: bigint;  // Global amount of ETH staked
  totalRewards: bigint; // Total BVW distributed
  proposalsCount: number;
}

// 2. UPDATED PROPOSAL INTERFACE
// Standardized to match Solidity struct return values
export interface Proposal {
  id: number;
  description: string;
  votesFor: bigint;     // Using camelCase instead of hyphenated-names
  votesAgainst: bigint;
  executed: boolean;    // Added this as it's standard for DAO proposals
  deadline: number;     // Block timestamp
}

// 3. BONUS: USER STATS INTERFACE
// Useful for your 'Me' or 'Rewards' pages
export interface UserStakeInfo {
  stakedAmount: bigint;
  rewardsPending: bigint;
  lastStakeTimestamp: number;
}