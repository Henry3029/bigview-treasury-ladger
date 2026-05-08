import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePrivy } from '@privy-io/expo';

interface StatusBadgeProps {
  label?: string;
}

export default function StatusBadge({ label }: StatusBadgeProps) {
  // Use 'as any' to allow access to user.wallet
  const { user, authenticated } = usePrivy() as any; 
  
  const address = user?.wallet?.address;
  const isConnected = authenticated;

  return (
    <View style={[
      styles.badge, 
      isConnected ? styles.connectedBorder : styles.disconnectedBorder
    ]}>
      <View style={[
        styles.dot, 
        isConnected ? styles.connectedDot : styles.disconnectedDot
      ]} />
      
      <Text style={[
        styles.text, 
        isConnected ? styles.connectedText : styles.disconnectedText
      ]}>
        {isConnected && address
          ? `BASE: ${address.slice(0, 6)}...${address.slice(-4)}` 
          : label || "Disconnected"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  connectedBorder: { borderColor: 'rgba(255, 215, 0, 0.2)', backgroundColor: 'rgba(255, 215, 0, 0.05)' },
  connectedDot: { backgroundColor: '#FFD700' },
  connectedText: { color: '#FFD700' },
  disconnectedBorder: { borderColor: 'rgba(255,255,255,0.05)' },
  disconnectedDot: { backgroundColor: 'rgba(255,255,255,0.2)' },
  disconnectedText: { color: 'rgba(255,255,255,0.3)' },
});