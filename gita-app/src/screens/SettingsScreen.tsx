/**
 * Settings Screen
 * App settings and preferences - placeholder without styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SettingsScreenProps } from '@/src/types/navigation';

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

export default function SettingsScreen({ navigation, route }: SettingsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
    </View>
  );
}
