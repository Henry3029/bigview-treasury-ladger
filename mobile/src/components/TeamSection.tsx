import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Users, ShieldCheck } from 'lucide-react-native';

// Professional data structure for your 6 team members
const TEAM_MEMBERS = [
  { id: '1', name: 'Member 1', role: 'Lead Dev', initial: 'M1' },
  { id: '2', name: 'Member 2', role: 'Web3 Lead', initial: 'M2' },
  { id: '3', name: 'Member 3', role: 'Designer', initial: 'M3' },
  { id: '4', name: 'Member 4', role: 'Community', initial: 'M4' },
  { id: '5', name: 'Member 5', role: 'Marketing', initial: 'M5' },
  { id: '6', name: 'Member 6', role: 'Security', initial: 'M6' },
];

export default function TeamSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Users size={18} color="#FFD700" />
          <Text style={styles.title}>Project Contributors</Text>
        </View>
        <Text style={styles.subtitle}>Building the future of Bigview together</Text>
      </View>

      <View style={styles.grid}>
        {TEAM_MEMBERS.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{member.initial}</Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={10} color="#000" />
              </View>
            </View>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.role}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 32, paddingBottom: 20 },
  header: { marginBottom: 20, paddingHorizontal: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '500' },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 12 
  },
  card: { 
    width: '31%', // Fits 3 items per row
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 20, 
    padding: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: 'rgba(255, 215, 0, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative'
  },
  avatarText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 },
  verifiedBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#FFD700', 
    borderRadius: 10, 
    padding: 2 
  },
  name: { color: '#FFF', fontSize: 11, fontWeight: '900', textAlign: 'center', marginBottom: 2 },
  role: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: '700', textAlign: 'center' }
});