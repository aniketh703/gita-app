/**
 * Streak Display Component
 * Shows current reading streak with fire animation
 * Based on Rule #11 + #25: Gamification
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  shieldCount?: number;
  isDark?: boolean;
  compact?: boolean;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  shieldCount = 0,
  isDark = false,
  compact = false,
}: StreakDisplayProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (currentStreak > 0) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
        true,
      );
    }
  }, [currentStreak, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors = {
    bg: isDark ? "#1a1a1a" : "#fff8f0",
    text: isDark ? "#ffffff" : "#0a0a0a",
    textSecondary: isDark ? "#a0a0a0" : "#666666",
    accent: "#ff6b35",
    border: isDark ? "#333333" : "#ffe8d6",
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.bg }]}>
        <Animated.View style={animatedStyle}>
          <MaterialIcons
            name="local-fire-department"
            size={24}
            color={currentStreak > 0 ? colors.accent : colors.textSecondary}
          />
        </Animated.View>
        <Text style={[styles.compactText, { color: colors.text }]}>
          {currentStreak}
        </Text>
        <Text style={[styles.compactLabel, { color: colors.textSecondary }]}>
          day streak
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Animated.View style={animatedStyle}>
          <MaterialIcons
            name="local-fire-department"
            size={32}
            color={currentStreak > 0 ? colors.accent : colors.textSecondary}
          />
        </Animated.View>
        <Text style={[styles.title, { color: colors.text }]}>
          Reading Streak
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Current
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Best
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.shieldRow,
          { backgroundColor: colors.bg, borderColor: colors.border },
        ]}
      >
        <View style={styles.shieldLabelRow}>
          <MaterialIcons name="shield" size={16} color={colors.accent} />
          <Text style={[styles.shieldLabel, { color: colors.text }]}>
            Streak Shields
          </Text>
        </View>
        <Text style={[styles.shieldValue, { color: colors.accent }]}>
          {" "}
          {shieldCount}
        </Text>
      </View>

      {currentStreak > 0 && (
        <View
          style={[styles.encouragement, { backgroundColor: colors.border }]}
        >
          <MaterialIcons name="star" size={16} color={colors.accent} />
          <Text style={[styles.encouragementText, { color: colors.text }]}>
            {currentStreak >= 7
              ? "Amazing dedication! 🙏"
              : currentStreak >= 3
                ? "Keep going! You're building a habit! 💪"
                : "Great start! Come back tomorrow! 🌟"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    height: 40,
  },
  shieldRow: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  shieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shieldLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  shieldValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  encouragement: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  encouragementText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  compactText: {
    fontSize: 20,
    fontWeight: "700",
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
