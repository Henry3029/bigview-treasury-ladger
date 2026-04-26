import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, ArrowLeftRight, Zap, Wallet, User } from 'lucide-react-native';

// Import your Screens
import DashboardScreen from './src/screens/DashboardScreen';
import SwapScreen from './src/screens/SwapScreen';
import StakeScreen from './src/screens/StakeScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import MeScreen from './src/screens/MeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Industry standard: Build your own headers
          tabBarStyle: { 
            backgroundColor: '#000', // Bigview Black
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 15,
          },
          tabBarActiveTintColor: '#FFD700', // Bigview Gold
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({ color, size }) => {
            // This is how professionals handle icons
            if (route.name === 'Home') return <LayoutDashboard size={size} color={color} />;
            if (route.name === 'Swap') return <ArrowLeftRight size={size} color={color} />;
            if (route.name === 'Stake') return <Zap size={size} color={color} />;
            if (route.name === 'Rewards') return <Wallet size={size} color={color} />;
            if (route.name === 'Me') return <User size={size} color={color} />;
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
  );
}