/**
 * Rating Prompt Modal
 * Shows after user has read a certain number of slokas (Rule #17)
 * Asks for rating at a positive moment
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RatingPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RatingPromptModal({
  visible,
  onClose,
}: RatingPromptModalProps) {
  const { colors } = useAppTheme();
  const { markAsRated } = useAppStore();

  const handleRate = async () => {
    try {
      // Request store review (native dialog)
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      }
      markAsRated();
      onClose();
    } catch (error) {
      console.log("Rating error:", error);
      onClose();
    }
  };

  const handleRemindLater = () => {
    onClose();
  };

  const handleNotNow = () => {
    markAsRated(); // Don't show again
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdrop}
        onPress={onClose}
      >
        {/* Modal Container */}
        <View style={[styles.modalContainer]}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {/* Success Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.accentSoft },
              ]}
            >
              <MaterialIcons name="favorite" size={48} color={colors.accent} />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              You&apos;re Making Progress!
            </Text>

            {/* Description */}
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Enjoying the wisdom of the Bhagavad Gita?
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Your rating helps us improve the experience
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={handleRate}
              >
                <MaterialIcons
                  name="star"
                  size={20}
                  color={colors.background}
                />
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: colors.background },
                  ]}
                >
                  Rate Us
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  { borderColor: colors.border },
                ]}
                onPress={handleRemindLater}
              >
                <Text
                  style={[styles.secondaryButtonText, { color: colors.text }]}
                >
                  Remind Later
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.tertiaryButton]}
                onPress={handleNotNow}
              >
                <Text
                  style={[
                    styles.tertiaryButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Not Now
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: radius.xl,
  },
  card: {
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  iconContainer: {
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
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  primaryButton: {
    flexDirection: "row",
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
  tertiaryButton: {},
  tertiaryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
