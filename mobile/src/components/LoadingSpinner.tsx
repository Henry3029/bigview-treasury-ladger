import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function LoadingSpinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Starts the infinite rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        
        {/* Bigview Spinning Ring */}
        <Animated.View 
          style={[
            styles.spinner, 
            { transform: [{ rotate: spin }] }
          ]} 
        />

        {/* Loading Text */}
        <View style={styles.textWrapper}>
          <Text style={styles.loadingText}>BIGVIEW</Text>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 11, 46, 0.8)', // Your violet-background/80
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    alignItems: 'center',
    gap: 24,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(139, 92, 246, 0.2)', // violet-glow/20
    borderTopColor: '#FFD700', // gold-buttons
  },
  textWrapper: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700', // gold-buttons
    fontWeight: '900',
    letterSpacing: 4,
    fontSize: 12,
  },
});