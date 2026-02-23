import React, { useState, useEffect } from "react";
import { STACKS_TESTNET } from "@stacks/network"; 
import * as StacksTransactions from "@stacks/transactions";
import DashboardData from '../components/DashboardData';
import StatusBadge from '../components/StatusBadge';
import DashboardButtons from '../components/DashboardButtons';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';

// --- CONFIGURATION & SESSION ---
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
const StacksConnect = { showConnect, openContractCall };

const CONTRACT_ADDRESS = "ST414MTX2NQ4MVMRE2J9CQATKDEWVXT3DA96XHHA";
const CONTRACT_NAME = "bigview-treasury";
const network = 'testnet';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState("Ready");
      const [stake, setStake] = useState(0);
        const [reward, setReward] = useState(0);

          // 1. SAFETY GUARD: Wait for browser to load before running code
            useEffect(() => {
                setIsClient(true);
                  }, []);

                    const userData = (isClient && userSession.isUserSignedIn()) ? userSession.loadUserData() : null;
                      const userAddress = userData ? userData.profile.stxAddress.testnet : null;

                        // 2. DATA FETCHING
                          async function fetchMySummary() {
                              if (!userAddress) return;
                                  setMessage("Fetching data...");
                                      try {
                                            const result = await StacksTransactions.fetchCallReadOnlyFunction({
                                                    contractAddress: CONTRACT_ADDRESS,
                                                            contractName: CONTRACT_NAME,
                                                                    functionName: "dashboard-summary",
                                                                            functionArgs: [],
                                                                                    network,
                                                                                            senderAddress: userAddress,
                                                                                                  });
                                                                                                        setMessage("Data Loaded");
                                                                                                            } catch (e) { 
                                                                                                                  console.error(e);
                                                                                                                        setMessage("Error fetching data.");
                                                                                                                            }
                                                                                                                              }

                                                                                                                                useEffect(() => {
                                                                                                                                    if (isClient && userAddress) {
                                                                                                                                          fetchMySummary();
                                                                                                                                              }
                                                                                                                                                }, [isClient, userAddress]);

                                                                                                                                                  // 3. WALLET INTERACTION
                                                                                                                                                    const handleStake = async () => {
                                                                                                                                                        const showConnectTool = window?.StacksProvider?.showConnect || StacksConnect.showConnect;

                                                                                                                                                            if (!userSession.isUserSignedIn()) {
                                                                                                                                                                  if (typeof showConnectTool === 'function') {
                                                                                                                                                                          showConnectTool({
                                                                                                                                                                                    appDetails: { name: "BigView Treasury", icon: window.location.origin + "/logo.png" },
                                                                                                                                                                                              userSession,
                                                                                                                                                                                                        redirectTo: window.location.origin,
                                                                                                                                                                                                                  onFinish: () => window.location.reload(),
                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                        alert("Wallet not found. Use Leather or Xverse browser.");
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                    return;
                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                            const openCallTool = window?.StacksProvider?.openContractCall || StacksConnect.openContractCall;
                                                                                                                                                                                                                                                                if (typeof openCallTool === 'function') {
                                                                                                                                                                                                                                                                      const amount = StacksTransactions.uintCV(1000000); // 1 STX
                                                                                                                                                                                                                                                                            await openCallTool({
                                                                                                                                                                                                                                                                                    contractAddress: CONTRACT_ADDRESS,
                                                                                                                                                                                                                                                                                            contractName: CONTRACT_NAME,
                                                                                                                                                                                                                                                                                                    functionName: "stake",
                                                                                                                                                                                                                                                                                                            functionArgs: [amount],
                                                                                                                                                                                                                                                                                                                    network,
                                                                                                                                                                                                                                                                                                                            onFinish: (data) => setMessage(`Staked! TX: ${data.txId.substring(0, 8)}`),
                                                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                                                                                                          // 4. THE RETURN LOGIC (The UI)
                                                                                                                                                                                                                                                                                                                                            if (!isClient) return null; // Important: Prevents Vercel server-side crash

                                                                                                                                                                                                                                                                                                                                              return (
                                                                                                                                                                                                                                                                                                                                                  <div className="p-6 max-w-4xl mx-auto">
                                                                                                                                                                                                                                                                                                                                                        <h1 className="text-2xl font-bold mb-4">BigView Treasury Dashboard</h1>
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                    <StatusBadge message={message} />

                                                                                                                                                                                                                                                                                                                                                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                                                                                                                                                                                                                                                                                                                                                  <DashboardData title="Your Stake" value={`${stake} STX`} />
                                                                                                                                                                                                                                                                                                                                                                                          <DashboardData title="Pending Rewards" value={`${reward} STX`} />
                                                                                                                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                                                                                                                      <div className="mt-8">
                                                                                                                                                                                                                                                                                                                                                                                                              <DashboardButtons 
                                                                                                                                                                                                                                                                                                                                                                                                                        onStake={handleStake}
                                                                                                                                                                                                                                                                                                                                                                                                                                  onClaim={() => setMessage("Claiming not implemented yet")}
                                                                                                                                                                                                                                                                                                                                                                                                                                            onUnstake={() => setMessage("Unstaking not implemented yet")}
                                                                                                                                                                                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                {userAddress && (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p className="mt-4 text-sm text-gray-500">Connected: {userAddress}</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }