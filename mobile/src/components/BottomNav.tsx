import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LayoutDashboard, ArrowLeftRight, Zap, Wallet, User } from 'lucide-react-native';

export default function BottomNav() {
  return (
    <View style={styles.nav}>
      <NavLink icon={<LayoutDashboard size={22} />} label="Home" active={true} />
      <NavLink icon={<ArrowLeftRight size={22} />} label="Swap" active={false} />
      <NavLink icon={<Zap size={22} />} label="Stake" active={false} />
      <NavLink icon={<Wallet size={22} />} label="Rewards" active={false} />
      <NavLink icon={<User size={22} />} label="Me" active={false} />
    </View>
  );
}

function NavLink({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <View style={active ? styles.activeGlow : null}>
        {React.cloneElement(icon as React.ReactElement, {
          color: active ? '#3B82F6' : '#FFFFFF'
        })}
      </View>
      <Text style={[styles.label, { color: active ? '#3B82F6' : '#FFFFFF' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 20, backgroundColor: '#1A0B2E' },
  navItem: { alignItems: 'center', gap: 4 },
  activeGlow: { shadowColor: '#FDE68A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8 },
  label: { fontSize: 10, fontWeight: '400', letterSpacing: -0.5 }
});