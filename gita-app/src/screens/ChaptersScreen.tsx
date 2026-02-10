/**
 * Chapters Screen
 * Minimal list of all 18 chapters
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import type { ChaptersScreenProps } from '@/src/types/navigation';
import { useApp } from '@/src/context/AppContext';
import { getChapters } from '@/src/utils/gitaData';
import type { ChapterSummary, LangKey } from '@/src/types';

const colors = {
  light: {
    bg: '#ffffff',
    text: '#111111',
    muted: '#6b6b6b',
    divider: '#e9e9e9',
  },
  dark: {
    bg: '#0f0f0f',
    text: '#f5f5f5',
    muted: '#9a9a9a',
    divider: '#2a2a2a',
  },
};

function getLocalizedText(text: Record<LangKey, string>, lang: LangKey): string {
  return text[lang] || text.english;
}

export default function ChaptersScreen({ navigation }: ChaptersScreenProps) {
  const { theme, language } = useApp();
  const color = theme.isDark ? colors.dark : colors.light;
  const chapters = getChapters();

  const renderItem: ListRenderItem<ChapterSummary> = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Reading', { chapterId: item.chapter, verseId: 1 })}
      style={[styles.row, { borderBottomColor: color.divider }]}
    >
      <Text style={[styles.chapterNumber, { color: color.muted }]}>#{item.chapter}</Text>
      <Text style={[styles.chapterName, { color: color.text }]}>
        {getLocalizedText(item.name, language)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: color.bg }]}>
      <Text style={[styles.title, { color: color.text }]}
        accessibilityRole="header"
      >
        {language === 'english' ? 'Chapters' : 'अध्याय'}
      </Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => `chapter-${item.chapter}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  chapterNumber: {
    fontSize: 12,
    fontWeight: '600',
    width: 36,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
