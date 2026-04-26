import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Users, TrendingUp, PieChart } from 'lucide-react-native'; 
import { createPublicClient, http, formatEther, Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '../constants/abis/BigViewTreasuryV2.json';

interface DashboardDataProps {
  stake?: string;
}

export default function DashboardData({ stake }: DashboardDataProps) {
  const [stats, setStats] = useState({ members: "0", staked: "0" });
  const [loading, setLoading] = useState(true);

  // FIXED: Address casting
  const treasuryAddress = process.env.EXPO_PUBLIC_TREASURY_ADDRESS as Address;

  useEffect(() => {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(), 
    });

    async function getBlockchainData() {
      try {
        const data = await client.multicall({
          contracts: [
            { address: treasuryAddress, abi: treasuryAbi as any, functionName: 'totalMembersCount' },
            { address: treasuryAddress, abi: treasuryAbi as any, functionName: 'totalStakedAmount' },
          ]
        });

        setStats({
          members: data[0].status === 'success' ? Number(data[0].result).toString() : "0",
          staked: stake ? stake.replace(" ETH", "") : (data[1].status === 'success' ? formatEther(data[1].result as bigint) : "0"),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    getBlockchainData();
  }, [treasuryAddress, stake]);

  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <View style={styles.cardHeader}>
            <Users size={12} strokeWidth={3} color="rgba(255,255,255,0.4)" />
            <Text style={styles.label}>NETWORK SIZE</Text>
          </View>
          <Text style={styles.value}>{stats.members} <Text style={styles.unitSmall}>Users</Text></Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.cardHeader}>
            <TrendingUp size={12} strokeWidth={3} color="rgba(255,255,255,0.6)" />
            <Text style={styles.label}>YIELD RATE</Text>
          </View>
          <Text style={styles.value}>12.5% <Text style={styles.unitSmall}>APY</Text></Text>
        </View>
      </View>

      <View style={styles.largeCard}>
        <View style={styles.cardInfo}>
          <Text style={styles.label}>TOTAL VALUE LOCKED</Text>
          <Text style={styles.largeValue}>
            {Number(stats.staked).toLocaleString()} <Text style={styles.ethUnit}>ETH</Text>
          </Text>
        </View>
        <View style={styles.iconCircle}>
          <PieChart size={20} color="#3B82F6" strokeWidth={2.5} />
        </View>
        <View style={styles.decorativeCircle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 8, gap: 12 },
  loadingCard: { height: 100, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  grid: { flexDirection: 'row', gap: 12 },
  smallCard: { flex: 1, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 16, backgroundColor: '#000' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  label: { fontSize: 8, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.6 },
  value: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  unitSmall: { fontSize: 10, color: 'rgba(255,255,255,0.2)' },
  largeCard: { padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', overflow: 'hidden' },
  cardInfo: { zIndex: 10, gap: 4 },
  largeValue: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  ethUnit: { fontSize: 12, color: '#4ADE80' },
  iconCircle: { padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#000' },
  decorativeCircle: { position: 'absolute', bottom: -16, right: -16, width: 96, height: 96, backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 48 },
});