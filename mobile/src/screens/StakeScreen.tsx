import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import WisdomCarousel from '../components/WisdomCarousel';
import StakeCard from '../components/StakeCard';

const { width, height } = Dimensions.get('window');

export default function StakeScreen() {
  return (
    <View style={styles.root}>
      {/* BACKGROUND DECORATIVE GLOWS */}
      <View style={[styles.glow, styles.topGlow]} />
      <View style={[styles.glow, styles.bottomGlow]} />

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Sparkles size={12} color="#FFD700" />
            <Text style={styles.badgeText}>Bigview Treasury</Text>
          </View>
          
          {/* WisdomCarousel will sit here */}
          <WisdomCarousel />
        </View>

        {/* 2. THE STAKE CARD */}
        <View style={styles.stakeCardWrapper}>
          <StakeCard />
        </View>

        {/* 3. FOOTER STATS */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Network: </Text>
            <Text style={styles.footerValue}>Base Sepolia</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Reward: </Text>
            <Text style={styles.footerValueWhite}>BVW Token</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0B2E', // Brand Violet
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  topGlow: {
    top: -height * 0.1,
    left: -width * 0.1,
    width: width * 0.6,
    height: height * 0.3,
    backgroundColor: '#333', // Simplified charcaol equivalent
  },
  bottomGlow: {
    bottom: -height * 0.1,
    right: -width * 0.1,
    width: width * 0.5,
    height: height * 0.4,
    backgroundColor: '#333',
  },
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(51, 51, 51, 0.2)', // charcaol/5
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4ADE80', // solid-green
    letterSpacing: 0.5,
  },
  stakeCardWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  footer: {
    marginTop: 48,
    flexDirection: 'row',
    gap: 32,
    zIndex: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.2)',
  },
  footerValue: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerValueWhite: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF',
  },
});