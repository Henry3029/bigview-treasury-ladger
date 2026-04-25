import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from 'react-native';
import { usePrivy, useWallets } from '@privy-io/expo';
import { createWalletClient, createPublicClient, custom, http, parseUnits, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Coins, Flame, ShieldAlert, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Ensure your ABI is accessible in your mobile path
import tokenAbi from '../constants/abis/BigViewTreasuryV2.json';

export default function AdminMintScreen() {
  const [amount, setAmount] = useState('');
  const [totalSupply, setTotalSupply] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; 

  const tokenAddress = process.env.EXPO_PUBLIC_TOKEN_ADDRESS as `0x${string}`;
  const deployerAddr = process.env.EXPO_PUBLIC_DEPLOYER_ADDR?.toLowerCase();
  const isOwner = user?.wallet?.address?.toLowerCase() === deployerAddr;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.EXPO_PUBLIC_BASE_SEPOLIA_RPC)
  });

  const fetchSupply = async () => {
    try {
      const data = await publicClient.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'totalSupply',
      });
      setTotalSupply(formatUnits(data as bigint, 18));
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { fetchSupply(); }, []);

  const handleAction = async (action: 'mint' | 'burn') => {
    if (!authenticated) return login();
    if (!amount || isProcessing || !wallet) return;

    try {
      setIsProcessing(true);
      const ethereumProvider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(ethereumProvider)
      });

      const units = parseUnits(amount, 18);
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: action,
        args: [units],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      Alert.alert("Success", `${action.toUpperCase()} operation confirmed!`);
      setAmount('');
      fetchSupply();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "Transaction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 1. ACCESS DENIED VIEW
  if (!isOwner && authenticated) {
    return (
      <View style={styles.deniedRoot}>
        <View style={styles.deniedCard}>
          <ShieldAlert size={48} color="#EF4444" />
          <Text style={styles.deniedTitle}>Access Denied</Text>
          <Text style={styles.deniedSubtitle}>DEPLOYER ONLY TERMINAL</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Supply Controller</Text>
        <Text style={styles.subtitle}>BigView Protocol V2.0</Text>
      </View>

      {/* SUPPLY CARD */}
      <LinearGradient colors={['#FFD700', '#B8860B']} style={styles.supplyCard}>
        <Activity size={60} color="#000" style={styles.bgIcon} />
        <Text style={styles.supplyLabel}>Total BVW in Circulation</Text>
        <Text style={styles.supplyValue}>
          {Number(totalSupply).toLocaleString()} <Text style={styles.unitText}>BVW</Text>
        </Text>
      </LinearGradient>

      {/* INPUT AREA */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Adjustment Quantity</Text>
        <TextInput 
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="rgba(255,255,255,0.2)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.buttonGap}>
          <TouchableOpacity 
            style={[styles.btn, styles.mintBtn, isProcessing && styles.disabled]} 
            onPress={() => handleAction('mint')}
            disabled={isProcessing}
          >
            {isProcessing ? <ActivityIndicator color="#000" /> : <Coins size={20} color="#000" />}
            <Text style={styles.mintBtnText}>Execute Mint</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.burnBtn, isProcessing && styles.disabled]} 
            onPress={() => handleAction('burn')}
            disabled={isProcessing}
          >
            {isProcessing ? <ActivityIndicator color="#EF4444" /> : <Flame size={20} color="#EF4444" />}
            <Text style={styles.burnBtnText}>Execute Burn</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footer}>Secure Terminal • BigView Treasury Ledger</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  deniedRoot: { flex: 1, backgroundColor: '#1A0B2E', justifyContent: 'center', alignItems: 'center' },
  deniedCard: { backgroundColor: '#1E293B', padding: 40, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  deniedTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', marginTop: 16 },
  deniedSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  
  header: { alignItems: 'center', marginBottom: 32 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '900' },
  
  supplyCard: { width: '100%', padding: 32, borderRadius: 24, position: 'relative', overflow: 'hidden' },
  bgIcon: { position: 'absolute', right: -10, top: -10, opacity: 0.1 },
  supplyLabel: { color: 'rgba(0,0,0,0.5)', fontSize: 10, fontWeight: '900', marginBottom: 4 },
  supplyValue: { color: '#000', fontSize: 36, fontWeight: '900', letterSpacing: -2 },
  unitText: { fontSize: 14 },
  
  inputSection: { width: '100%', marginTop: 24, backgroundColor: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', marginLeft: 8 },
  input: { color: '#FFF', fontSize: 40, fontWeight: '900', marginVertical: 16, paddingHorizontal: 8 },
  buttonGap: { gap: 12 },
  btn: { width: '100%', height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mintBtn: { backgroundColor: '#FFD700' },
  mintBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },
  burnBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  burnBtnText: { color: '#EF4444', fontWeight: '900', fontSize: 14 },
  disabled: { opacity: 0.3 },
  
  footer: { marginTop: 40, color: 'rgba(255,255,255,0.1)', fontSize: 8, fontWeight: '900', letterSpacing: 1 }
});