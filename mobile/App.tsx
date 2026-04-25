import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { PrivyProvider, usePrivy } from '@privy-io/expo';
import { baseSepolia } from 'viem/chains';
import { StatusBar } from 'expo-status-bar';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Lucide Icons for the Tab Bar
import { LayoutDashboard, Repeat, TrendingUp, History, Info, Settings } from 'lucide-react-native';

// Screen Imports
import Dashboard from './src/screens/Dashboard';
import SwapScreen from './src/screens/SwapScreen';
import EarnScreen from './src/screens/EarnScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AboutScreen from './src/screens/AboutScreen';
import AdminMintScreen from './src/screens/AdminMintScreen';
import RewardsScreen from './src/screens/RewardsScreen';

// Component Imports
import LoadingSpinner from './src/components/LoadingSpinner';
import WelcomeBanner from './src/components/WelcomeBanner';
import MobileHeaderWrapper from './src/components/MobileHeaderWrapper';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { ready, user } = usePrivy();

  // Show spinner while Privy initializes
  if (!ready) return <LoadingSpinner />;

  // Admin Check for the Tab Bar
  const deployerAddr = process.env.EXPO_PUBLIC_DEPLOYER_ADDR?.toLowerCase();
  const isOwner = user?.wallet?.address?.toLowerCase() === deployerAddr;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {/* Note: We keep the Header/Banner outside the Navigator 
          if you want them visible on EVERY screen. 
      */}
      <WelcomeBanner />
      <MobileHeaderWrapper />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') return <LayoutDashboard size={size} color={color} />;
            if (route.name === 'Swap') return <Repeat size={size} color={color} />;
            if (route.name === 'Rewards') return <Gift size={size} color={color} />;
            if (route.name === 'Earn') return <TrendingUp size={size} color={color} />;
            if (route.name === 'History') return <History size={size} color={color} />;
            if (route.name === 'About') return <Info size={size} color={color} />;
            if (route.name === 'Admin') return <Settings size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} />
        <Tab.Screen name="Swap" component={SwapScreen} />
        <Tab.Screen name="Earn" component={EarnScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Rewards" component={RewardsScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
        
        {/* Only show Admin tab if the connected user is the deployer */}
        {isOwner && (
          <Tab.Screen name="Admin" component={AdminMintScreen} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
      <View style={styles.container}>
        <AppContent />
      </View>
    </PrivyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  tabBar: {
    backgroundColor: '#0F051D', // Deepest slate for the bar
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    elevation: 0,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});