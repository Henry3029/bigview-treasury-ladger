import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, FlatList } from 'react-native';
import { ExternalLink, CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

interface TreasuryTableProps {
  address: string | null;
}

export default function TreasuryTable({ address }: TreasuryTableProps) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  useEffect(() => {
    async function fetchHistory() {
      if (!address) {
        setLoading(false);
        return;
      }

      const apiKey = process.env.EXPO_PUBLIC_BASESCAN_API_KEY;

      try {
        const res = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );
        const data = await res.json();
        
        if (data.status === "1" && data.result) {
          setTransactions(data.result.slice(0, 10) || []);
          notify("Base transactions updated.", "success");
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
        notify("Could not connect to the Base Explorer.", "error"); 
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [address]);

  if (!address) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Please sign in to see your history.</Text>
      </View>
    );
  }

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FFD700" />
        <Text style={styles.loadingText}>Syncing Ledger...</Text>
      </View>
    );
  }

  const renderTxItem = ({ item }: { item: any }) => {
    const isError = item.isError !== '0';
    const functionName = item.functionName 
      ? item.functionName.split('(')[0].replace(/([A-Z])/g, ' $1') 
      : 'Transfer';

    return (
      <TouchableOpacity 
        style={styles.txCard}
        onPress={() => Linking.openURL(`https://sepolia.basescan.org/tx/${item.hash}`)}
      >
        <View style={styles.txHeader}>
          <Text style={styles.hashText}>{item.hash.substring(0, 18)}...</Text>
          <ExternalLink size={12} color="#FFD700" opacity={0.5} />
        </View>

        <View style={styles.txFooter}>
          <View style={[styles.statusBadge, isError ? styles.errorBadge : styles.successBadge]}>
            <Text style={[styles.statusText, isError ? styles.errorText : styles.successText]}>
              {isError ? 'FAILED' : 'CONFIRMED'}
            </Text>
          </View>
          <Text style={styles.methodText}>{functionName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {message && (
        <View style={[
          styles.notification,
          status === 'success' ? styles.notifySuccess : status === 'error' ? styles.notifyError : styles.notifyInfo
        ]}>
          {status === 'success' && <CheckCircle2 size={14} color="#10B981" />}
          {status === 'error' && <AlertCircle size={14} color="#EF4444" />}
          {status === 'info' && <Info size={14} color="#FFD700" />}
          <Text style={[
            styles.notifyText,
            status === 'success' ? styles.successText : status === 'error' ? styles.errorText : styles.infoText
          ]}>{message}</Text>
        </View>
      )}

      <FlatList
        data={transactions}
        renderItem={renderTxItem}
        keyExtractor={(item) => item.hash}
        scrollEnabled={false} // Parent ScrollView handles scrolling
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  centered: { padding: 40, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: 12, textAlign: 'center' },
  
  notification: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, marginBottom: 16, borderSize: 1 },
  notifySuccess: { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' },
  notifyError: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' },
  notifyInfo: { backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.2)' },
  notifyText: { fontSize: 10, fontWeight: 'bold' },

  txCard: { paddingVertical: 16, paddingHorizontal: 4 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hashText: { fontFamily: 'monospace', fontSize: 12, color: 'rgba(255, 215, 0, 0.7)' },
  txFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  successBadge: { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' },
  errorBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' },
  statusText: { fontSize: 8, fontWeight: '900' },
  successText: { color: '#10B981' },
  errorText: { color: '#EF4444' },
  infoText: { color: '#FFD700' },
  
  methodText: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', textTransform: 'uppercase' },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }
});