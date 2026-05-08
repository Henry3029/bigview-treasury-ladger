import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { createPublicClient, http, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { RefreshCcw, ChevronRight, Gift, Zap, Ticket, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Your V2 ABI path
import tokenAbi from '../constants/abis/BigViewTreasuryV2.json';

const { width } = Dimensions.get('window');

export default function RewardsScreen() {
  const { user, authenticated } = usePrivy() as any; 
  const address = user?.wallet?.address;

  const [pending, setPending] = useState("0.00");
  const [liveStaked, setLiveStaked] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = "0xE5d555B65924BcB6FB7B8aAD9303727A8f3F5788" as `0x${string}`;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.EXPO_PUBLIC_BASE_SEPOLIA_RPC)
  });

  const fetchRewardsData = async () => {
    if (!address || !authenticated) return;
    try {
      setIsLoading(true);
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: tokenAbi,
        functionName: 'members',
        args: [address],
      });

      if (data && Array.isArray(data)) {
        const [isMember, amount, unclaimedBVW] = data;
        if (isMember) {
          setLiveStaked(formatUnits(amount, 18));
          setPending(Number(formatUnits(unclaimedBVW, 18)).toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching rewards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, [address, authenticated]);

  return (
    <View style={styles.root}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchRewardsData} tintColor="#FFD700" />
        }
      >
        {/* HEADER AREA */}
        <LinearGradient 
          colors={['rgba(255, 215, 0, 0.15)', 'transparent']} 
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Rewards</Text>
            <TouchableOpacity onPress={fetchRewardsData} style={styles.refreshBtn}>
               <RefreshCcw size={20} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>BVW Yield</Text>
              <View style={styles.statValueContainer}>
                <View style={styles.bvwIcon}><Text style={styles.bvwText}>BVW</Text></View>
                <Text style={styles.statValue}>{pending}</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
              </View>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Active Stake</Text>
              <View style={styles.statValueContainer}>
                <Ticket size={22} color="#FFD700" />
                <Text style={styles.statValue}>{Number(liveStaked).toFixed(2)} <Text style={styles.unit}>ETH</Text></Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainBody}>
          {/* ICON GRID */}
          <View style={styles.iconGrid}>
            {[
              { label: 'Weekly Drop', icon: <Zap size={22} color="#FFD700" />, bg: 'rgba(255, 215, 0, 0.1)' },
              { label: 'Referral', icon: <Gift size={22} color="#F472B6" />, bg: 'rgba(244, 114, 182, 0.1)' },
              { label: 'Boosters', icon: <TrendingUp size={22} color="#34D399" />, bg: 'rgba(52, 211, 153, 0.1)' },
              { label: 'Governance', icon: <Ticket size={22} color="#60A5FA" />, bg: 'rgba(96, 165, 250, 0.1)' },
            ].map((item, i) => (
              <View key={i} style={styles.gridItem}>
                <TouchableOpacity style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  {item.icon}
                </TouchableOpacity>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* HOT BOOSTERS SECTION */}
          <Text style={styles.sectionTitle}>Hot Yield Boosters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {[1, 2].map((v) => (
              <View key={v} style={styles.boosterCard}>
                <View style={styles.boosterTopLine} />
                <Text style={styles.boosterApy}>+5% APY</Text>
                <Text style={styles.boosterSubtitle}>Stake Booster v.{v}</Text>
                <TouchableOpacity style={styles.claimBtn}>
                  <Text style={styles.claimBtnText}>Claim</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* DAILY QUESTS */}
          <View style={styles.questCard}>
            <Text style={styles.questHeader}>Daily Quests</Text>
            <View style={styles.questItem}>
              <View style={styles.questInfo}>
                <View style={styles.questIconBox}><TrendingUp size={24} color="#FFF" /></View>
                <View>
                  <Text style={styles.questTitle}>Yield Multiplier</Text>
                  <Text style={styles.questBonus}>+Up to 6.5%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.goBtn}>
                <Text style={styles.goText}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  content: { paddingBottom: 100 },
  headerGradient: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  refreshBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statsRow: { flexDirection: 'row', gap: 32 },
  statItem: { gap: 4 },
  statLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  statValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statValue: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  unit: { fontSize: 12, opacity: 0.3 },
  bvwIcon: { width: 24, height: 24, backgroundColor: '#FFD700', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bvwText: { color: '#000', fontSize: 8, fontWeight: '900' },
  
  mainBody: { px: 24, paddingHorizontal: 24, marginTop: -20 },
  iconGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  gridItem: { alignItems: 'center', gap: 8 },
  iconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  gridLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  
  sectionTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 16 },
  horizontalScroll: { marginBottom: 32 },
  boosterCard: { width: 200, backgroundColor: '#1E293B', padding: 20, borderRadius: 24, marginRight: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  boosterTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#FFD700', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  boosterApy: { color: '#FFF', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  boosterSubtitle: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', marginBottom: 20 },
  claimBtn: { backgroundColor: '#FFD700', py: 10, borderRadius: 50, alignItems: 'center', paddingVertical: 10 },
  claimBtnText: { color: '#000', fontWeight: '900', fontSize: 10 },
  
  questCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questHeader: { color: '#FFF', fontSize: 10, fontWeight: '900', marginBottom: 24 },
  questItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  questIconBox: { width: 48, height: 48, backgroundColor: '#000', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  questBonus: { color: '#34D399', fontSize: 10, fontWeight: '900', mt: 4 },
  goBtn: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#000', borderRadius: 50, borderWIdth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  goText: { color: '#FFF', fontSize: 10, fontWeight: '900' }
});