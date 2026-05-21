// src/config/env.ts

// ==========================================
// 1. CONTRACT & TOKEN ADDRESSES (Strict 0x${string} Types)
// ==========================================

// Raw values from .env
const rawTreasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
const rawGovernanceToken = process.env.NEXT_PUBLIC_GOV_TOKEN_ADDRESS;

// Strict Fallbacks (Useful for local testing or if .env fails)
const ZERO_ADDRESS: `0x${string}` = "0x0000000000000000000000000000000000000000";

export const TREASURY_ADDRESS = (rawTreasury as `0x${string}`) || ZERO_ADDRESS;
export const TOKEN_ADDRESS = (rawGovernanceToken as `0x${string}`) || ZERO_ADDRESS;


// ==========================================
// 2. OTHER APP SETTINGS (Strings, Numbers, IDs)
// ==========================================

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "missing-privy-id";
export const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/...";

// Convert string numbers from .env into actual numbers safely
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11155111; // Defaults to Sepolia