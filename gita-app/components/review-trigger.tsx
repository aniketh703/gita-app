/**
 * Review Trigger System
 * Prompts user to rate app after reading X verses
 * Based on Rule #12: Review Trigger Pattern
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from "react-native-reanimated";

interface ReviewTriggerProps {
  versesRead: number;
  onDismiss: () => void;
  onSubmit?: (rating: number) => void;
}

const REVIEW_TRIGGER_THRESHOLD = 5; // Show after 5 verses

export function useReviewTrigger() {
  const { ratingState, updateRatingState } = useAppStore();

  const shouldShowReview = (versesRead: number): boolean => {
    if (ratingState?.hasRated) return false;
    if (!ratingState) return false;

    return (
      ratingState.slokasReadSinceLastPrompt >= REVIEW_TRIGGER_THRESHOLD &&
      (!ratingState.lastPromptDate ||
        new Date().getTime() - new Date(ratingState.lastPromptDate).getTime() >
          7 * 24 * 60 * 60 * 1000) // Show only once per week
    );
  };

  const recordReviewPrompt = () => {
    updateRatingState({
      slokasReadSinceLastPrompt: 0,
      lastPromptDate: new Date().toISOString(),
      promptsShown: (ratingState?.promptsShown || 0) + 1,
    });
  };

  const recordReviewSubmitted = (rating: number) => {
    updateRatingState({
      hasRated: true,
      slokasReadSinceLastPrompt: 0,
      lastPromptDate: new Date().toISOString(),
    });
  };

  return {
    shouldShowReview,
    recordReviewPrompt,
    recordReviewSubmitted,
  };
}

export function ReviewTriggerModal({
  versesRead,
  onDismiss,
  onSubmit,
}: ReviewTriggerProps) {
  const { colors } = useAppTheme();
  const [rating, setRating] = useState(0);
  const { updateRatingState, markAsRated } = useAppStore();

  const handleSubmitRating = async (stars: number) => {
    setRating(stars);
    updateRatingState({ promptsShown: 1 });

    if (stars >= 4) {
      // Redirect to app store for rating
      Alert.alert(
        "Thank You! 🙏",
        "Your feedback helps us improve. Would you like to rate us on the app store?",
        [
          { text: "Cancel", onPress: onDismiss },
          {
            text: "Rate Now",
            onPress: () => {
              // Link to app store - adjust for your app
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.aniketh_037.gitaapp",
              );
              markAsRated();
              onDismiss();
            },
          },
        ],
      );
    } else {
      // Show feedback form for low ratings
      Alert.alert(
        "We'd Love to Hear More",
        "How can we improve your experience?",
        [{ text: "OK", onPress: onDismiss }],
      );
    }

    if (onSubmit) {
      onSubmit(stars);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.modal, { backgroundColor: colors.surface }]}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Icon */}
        <Animated.View
          entering={ZoomIn.delay(200).duration(600)}
          style={styles.iconSection}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.accent + "20" },
            ]}
          >
            <MaterialIcons name="rate-review" size={48} color={colors.accent} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          How is Your Experience?
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInUp.delay(500).duration(600)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          You have read {versesRead} beautiful verses. Share your feedback!
        </Animated.Text>

        {/* Star Rating */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <View style={styles.ratingSection}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleSubmitRating(star)}
              >
                <MaterialIcons
                  name={star <= rating ? "star" : "star-border"}
                  size={48}
                  color={star <= rating ? colors.accent : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Reason */}
        {rating > 0 && (
          <Animated.Text
            entering={FadeInDown.delay(700).duration(600)}
            style={[styles.reasonText, { color: colors.textSecondary }]}
          >
            {rating >= 4
              ? "Thank you for loving our app! 🙏"
              : "Help us improve your experience"}
          </Animated.Text>
        )}

        {/* Dismiss Button */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <TouchableOpacity
            style={[styles.dismissButton, { borderColor: colors.border }]}
            onPress={onDismiss}
          >
            <Text style={[styles.dismissText, { color: colors.textSecondary }]}>
              Maybe later
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    width: "85%",
    padding: spacing.lg,
    borderRadius: radius.xl,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  iconSection: {
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  ratingSection: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  reasonText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing.md,
    fontStyle: "italic",
  },
  dismissButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  dismissText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
});
