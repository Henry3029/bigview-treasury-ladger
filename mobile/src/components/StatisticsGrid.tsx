import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Percent } from 'lucide-react-native';

interface Props {
  totalStaked: string;
  apy: string;
}

export const StatisticsGrid = ({ totalStaked, apy }: Props) => {
  return (
    <View style={styles.container}>
      {/* Pool APY Card */}
      <View style={styles.card}>
        <View style={styles.glow} />
        <View style={styles.header}>
          <Percent size={14} color="#FFD700" strokeWidth={3} />
          <Text style={styles.label}>Pool APY</Text>
        </View>
        <Text style={styles.value}>
          {apy}% <Text style={styles.subValue}>Yield</Text>
        </Text>
      </View>

      {/* Global Staked Card */}
      <View style={[styles.card, styles.violetBg]}>
        <View style={styles.header}>
          <TrendingUp size={14} color="rgba(255,255,255,0.4)" strokeWidth={3} />
          <Text style={styles.label}>Global Staked</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{totalStaked}</Text>
          <Text style={[styles.subValue, styles.goldText]}>ETH</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  card: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  violetBg: { backgroundColor: 'rgba(139, 92, 246, 0.03)' }, // Subtle violet tint
  glow: { position: 'absolute', right: -10, top: -10, width: 40, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  label: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subValue: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.2)' },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  goldText: { color: 'rgba(255, 215, 0, 0.5)' }
});