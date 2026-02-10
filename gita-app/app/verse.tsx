import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { getVerse, getNextVerse, getPreviousVerse } from '@/src/utils/gitaData';
import type { LangKey } from '@/src/types';
import { DevanagariText } from '@/components/devanagari-text';
import { Fonts } from '@/constants/theme';

const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    accent: '#8B4513',
    border: '#eeeeee',
    verseBox: '#f9f9f9',
    toggleBg: '#f2f2f2',
    toggleActive: '#8B4513',
    toggleText: '#333333',
    toggleActiveText: '#ffffff',
    buttonBg: '#f5f5f5',
    buttonDisabled: '#e0e0e0',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    tertiary: '#777777',
    accent: '#d4a574',
    border: '#333333',
    verseBox: '#2a2a2a',
    toggleBg: '#242424',
    toggleActive: '#d4a574',
    toggleText: '#e6e6e6',
    toggleActiveText: '#1a1a1a',
    buttonBg: '#2a2a2a',
    buttonDisabled: '#333333',
  },
};

function getLocalizedText(text: { english: string; hindi: string } | undefined, lang: LangKey): string {
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
    !normalized.includes('transliteration needed') &&
    !normalized.includes('sanskrit text needed')
  );
}

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  color: typeof colors.light;
}

function ToggleButton({ label, active, onPress, disabled, color }: ToggleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.toggleButton,
        {
          backgroundColor: active ? color.toggleActive : color.toggleBg,
          borderColor: color.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.toggleButtonText,
          { color: active ? color.toggleActiveText : color.toggleText },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function VerseScreen() {
  const { ch: chapterStr, verse: verseStr } = useLocalSearchParams<{
    ch: string;
    verse: string;
  }>();
  const router = useRouter();
  const { theme, language, fontSize } = useApp();
  const color = theme.isDark ? colors.dark : colors.light;

  const chapter = parseInt(chapterStr || '1', 10);
  const verseNum = parseInt(verseStr || '1', 10);

  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showCommentary, setShowCommentary] = useState(false);

  const verse = useMemo(() => getVerse(chapter, verseNum), [chapter, verseNum]);
  const nextVerse = useMemo(() => getNextVerse(chapter, verseNum), [chapter, verseNum]);
  const prevVerse = useMemo(() => getPreviousVerse(chapter, verseNum), [chapter, verseNum]);

  if (!verse) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: color.border }]}
          >
            <Text style={[styles.backText, { color: color.text }]}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: color.text }]}>Verse not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const translation = getLocalizedText(verse.translations, language);
  const commentary = verse.commentary
    ? getLocalizedText(verse.commentary as { english: string; hindi: string }, language)
    : '';
  
  const hasTransliteration = isMeaningfulText(verse.transliteration);
  const hasTranslation = isMeaningfulText(translation);
  const hasCommentary = isMeaningfulText(commentary);

  const sankritFontFamily = Fonts.devanagari.regular;
  const contentFontFamily =
    language === 'hindi' ? Fonts.devanagari.regular : Fonts.sans.regular;
  const contentFontFamilyItalic =
    language === 'hindi' ? Fonts.devanagari.regular : Fonts.sans.italic;

  const scaledFontSize = {
    small: fontSize - 2,
    normal: fontSize,
    medium: fontSize + 2,
    large: fontSize + 4,
    xlarge: fontSize + 8,
  };

  const handleNavigate = (nav: { chapter: number; verse: number } | null) => {
    if (!nav) return;
    router.push(`/verse?ch=${nav.chapter}&verse=${nav.verse}` as Href);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: color.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { borderColor: color.border }]}
        >
          <Text style={[styles.backText, { color: color.text }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.verseTitle, { color: color.accent }]}>
            Chapter {chapter}, Verse {verseNum}
          </Text>
        </View>
      </View>

      {/* Toggle Controls */}
      <View style={[styles.controlsContainer, { backgroundColor: color.verseBox }]}>
        <View style={styles.toggleRow}>
          <ToggleButton
            label="Transliteration"
            active={showTransliteration}
            onPress={() => setShowTransliteration(!showTransliteration)}
            disabled={!hasTransliteration}
            color={color}
          />
          <ToggleButton
            label="Translation"
            active={showTranslation}
            onPress={() => setShowTranslation(!showTranslation)}
            disabled={!hasTranslation}
            color={color}
          />
          <ToggleButton
            label="Commentary"
            active={showCommentary}
            onPress={() => setShowCommentary(!showCommentary)}
            disabled={!hasCommentary}
            color={color}
          />
        </View>
      </View>

      {/* Verse Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={[styles.verseCard, { backgroundColor: color.verseBox }]}>
          {/* Sanskrit - Always Visible */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: color.accent }]}>Sanskrit</Text>
            <DevanagariText
              style={[
                styles.sanskritText,
                {
                  fontFamily: sankritFontFamily,
                  fontSize: scaledFontSize.large,
                  lineHeight: scaledFontSize.large * 1.8,
                  color: color.text,
                },
              ]}
            >
              {verse.sanskrit}
            </DevanagariText>
          </View>

          {/* Transliteration - Toggle */}
          {showTransliteration && hasTransliteration && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>
                Transliteration
              </Text>
              <Text
                style={[
                  styles.transliterationText,
                  {
                    fontFamily: contentFontFamilyItalic,
                    fontSize: scaledFontSize.normal,
                    lineHeight: scaledFontSize.normal * 1.6,
                    color: color.secondary,
                  },
                ]}
              >
                {verse.transliteration}
              </Text>
            </View>
          )}

          {/* Translation - Toggle */}
          {showTranslation && hasTranslation && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Translation</Text>
              <Text
                style={[
                  styles.translationText,
                  {
                    fontFamily: contentFontFamily,
                    fontSize: scaledFontSize.medium,
                    lineHeight: scaledFontSize.medium * 1.7,
                    color: color.text,
                  },
                ]}
              >
                {translation}
              </Text>
            </View>
          )}

          {/* Commentary - Toggle */}
          {showCommentary && hasCommentary && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Commentary</Text>
              <Text
                style={[
                  styles.commentaryText,
                  {
                    fontFamily: contentFontFamily,
                    fontSize: scaledFontSize.small,
                    lineHeight: scaledFontSize.small * 1.6,
                    color: color.secondary,
                  },
                ]}
              >
                {commentary}
              </Text>
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => handleNavigate(prevVerse)}
            disabled={!prevVerse}
            style={[
              styles.navButton,
              {
                backgroundColor: prevVerse ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: prevVerse ? color.text : color.tertiary },
              ]}
            >
              ← Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigate(nextVerse)}
            disabled={!nextVerse}
            style={[
              styles.navButton,
              {
                backgroundColor: nextVerse ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: nextVerse ? color.text : color.tertiary },
              ]}
            >
              Next →
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitles: {
    flex: 1,
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  verseCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionDivider: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sanskritText: {
    textAlign: 'left',
  },
  transliterationText: {
    textAlign: 'left',
  },
  translationText: {
    textAlign: 'left',
  },
  commentaryText: {
    textAlign: 'left',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
