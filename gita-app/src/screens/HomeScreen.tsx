/**
 * Home Screen - Spiritual Hub
 * Complete engagement hub with daily verse, streak, bookmarks, and reflections
 * Implements growth-optimized UX patterns for devotional apps
 */

import { DevanagariText } from "@/components/devanagari-text";
import { KrishnaGuide, useKrishnaGuide } from "@/components/krishna-guide";
import { StreakDisplay } from "@/components/streak-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { DevResetOnboardingButton } from "@/src/components/dev-reset-button";
import { useApp } from "@/src/context/AppContext";
import { ROUTES, verseRoute } from "@/src/navigation/routes";
import { useAppStore } from "@/src/store/appStore";
import { getGitaData, getTotalVerses } from "@/src/utils/gitaData";
import { getReadingProgress } from "@/src/utils/readingProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { language } = useApp();
  const router = useRouter();
  const allChapters = getGitaData();
  const totalVerses = getTotalVerses();
  const { guideState, showGuide, hideGuide } = useKrishnaGuide();

  // Get streak data and user name from store
  const {
    streak,
    streakRisk,
    checkStreakRisk,
    acceptStreakShield,
    declineStreakShield,
  } = useAppStore();
  const userName = "Seeker"; // Can be customized from onboarding

  const [lastRead, setLastRead] = useState<{
    chapter: number;
    verse: number;
  } | null>(null);

  // Daily sloka - based on day of year
  const todaysSloka = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Cycle through all verses in the canonical dataset
    const verseIndex = dayOfYear % totalVerses;

    let count = 0;
    for (const chapter of allChapters) {
      if (count + chapter.verses.length > verseIndex) {
        const verse = chapter.verses[verseIndex - count];
        const translation =
          language === "english"
            ? verse.translations?.english
            : verse.translations?.hindi || verse.translations?.english;

        return {
          chapter: chapter.chapter,
          verse: verse.verse,
          sanskrit: verse.sanskrit,
          translation: translation || "",
          chapterName:
            language === "english"
              ? chapter.name.english
              : chapter.name.hindi || chapter.name.english,
        };
      }
      count += chapter.verses.length;
    }

    // Fallback to first verse
    const verse = allChapters[0].verses[0];
    const translation =
      language === "english"
        ? verse.translations?.english
        : verse.translations?.hindi || verse.translations?.english;

    return {
      chapter: 1,
      verse: 1,
      sanskrit: verse.sanskrit,
      translation: translation || "",
      chapterName:
        language === "english"
          ? allChapters[0].name.english
          : allChapters[0].name.hindi || allChapters[0].name.english,
    };
  }, [allChapters, language, totalVerses]);

  // Load reading progress
  useEffect(() => {
    const loadData = async () => {
      const progress = await getReadingProgress();
      if (progress) {
        setLastRead({ chapter: progress.chapter, verse: progress.verse });
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    checkStreakRisk();
  }, [checkStreakRisk, streak.currentStreak, streak.lastStreakDate]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Daily reflection quotes
  const dailyReflections = useMemo(
    () => [
      "You have the right to perform your duty, but not to the fruits of your actions.",
      "The mind is restless and difficult to restrain, but it is subdued by practice.",
      "One who sees inaction in action, and action in inaction, is wise among humans.",
      "A person is said to be established in self-realization when they are fully satisfied.",
      "Whatever you do, do as an offering to the Divine.",
    ],
    [],
  );

  const todaysReflection = useMemo(() => {
    const today = new Date();
    const dayIndex = today.getDate() % dailyReflections.length;
    return dailyReflections[dayIndex];
  }, [dailyReflections]);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header with Greeting */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greeting}, {userName}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Continue your spiritual journey
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() =>
                showGuide(
                  "Welcome to your spiritual companion! I'm here to guide you through the wisdom of the Bhagavad Gita. Ask me anything about the verses or your practice.",
                  "welcome",
                )
              }
              style={styles.headerButton}
            >
              <MaterialIcons
                name="auto-awesome"
                size={24}
                color={colors.accent}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(ROUTES.SETTINGS)}
              style={styles.headerButton}
            >
              <MaterialIcons
                name="settings"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak Display */}
        <View style={styles.streakSection}>
          <StreakDisplay
            currentStreak={streak?.currentStreak || 0}
            longestStreak={streak?.longestStreak || 0}
            shieldCount={streak?.streakShields || 0}
          />
        </View>

        {/* Today's Verse Card */}
        <Card style={[styles.todayCard, { backgroundColor: colors.surface }]}>
          <View style={styles.todayHeader}>
            <View style={styles.todayLabelRow}>
              <MaterialIcons name="wb-sunny" size={20} color={colors.accent} />
              <Text style={[styles.todayLabel, { color: colors.accent }]}>
                Today’s Verse
              </Text>
            </View>
            <Text
              style={[styles.todayReference, { color: colors.textSecondary }]}
            >
              Chapter {todaysSloka.chapter} • Verse {todaysSloka.verse}
            </Text>
          </View>

          <View style={styles.sanskritContainer}>
            <DevanagariText style={[styles.sanskrit, { color: colors.text }]}>
              {todaysSloka.sanskrit}
            </DevanagariText>
          </View>

          <Text style={[styles.translation, { color: colors.text }]}>
            {todaysSloka.translation}
          </Text>

          <Button
            onPress={() =>
              router.push(verseRoute(todaysSloka.chapter, todaysSloka.verse))
            }
            style={styles.readButton}
          >
            <Text style={styles.readButtonText}>Read Full Verse</Text>
          </Button>
        </Card>

        {/* Continue Reading */}
        {lastRead && (
          <Card
            style={[styles.continueCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="auto-stories"
                size={20}
                color={colors.accent}
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Continue Reading
              </Text>
            </View>
            <Text
              style={[styles.cardDescription, { color: colors.textSecondary }]}
            >
              Chapter {lastRead.chapter}, Verse {lastRead.verse}
            </Text>
            <Button
              onPress={() =>
                router.push(verseRoute(lastRead.chapter, lastRead.verse))
              }
              style={[
                styles.cardButton,
                {
                  backgroundColor: colors.accent,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Text style={[styles.cardButtonText, { color: "#ffffff" }]}>
                Continue
              </Text>
            </Button>
          </Card>
        )}

        {/* Daily Reflection */}
        <Card
          style={[styles.reflectionCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="lightbulb" size={20} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Daily Reflection
            </Text>
          </View>
          <Text style={[styles.reflectionText, { color: colors.text }]}>
            {todaysReflection}
          </Text>
          <Text
            style={[
              styles.reflectionAttribution,
              { color: colors.textSecondary },
            ]}
          >
            — Bhagavad Gita
          </Text>
        </Card>

        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.surface }]}
            onPress={() => router.push(ROUTES.BOOKMARKS)}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: colors.accent + "20" },
              ]}
            >
              <MaterialIcons name="bookmark" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Bookmarks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.surface }]}
            onPress={() => router.push(ROUTES.SEARCH)}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: colors.accent + "20" },
              ]}
            >
              <MaterialIcons name="search" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {/* Explore Chapters */}
        <Card style={[styles.exploreCard, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="menu-book" size={20} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Explore the Gita
            </Text>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.textSecondary }]}
          >
            18 Chapters • {totalVerses} Verses of timeless wisdom
          </Text>
          <Button
            onPress={() => router.push(ROUTES.CHAPTERS)}
            style={styles.cardButton}
          >
            <Text style={styles.cardButtonText}>Browse All Chapters</Text>
          </Button>
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: spacing.xxl + spacing.lg }} />

        {/* Dev Reset Button (only visible in __DEV__ mode) */}
        <DevResetOnboardingButton />
      </ScrollView>

      {/* Krishna Guide Mascot Modal */}
      <KrishnaGuide
        message={guideState.message}
        context={guideState.context}
        visible={guideState.visible}
        onClose={hideGuide}
        showSkinSelector={true}
      />

      <Modal
        visible={streakRisk.isAtRisk}
        animationType="fade"
        transparent
        statusBarTranslucent
      >
        <View style={styles.riskOverlay}>
          <View
            style={[
              styles.riskModal,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.riskHeader}>
              <MaterialIcons name="warning" size={26} color={colors.accent} />
              <Text style={[styles.riskTitle, { color: colors.text }]}>
                Your streak is at risk!
              </Text>
            </View>

            <Text style={[styles.riskBody, { color: colors.textSecondary }]}>
              You missed {streakRisk.missedDays} day
              {streakRisk.missedDays > 1 ? "s" : ""}. Use a Streak Shield to
              protect your {streak.currentStreak}-day streak?
            </Text>

            <View
              style={[
                styles.riskStatCard,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
            >
              <View style={styles.riskStatRow}>
                <Text
                  style={[
                    styles.riskStatLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Current streak
                </Text>
                <Text style={[styles.riskStatValue, { color: colors.text }]}>
                  {streak.currentStreak} days
                </Text>
              </View>
              <View style={styles.riskStatRow}>
                <Text
                  style={[
                    styles.riskStatLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Streak shields
                </Text>
                <Text style={[styles.riskStatValue, { color: colors.text }]}>
                  {streak.streakShields}
                </Text>
              </View>
            </View>

            {streak.streakShields <= 0 && (
              <Text style={[styles.insufficientText, { color: colors.accent }]}>
                No shields available yet. Start fresh today and rebuild your
                streak.
              </Text>
            )}

            <View style={styles.riskActions}>
              {streak.streakShields > 0 && (
                <Pressable
                  style={[
                    styles.riskButtonPrimary,
                    { backgroundColor: colors.accent },
                  ]}
                  onPress={acceptStreakShield}
                >
                  <Text style={styles.riskButtonPrimaryText}>Use Shield</Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.riskButtonSecondary,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.bg,
                  },
                ]}
                onPress={declineStreakShield}
              >
                <Text
                  style={[
                    styles.riskButtonSecondaryText,
                    { color: colors.text },
                  ]}
                >
                  Start Fresh
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  headerButton: {
    padding: spacing.xs,
  },
  streakSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  todayCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  todayHeader: {
    marginBottom: spacing.md,
  },
  todayLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  todayLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  todayReference: {
    fontSize: fontSize.xs + 1,
  },
  sanskritContainer: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  sanskrit: {
    fontSize: fontSize.xxxl,
    lineHeight: 38,
    textAlign: "center",
  },
  translation: {
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  readButton: {
    marginTop: spacing.xs,
  },
  readButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  continueCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md + spacing.sm,
    borderRadius: radius.lg,
  },
  reflectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md + spacing.sm,
    borderRadius: radius.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  cardButton: {
    marginTop: spacing.xs,
  },
  cardButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  reflectionText: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: spacing.sm,
  },
  reflectionAttribution: {
    fontSize: fontSize.sm,
    textAlign: "right",
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  exploreCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md + spacing.sm,
    borderRadius: radius.lg,
  },
  riskOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  riskModal: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  riskTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  riskBody: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  riskStatCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  riskStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  riskStatLabel: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.medium,
  },
  riskStatValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  insufficientText: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  riskActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  riskButtonPrimary: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  riskButtonPrimaryText: {
    color: "#ffffff",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  riskButtonSecondary: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  riskButtonSecondaryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
