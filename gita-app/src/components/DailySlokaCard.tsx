/**
 * Daily Sloka Card
 * Displays today's sloka prominently on home screen
 * Creates immediate value and engagement
 */

import gitaData from "@/assets/data.json";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInUp } from "react-native-reanimated";

export default function DailySlokaCard() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const { generateDailySlokaIndex, setCurrentChapter, setCurrentVerse } =
    useAppStore();

  // Get today's sloka
  const todaysSloka = useMemo(() => {
    const dailySlokaIndex = generateDailySlokaIndex();

    let currentIndex = 0;
    let selectedChapter: any = null;
    let selectedVerse: any = null;

    for (const chapter of gitaData) {
      if (currentIndex + chapter.verses.length > dailySlokaIndex) {
        selectedChapter = chapter;
        selectedVerse =
          chapter.verses[dailySlokaIndex - currentIndex] || chapter.verses[0];
        break;
      }
      currentIndex += chapter.verses.length;
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
    };
  }, [generateDailySlokaIndex]);

  const handleReadNow = () => {
    setCurrentChapter(todaysSloka.chapter);
    setCurrentVerse(todaysSloka.verse);
    router.push({
      pathname: "/reading",
      params: {
        ch: String(todaysSloka.chapter),
        verse: String(todaysSloka.verse),
      },
    });
  };

  return (
    <Animated.View
      entering={SlideInUp.delay(400).duration(600)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header with Icon and Badge */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name="today"
              size={24}
              color={colors.accent}
              style={styles.icon}
            />
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Today&apos;s Wisdom
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>
              {todaysSloka.chapter}.{todaysSloka.verse}
            </Text>
          </View>
        </View>

        {/* Sloka Content */}
        <View style={styles.content}>
          {/* Sanskrit */}
          <Text
            style={[styles.sanskrit, { color: colors.text }]}
            numberOfLines={3}
          >
            {todaysSloka.sanskrit}
          </Text>

          {/* Transliteration */}
          <Text
            style={[styles.transliteration, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {todaysSloka.transliteration}
          </Text>

          {/* Translation */}
          <Text
            style={[styles.translation, { color: colors.text }]}
            numberOfLines={3}
          >
            {todaysSloka.translation}
          </Text>
        </View>

        {/* Read Now Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleReadNow}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Read Now
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={fontSize.sm + 2}
            color={colors.background}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  content: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  sanskrit: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
    fontStyle: "italic",
  },
  transliteration: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.medium,
    lineHeight: 18,
  },
  translation: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: 21,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
