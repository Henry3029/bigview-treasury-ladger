import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { usePrivy, useWallets } from '@privy-io/expo';
import { createWalletClient, custom, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ArrowUpDown, RefreshCw } from 'lucide-react-native';

export default function SwapInterface() {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0.00");
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);

  const { login, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  // --- PRICE FETCHING ---
  useEffect(() => {
    const getPrice = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut("0.00");
        return;
      }
      setIsCalculating(true);
      
      try {
        const sellAmountWei = parseEther(amountIn).toString();
        
        // IMPORTANT: Replace with your actual deployed API URL for mobile
        const res = await fetch(`https://your-api-domain.com/api/swap?sellToken=ETH&buyToken=USDC&sellAmount=${sellAmountWei}`);
        const data = await res.json();

        if (data.buyAmount) {
          const formattedOut = (Number(data.buyAmount) / 10 ** 6).toFixed(2);
          setAmountOut(formattedOut);
          setQuoteData(data);
        }
      } catch (err) {
        console.error("0x Fetch Error:", err);
      } finally {
        setIsCalculating(false);
      }
    };

    const timeoutId = setTimeout(getPrice, 500);
    return () => clearTimeout(timeoutId);
  }, [amountIn]);

  const handleSwap = async () => {
    if (!ready || !authenticated) return login();
    if (!quoteData) return;

    const wallet = wallets[0];
    if (!wallet) return Alert.alert("Error", "Please connect your wallet");

    setIsCalculating(true);
    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      });

      const hash = await walletClient.sendTransaction({
        to: quoteData.to as `0x${string}`,
        data: quoteData.data as `0x${string}`,
        value: BigInt(quoteData.value),
      });

      Alert.alert("Success", "Swap successful! Transaction Hash: " + hash);
      setAmountIn("");
    } catch (err) {
      console.error("Swap Error:", err);
      Alert.alert("Swap Error", "Transaction failed. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Swap</Text>
      </View>
      
      <View style={styles.inputWrapper}>
        {/* INPUT BOX (ETH) */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
            style={styles.mainInput}
            value={amountIn}
            onChangeText={setAmountIn}
          />
          <View style={styles.tokenBadge}>
            <Text style={styles.tokenText}>ETH</Text>
          </View>
        </View>

        {/* STRETCHING LINE & ARROW */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <TouchableOpacity style={styles.arrowBtn}>
            <ArrowUpDown size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* OUTPUT BOX (USDC) */}
        <View style={styles.inputRow}>
          <View style={styles.outputDisplay}>
            {isCalculating ? (
              <RefreshCw size={24} color="rgba(255,255,255,0.2)" />
            ) : (
              <Text style={styles.outputText}>{amountOut}</Text>
            )}
          </View>
          <View style={[styles.tokenBadge, styles.blueBadge]}>
            <Text style={styles.tokenText}>USDC</Text>
          </View>
        </View>
      </View>

      {/* PRICE INFO */}
      {amountIn !== "" && (
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Slippage Protection</Text>
            <Text style={styles.infoValue}>Auto (0.5%)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabelBold}>Provider</Text>
            <Text style={styles.infoYellow}>0x Aggregator</Text>
          </View>
        </View>
      )}

      {/* ACTION BUTTON */}
      <TouchableOpacity 
        disabled={!amountIn || isCalculating}
        onPress={handleSwap}
        style={[styles.swapBtn, (!amountIn || isCalculating) && styles.disabledBtn]}
      >
        <Text style={styles.swapBtnText}>
          {isCalculating ? "Fetching Price..." : "Execute Swap"}
        </Text>
      </TouchableOpacity>

      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>
          BigView Protocol, The Future Of Decentralized Finance!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, width: '100%' },
  header: { position: 'relative', height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  inputWrapper: { gap: 8, marginBottom: 24 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 80 },
  mainInput: { flex: 1, fontSize: 56, fontWeight: '300', color: '#FFF', padding: 0 },
  outputDisplay: { flex: 1, height: 80, justifyContent: 'center' },
  outputText: { fontSize: 56, fontWeight: '300', color: '#FFF' },
  tokenBadge: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  blueBadge: { backgroundColor: '#3B82F6' },
  tokenText: { color: '#000', fontWeight: '600', fontSize: 12 },
  dividerRow: { height: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  line: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  arrowBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 20, borderWidth: 4, borderColor: 'rgba(255,255,255,0.05)' },
  infoTable: { marginBottom: 24, gap: 4, paddingHorizontal: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.2)' },
  infoLabelBold: { fontSize: 9, fontWeight: '900', color: '#FFF' },
  infoValue: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  infoYellow: { fontSize: 9, fontWeight: '900', color: '#FFD700' },
  swapBtn: { backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 100, alignItems: 'center', shadowColor: '#FFD700', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  disabledBtn: { opacity: 0.2 },
  swapBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  promoBanner: { marginTop: 16, padding: 8, backgroundColor: 'rgba(74, 222, 128, 0.2)', borderRadius: 4 },
  promoText: { color: '#FFD700', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }
});