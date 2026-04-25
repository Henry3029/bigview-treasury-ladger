import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { createPublicClient, createWalletClient, custom, parseEther, formatEther, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Wallet, Info } from 'lucide-react-native';
import treasuryAbi from '../constants/abis/BigViewTreasuryV2.json';

export default function StakeCard() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const { login, authenticated, ready, user } = usePrivy();

  const treasuryAddress = process.env.EXPO_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

  const fetchBalance = async () => {
    if (!user?.wallet?.address) return;
    const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
    try {
      const bal = await publicClient.getBalance({ address: user.wallet.address as `0x${string}` });
      setBalance(parseFloat(formatEther(bal)).toFixed(2));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (ready && authenticated) fetchBalance();
  }, [ready, authenticated]);

  const handleStake = async () => {
    if (!authenticated) return login();
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);
    try {
      const wallet = user?.wallet; // Privy Expo handles the active wallet reference
      const provider = await wallet?.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet?.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      });

      const hash = await walletClient.writeContract({
        address: treasuryAddress,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate',
        args: [],
        value: parseEther(amount),
      });

      Alert.alert("Success", "Staking complete!");
      setAmount('');
      fetchBalance();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Staking failed. Check your balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stake</Text>
        <Text style={styles.subtitle}>Earning <Text style={styles.gold}>BVW</Text> Rewards</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.balanceText}>Bal: {balance} ETH</Text>
        </View>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="rgba(255,255,255,0.2)"
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity 
        style={[styles.stakeBtn, (loading || !amount) && styles.disabledBtn]} 
        onPress={handleStake}
        disabled={loading || !amount}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Wallet size={20} color="#000" />}
        <Text style={styles.btnText}>{loading ? 'Confirming...' : 'Start Earning'}</Text>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <Info size={14} color="rgba(255,255,255,0.2)" />
        <Text style={styles.infoText}>Automated Staking Powered By BigView Ledger</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, borderTopWidth: 2, borderBottomWidth: 2, borderColor: 'rgba(255,255,255,0.05)' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subtitle: { fontSize: 10, fontWeight: '900', color: 'rgba(74, 222, 128, 0.4)' },
  gold: { color: '#FFD700' },
  inputSection: { marginBottom: 32 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 10, color: '#FFF', fontWeight: '500' },
  balanceText: { fontSize: 10, color: '#4ADE80', fontWeight: '900' },
  input: { fontSize: 32, fontWeight: 'bold', color: '#FFF', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingVertical: 8 },
  stakeBtn: { backgroundColor: '#FFD700', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  disabledBtn: { opacity: 0.3 },
  btnText: { color: '#000', fontSize: 18, fontWeight: '900' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  infoText: { fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: '500', flex: 1 },
});