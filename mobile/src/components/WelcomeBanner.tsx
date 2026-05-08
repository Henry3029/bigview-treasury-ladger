import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { X, Sparkles, Zap } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeBanner() {
  const { user, authenticated } = usePrivy() as any; 
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const checkWelcome = async () => {
      if (authenticated && user) {
        const hasSeenWelcome = await AsyncStorage.getItem('bigview_welcome_seen_v2');
        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }
      }
    };
    checkWelcome();
  }, [authenticated, user]);

  const closeBanner = async () => {
    setShowWelcome(false);
    await AsyncStorage.setItem('bigview_welcome_seen_v2', 'true');
  };

  return (
    <Modal visible={showWelcome} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#0f172a', '#1e293b', '#000000']}
            style={styles.mainCard}
          >
            {/* Brand Glows */}
            <View style={styles.topGlow} />
            <View style={styles.bottomGlow} />

            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <View style={styles.goldBox} />
              </View>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>Welcome Home</Text>
                  <Sparkles size={18} color="#FFD700" />
                </View>

                <Text style={styles.sublabel}>ACCOUNT SECURED</Text>

                <View style={styles.divider} />

                <Text style={styles.description}>
                  You're now live on <Text style={styles.boldWhite}>Base Sepolia</Text>. Start staking to accumulate <Text style={styles.boldWhite}>BVW</Text> governance rewards automatically.
                </Text>

                <TouchableOpacity style={styles.getStartedBtn} onPress={closeBanner}>
                  <Zap size={16} color="#FFF" fill="#FFF" />
                  <Text style={styles.btnText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.closeBtn} onPress={closeBanner}>
            <X size={24} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.95)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  cardContainer: { width: '100%', maxWidth: 400, alignItems: 'center' },
  mainCard: { width: '100%', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  topGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, backgroundColor: 'rgba(255, 215, 0, 0.15)', borderRadius: 60 },
  bottomGlow: { position: 'absolute', bottom: -40, left: -40, width: 100, height: 100, backgroundColor: 'rgba(255, 215, 0, 0.08)', borderRadius: 50 },
  content: { alignItems: 'center', zIndex: 10 },
  iconContainer: { marginBottom: 24 },
  goldBox: { width: 80, height: 80, backgroundColor: '#FFD700', borderRadius: 20, transform: [{ rotate: '12deg' }], shadowColor: '#FFD700', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20 },
  textContainer: { width: '100%', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  sublabel: { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  divider: { height: 1, width: 48, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 },
  boldWhite: { color: '#FFF', fontWeight: '900' },
  getStartedBtn: { width: '100%', marginTop: 24, paddingVertical: 16, backgroundColor: '#FFD700', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  closeBtn: { marginTop: 32, padding: 16, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
});