import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PrivyProvider } from '@privy-io/expo';
import { LayoutDashboard, ArrowLeftRight, Zap, Wallet, User as UserIcon } from 'lucide-react-native';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import SwapScreen from './src/screens/SwapScreen';
import StakeScreen from './src/screens/StakeScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import MeScreen from './src/screens/MeScreen';

const Tab = createBottomTabNavigator();

// Reading from .env using industry-standard process.env
const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID || '';
const PRIVY_CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID || '';

export default function App() {
  if (!PRIVY_APP_ID || !PRIVY_CLIENT_ID) {
    console.error("Missing Privy Configuration in .env file");
  }

  return (
    <PrivyProvider 
      appId={PRIVY_APP_ID} 
      clientId={PRIVY_CLIENT_ID}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { 
              backgroundColor: '#000', 
              borderTopWidth: 0,
              height: 85, 
              paddingBottom: 25,
              paddingTop: 10,
            },
            tabBarActiveTintColor: '#FFD700', 
            tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
            tabBarLabelStyle: { 
              fontSize: 10, 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              letterSpacing: 1 
            },
            tabBarIcon: ({ color }) => {
              const iconSize = 22;
              if (route.name === 'Home') return <LayoutDashboard size={iconSize} color={color} />;
              if (route.name === 'Swap') return <ArrowLeftRight size={iconSize} color={color} />;
              if (route.name === 'Stake') return <Zap size={iconSize} color={color} />;
              if (route.name === 'Rewards') return <Wallet size={iconSize} color={color} />;
              if (route.name === 'Me') return <UserIcon size={iconSize} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={DashboardScreen} />
          <Tab.Screen name="Swap" component={SwapScreen} />
          <Tab.Screen name="Stake" component={StakeScreen} />
          <Tab.Screen name="Rewards" component={RewardsScreen} />
          <Tab.Screen name="Me" component={MeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PrivyProvider>
  );
}