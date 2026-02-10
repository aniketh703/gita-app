import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { getChapter } from '@/src/utils/gitaData';
import type { LangKey } from '@/src/types';
import { DevanagariText } from '@/components/devanagari-text';
import { Fonts } from '@/constants/theme';

const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    accent: '#8B4513',
    border: '#eeeeee',
    verseBox: '#f9f9f9',
    toggleBg: '#f2f2f2',
    toggleText: '#333333',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    accent: '#d4a574',
    border: '#333333',
    verseBox: '#2a2a2a',
    toggleBg: '#242424',
    toggleText: '#e6e6e6',
  },
};

function getLocalizedText(text: Record<string, string> | undefined, lang: LangKey): string {
  if (!text) return '';
  return text[lang] || text['english'] || 'N/A';
}

function isMeaningfulText(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.trim().toLowerCase();
  return (
    normalized !== '' &&
    !normalized.includes('translation needed') &&
    !normalized.includes('commentary needed') &&
    !normalized.includes('transliteration needed')
  );
}

export default function ReadingScreen() {
  const { ch: chapterStr } = useLocalSearchParams<{ ch: string; verse: string }>();
  const router = useRouter();
  const { theme, language, fontSize } = useApp();
  const color = theme.isDark ? colors.dark : colors.light;

  const chapter = parseInt(chapterStr || '1', 10);

  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showCommentary, setShowCommentary] = useState(false);

  useEffect(() => {
    const nextChapter = Number.isNaN(chapter) ? 1 : chapter;
    setCurrentChapter(nextChapter);
  }, [chapter]);

  const chapterData = getChapter(currentChapter);

  const verses = useMemo(() => chapterData?.verses || [], [chapterData]);

  if (!chapterData) {
    return (
      <View style={[styles.container, { backgroundColor: color.bg }]}>
        <Text style={[styles.errorText, { color: color.text }]}>Chapter not found</Text>
      </View>
    );
  }

  const contentFontFamily = language === 'hindi' ? Fonts.devanagari.regular : Fonts.sans.regular;
  const contentFontFamilyItalic = language === 'hindi' ? Fonts.devanagari.regular : Fonts.sans.italic;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: color.border }]}
          >
            <Text style={[styles.backText, { color: color.text }]}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={[styles.chapterTitle, { color: color.accent }]}
              numberOfLines={1}
            >
              {getLocalizedText(chapterData.name, language)}
            </Text>
            <Text style={[styles.verseReference, { color: color.secondary }]}>
              {language === 'english' ? `Chapter ${currentChapter}` : `अध्याय ${currentChapter}`}
            </Text>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setShowTransliteration((value) => !value)}
            style={[
              styles.toggleButton,
              {
                backgroundColor: showTransliteration ? color.accent : color.toggleBg,
                borderColor: color.border,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: showTransliteration ? '#ffffff' : color.toggleText },
              ]}
            >
              Transliteration
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowTranslation((value) => !value)}
            style={[
              styles.toggleButton,
              {
                backgroundColor: showTranslation ? color.accent : color.toggleBg,
                borderColor: color.border,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: showTranslation ? '#ffffff' : color.toggleText },
              ]}
            >
              {language === 'english' ? 'Translation' : 'अनुवाद'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCommentary((value) => !value)}
            style={[
              styles.toggleButton,
              {
                backgroundColor: showCommentary ? color.accent : color.toggleBg,
                borderColor: color.border,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: showCommentary ? '#ffffff' : color.toggleText },
              ]}
            >
              {language === 'english' ? 'Commentary' : 'व्याख्या'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={verses}
        keyExtractor={(item) => `verse-${currentChapter}-${item.verse}`}
        contentContainerStyle={styles.content}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        renderItem={({ item }) => {
          const translationText = getLocalizedText(item.translations, language);
          const commentaryText = getLocalizedText(item.commentary, language);

          return (
            <TouchableOpacity
              onPress={() => router.push(`/verse?ch=${currentChapter}&verse=${item.verse}`)}
              activeOpacity={0.9}
            >
              <View style={[styles.verseContainer, { backgroundColor: color.verseBox, borderColor: color.border }]}
              >
                <Text style={[styles.verseIndex, { color: color.secondary }]}>
                  {currentChapter}.{item.verse}
                </Text>

                <View style={styles.verseSection}>
                  <Text style={[styles.sectionLabel, { color: color.accent }]}>Sanskrit</Text>
                  <DevanagariText
                    style={[styles.sanskritText, { color: color.text, fontSize }]}
                  >
                    {item.sanskrit}
                  </DevanagariText>
                </View>

                {showTransliteration && isMeaningfulText(item.transliteration) && (
                  <View style={[styles.verseSection, styles.sectionDivider, { borderTopColor: color.border }]}
                  >
                    <Text style={[styles.sectionLabel, { color: color.accent }]}>Transliteration</Text>
                    <Text
                      style={[
                        styles.transliterationText,
                        { color: color.secondary, fontSize: fontSize - 2, fontFamily: contentFontFamilyItalic },
                      ]}
                    >
                      {item.transliteration}
                    </Text>
                  </View>
                )}

                {showTranslation && isMeaningfulText(translationText) && (
                  <View style={[styles.verseSection, styles.sectionDivider, { borderTopColor: color.border }]}
                  >
                    <Text style={[styles.sectionLabel, { color: color.accent }]}
                    >
                      {language === 'english' ? 'Translation' : 'अनुवाद'}
                    </Text>
                    {language === 'hindi' ? (
                      <DevanagariText
                        style={[styles.translationText, { color: color.text, fontSize, fontFamily: contentFontFamily }]}
                      >
                        {translationText}
                      </DevanagariText>
                    ) : (
                      <Text
                        style={[
                          styles.translationText,
                          { color: color.text, fontSize, fontFamily: contentFontFamily },
                        ]}
                      >
                        {translationText}
                      </Text>
                    )}
                  </View>
                )}

                {showCommentary && isMeaningfulText(commentaryText) && (
                  <View style={[styles.verseSection, styles.sectionDivider, { borderTopColor: color.border }]}
                  >
                    <Text style={[styles.sectionLabel, { color: color.accent }]}
                    >
                      {language === 'english' ? 'Commentary' : 'व्याख्या'}
                    </Text>
                    {language === 'hindi' ? (
                      <DevanagariText
                        style={[styles.commentaryText, { color: color.secondary, fontSize: fontSize - 1, fontFamily: contentFontFamily }]}
                      >
                        {commentaryText}
                      </DevanagariText>
                    ) : (
                      <Text
                        style={[
                          styles.commentaryText,
                          { color: color.secondary, fontSize: fontSize - 1, fontFamily: contentFontFamily },
                        ]}
                      >
                        {commentaryText}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitles: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  verseReference: {
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  verseContainer: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  verseIndex: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  verseSection: {
    marginBottom: 6,
  },
  sectionDivider: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sanskritText: {
    lineHeight: 30,
  },
  transliterationText: {
    lineHeight: 24,
  },
  translationText: {
    lineHeight: 26,
  },
  commentaryText: {
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});
