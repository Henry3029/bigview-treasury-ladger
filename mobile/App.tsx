import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { PrivyProvider, usePrivy } from '@privy-io/expo'; // Added usePrivy
import { baseSepolia } from 'viem/chains';
import { StatusBar } from 'expo-status-bar';

// Your Components
import WelcomeBanner from './src/components/WelcomeBanner';
import BottomNav from './src/components/BottomNav';
import MobileHeaderWrapper from './src/components/MobileHeaderWrapper';
import Dashboard from './src/screens/Dashboard';
import LoadingSpinner from './src/components/LoadingSpinner'; // Import the spinner

// 1. Create a "Content" component to handle the loading logic
function AppContent() {
  const { ready } = usePrivy();

  // If Privy is still initializing, show the spinner instead of the app
  if (!ready) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      
      <View style={styles.layoutWrapper}>
        <WelcomeBanner />
        <MobileHeaderWrapper />

        <View style={styles.mainContent}>
          <Dashboard />
        </View>

        <View style={styles.bottomNavContainer}>
          <BottomNav />
        </View>
      </View>
    </SafeAreaView>
  );
}

// 2. Your main App export stays simple and provides the context
export default function App() {
  return (
    <PrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#FFD700',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <AppContent />
    </PrivyProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  layoutWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, 
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(28, 28, 30, 0.4)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
});