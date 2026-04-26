import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BigViewLoGo() {
  return (
    <View style={styles.band}>
      <View style={styles.card}>
        <View style={styles.logoWrapper}>
          <Text style={styles.textBlue}>BIG</Text>
          <Text style={styles.textGold}>VI</Text>
          <Text style={styles.textBlue}>EW</Text>
          <View style={styles.swoosh} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 12,
    // FIXED: Split borderVerticalWidth into Top and Bottom
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#0D0D0D',
    width: '100%',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'relative',
  },
  textBlue: { fontSize: 36, fontWeight: '900', color: '#3B82F6', fontStyle: 'italic' },
  textGold: { fontSize: 54, fontWeight: '900', color: '#FFD700', fontStyle: 'italic', marginHorizontal: -4, zIndex: 10 },
  swoosh: {
    position: 'absolute',
    bottom: 8,
    left: '5%',
    width: '90%',
    height: 6,
    backgroundColor: '#D32F2F',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  }
});