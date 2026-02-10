import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { getTotalVerses, getChapters } from '@/src/utils/gitaData';

const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    accent: '#8B4513',
    border: '#eeeeee',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    accent: '#d4a574',
    border: '#333333',
  },
};

export default function HomeScreen() {
  const { theme, language } = useApp();
  const color = theme.isDark ? colors.dark : colors.light;
  const chapters = getChapters();

  const title = language === 'english' ? 'Bhagavad Gita' : 'भगवद्गीता';

  const subtitle =
    language === 'english'
      ? 'A timeless spiritual wisdom'
      : 'कालजयी आध्यात्मिक ज्ञान';

  const readLabel = language === 'english' ? 'Start Reading' : 'पढ़ना शुरू करें';

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: color.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: color.secondary }]}>{subtitle}</Text>
        <View style={[styles.statsContainer, { borderColor: color.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: color.accent }]}>{chapters.length}</Text>
            <Text style={[styles.statLabel, { color: color.secondary }]}>
              {language === 'english'
              ? 'Chapters'
              : 'अध्याय'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    marginHorizontal: 16,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

