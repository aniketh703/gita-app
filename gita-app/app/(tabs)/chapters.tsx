/**
 * Chapters Screen - Minimal & Calm
 * Focus: Simple chapter list with clean cards
 * Design: No badges, no progress bars, simple tap navigation
 * Uses Settings: Language, Theme, Font Size
 */

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { readingRoute } from "@/src/navigation/routes";
import type { ChapterSummary, LangKey } from "@/src/types";
import { getChapters } from "@/src/utils/gitaData";
import { triggerLightHaptic } from "@/src/utils/haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

function getLocalizedText(
  text: Record<LangKey, string>,
  lang: LangKey,
): string {
  return text[lang] || text.english;
}

export default function ChaptersScreen() {
  const prefs = usePreferencesState();
  const router = useRouter();
  const { colors } = useAppTheme();

  const chapters = getChapters();

  const renderChapter: ListRenderItem<ChapterSummary> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          triggerLightHaptic(prefs.toggles.enableHaptics);
          router.push(readingRoute(item.chapter));
        }}
        activeOpacity={0.7}
      >
        <Card
          style={[
            styles.chapterCard,
            {
              backgroundColor: colors.verseBox,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.chapterNumber,
                { color: colors.accent, fontSize: prefs.fontSize },
              ]}
            >
              {prefs.language === "english"
                ? `Chapter ${item.chapter}`
                : `अध्याय ${item.chapter}`}
            </Text>
            <Text
              style={[
                styles.yogaName,
                { color: colors.text, fontSize: prefs.fontSize * 0.95 },
              ]}
              numberOfLines={2}
            >
              {getLocalizedText(item.name, prefs.language as LangKey)}
            </Text>
            <Text
              style={[
                styles.metaText,
                { color: colors.secondary, fontSize: prefs.fontSize * 0.85 },
              ]}
            >
              {prefs.language === "english"
                ? `${item.verse_count} Verses`
                : `${item.verse_count} श्लोक`}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: prefs.fontSize * 1.2 },
          ]}
        >
          {prefs.language === "english" ? "18 Chapters" : "18 अध्याय"}
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: colors.secondary, fontSize: prefs.fontSize * 0.9 },
          ]}
        >
          {prefs.language === "english"
            ? "Discover the teachings of the Bhagavad Gita"
            : "भगवद्गीता की शिक्षाओं को खोजें"}
        </Text>
      </View>

      {/* Chapters List */}
      <FlatList
        data={chapters}
        key={prefs.fontSize.toString()}
        keyExtractor={(item) => `chapter-${item.chapter}`}
        renderItem={renderChapter}
        contentContainerStyle={{
          ...styles.listContent,
          paddingHorizontal: spacing.lg,
        }}
        scrollEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  chapterCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  cardContent: {
    gap: spacing.sm,
  },
  chapterNumber: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  yogaName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
  },
  metaText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
