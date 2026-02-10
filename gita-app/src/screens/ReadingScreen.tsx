/**
 * Reading Screen (Verse Screen)
 * Displays a specific verse - placeholder without styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ReadingScreenProps } from '@/src/types/navigation';

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
    marginBottom: 16,
  },
  params: {
    fontSize: 16,
    color: '#666',
  },
});

export default function ReadingScreen({ navigation, route }: ReadingScreenProps) {
  // Type-safe access to route params
  const { chapterId, verseId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verse Screen</Text>
      <Text style={styles.params}>Chapter: {chapterId}, Verse: {verseId}</Text>
    </View>
  );
}
