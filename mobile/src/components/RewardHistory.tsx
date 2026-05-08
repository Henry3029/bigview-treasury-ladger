import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { usePrivy, useWallets } from '@privy-io/expo';
import { ExternalLink, CheckCircle2, Clock } from 'lucide-react-native';

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  status: string;
}

export const RewardHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { authenticated } = usePrivy() as any;
  const { wallets } = useWallets();
  
  const wallet = wallets?.[0];
  const address = wallet?.address;

  useEffect(() => {
    async function fetchUserHistory() {
      if (!authenticated || !address) {
        setLoading(false);
        return;
      }
      const treasuryAddress = process.env.EXPO_PUBLIC_TREASURY_ADDRESS?.toLowerCase();
      const apiKey = process.env.EXPO_PUBLIC_BASESCAN_API_KEY;

      try {
        const res = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );
        const data = await res.json();

        if (data.status === "1" && data.result) {
          const filtered = data.result
            .filter((tx: any) => tx.to?.toLowerCase() === treasuryAddress)
            .slice(0, 5)
            .map((tx: any) => ({
              id: tx.hash,
              date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
              }),
              type: tx.functionName 
                ? tx.functionName.split('(')[0].replace(/([A-Z])/g, ' $1').trim() 
                : 'Transaction',
              status: tx.isError === "0" ? 'Confirmed' : 'Failed',
            }));
          setHistory(filtered);
        }
      } catch (err) {
        console.error("Error fetching Base history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserHistory();
  }, [address, authenticated]);

  if (loading) return <Text style={styles.loadingText}>Syncing history...</Text>;
  
  if (history.length === 0) return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>No recent activity found.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>Base Sepolia</Text>
        </View>
      </View>

      {history.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, item.status === 'Confirmed' ? styles.bgGreen : styles.bgGold]}>
              {item.status === 'Confirmed' ? <CheckCircle2 size={18} color="#10B981" /> : <Clock size={18} color="#FFD700" />}
            </View>
            <View>
              <Text style={styles.txType}>{item.type}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => Linking.openURL(`https://sepolia.basescan.org/tx/${item.id}`)}
            style={styles.linkBtn}
          >
            <Text style={styles.hashText}>{item.id.substring(0, 6)}...</Text>
            <ExternalLink size={12} color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  loadingText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: 20 },
  emptyBox: { padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,215,0,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFD700' },
  badgeText: { color: '#FFD700', fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bgGreen: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  bgGold: { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
  txType: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  txDate: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700' },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  hashText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700' },
});