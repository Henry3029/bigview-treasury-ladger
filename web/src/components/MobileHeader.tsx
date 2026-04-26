import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { Bell, User, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import ProfileDrawer from './ProfileDrawer';

interface MobileHeaderProps {
  onNotificationClick: () => void;
}

export default function MobileHeader({ onNotificationClick }: MobileHeaderProps) {
  const { user, authenticated, login } = usePrivy();
  
  // FIXED: Reliable way to get the primary wallet address in Expo SDK
  const address = user?.linkedAccounts?.find((acc) => acc.type === 'wallet')?.address;
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // FIXED: Explicitly casting to access picture safely
  const googleImage = user?.linkedAccounts?.find(
    (acc: any) => acc.type === 'google_oauth'
  )?.picture;

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const copyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      notify("Address Copied!");
    }
  };

  const handleProfileClick = () => {
    if (!authenticated) return login();
    setIsDrawerOpen(true);
  };

  const displayImage = avatarUrl || googleImage;

  return (
    <>
      {message && (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>{message}</Text>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleProfileClick} style={styles.profileBtn}>
            {displayImage ? (
              <Image source={{ uri: displayImage }} style={styles.avatar} />
            ) : (
              <User size={22} strokeWidth={2.5} color="#FFF" />
            )}
          </TouchableOpacity>

          <View>
            {authenticated && address ? (
              <TouchableOpacity onPress={copyAddress} style={styles.walletPill}>
                <View style={styles.statusDot} />
                <Text style={styles.addressText}>
                  {address.slice(0, 4)}...{address.slice(-4)}
                </Text>
                <Copy size={10} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={login} style={styles.connectBtn}>
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={onNotificationClick} style={styles.notifBtn}>
            <Bell size={20} color="rgba(255, 215, 0, 0.7)" />
          </TouchableOpacity>
          
          <View style={styles.branding}>
            <View style={styles.logoSquare}>
              <Image 
                source={require('../../assets/images/bigview-image.png')} 
                style={styles.logoImg} 
              />
            </View>
            <Text style={styles.brandText}>
              BI<Text style={styles.gold}>G</Text>VI<Text style={styles.gold}>EW</Text>
            </Text>
          </View>
        </View>
      </View>

      <ProfileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />
    </>
  );
}

const styles = StyleSheet.create({
  toastContainer: { position: 'absolute', top: 110, left: 0, right: 0, alignItems: 'center', zIndex: 400 },
  toast: { backgroundColor: '#FFD700', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  toastText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  header: { height: 96, backgroundColor: '#1A0B2E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', zIndex: 90 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileBtn: { width: 48, height: 48, backgroundColor: '#3B82F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  walletPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255, 215, 0, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  statusDot: { width: 6, height: 6, backgroundColor: '#4ADE80', borderRadius: 3 },
  addressText: { fontSize: 10, fontWeight: '900', color: '#FFF' },
  connectBtn: { backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  connectText: { color: '#000', fontSize: 13, fontWeight: '900' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { padding: 8 },
  branding: { alignItems: 'center', gap: 4 },
  logoSquare: { width: 36, height: 36, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoImg: { width: 24, height: 24, resizeMode: 'contain' },
  brandText: { fontSize: 9, fontWeight: '900', color: '#FFF' },
  gold: { color: '#FFD700' }
});