/**
 * Home Screen
 * Main landing screen - placeholder without styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { HomeScreenProps } from '@/src/types/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
  );
}
