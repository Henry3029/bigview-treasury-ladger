import { useState } from "react";
import { PrivyClient } from "@privy-io/react-auth";
import Dashboard from "../components/Dashboard"; // your main dashboard component

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  });

  export default function HomePage() {
    const [user, setUser] = useState(null);

      async function handleLogin() {
          const loggedInUser = await privy.login({ provider: "google" });
              console.log("User Logged In:", loggedInUser);

                  // Save wallet address to localStorage
                      localStorage.setItem("userWallet", loggedInUser.wallet.address);

                          setUser(loggedInUser);
                            }

                              return (
                                  <div>
                                        <button onClick={handleLogin}>Login with Privy</button>

                                              {user ? (
                                                      <Dashboard /> // show your dashboard once logged in
                                                            ) : (
                                                                    <p>Please log in to access the dashboard.</p>
                                                                          )}
                                                                              </div>
                                                                                );
                                                                                }