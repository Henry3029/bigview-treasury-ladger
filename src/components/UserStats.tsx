"use client";
import { useConnect } from "@stacks/connect-react";
import { useEffect, useState } from "react";

export default function UserStats() {
  const { userSession } = useConnect();
  const [userBalance, setUserBalance] = useState("0.00");

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const addr = userSession.loadUserData().profile.stxAddress.testnet;
      fetch(`https://api.testnet.hiro.so/extended/v1/address/${addr}/balances`)
        .then(res => res.json())
        .then(data => {
          const balance = (Number(data?.stx?.balance) || 0) / 1_000_000;
          setUserBalance(balance.toLocaleString());
        });
    }
  }, [userSession]);

  if (!userSession.isUserSignedIn()) return null;

  return (
    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-6">
      <p className="text-xs font-bold text-orange-600 uppercase">Your Wallet Balance</p>
      <p className="text-2xl font-black text-orange-900">{userBalance} STX</p>
    </div>
  );
}