import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function LoadingSpinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop(); // Cleanup on unmount
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.spinner, 
            { transform: [{ rotate: spin }] }
          ]} 
        />
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
    backgroundColor: 'rgba(26, 11, 46, 0.8)',
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
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderTopColor: '#FFD700',
  },
  textWrapper: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontWeight: '900',
    letterSpacing: 4,
    fontSize: 12,
  },
});