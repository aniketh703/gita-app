/**
 * VerseCard Component
 * Full-page display for a single Bhagavad Gita verse
 * Includes language switching, navigation, and comprehensive verse details
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { DevanagariText } from './devanagari-text';
import type { Verse, LangKey } from '@/src/types';
import { Fonts } from '@/constants/theme';

interface VerseCardProps {
  verse: Verse;
  chapter: number;
  language: LangKey;
  fontSize: number;
  isDark: boolean;
  onLanguageChange: (lang: LangKey) => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  showHeader?: boolean;
}

const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    accent: '#8B4513',
    border: '#eeeeee',
    cardBg: '#f9f9f9',
    buttonBg: '#f5f5f5',
    buttonDisabled: '#e0e0e0',
    switchTrack: '#e0e0e0',
    switchThumb: '#8B4513',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    tertiary: '#777777',
    accent: '#d4a574',
    border: '#333333',
    cardBg: '#2a2a2a',
    buttonBg: '#2a2a2a',
    buttonDisabled: '#333333',
    switchTrack: '#424242',
    switchThumb: '#d4a574',
  },
};

/**
 * Get localized text from translations object
 */
function getLocalizedText(
  text: { english: string; hindi: string } | undefined,
  lang: LangKey
): string {
  if (!text) return '';
  return text[lang] || text['english'] || 'N/A';
}

/**
 * Check if text is meaningful (not a placeholder)
 */
function isMeaningfulText(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.trim().toLowerCase();
  return (
    normalized !== '' &&
    !normalized.includes('translation needed') &&
    !normalized.includes('commentary needed') &&
    !normalized.includes('transliteration needed') &&
    !normalized.includes('sanskrit text needed') &&
    normalized !== 'n/a'
  );
}

/**
 * VerseCard Component
 * Displays a single verse with full page layout
 */
