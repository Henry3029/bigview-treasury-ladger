import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ScrollView, ActivityIndicator } from 'react-native';
import { X, Zap, Camera, User, ExternalLink, ShieldCheck, Copy, LogOut, Wallet } from 'lucide-react-native';
import { usePrivy } from '@privy-io/expo';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToImgbb } from '../utils/uploadImage';

export default function ProfileDrawer({ isOpen, onClose, avatarUrl, setAvatarUrl }: { 
  isOpen: boolean, 
  onClose: () => void, 
  avatarUrl: string | null, 
  setAvatarUrl: (url: string | null) => void 
}) {
  const { authenticated, user, logout } = usePrivy() as any;

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Use optional chaining and casting to handle linked_accounts structure
  const linkedAccounts = (user as any)?.linked_accounts || (user as any)?.linkedAccounts || [];
  const googleImage = linkedAccounts.find((acc: any) => acc.type === 'google_oauth')?.picture;
  const walletAccount = linkedAccounts.find((acc: any) => acc.type === 'wallet');
  const activeAddress = walletAccount?.address || (user as any)?.wallet?.address;

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const copyAddress = async () => {
    if (activeAddress) {
      await Clipboard.setStringAsync(activeAddress);
      notify('Address Copied!');
    }
  };

  const handleCameraClick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      notify("Permission Required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setIsUploading(true);
      const localUri = result.assets[0].uri;
      const filename = localUri.split('/').pop();
      const type = `image/${filename?.split('.').pop()}`;
      
      const formData = new FormData();
      formData.append('image', { uri: localUri, name: filename, type } as any);

      try {
        const uploadedUrl = await uploadImageToImgbb(formData);
        if (uploadedUrl) {
          setAvatarUrl(uploadedUrl);
          notify('Profile Updated!');
        }
      } catch (e) {
        notify("Upload Failed");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {message && (
          <View style={styles.toastContainer}>
            <View style={styles.toast}><Text style={styles.toastText}>{message}</Text></View>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                {isUploading ? (
                  <ActivityIndicator color="#FFD700" />
                ) : (avatarUrl || googleImage) ? (
                  <Image source={{ uri: avatarUrl || googleImage }} style={styles.avatarImg} />
                ) : (
                  <User size={48} color="rgba(255,255,255,0.2)" />
                )}
              </View>
              <TouchableOpacity style={styles.cameraBtn} onPress={handleCameraClick} disabled={isUploading}>
                <Camera size={18} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{authenticated ? "Henry Chigozie" : "Guest User"}</Text>
            <View style={styles.networkBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.networkText}>Base Sepolia Live</Text>
            </View>
          </View>

          <View style={styles.cardList}>
            <View style={styles.infoCard}>
              <View style={styles.row}>
                <View style={styles.iconBox}><Wallet size={16} color="#FFD700" /></View>
                <Text style={styles.addressText}>
                  {activeAddress ? `${activeAddress.slice(0, 10)}...${activeAddress.slice(-8)}` : 'Not Connected'}
                </Text>
                <TouchableOpacity onPress={copyAddress} style={styles.copyBtn}>
                  <Copy size={16} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardLabel}>Membership Tier</Text>
              <View style={styles.row}>
                <View style={styles.rowMain}>
                  <ShieldCheck size={16} color="#FFD700" />
                  <Text style={styles.tierText}>Tier 1 • Genesis</Text>
                </View>
                <TouchableOpacity style={styles.upgradeBtn}>
                  <Text style={styles.upgradeText}>Upgrade </Text>
                  <ExternalLink size={12} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.rowMain}>
                <Zap size={18} color="#FFD700" />
                <Text style={styles.actionText}>Stake Assets</Text>
              </View>
              <X size={16} color="rgba(255,255,255,0.2)" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>

            {authenticated && (
              <TouchableOpacity style={styles.logoutBtn} onPress={() => { logout(); onClose(); }}>
                <LogOut size={18} color="#EF4444" />
                <Text style={styles.logoutText}>Disconnect Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bigview Treasury Ledger • v2.0</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  toastContainer: { position: 'absolute', top: 100, width: '100%', alignItems: 'center', zIndex: 400 },
  toast: { backgroundColor: '#4ADE80', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 12 },
  toastText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  header: { padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  closeBtn: { padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16 },
  scrollContent: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 40 },
  avatarWrapper: { position: 'relative' },
  avatarCircle: { width: 112, height: 112, borderRadius: 24, borderWidth: 4, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  cameraBtn: { position: 'absolute', bottom: 0, width: '100%', height: '25%', backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFF', marginTop: 24, letterSpacing: -1 },
  networkBadge: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: 'rgba(255, 215, 0, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.2)' },
  pulseDot: { width: 6, height: 6, backgroundColor: '#FFD700', borderRadius: 3 },
  networkText: { fontSize: 10, fontWeight: '900', color: '#FFF' },
  cardList: { paddingHorizontal: 24, gap: 16 },
  infoCard: { padding: 16, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
  addressText: { fontSize: 14, fontWeight: 'bold', color: '#FFF', flex: 1, marginLeft: 12 },
  cardLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  tierText: { fontSize: 12, fontWeight: '900', color: '#FFD700' },
  upgradeBtn: { flexDirection: 'row', alignItems: 'center' },
  upgradeText: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)' },
  actionBtn: { padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { padding: 20, borderRadius: 20, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)', flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoutText: { fontSize: 14, fontWeight: 'bold', color: '#EF4444' },
  footer: { padding: 40, alignItems: 'center' },
  footerText: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.2)' }
});