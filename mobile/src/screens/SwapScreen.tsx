import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Activity } from 'lucide-react-native';
import SwapInterface from '../components/SwapInterface'; // We'll need to translate this next!

export default function SwapScreen() {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Page Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exchange Assets</Text>
        <Text style={styles.subtitle}>
          Swap Base Sepolia tokens with <Text style={styles.gold}>Bigview</Text> Liquidity.
        </Text>
      </View>

      {/* 2. The Swap Component Wrapper */}
      <View style={styles.interfaceWrapper}>
        <SwapInterface />
      </View>

      {/* 3. Footer Info & Network Status */}
      <View style={styles.footer}>
        <View style={styles.statusRow}>
          <View style={styles.badge}>
            <View style={styles.pulseDot} />
            <Text style={styles.badgeText}>Base Sepolia</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Slippage: </Text>
            <Text style={styles.infoValue}>0.5%</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fee: </Text>
            <Text style={[styles.infoValue, styles.greenText]}>1.0%</Text>
          </View>
        </View>

        <View style={styles.engineRow}>
          <Activity size={12} color="rgba(255, 255, 255, 0.1)" />
          <Text style={styles.engineText}>Live Pricing Engine</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#1A0B2E', // Consistency with layout
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(59, 130, 246, 0.8)', // text-blue/80
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  gold: {
    color: '#FFD700',
  },
  interfaceWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(28, 28, 30, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
    shadowColor: '#10B981',
    shadowRadius: 8,
    shadowOpacity: 0.5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.2)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.2)',
  },
  infoValue: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  greenText: {
    color: '#4ADE80',
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.1,
  },
  engineText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
});