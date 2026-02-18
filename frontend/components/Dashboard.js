import React, { useState, useEffect } from "react";
// Unified networks and transactions from the new library versions
import { StacksNetworks } from "@stacks/network"; 
import * as StacksTransactions from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = "bigview-treasury";

// Select network safely
const network = StacksNetworks.testnet; 

export default function Dashboard({ user }) {
  const [stake, setStake] = useState(0);
    const [reward, setReward] = useState(0);
      const [message, setMessage] = useState("Ready");

        const userAddress = user?.wallet?.address;

          async function fetchMySummary() {
              if (!userAddress) return;
                  try {
                        // Using the namespaced import to prevent "doesn't exist" errors
                              const result = await StacksTransactions.fetchCallReadOnlyFunction({
                                      contractAddress: CONTRACT_ADDRESS,
                                              contractName: CONTRACT_NAME,
                                                      functionName: "my-summary",
                                                              functionArgs: [],
                                                                      network,
                                                                              senderAddress: userAddress,
                                                                                    });
                                                                                          console.log("Success:", result);
                                                                                              } catch (e) { 
                                                                                                    console.error("Fetch error:", e); 
                                                                                                        }
                                                                                                          }

                                                                                                            useEffect(() => {
                                                                                                                fetchMySummary();
                                                                                                                  }, [userAddress]);

                                                                                                                    const executeContractCall = async (functionName, functionArgs, successMsg) => {
                                                                                                                        setMessage(`Initiating ${functionName}...`);

                                                                                                                            const options = {
                                                                                                                                  contractAddress: CONTRACT_ADDRESS,
                                                                                                                                        contractName: CONTRACT_NAME,
                                                                                                                                              functionName,
                                                                                                                                                    functionArgs,
                                                                                                                                                          network,
                                                                                                                                                                onFinish: (data) => {
                                                                                                                                                                        setMessage(`${successMsg}! TX ID: ${data.txId.substring(0, 10)}...`);
                                                                                                                                                                              },
                                                                                                                                                                                    onCancel: () => setMessage("Transaction cancelled."),
                                                                                                                                                                                        };

                                                                                                                                                                                            if (window.StacksProvider || window.LeatherProvider) {
                                                                                                                                                                                                  await openContractCall(options);
                                                                                                                                                                                                      } else {
                                                                                                                                                                                                            setTimeout(() => {
                                                                                                                                                                                                                    setMessage(`${successMsg} (Simulated on Mobile)`);
                                                                                                                                                                                                                          }, 1500);
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                  const handleStake = () => {
                                                                                                                                                                                                                                      const amount = StacksTransactions.uintCV(1000000);
                                                                                                                                                                                                                                          executeContractCall("stake", [amount], "Staked 1 STX");
                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                              return (
                                                                                                                                                                                                                                                  <div style={{ padding: "30px", textAlign: "center", fontFamily: "sans-serif" }}>
                                                                                                                                                                                                                                                        <h2 style={{ color: "#333" }}>BigView Dashboard</h2>
                                                                                                                                                                                                                                                              <p style={{ fontSize: "14px", color: "#666" }}> Wallet: {userAddress ? `${userAddress.substring(0, 6)}...` : "Connecting..."}</p>
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                          <button 
                                                                                                                                                                                                                                                                                  style={{ padding: "18px", borderRadius: "12px", backgroundColor: "#5546FF", color: "white", border: "none", width: "100%", fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}
                                                                                                                                                                                                                                                                                          onClick={handleStake}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                        Stake 1 STX
                                                                                                                                                                                                                                                                                                              </button>

                                                                                                                                                                                                                                                                                                                    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "15px", textAlign: "left", marginTop: "20px" }}>
                                                                                                                                                                                                                                                                                                                            <p><strong>Status:</strong> {message}</p>
                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                        }