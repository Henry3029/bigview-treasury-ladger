import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <LinearGradient
      colors={['#FFD700', '#B8860B']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.labelGroup}>
          <Text style={styles.label}>Available Balance</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
            {showBalance ? <Eye size={14} color="#000" /> : <EyeOff size={14} color="#000" />}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => Alert.alert("History", "Viewing History...")} style={styles.historyBtn}>
          <Text style={styles.historyText}>Transaction History</Text>
          <ChevronRight size={14} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.amount}>
          {showBalance ? amount : "••••••"}
        </Text>

        <TouchableOpacity style={styles.addBtn}>
          <Plus size={9} strokeWidth={3} color="#000" />
          <Text style={styles.addText}>Add <Text style={styles.greenText}>Money</Text></Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 24, paddingVertical: 12, marginHorizontal: 12, borderRadius: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 13, color: '#000' },
  eyeBtn: { padding: 4 },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  historyText: { fontSize: 13, color: '#000' },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#000', letterSpacing: -1 },
  // FIXED: changed borderWeight to borderWidth
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#FFD700', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  addText: { fontSize: 15, fontWeight: '600', color: '#000' },
  greenText: { color: '#15803D' }
});