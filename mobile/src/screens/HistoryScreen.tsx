import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { ReceiptText, History, Wallet } from 'lucide-react-native';
import TreasuryTable from '../components/TreasuryTable';

export default function HistoryScreen() {
  const { user, authenticated, login } = usePrivy() as any; 
  const address = user?.wallet?.address;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <History size={20} color="#FFF" />
          </View>
          <Text style={styles.title}>Transaction History</Text>
        </View>
        <Text style={styles.subtitle}>
          Track your interactions with the <Text style={styles.gold}>Bigview Treasury</Text> on Base.
        </Text>

        {authenticated && (
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>Live Feed Active</Text>
          </View>
        )}
      </View>

      {/* Main Content Area */}
      <View style={styles.tableContainer}>
        {authenticated ? (
          <TreasuryTable address={address || null} />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.walletIconBox}>
              <Wallet size={40} color="#FFF" />
            </View>
            <Text style={styles.emptyTitle}>Connection Required</Text>
            <Text style={styles.emptySubtitle}>
              Please connect your wallet to view history.
            </Text>
            <TouchableOpacity style={styles.connectBtn} onPress={login}>
              <Text style={styles.connectBtnText}>Connect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <View style={styles.syncBadge}>
          <ReceiptText size={14} color="rgba(255, 215, 0, 0.8)" />
          <Text style={styles.syncText}>DATA SYNCED WITH BASE SEPOLIA</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  content: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  header: { marginBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconBox: { padding: 8, backgroundColor: '#000', borderRadius: 12, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subtitle: { fontSize: 10, fontWeight: '800', color: '#FFF', marginLeft: 4 },
  gold: { color: '#FFD700' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  pulseDot: { width: 6, height: 6, backgroundColor: '#10B981', borderRadius: 3 },
  liveText: { fontSize: 9, fontWeight: 'bold', color: '#4ADE80' },
  tableContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden', minHeight: 300 },
  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  walletIconBox: { width: 80, height: 80, backgroundColor: '#000', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  emptyTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 10, marginBottom: 8 },
  emptySubtitle: { color: '#FFF', fontSize: 11, fontWeight: 'bold', textAlign: 'center', opacity: 0.6, maxWidth: 180, lineHeight: 16 },
  connectBtn: { marginTop: 24, backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  connectBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  footer: { marginTop: 32, alignItems: 'center' },
  syncBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  syncText: { fontSize: 8, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
});