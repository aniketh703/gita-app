/**
 * Progress Indicator Component
 * Shows user's progress through chapters and verses
 * Principles: Visual Feedback, Personalization, User Engagement
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: string;
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  height = 8,
  color,
}: ProgressIndicatorProps) {
  const { colors } = useAppTheme();

  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const progressColor = color || colors.accent;
  const bgColor = colors.border;
  const textColor = colors.text;

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.header}>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: textColor }]}>
              {percentage}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: bgColor }]}>
        <View
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
              backgroundColor: progressColor,
              height,
            },
          ]}
        />
      </View>
      {!label && showPercentage && (
        <Text style={[styles.centeredPercentage, { color: textColor }]}>
          {current} / {total}
        </Text>
      )}
    </View>
  );
}

// Circular progress for reading statistics
export function CircularProgress({
  percentage,
  size = 80,
  strokeWidth = 8,
  label,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const { colors } = useAppTheme();
  const textColor = colors.text;

  return (
    <View style={[styles.circularContainer, { width: size, height: size }]}>
      <Text
        style={[styles.circularText, { color: textColor, fontSize: size / 3 }]}
      >
        {Math.round(percentage)}%
      </Text>
      {label && (
        <Text style={[styles.circularLabel, { color: textColor }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
  },
  centeredPercentage: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  track: {
    borderRadius: 99,
    overflow: "hidden",
  },
  progress: {
    borderRadius: 99,
  },
  circularContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  circularText: {
    fontWeight: "bold",
  },
  circularLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});
