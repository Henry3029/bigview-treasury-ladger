import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { 
  EyeOff, 
  LogOut, 
  Lock, 
  User, 
  Settings, 
  ShieldCheck 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const privy = usePrivy() as any; 
  const { login, logout, authenticated, ready, user } = privy; 
  const wallets = privy.wallets || [];
  const [balance, setBalance] = useState("0.00");

  const address = user?.wallet?.address || wallets[0]?.address;
  const googlePicture = user?.linkedAccounts?.find((acc: any) => acc.type === 'google_oauth')?.picture;

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(),
          });
          const rawBalance = await publicClient.getBalance({ address: address as `0x${string}` });
          setBalance(parseFloat(formatEther(rawBalance)).toFixed(4));
        } catch (error) {
          console.error("Balance fetch failed:", error);
        }
      }
    };

    if (authenticated) fetchBalance();
  }, [address, authenticated]);

  if (!ready) return null;

  // 1. LOGIN SCREEN
  if (!authenticated) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.lockIconBox}>
          <Lock size={32} color="#4ADE80" />
        </View>
        <Text style={styles.authTitle}>Secure Access</Text>
        <Text style={styles.authSubtitle}>Authentication Required for Bigview Ledger</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <Text style={styles.loginBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. PROFILE VIEW
  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* TOP BRAND BOX */}
      <View style={styles.brandBox}>
        {/* Decorative Blur Circle */}
        <View style={styles.blurCircle} />
        
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <View style={styles.avatarBox}>
              {googlePicture ? (
                <Image source={{ uri: googlePicture }} style={styles.avatar} />
              ) : (
                <User size={30} color="#FFF" />
              )}
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.hiText}>Hi</Text>
              <View style={styles.upgradeBadge}>
                <Text style={styles.upgradeText}>Upgrade your account</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.settingsBtn}>
            <Settings size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.balanceContainer}>
          <View>
            <View style={styles.balanceLabelRow}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <EyeOff size={12} color="rgba(255,255,255,0.5)" />
            </View>
            <Text style={styles.balanceAmount}>
              {balance} <Text style={styles.ethUnit}>ETH</Text>
            </Text>
          </View>

          <View style={styles.shieldContainer}>
            <View style={styles.shieldPulse} />
            <View style={styles.shieldIconBox}>
              <ShieldCheck size={32} color="#FFF" strokeWidth={2.5} />
            </View>
          </View>
        </View>
      </View>

      {/* MENU OPTIONS */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <View style={styles.logoutIconBox}>
            <LogOut size={20} color="#EF4444" />
          </View>
          <Text style={styles.logoutText}>Terminate Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0B2E' },
  authContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A0B2E', padding: 20 },
  lockIconBox: { width: 64, height: 64, backgroundColor: '#FFD700', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  authTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
  authSubtitle: { color: '#4ADE80', opacity: 0.8, fontSize: 10, fontWeight: 'bold', marginBottom: 32 },
  loginBtn: { width: '100%', height: 50, backgroundColor: '#FFD700', borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  
  // FIX FOR ERROR 2: Removed nested claimBtn and replaced 'py'
  brandBox: { backgroundColor: '#4ADE80', paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24, overflow: 'hidden' },
  
  // Create a separate style for the content area mentioned in the error
  content: { 
    padding: 20, 
    paddingVertical: 12 // This replaces the 'py' error shown in screenshot 20260509-101912.png
  },

  // This must be its own top-level property, NOT inside 'content'
  claimBtn: {
    marginTop: 16,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },

  blurCircle: { position: 'absolute', top: -100, right: -100, width: 256, height: 256, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 128 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#000', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  avatar: { width: '100%', height: '100%' },
  userTextContainer: { gap: 4 },
  hiText: { fontSize: 24, fontWeight: '900', color: '#FFD700' },
  upgradeBadge: { backgroundColor: 'rgba(74, 222, 128, 0.5)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  upgradeText: { color: '#000', fontSize: 8, fontWeight: 'bold' },
  settingsBtn: { padding: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  balanceContainer: { marginTop: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  balanceLabel: { color: '#FFF', fontSize: 10, fontWeight: '500' },
  balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: 'bold', letterSpacing: -1 },
  ethUnit: { fontSize: 12, fontWeight: '400' },
  shieldContainer: { position: 'relative' },
  shieldIconBox: { width: 64, height: 64, backgroundColor: '#10B981', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#000' },
  shieldPulse: { position: 'absolute', width: 64, height: 64, backgroundColor: 'rgba(16,185,129,0.2)', borderRadius: 32 },
  
  menuContainer: { padding: 24, marginTop: 16 },
  logoutBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)' },
  logoutIconBox: { width: 40, height: 40, backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '900', fontSize: 14 }
});