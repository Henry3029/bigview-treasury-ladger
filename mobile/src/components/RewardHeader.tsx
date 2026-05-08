import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePrivy } from '@privy-io/expo'; // Removed useWallets
import { createWalletClient, custom, publicActions, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CheckCircle2, Zap } from 'lucide-react-native';
import treasuryAbi from '../constants/abis/BigViewTreasuryV2.json';

interface Props {
  totalEarned: string;
  pending: string;
}

export const RewardHeader = ({ totalEarned, pending }: Props) => {
  // FIXED: Pull wallets directly from usePrivy
  const { authenticated, login, wallets } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const contractAddress = (process.env.EXPO_PUBLIC_TREASURY_ADDRESS || '0x000...') as Address;

  const handleClaim = async () => {
    if (!authenticated) return login();
    const wallet = wallets?.[0]; // Safer access
    if (!wallet) return;

    try {
      setIsProcessing(true);
      const provider = await wallet.getEthereumProvider();
      const client = createWalletClient({
        account: wallet.address as Address,
        chain: baseSepolia,
        transport: custom(provider)
      }).extend(publicActions);

      const hash = await client.writeContract({
        address: contractAddress,
        abi: treasuryAbi,
        functionName: 'claimGovernanceRewards',
        account: wallet.address as Address,
      });

      await client.waitForTransactionReceipt({ hash });
      
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 5000);
    } catch (error) {
      console.error("Claim Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canClaim = Number(pending.replace(/,/g, '')) > 0;

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      
      <View style={styles.topSection}>
        <Text style={styles.label}>Lifetime BVW Earned</Text>
        <Text style={styles.mainValue}>
          {totalEarned} <Text style={styles.symbol}>BVW</Text>
        </Text>
      </View>
      
      <View style={styles.claimBox}>
        <View style={styles.availableSection}>
          <Text style={styles.availLabel}>Available</Text>
          <View style={styles.availValueRow}>
            <Text style={styles.availValue}>{pending}</Text>
            <Text style={styles.availSymbol}>BVW</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={handleClaim}
          disabled={isProcessing || !canClaim}
          style={[styles.claimBtn, !canClaim && styles.disabledBtn]}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : isConfirmed ? (
            <CheckCircle2 size={16} color="#000" />
          ) : (
            <Zap size={16} color={canClaim ? "#000" : "rgba(255,255,255,0.2)"} fill={canClaim ? "#000" : "transparent"} />
          )}
          <Text style={styles.claimBtnText}>
            {isProcessing ? "Wait..." : isConfirmed ? "Success" : "Claim Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#1E293B', padding: 24, borderRadius: 32, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  glow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: 'rgba(255, 215, 0, 0.05)', borderRadius: 60 },
  topSection: { alignItems: 'center' },
  label: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  mainValue: { fontSize: 40, fontWeight: '900', color: '#FFF', letterSpacing: -2, marginVertical: 8 },
  symbol: { fontSize: 14, opacity: 0.3 },
  claimBox: { marginTop: 24, backgroundColor: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availableSection: { flex: 1 },
  availLabel: { fontSize: 8, fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  availValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  availValue: { fontSize: 20, fontWeight: '900', color: '#FFD700' },
  availSymbol: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.2)' },
  claimBtn: { flex: 1, height: 48, backgroundColor: '#FFD700', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  claimBtnText: { color: '#000', fontWeight: '900', fontSize: 10 }, // FIXED TYPO HERE
  disabledBtn: { backgroundColor: 'rgba(255,255,255,0.05)' }, // FIXED RFGBA TYPO HERE
});