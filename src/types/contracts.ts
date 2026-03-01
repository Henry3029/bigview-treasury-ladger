// src/types/contract.ts
export interface DashboardSummary {
  "total-members": number;
  "total-stakes": number;
  "total-rewards": number;
  "proposals-count": number;
}

export interface Proposal {
  id: number;           // Correct
  description: string;  // Match 'description' from contract
  "votes-for": number;  // Match 'votes-for' exactly (requires quotes because of the dash)
  "votes-against": number; 
}
