import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { usePrivy } from '@privy-io/expo';

const DEV_FEE_PERCENT = 10;
const TREASURY_ADDRESS = process.env.EXPO_PUBLIC_PROFIT_WALLET;

export default function EarnCard() {
  const [amount, setAmount] = useState("");
  const [pool, setPool] = useState({ apy: "0", tvl: "0" });
  const [loading, setLoading] = useState(false);
  const { login, authenticated } = usePrivy();

  useEffect(() => {
    const fetchAeroData = async () => {
      // Note: Update this to your deployed Web API URL
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_WEB_URL}/api/earn`);
        const data = await res.json();
        setPool({ apy: data.apy, tvl: data.tvl });
      } catch (e) { console.log("Fetch error", e); }
    };
    fetchAeroData();
  }, []);

  const handleEarn = async () => {
    if (!authenticated) return login();
    setLoading(true);
    // Blockchain logic would go here via Viem
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Earnings</Text>
          <View style={styles.statusRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>Base Mainnet Live</Text>
          </View>
        </View>
        <View style={styles.aprBadge}>
          <Text style={styles.aprLabel}>Net APR</Text>
          <Text style={styles.aprValue}>{pool.apy}%</Text>
        </View>
      </View>

      <View style={styles.feeBox}>
        <View style={styles.feeLeft}>
          <ShieldCheck size={12} color="#60A5FA" />
          <Text style={styles.feeLabel}>Fee</Text>
        </View>
        <Text style={styles.feeValue}>{DEV_FEE_PERCENT}% of yield</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Deposit ETH</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="rgba(255,255,255,0.1)"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          selectionColor="#FFD700"
        />
      </View>

      <TouchableOpacity 
        onPress={handleEarn}
        disabled={loading || !amount}
        style={[styles.mainBtn, (loading || !amount) && styles.disabledBtn]}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <View style={styles.btnContent}>
            <TrendingUp size={18} color="#000" strokeWidth={3} />
            <Text style={styles.btnText}>Start Earning</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Treasury: {TREASURY_ADDRESS?.slice(0, 6)}...{TREASURY_ADDRESS?.slice(-4)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E293B', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EAB308' },
  statusText: { fontSize: 8, fontWeight: '900', color: 'rgba(234, 179, 8, 0.4)', textTransform: 'uppercase' },
  aprBadge: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  aprLabel: { fontSize: 7, fontWeight: '900', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  aprValue: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  feeBox: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  feeLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feeLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  feeValue: { fontSize: 10, fontWeight: '900', color: '#60A5FA' },
  inputContainer: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 24, marginBottom: 24 },
  inputLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: 8 },
  input: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  mainBtn: { backgroundColor: '#FFD700', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  disabledBtn: { opacity: 0.5 },
  footerText: { textAlign: 'center', marginTop: 16, fontSize: 8, color: 'rgba(255,255,255,0.2)', fontWeight: '700' }
});