import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { usePrivy, useWallets } from '@privy-io/expo';
import { encodeFunctionData, createPublicClient, http, createWalletClient, custom, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '../constants/abis/BigViewTreasuryV2.json';

export const ClaimButton = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  // Safely get the first wallet
  const wallet = wallets && wallets.length > 0 ? wallets[0] : null; 

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    if (type === 'error' || type === 'success') {
      Alert.alert(type.toUpperCase(), text);
    }
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleClaim = async () => {
    if (!authenticated) {
      notify("Redirecting to login...", "info");
      login();
      return;
    }

    if (!wallet) return notify("No wallet connected!", "error");

    setIsConfirming(true);

    try {
      // Ensure we are on Base Sepolia
      if (wallet.chainId !== 'eip155:84532') {
        await wallet.switchChain(84532);
      }

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(provider),
      });

      const [address] = await walletClient.getAddresses();
      
      const data = encodeFunctionData({
        abi: treasuryAbi,
        functionName: 'claimGovernanceRewards',
        args: [],
      });

      // FIXED: Strict casting and fallback for env variable
      const treasuryAddress = (process.env.EXPO_PUBLIC_TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;
      
      const txHash = await walletClient.sendTransaction({
        account: address,
        to: treasuryAddress,
        data: data,
      });

      notify("Transaction sent! Waiting...", "info");

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.EXPO_PUBLIC_BASE_SEPOLIA_RPC),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      if (receipt.status === 'success') {
        notify('Claim Successful!', 'success');
      } else {
        notify('Transaction reverted.', 'error');
      }

    } catch (err: any) {
      console.error("Claim failed:", err);
      const isUserRejected = err.message?.includes("User rejected") || err.code === 4001;
      notify(isUserRejected ? "Transaction rejected." : "Claim failed.", "error");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      {message && (
        <View style={[styles.notification, status === 'success' ? styles.bgSuccess : status === 'error' ? styles.bgError : styles.bgInfo]}>
          <View style={[styles.dot, status === 'success' ? styles.dotSuccess : status === 'error' ? styles.dotError : status === 'dotInfo']} />
          <Text style={[styles.notifyText, status === 'success' ? styles.textSuccess : status === 'error' ? styles.textError : styles.textInfo]}>
            {message}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        onPress={handleClaim}
        disabled={isConfirming}
        style={[styles.button, isConfirming && styles.disabled]}
        activeOpacity={0.8}
      >
        {isConfirming ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>
            {!authenticated ? 'Connect to Claim' : 'Claim Now'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  notification: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 16, borderWidth: 1, gap: 8, width: '100%' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  notifyText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  bgSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' },
  textSuccess: { color: '#10B981' },
  dotSuccess: { backgroundColor: '#10B981' },
  bgError: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' },
  textError: { color: '#EF4444' },
  dotError: { backgroundColor: '#EF4444' },
  bgInfo: { backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.2)' },
  textInfo: { color: '#FFD700' },
  dotInfo: { backgroundColor: '#FFD700' },
  button: { backgroundColor: '#FFD700', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20, width: '100%', alignItems: 'center', elevation: 8 },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  disabled: { opacity: 0.5 }
});