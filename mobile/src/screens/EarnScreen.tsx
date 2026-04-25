import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { TrendingUp, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react-native';
import EarnCard from '../components/EarnCard';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function EarnScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* 1. Header & TVL */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <TrendingUp size={24} color="#FFF" />
          </View>
          <View>
            <Text style={styles.title}>Growth Vaults</Text>
            <Text style={styles.subtitle}>
              Deploy assets to the <Text style={styles.goldText}>Bigview Ecosystem</Text>
            </Text>
          </View>
        </View>

        <View style={styles.tvlBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.tvlLabel}>Protocol TVL:</Text>
          <Text style={styles.tvlValue}>$1.24M+</Text>
        </View>
      </View>

      {/* 2. Recommended Strategies */}
      <View style={styles.strategySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Strategies</Text>
          <View style={styles.chainBadge}>
            <Text style={styles.chainText}>Base Mainnet</Text>
          </View>
        </View>

        {/* Strategy Card: ETH/USDC */}
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient 
            colors={['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.4)']} 
            style={styles.strategyCard}
          >
            <View style={styles.strategyMain}>
              <View style={styles.tokenPair}>
                <View style={styles.tokenCirclePrimary}><Text style={styles.tokenSymbol}>Ξ</Text></View>
                <View style={styles.tokenCircleSecondary}><Text style={styles.tokenSymbolSmall}>USDC</Text></View>
              </View>
              
              <View style={styles.strategyInfo}>
                <Text style={styles.strategyTitle}>Stable-Core ETH</Text>
                <Text style={styles.strategySub}>Automated Aerodrome Yield</Text>
              </View>

              <View style={styles.apyContainer}>
                <Text style={styles.apyLabel}>Net APY</Text>
                <Text style={styles.apyValue}>12.5%</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Highlight Grid */}
        <View style={styles.highlightRow}>
          <View style={styles.highlightCard}>
            <Zap size={16} color="#FFD700" />
            <Text style={styles.highlightText}>Instant Compounding</Text>
          </View>
          <View style={styles.highlightCard}>
            <ShieldCheck size={16} color="#4ADE80" />
            <Text style={styles.highlightText}>Verified Security</Text>
          </View>
        </View>
      </View>

      {/* 3. Action Area (EarnCard) */}
      <View style={styles.actionSection}>
        <EarnCard />
        
        {/* Transparency Card */}
        <TouchableOpacity style={styles.transparencyCard}>
          <Text style={styles.transparencyTitle}>Protocol Transparency</Text>
          <Text style={styles.transparencyBody}>
            By depositing, your assets enter a managed vault that optimizes yield across Base.
          </Text>
          <View style={styles.auditRow}>
            <Text style={styles.auditText}>View Strategy Audit</Text>
            <ArrowUpRight size={12} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  content: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  header: { marginBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  iconBox: { padding: 10, backgroundColor: '#2D2D2D', borderRadius: 16 },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subtitle: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  goldText: { color: '#FFD700' },
  
  tvlBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  pulseDot: { width: 8, height: 8, backgroundColor: '#10B981', borderRadius: 4 },
  tvlLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '900' },
  tvlValue: { fontSize: 14, color: '#FFF', fontWeight: '900' },

  strategySection: { backgroundColor: 'rgba(45, 45, 45, 0.2)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  chainBadge: { backgroundColor: 'rgba(255,215,0,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)' },
  chainText: { color: '#FFD700', fontSize: 9, fontWeight: '900' },
  
  strategyCard: { borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  strategyMain: { flexDirection: 'row', alignItems: 'center' },
  tokenPair: { flexDirection: 'row', marginRight: 12 },
  tokenCirclePrimary: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1A0B2E' },
  tokenCircleSecondary: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginLeft: -12, borderWidth: 2, borderColor: '#1A0B2E' },
  tokenSymbol: { color: '#FFD700', fontSize: 20, fontWeight: '900' },
  tokenSymbolSmall: { color: '#000', fontSize: 8, fontWeight: '900' },
  
  strategyInfo: { flex: 1 },
  strategyTitle: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  strategySub: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: '900' },
  
  apyContainer: { alignItems: 'flex-end' },
  apyLabel: { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: '900' },
  apyValue: { fontSize: 24, color: '#10B981', fontWeight: '900', letterSpacing: -1 },

  highlightRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  highlightCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  highlightText: { fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: '900' },

  actionSection: { gap: 24 },
  transparencyCard: { backgroundColor: 'rgba(255,215,0,0.05)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  transparencyTitle: { color: '#FFD700', fontSize: 10, fontWeight: '900', marginBottom: 8 },
  transparencyBody: { color: '#4ADE80', fontSize: 10, fontWeight: '900', lineHeight: 14 },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  auditText: { color: '#FFF', fontSize: 9, fontWeight: '900' }
});