import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TeamSection from '../components/TeamSection';
import { Info } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Info size={24} color="#FFD700" />
        </View>
        <Text style={styles.title}>About Bigview Treasury</Text>
        <Text style={styles.tagline}>
          Transparency. Community. Decentralization.
        </Text>
      </View>

      {/* Description Card */}
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionText}>
          We are tracking the <Text style={styles.highlight}>POX rewards</Text> for our community, 
          ensuring every participant has a clear view of the ecosystem's growth on the Base network.
        </Text>
      </View>

      {/* Team Section Component */}
      <View style={styles.teamContainer}>
        <TeamSection />
      </View>

      {/* Footer Versioning */}
      <Text style={styles.versionText}>Bigview Mobile v1.0.0 (Beta)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconBox: { 
    padding: 12, 
    backgroundColor: 'rgba(255, 215, 0, 0.1)', 
    borderRadius: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)'
  },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  tagline: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: 'rgba(255,255,255,0.4)', 
    textTransform: 'uppercase', 
    letterSpacing: 2,
    marginTop: 4 
  },
  descriptionCard: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32
  },
  descriptionText: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.7)', 
    lineHeight: 22, 
    textAlign: 'center',
    fontWeight: '500'
  },
  highlight: { color: '#FFD700', fontWeight: '900' },
  teamContainer: { width: '100%' },
  versionText: { 
    textAlign: 'center', 
    marginTop: 40, 
    fontSize: 9, 
    fontWeight: '900', 
    color: 'rgba(255,255,255,0.1)',
    letterSpacing: 1
  }
});