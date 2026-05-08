import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { Gift, ChevronRight, Repeat } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function DashboardButtons() {
  // FIXED: Applying the 'as any' bypass
  const privy = usePrivy() as any;
  const login = privy.login;
  const authenticated = privy.authenticated;

  const navigation = useNavigation<any>();

  const handleSwap = () => {
    navigation.navigate('Swap');
  };

  const handleClaim = () => {
    if (!authenticated) {
        login();
        return;
    }
    navigation.navigate('Rewards'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSwap} style={styles.button} activeOpacity={0.8}>
        <View style={styles.iconBoxViolet}>
          <Repeat size={20} color="#8B5CF6" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.topText}>Swap</Text>
          <Text style={styles.subText}>BVW Token</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleClaim} style={styles.button} activeOpacity={0.8}>
        <View style={styles.iconBoxGold}>
          <Gift size={20} color="#000" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.topTextGold}>Claim</Text>
          <Text style={styles.subText}>Rewards</Text>
        </View>
        <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12, width: '100%', paddingHorizontal: 4, marginBottom: 24 },
  button: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconBoxViolet: { width: 44, height: 44, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  iconBoxGold: { width: 44, height: 44, backgroundColor: '#FFD700', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1 },
  topText: { color: '#FFF', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  topTextGold: { color: '#FFD700', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  subText: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700' }
});