export function VerseCard({
  verse,
  chapter,
  language,
  fontSize,
  isDark,
  onLanguageChange,
  onNavigatePrevious,
  onNavigateNext,
  hasPrevious,
  hasNext,
  showHeader = true,
}: VerseCardProps) {
  const router = useRouter();
  const color = isDark ? colors.dark : colors.light;

  const scaledFontSize = {
    small: fontSize - 2,
    normal: fontSize,
    medium: fontSize + 2,
    large: fontSize + 4,
    xlarge: fontSize + 8,
  };

  const sanskritFontFamily = Fonts.devanagari.regular;
  const contentFontFamily =
    language === 'hindi' ? Fonts.devanagari.regular : Fonts.sans.regular;
  const contentFontFamilyItalic = Fonts.sans.italic;

  const translation = getLocalizedText(verse.translations, language);
  const commentary = verse.commentary
    ? getLocalizedText(verse.commentary as { english: string; hindi: string }, language)
    : '';

  if (showHeader) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: color.bg }]}>
        {/* Back Button at the very top */}
        <View style={[styles.header, { borderBottomColor: color.border }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: color.border }]}
          >
            <Text style={[styles.backText, { color: color.text }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={[styles.verseTitle, { color: color.accent }]}>
              Chapter {chapter} - Verse {verse.verse}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
      >
        {/* Verse Display at the top */}
        <View style={[styles.verseCard, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          {/* Sanskrit Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: color.accent }]}>Sanskrit</Text>
            <DevanagariText
              style={[
                styles.sanskritText,
                {
                  fontFamily: sanskritFontFamily,
                  fontSize: scaledFontSize.large,
                  lineHeight: scaledFontSize.large * 1.8,
                  color: color.text,
                },
              ]}
            >
              {verse.sanskrit}
            </DevanagariText>
          </View>
        </View>

        {/* Language Switch */}
        <View style={[styles.languageSwitchContainer, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          <Text style={[styles.languageLabel, { color: color.text }]}>English</Text>
          <Switch
            value={language === 'hindi'}
            onValueChange={(value) => onLanguageChange(value ? 'hindi' : 'english')}
            trackColor={{ false: color.switchTrack, true: color.switchTrack }}
            thumbColor={language === 'hindi' ? color.switchThumb : color.switchThumb}
            ios_backgroundColor={color.switchTrack}
          />
          <Text style={[styles.languageLabel, { color: color.text }]}>हिंदी</Text>
        </View>

        {/* Meaning/Explanation Section */}
        <View style={[styles.meaningContainer, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          <Text style={[styles.meaningTitle, { color: color.accent }]}>Meaning & Explanation</Text>
          
          {/* Transliteration */}
          {isMeaningfulText(verse.transliteration) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Transliteration</Text>
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

          {/* Translation */}
          {isMeaningfulText(translation) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Translation</Text>
              {language === 'hindi' ? (
                <DevanagariText
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
                </DevanagariText>
              ) : (
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
              )}
            </View>
          )}

          {/* Commentary */}
          {isMeaningfulText(commentary) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Commentary</Text>
              {language === 'hindi' ? (
                <DevanagariText
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
                </DevanagariText>
              ) : (
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
              )}
            </View>
          )}
        </View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={onNavigatePrevious}
            disabled={!hasPrevious}
            style={[
              styles.navButton,
              {
                backgroundColor: hasPrevious ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: hasPrevious ? color.text : color.tertiary },
              ]}
            >
              ← Previous Verse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateNext}
            disabled={!hasNext}
            style={[
              styles.navButton,
              {
                backgroundColor: hasNext ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: hasNext ? color.text : color.tertiary },
              ]}
            >
              Next Verse →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavBar, { backgroundColor: color.cardBg, borderTopColor: color.border }]}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>🏠</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chapters' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>📖</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Chapters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/explore' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>🔍</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Explore</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  }

  // When showHeader is false (using native header)
  return (
    <View style={[styles.container, { backgroundColor: color.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Verse Display at the top */}
        <View style={[styles.verseCard, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          {/* Sanskrit Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: color.accent }]}>Sanskrit</Text>
            <DevanagariText
              style={[
                styles.sanskritText,
                {
                  fontFamily: sanskritFontFamily,
                  fontSize: scaledFontSize.large,
                  lineHeight: scaledFontSize.large * 1.8,
                  color: color.text,
                },
              ]}
            >
              {verse.sanskrit}
            </DevanagariText>
          </View>
        </View>

        {/* Language Switch */}
        <View style={[styles.languageSwitchContainer, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          <Text style={[styles.languageLabel, { color: color.text }]}>English</Text>
          <Switch
            value={language === 'hindi'}
            onValueChange={(value) => onLanguageChange(value ? 'hindi' : 'english')}
            trackColor={{ false: color.switchTrack, true: color.switchTrack }}
            thumbColor={language === 'hindi' ? color.switchThumb : color.switchThumb}
            ios_backgroundColor={color.switchTrack}
          />
          <Text style={[styles.languageLabel, { color: color.text }]}>हिंदी</Text>
        </View>

        {/* Meaning/Explanation Section */}
        <View style={[styles.meaningContainer, { backgroundColor: color.cardBg, borderColor: color.border }]}>
          <Text style={[styles.meaningTitle, { color: color.accent }]}>Meaning & Explanation</Text>
          
          {/* Transliteration */}
          {isMeaningfulText(verse.transliteration) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Transliteration</Text>
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

          {/* Translation */}
          {isMeaningfulText(translation) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Translation</Text>
              {language === 'hindi' ? (
                <DevanagariText
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
                </DevanagariText>
              ) : (
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
              )}
            </View>
          )}

          {/* Commentary */}
          {isMeaningfulText(commentary) && (
            <View style={[styles.section, styles.sectionDivider, { borderTopColor: color.border }]}>
              <Text style={[styles.sectionLabel, { color: color.secondary }]}>Commentary</Text>
              {language === 'hindi' ? (
                <DevanagariText
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
                </DevanagariText>
              ) : (
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
              )}
            </View>
          )}
        </View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={onNavigatePrevious}
            disabled={!hasPrevious}
            style={[
              styles.navButton,
              {
                backgroundColor: hasPrevious ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: hasPrevious ? color.text : color.tertiary },
              ]}
            >
              ← Previous Verse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateNext}
            disabled={!hasNext}
            style={[
              styles.navButton,
              {
                backgroundColor: hasNext ? color.buttonBg : color.buttonDisabled,
                borderColor: color.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: hasNext ? color.text : color.tertiary },
              ]}
            >
              Next Verse →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavBar, { backgroundColor: color.cardBg, borderTopColor: color.border }]}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>🏠</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chapters' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>📖</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Chapters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/explore' as Href)}
          style={styles.navBarButton}
        >
          <Text style={[styles.navBarIcon, { color: color.accent }]}>🔍</Text>
          <Text style={[styles.navBarLabel, { color: color.text }]}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderWidth: 1,
  },
  languageSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  meaningContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionDivider: {
    borderTopWidth: 1,
    paddingTop: 16,
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
    marginBottom: 16,
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
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  navBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  navBarIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
