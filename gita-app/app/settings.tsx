import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useApp } from '@/src/context/AppContext';

const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    accent: '#8B4513',
    border: '#eeeeee',
    itemBg: '#f9f9f9',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    accent: '#d4a574',
    border: '#333333',
    itemBg: '#2a2a2a',
  },
};

export default function SettingsScreen() {
  const {
    theme,
    language,
  } = useApp();

  const color = theme.isDark ? colors.dark : colors.light;

  const settingsTitle = language === 'english' ? 'Settings' : 'सेटिंग';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: color.text }]}>{settingsTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language */}
        <View style={[styles.section, { borderBottomColor: color.border }]}>
          <Text style={[styles.sectionTitle, { color: color.text }]}>
            {language === 'english'
              ? `Bhagavad Gita Reader v1.0

Offline-first, bilingual reading experience.

All content is available without internet connection.`
              : `भगवद्गीता रीडर v1.0

ऑफ़लाइन-पहले, द्विभाषी पढ़ने का अनुभव।

सभी सामग्री इंटरनेट कनेक्शन के बिना उपलब्ध है।`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  section: {
    marginVertical: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  languageOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  fontSizeButtons: {
    flexDirection: 'row',
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  fontButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

