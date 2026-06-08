import { useState, ChangeEvent } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains"; // Using Base Sepolia testnet for safety

// 1. Setup the public client outside the component to avoid re-creating it on every render
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Mocking contract details for compilation stability
const CONTRACT_ADDRESS = "0xYourPermanentProxyAddressHere";
const CONTRACT_ABI = [
  {
    inputs: [{ name: "_user", type: "address" }, { name: "_amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

export default function StakingComponent() {
  // 2. State Variables
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. Input Validation Handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    const numericValue = parseFloat(value);

    // Your validation check: prevent negative numbers, NaN, or values <= 0
    if (isNaN(numericValue) || numericValue <= 0) {
      setMessage("Invalid input: Amount must be greater than 0");
      return;
    }

    // Clear error message if input becomes valid
    setMessage("");
  };

  // 4. Contract Call Handler
  const handleContractCall = async () => {
    const numericValue = parseFloat(amount);
    
    // Safety guard step before executing network calls
    if (!amount || isNaN(numericValue) || numericValue <= 0) {
      setMessage("Please enter a valid amount before staking.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Convert standard human string input to BigInt wei logic (1 ETH = 10^18 Wei)
      // Note: We parse the token unit here to send it down the line safely
      const parsedAmount = BigInt(Math.floor(numericValue * 1e18));

      // Simulating the contract read/simulation call via public client
      const contractCall = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "deposit",
        args: ["0xUserAddressPlaceholder", parsedAmount], // user address and amount fields
      });

      console.log("Contract simulation successful:", contractCall);
      setMessage("Simulation successful! Ready to broadcast transaction.");
    } catch (error) {
      console.error(error);
      setMessage("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Parent container div
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Header Block with custom gold gradient theme styling */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black">
          <h1 className="text-xl font-bold tracking-tight">
            Stake ETH and earn yield in return
          </h1>
        </div>

        {/* Input area element containing labels and placeholders */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Stake ETH
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors text-white placeholder-slate-600 text-lg"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleContractCall}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? "Processing..." : "Stake Funds"}
        </button>

        {/* Live Message State feedback window */}
        {message && (
          <div className={`p-3 rounded-lg text-center text-sm font-medium ${
            message.includes("Wrong") || message.includes("Invalid") 
              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
}