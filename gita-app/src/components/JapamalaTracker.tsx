/**
 * Japamala Streak Tracker Component
 * Prayer bead streak tracker with haptic feedback and scrubbing via Gesture Handler
 * Shows current streak, longest streak, and allows user to scrub through consistency
 */

import type { ThemePalette } from "@/constants/colors";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const BEAD_SIZE = 32;

interface JapamalaTrackerProps {
  onStreakTap?: (day: string) => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function JapamalaTracker({ onStreakTap }: JapamalaTrackerProps) {
  const { colors } = useAppTheme();
  const { streak } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get all dates in current streak
  const getBeads = () => {
    if (streak.currentStreak === 0) return [];

    const beads = [];
    const today = new Date();

    for (let i = streak.currentStreak - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const versesRead = streak.readings[dateStr] ?? 0;
      beads.push({
        date: dateStr,
        dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        versesRead,
      });
    }

    return beads;
  };

  const beads = getBeads();
  const scrollProgress = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      scrollProgress.value = Math.max(
        0,
        Math.min(1, event.translationX / width),
      );
    })
    .onEnd(() => {
      scrollProgress.value = withSpring(0);
    });

  const handleBeadPress = (date: string) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedDate(selectedDate === date ? null : date);
    if (onStreakTap) {
      onStreakTap(date);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            {streak.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Current Streak
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            {streak.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Longest Streak
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            {streak.totalDaysRead}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Days
          </Text>
        </View>
      </View>

      {/* Japamala Beads */}
      {beads.length > 0 ? (
        <GestureDetector gesture={panGesture}>
          <View style={styles.beadsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              contentContainerStyle={styles.scrollContent}
            >
              {beads.map((bead, index) => (
                <BeadItem
                  key={bead.date}
                  bead={bead}
                  isSelected={selectedDate === bead.date}
                  colors={colors}
                  onPress={() => handleBeadPress(bead.date)}
                  delay={index * 30}
                />
              ))}
            </ScrollView>
          </View>
        </GestureDetector>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Begin your journey. Read your first sloka today.
          </Text>
        </View>
      )}

      {/* Selected Date Details */}
      {selectedDate && streak.readings[selectedDate] !== undefined && (
        <View
          style={[
            styles.selectedDetails,
            { backgroundColor: colors.surfaceSoft },
          ]}
        >
          <Text style={[styles.selectedDate, { color: colors.text }]}>
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.versesCount, { color: colors.accent }]}>
            {streak.readings[selectedDate]} verses read
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * Individual Bead Component with Animation
 */
interface BeadItemProps {
  bead: {
    date: string;
    dayOfWeek: string;
    dayNumber: number;
    versesRead: number;
  };
  colors: ThemePalette;
  isSelected: boolean;
  onPress: () => void;
  delay: number;
}

function BeadItem({ bead, colors, isSelected, onPress, delay }: BeadItemProps) {
  const scaleProgress = useSharedValue(0);

  React.useEffect(() => {
    scaleProgress.value = withSpring(isSelected ? 1.3 : 1.0);
  }, [isSelected, scaleProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scaleProgress.value,
      [0, 1],
      [1, 1.3],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      scaleProgress.value,
      [0, 1],
      [0.7, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Intensity based on verses read
  const intensity = Math.min(1, (bead.versesRead || 0) / 10);
  const beadColor = isSelected
    ? colors.accent
    : hexToRgba(colors.accent, 0.3 + intensity * 0.7);

  return (
    <Animated.View style={[styles.beadWrapper, animatedStyle]}>
      <Animated.View
        onTouchEnd={onPress}
        style={[
          styles.bead,
          {
            backgroundColor: beadColor,
            borderColor: colors.accent,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.beadLabel,
            {
              color: isSelected ? colors.background : colors.textSecondary,
              fontSize: isSelected ? 11 : 9,
            },
          ]}
        >
          {bead.dayNumber}
        </Text>
      </Animated.View>
      <Text
        style={[
          styles.dayLabel,
          {
            color: colors.textSecondary,
            fontSize: isSelected ? 12 : 10,
          },
        ]}
      >
        {bead.dayOfWeek}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(128,128,128,0.2)",
    marginHorizontal: spacing.xs,
  },
  beadsContainer: {
    height: 100,
    marginVertical: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
  },
  beadWrapper: {
    alignItems: "center",
    marginHorizontal: spacing.xs / 2,
    width: BEAD_SIZE + 16,
  },
  bead: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  beadLabel: {
    fontWeight: fontWeight.bold,
  },
  dayLabel: {
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  emptyState: {
    paddingVertical: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  selectedDetails: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  selectedDate: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  versesCount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
