import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import MapScreen from './src/screens/MapScreen';
import CardsScreen from './src/screens/CardsScreen';
import AboutScreen from './src/screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
              else if (route.name === 'Cards') iconName = focused ? 'grid' : 'grid-outline';
              else if (route.name === 'About') iconName = focused ? 'information-circle' : 'information-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#0f172a',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e2e8f0',
              paddingBottom: 4,
              height: 56,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Cards" component={CardsScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
