import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { formatUnits } from 'viem';

// Using relative paths as discussed
import DashboardData from '../components/DashboardData';
import BigViewLoGo from '../components/BigViewLoGo'; 
import BalanceCard from '../components/BalanceCard'; 

interface DashboardStats {
  stake: string;
  treasuryBalance: string;
}

const RPC_URL = process.env.EXPO_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_TREASURY_ADDRESS || '';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({ stake: "0.00", treasuryBalance: "0.00" });

  const getDashboardData = async () => {
    if (!CONTRACT_ADDRESS) return;

    try {
      const balanceRes = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [CONTRACT_ADDRESS, 'latest'],
          id: 1,
        }),
      });
      
      const balanceJson = await balanceRes.json();
      const rawBalance = balanceJson.result || "0x0";
      const ethBalance = formatUnits(BigInt(rawBalance), 18);

      setStats({
        stake: `${Number(ethBalance).toLocaleString()} ETH`,
        treasuryBalance: Number(ethBalance).toLocaleString(),
      });
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          <BalanceCard />
          
          <BigViewLoGo />
          
          <DashboardData stake={stats.stake} />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bigview Treasury Ledger • v2.0</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    paddingTop: 112, 
    paddingHorizontal: 20,
    gap: 24, 
  },
  footer: {
    paddingTop: 16,
    opacity: 0.2,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
});