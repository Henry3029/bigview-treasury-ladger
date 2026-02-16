import { useState } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import Dashboard from "./dashboard"; // Ensure this path matches your file structure

export default function HomePage() {
  const { login, authenticated, user } = usePrivy();

    const handleLogin = async () => {
        try {
              await login();
                    // Privy handles the session, we'll extract the wallet inside the Dashboard
                        } catch (error) {
                              console.error("Login failed", error);
                                  }
                                    };

                                      return (
                                          <div style={{ padding: "2rem", textAlign: "center" }}>
                                                {!authenticated ? (
                                                        <div>
                                                                  <h1>Welcome to BigView</h1>
                                                                            <button onClick={handleLogin}>Login with Privy</button>
                                                                                    </div>
                                                                                          ) : (
                                                                                                  <Dashboard user={user} />
                                                                                                        )}
                                                                                                            </div>
                                                                                                              );
                                                                                                              }