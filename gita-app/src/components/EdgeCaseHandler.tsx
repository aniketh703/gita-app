/**
 * Edge Case Handler
 * Handles various edge cases in the app:
 * - User disables all display options
 * - Last sloka of chapter reached
 * - Dataset loading errors
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EdgeCaseErrorProps {
  type: "no-display-options" | "dataset-error" | "end-of-chapter";
  visible: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
  onNavigateNext?: () => void;
  chapterName?: string;
  currentChapter?: number;
  totalChapters?: number;
}

export default function EdgeCaseHandler({
  type,
  visible,
  onDismiss,
  onRetry,
  onNavigateNext,
  chapterName,
  currentChapter,
  totalChapters,
}: EdgeCaseErrorProps) {
  const { colors } = useAppTheme();

  const getErrorContent = () => {
    switch (type) {
      case "no-display-options":
        return {
          icon: "visibility-off",
          title: "Display Settings Required",
          description:
            "Please enable at least one text display option (Sanskrit, Transliteration, English, or Hindi) to read the verses.",
          buttonText: "Go to Settings",
          showRetry: true,
        };

      case "dataset-error":
        return {
          icon: "error-outline",
          title: "Unable to Load Verses",
          description:
            "We encountered an issue loading the Bhagavad Gita data. This might be a temporary issue. Please try again.",
          buttonText: "Retry",
          showRetry: true,
        };

      case "end-of-chapter":
        return {
          icon: "celebration",
          title: `You've Completed ${chapterName}`,
          description:
            currentChapter === totalChapters
              ? "You've reached the end of the Bhagavad Gita! Congratulations on your spiritual journey."
              : `Excellent progress! Would you like to continue to Chapter ${(currentChapter ?? 0) + 1}?`,
          buttonText:
            currentChapter === totalChapters ? "Back to Home" : "Next Chapter",
          showRetry: false,
        };

      default:
        return {
          icon: "info",
          title: "Something went wrong",
          description: "An unexpected error occurred.",
          buttonText: "Dismiss",
          showRetry: false,
        };
    }
  };

  const content = getErrorContent();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdrop}
        onPress={onDismiss}
      >
        {/* Dialog */}
        <View style={[styles.dialogContainer]}>
          <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
            {/* Icon */}
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor:
                    type === "end-of-chapter"
                      ? colors.accentSoft
                      : colors.surfaceSoft,
                },
              ]}
            >
              <MaterialIcons
                name={content.icon as any}
                size={48}
                color={
                  type === "end-of-chapter"
                    ? colors.accent
                    : colors.textSecondary
                }
              />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              {content.title}
            </Text>

            {/* Description */}
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {content.description}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              {content.showRetry && (
                <TouchableOpacity
                  onPress={onRetry || onDismiss}
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.background },
                    ]}
                  >
                    {content.buttonText}
                  </Text>
                </TouchableOpacity>
              )}

              {!content.showRetry && (
                <TouchableOpacity
                  onPress={
                    type === "end-of-chapter" ? onNavigateNext : onDismiss
                  }
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.background },
                    ]}
                  >
                    {content.buttonText}
                  </Text>
                </TouchableOpacity>
              )}

              {content.showRetry && (
                <TouchableOpacity
                  onPress={onDismiss}
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[styles.secondaryButtonText, { color: colors.text }]}
                  >
                    Dismiss
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    width: "85%",
    borderRadius: radius.lg,
  },
  dialog: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.lg,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
