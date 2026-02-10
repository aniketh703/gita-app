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

export default function TabTwoScreen() {
  const {
    theme,
    language,
  } = useApp();

  const color = theme.isDark ? colors.dark : colors.light;

  const settingsTitle = language === 'english' ? 'About' : 'बारे में';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Language */}
        <View style={[styles.section, { borderBottomColor: color.border }]}>
          <Text style={[styles.title, { color: color.text }]}>
            {language === 'english' ? 'Bhagavad Gita' : 'भगवद्गीता'}
          </Text>
          <Text style={[styles.subtitle, { color: color.secondary }]}>
            {language === 'english' ? 'v1.0' : 'संस्करण 1.0'}
          </Text>
          <Text style={[styles.description, { color: color.secondary }]}>
            {language === 'english'
              ? `An offline-first, bilingual reading experience for the Bhagavad Gita.

All 18 chapters and 700 verses are available without internet connection.

Features:
• Browse all chapters
• Read verses in Sanskrit and English
• Clean, distraction-free interface
• Dark mode support`
              : `भगवद्गीता के लिए एक ऑफ़लाइन-पहले, द्विभाषी पठन अनुभव।

सभी 18 अध्याय और 700 श्लोक इंटरनेट कनेक्शन के बिना उपलब्ध हैं।

विशेषता:
• सभी अध्याय ब्राउज़ करें
• संस्कृत और अंग्रेजी में श्लोक पढ़ें
• स्वच्छ, विचलन-मुक्त इंटरफ़ेस
• डार्क मोड समर्थन`}
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
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 32,
  },
  section: {
    marginVertical: 16,
    borderBottomWidth: 1,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
});
