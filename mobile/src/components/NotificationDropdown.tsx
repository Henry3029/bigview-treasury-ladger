import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { CheckCircle2, AlertCircle, Clock, X, Bell, Trash2 } from 'lucide-react-native';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'pending';
  time: string;
}

export default function NotificationDropdown({ isOpen, onClose, notifications }: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: Notification[];
}) {
  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={22} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={32} color="#FFD700" opacity={0.3} />
              <Text style={styles.emptyText}>No New Activity</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.typeIcon}>
                {item.type === 'success' && <CheckCircle2 size={22} color="#10B981" />}
                {item.type === 'error' && <AlertCircle size={22} color="#EF4444" />}
                {item.type === 'pending' && <Clock size={22} color="#FFD700" />}
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Base Sepolia</Text>
                </View>
              </View>
            </View>
          )}
        />

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn}>
            <Trash2 size={16} color="#000" />
            <Text style={styles.clearBtnText}>Clear All History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#4ADE80' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFD700', letterSpacing: -1 },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
  listContent: { padding: 16 },
  card: { flexDirection: 'row', padding: 16, backgroundColor: '#111', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  typeIcon: { marginRight: 12 },
  cardBody: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 13, fontWeight: '900', color: '#FFF' },
  cardTime: { fontSize: 8, color: 'rgba(255,255,255,0.2)' },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8 },
  badgeText: { fontSize: 8, color: '#3B82F6', fontWeight: '900' },
  emptyContainer: { alignItems: 'center', marginTop: 100, opacity: 0.3 },
  emptyText: { marginTop: 16, fontSize: 14, fontWeight: '900', color: '#4ADE80' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  clearBtn: { backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  clearBtnText: { fontSize: 14, fontWeight: '900', color: '#000' }
});