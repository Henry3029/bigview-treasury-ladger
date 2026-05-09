import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { 
  User, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  GithubIcon, // CHANGED from Github
  TwitterIcon, // CHANGED from Twitter
  ExternalLink 
} from 'lucide-react-native';
import { usePrivy } from '@privy-io/expo';
import StatusBadge from '../components/StatusBadge';

export default function MeScreen() {
  const { logout, user } = usePrivy() as any; // Cast to any to prevent potential type mismatches

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out Bigview Ledger - The future of Base yield!' });
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 1. Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <User size={40} color="#FFD700" strokeWidth={1.5} />
          </View>
          {/* Using user data if available, falling back to Henry */}
          <Text style={styles.userName}>{user?.email?.address?.split('@')[0] || "Henry"}</Text>
          <StatusBadge />
        </View>

        {/* 2. Menu Sections */}
        <View style={styles.menuContainer}>
          
          <MenuSection title="Account">
            <MenuLink icon={<Settings size={18} />} label="Settings" onPress={() => {}} />
            <MenuLink icon={<Shield size={18} />} label="Security" onPress={() => {}} />
          </MenuSection>

          <MenuSection title="Support & Community">
            <MenuLink icon={<HelpCircle size={18} />} label="Help Center" onPress={() => {}} />
            <MenuLink icon={<GithubIcon size={18} />} label="Open Source" onPress={() => {}} />
            <MenuLink icon={<TwitterIcon size={18} />} label="Twitter / X" onPress={() => {}} />
            <MenuLink icon={<ExternalLink size={18} />} label="Share App" onPress={handleShare} />
          </MenuSection>

          {/* 3. Dangerous Actions */}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
            <LogOut size={18} color="#FF4545" />
            <Text style={styles.logoutText}>Disconnect Wallet</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.versionText}>BIGVIEW MOBILE • BUILD 1.0.4</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Sub-Components ---

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function MenuLink({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuLink} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLinkLeft}>
        <View style={styles.iconWrapper}>{React.cloneElement(icon, { color: '#FFD700' })}</View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 215, 0, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.2)' },
  avatarGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 215, 0, 0.02)', zIndex: -1 },
  userName: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
  menuContainer: { gap: 24 },
  section: { gap: 12 },
  sectionTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 4 },
  sectionBody: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20 },
  menuLinkLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrapper: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,215,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'rgba(255, 69, 69, 0.05)', paddingVertical: 18, borderRadius: 24, marginTop: 20, borderWidth: 1, borderColor: 'rgba(255, 69, 69, 0.1)' },
  logoutText: { color: '#FF4545', fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  versionText: { textAlign: 'center', marginTop: 40, color: 'rgba(255,255,255,0.1)', fontSize: 9, fontWeight: '900', letterSpacing: 2 }
});