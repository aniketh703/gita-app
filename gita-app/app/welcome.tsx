/**
 * Welcome Screen - First Impression
 * Shows immediately after onboarding to demonstrate value
 * Displays Today's Sloka to create immediate engagement
 */

import gitaData from "@/assets/data.json";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ROUTES } from "@/src/navigation/routes";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Get today's sloka
  const todaysSloka = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const totalVerseCount = gitaData.reduce(
      (sum, chapter) => sum + chapter.verse_count,
      0,
    );

    // Get a consistent verse for today
    let totalVerses = 0;
    let selectedChapter: any = null;
    let selectedVerse: any = null;
    const targetIndex = dayOfYear % totalVerseCount;

    for (const chapter of gitaData) {
      if (totalVerses + chapter.verses.length > targetIndex) {
        selectedChapter = chapter;
        selectedVerse =
          chapter.verses[targetIndex - totalVerses] || chapter.verses[0];
        break;
      }
      totalVerses += chapter.verses.length;
    }

    if (!selectedChapter || !selectedVerse) {
      selectedChapter = gitaData[0];
      selectedVerse = selectedChapter.verses[0];
    }

    return {
      chapter: selectedChapter.chapter,
      chapterName: selectedChapter.name,
      verse: selectedVerse.verse,
      sanskrit: selectedVerse.sanskrit,
      transliteration: selectedVerse.transliteration,
      translation:
        selectedVerse.translations?.english ||
        selectedVerse.translations?.hindi ||
        "",
      totalVerseCount,
    };
  }, []);

  const handleReadNow = () => {
    router.replace(ROUTES.TABS_HOME);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(800)}
          style={styles.headerContainer}
        >
          <MaterialIcons
            name="celebration"
            size={48}
            color={colors.accent}
            style={styles.celebrationIcon}
          />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome to Your Journey!
          </Text>
          <Text
            style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}
          >
            Here&apos;s your wisdom for today
          </Text>
        </Animated.View>

        {/* Today's Sloka Card */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={[
            styles.slokaCard,
            {
              backgroundColor: colors.verseBox,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="auto-stories"
              size={24}
              color={colors.accent}
            />
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Today&apos;s Wisdom
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: colors.textSecondary }]}
              >
                Chapter {todaysSloka.chapter} • Verse {todaysSloka.verse}
              </Text>
            </View>
          </View>

          {/* Sanskrit Text */}
          {todaysSloka.sanskrit && (
            <View style={styles.textSection}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Sanskrit
              </Text>
              <Text
                style={[styles.sanskritText, { color: colors.text }]}
                numberOfLines={4}
              >
                {todaysSloka.sanskrit}
              </Text>
            </View>
          )}

          {/* Translation */}
          {todaysSloka.translation && (
            <View style={styles.textSection}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Translation
              </Text>
              <Text
                style={[styles.translationText, { color: colors.text }]}
                numberOfLines={6}
              >
                {todaysSloka.translation}
              </Text>
            </View>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Quick Insight */}
          <View style={styles.insightContainer}>
            <MaterialIcons name="lightbulb" size={20} color={colors.accent} />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              This verse is one of {todaysSloka.totalVerseCount} timeless
              teachings waiting to guide you
            </Text>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View
          entering={FadeInDown.delay(900).duration(800)}
          style={styles.ctaContainer}
        >
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: colors.accent }]}
            onPress={handleReadNow}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctaButtonText, { color: colors.background }]}>
              Start Reading
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={colors.background}
            />
          </TouchableOpacity>

          <Text style={[styles.ctaSubtext, { color: colors.textSecondary }]}>
            Begin your journey of wisdom and self-discovery
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.xs,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: spacing.xl + spacing.xs,
    marginBottom: spacing.xl,
  },
  celebrationIcon: {
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xs,
    fontFamily: "Merriweather-Bold",
  },
  welcomeSubtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    opacity: 0.8,
  },
  slokaCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    opacity: 0.7,
  },
  textSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    opacity: 0.6,
  },
  sanskritText: {
    fontSize: fontSize.md,
    lineHeight: 26,
    fontFamily: "NotoSerifDevanagari-Regular",
  },
  translationText: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontFamily: "Merriweather-Regular",
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  insightContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  insightText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontStyle: "italic",
  },
  ctaContainer: {
    alignItems: "center",
    gap: spacing.md,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl + spacing.xs,
    borderRadius: radius.md,
    width: "100%",
  },
  ctaButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  ctaSubtext: {
    fontSize: fontSize.sm,
    textAlign: "center",
    opacity: 0.7,
  },
});
