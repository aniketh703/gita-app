import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useApp } from '@/src/context/AppContext';

export default function TabLayout() {
  const { theme } = useApp();
  const isDark = theme.isDark;

  const tabBarBackgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const tabBarActiveTintColor = '#8B4513';
  const tabBarInactiveTintColor = isDark ? '#666666' : '#999999';
  const tabBarBorderColor = isDark ? '#333333' : '#eeeeee';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        headerShown: true,
        headerStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderBottomColor: tabBarBorderColor,
          borderBottomWidth: 1,
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopColor: tabBarBorderColor,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bhagavad Gita',
          href: '/',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="chapters"
        options={{
          title: 'Chapters',
          href: '/chapters-tab',
          tabBarLabel: 'Chapters',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          href: '/explore',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}

