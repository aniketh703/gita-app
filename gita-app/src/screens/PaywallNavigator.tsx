/**
 * Soft Paywall - 3 Screen Narrative Flow (Devotional App Adapted)
 * Screen 1: Free Experience Value
 * Screen 2: Premium Features
 * Screen 3: Trial with Anxiety Removal
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ROUTES } from "@/src/navigation/routes";
import { getTotalVerses } from "@/src/utils/gitaData";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const TOTAL_VERSES = getTotalVerses();

interface PaywallNavigatorProps {
  onDismiss?: () => void;
}

export default function PaywallNavigator({ onDismiss }: PaywallNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  return (
    <View style={styles.container}>
      {currentScreen === 1 && (
        <PaywallScreen1 onNext={handleNext} onDismiss={onDismiss} />
      )}
      {currentScreen === 2 && (
        <PaywallScreen2 onNext={handleNext} onBack={handlePrevious} />
      )}
      {currentScreen === 3 && (
        <PaywallScreen3 onBack={handlePrevious} onDismiss={onDismiss} />
      )}
    </View>
  );
}

// ==================== SCREEN 1: Free Experience ====================

interface PaywallScreen1Props {
  onNext: () => void;
  onDismiss?: () => void;
}

function PaywallScreen1({ onNext, onDismiss }: PaywallScreen1Props) {
  const { colors } = useAppTheme();

  const freeFeatures = [
    {
      icon: "menu-book",
      title: `Read All ${TOTAL_VERSES} Verses`,
      description: "Complete Bhagavad Gita access forever",
    },
    {
      icon: "translate",
      title: "Sanskrit + Transliteration",
      description: "Original verses in multiple formats",
    },
    {
      icon: "bookmark",
      title: "Save Favorite Verses",
      description: "Create your personal collection",
    },
    {
      icon: "share",
      title: "Share Wisdom",
      description: "Inspire friends and family",
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Close Button */}
      {onDismiss && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Close paywall"
        >
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Icon */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.iconContainer}
        >
          <MaterialIcons name="auto-awesome" size={64} color={colors.accent} />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          Start Your Gita Journey{"\n"}Today
        </Animated.Text>

        {/* Free Features */}
        <View style={styles.featuresContainer}>
          {freeFeatures.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(600 + index * 100).duration(600)}
              style={[styles.featureRow, { borderColor: colors.border }]}
            >
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.accent + "20" },
                ]}
              >
                <MaterialIcons
                  name={feature.icon as any}
                  size={24}
                  color={colors.accent}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
              <MaterialIcons name="check" size={24} color={colors.accent} />
            </Animated.View>
          ))}
        </View>

        {/* CTA Button */}
        <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel="Continue to premium preview"
          >
            <Text style={[styles.primaryButtonText, { color: "#1a1a1a" }]}>
              Start Reading Free
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary Text */}
        <Animated.Text
          entering={FadeInDown.delay(1100).duration(600)}
          style={[styles.secondaryText, { color: colors.textSecondary }]}
        >
          Free forever • No credit card required
        </Animated.Text>
      </ScrollView>
    </View>
  );
}

// ==================== SCREEN 2: Premium Value ====================

interface PaywallScreen2Props {
  onNext: () => void;
  onBack: () => void;
}

function PaywallScreen2({ onNext, onBack }: PaywallScreen2Props) {
  const { colors } = useAppTheme();

  const premiumFeatures = [
    {
      icon: "palette",
      title: "Theme Customization",
      description: "Personalize your reading environment",
    },
    {
      icon: "bookmark",
      title: "Bookmark Organization",
      description: "Improved sorting and collections",
    },
    {
      icon: "insights",
      title: "Reading Insights",
      description: "Progress and habit summaries",
    },
    {
      icon: "rocket-launch",
      title: "Early Access",
      description: "Try upcoming features before general release",
    },
    {
      icon: "support-agent",
      title: "Priority Feedback",
      description: "Help shape upcoming app improvements",
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Badge */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={[styles.badge, { backgroundColor: colors.accent + "20" }]}
        >
          <MaterialIcons name="star" size={16} color={colors.accent} />
          <Text style={[styles.badgeText, { color: colors.accent }]}>
            PREMIUM
          </Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          Unlock Deeper{"\n"}Understanding
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInUp.delay(500).duration(600)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Premium includes:
        </Animated.Text>

        {/* Premium Features */}
        <View style={styles.premiumFeaturesContainer}>
          {premiumFeatures.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(600 + index * 80).duration(600)}
              style={styles.premiumFeature}
            >
              <View
                style={[
                  styles.premiumIcon,
                  { backgroundColor: colors.accent + "15" },
                ]}
              >
                <MaterialIcons
                  name={feature.icon as any}
                  size={20}
                  color={colors.accent}
                />
              </View>
              <View style={styles.premiumContent}>
                <Text style={[styles.premiumTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.premiumDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA Button */}
        <Animated.View entering={FadeInDown.delay(1200).duration(600)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel="Go to supporter preview options"
          >
            <Text style={[styles.primaryButtonText, { color: "#1a1a1a" }]}>
              View Supporter Preview
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={[styles.trialText, { color: colors.textSecondary }]}>
            Preview build: purchases are disabled
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ==================== SCREEN 3: Trial & Pricing ====================

interface PaywallScreen3Props {
  onBack: () => void;
  onDismiss?: () => void;
}

function PaywallScreen3({ onBack, onDismiss }: PaywallScreen3Props) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly",
  );

  const safeDismiss = () => {
    if (onDismiss) {
      onDismiss();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  };

  const handleStartTrial = () => {
    // Preview only: purchases are disabled in this build.
    safeDismiss();
  };

  const handleContinueFree = () => {
    safeDismiss();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(200).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          Supporter Preview
        </Animated.Text>

        {/* Anxiety Remover */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={[
            styles.anxietyBox,
            {
              backgroundColor: colors.accent + "10",
              borderColor: colors.accent,
            },
          ]}
        >
          <MaterialIcons name="verified" size={24} color={colors.accent} />
          <View style={styles.anxietyContent}>
            <Text style={[styles.anxietyText, { color: colors.text }]}>
              Purchases are currently disabled
            </Text>
            <Text
              style={[styles.anxietySubtext, { color: colors.textSecondary }]}
            >
              This screen is shown for feature preview only
            </Text>
          </View>
        </Animated.View>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <TouchableOpacity
              style={[
                styles.planCard,
                {
                  backgroundColor:
                    selectedPlan === "yearly"
                      ? colors.accentSoft
                      : colors.surface,
                  borderColor:
                    selectedPlan === "yearly" ? colors.accent : colors.border,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedPlan("yearly")}
              accessibilityRole="button"
              accessibilityLabel="Select yearly supporter preview plan"
              accessibilityState={{ selected: selectedPlan === "yearly" }}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: colors.text }]}>
                    Yearly (Coming Soon)
                  </Text>
                  <Text style={[styles.planPrice, { color: colors.text }]}>
                    --
                    <Text
                      style={[
                        styles.planPeriod,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {" "}
                      pricing TBD
                    </Text>
                  </Text>
                </View>
                {selectedPlan === "yearly" && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={colors.accent}
                  />
                )}
              </View>
              <View
                style={[styles.savingBadge, { backgroundColor: colors.accent }]}
              >
                <Text style={[styles.savingText, { color: "#1a1a1a" }]}>
                  Preview
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(600)}>
            <TouchableOpacity
              style={[
                styles.planCard,
                {
                  backgroundColor:
                    selectedPlan === "monthly"
                      ? colors.accentSoft
                      : colors.surface,
                  borderColor:
                    selectedPlan === "monthly" ? colors.accent : colors.border,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedPlan("monthly")}
              accessibilityRole="button"
              accessibilityLabel="Select monthly supporter preview plan"
              accessibilityState={{ selected: selectedPlan === "monthly" }}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: colors.text }]}>
                    Monthly (Coming Soon)
                  </Text>
                  <Text style={[styles.planPrice, { color: colors.text }]}>
                    --
                    <Text
                      style={[
                        styles.planPeriod,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {" "}
                      pricing TBD
                    </Text>
                  </Text>
                </View>
                {selectedPlan === "monthly" && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={colors.accent}
                  />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* CTA Buttons */}
        <Animated.View entering={FadeInDown.delay(900).duration(600)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={handleStartTrial}
            accessibilityRole="button"
            accessibilityLabel="Close supporter preview"
          >
            <Text style={[styles.primaryButtonText, { color: "#1a1a1a" }]}>
              Close Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleContinueFree}
            accessibilityRole="button"
            accessibilityLabel="Continue with free version"
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Continue with Free Version
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Terms */}
        <Animated.Text
          entering={FadeInDown.delay(1000).duration(600)}
          style={[styles.terms, { color: colors.textSecondary }]}
        >
          In-app purchases will be enabled in a future release
        </Animated.Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: spacing.xxl,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
  backButton: {
    position: "absolute",
    top: spacing.xxl,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xxl + spacing.lg,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.full,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.lg,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  featureIcon: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  featureDescription: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  secondaryText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  premiumFeaturesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  premiumFeature: {
    flexDirection: "row",
    gap: spacing.md,
  },
  premiumIcon: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  premiumDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  trialText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  anxietyBox: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  anxietyContent: {
    flex: 1,
  },
  anxietyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  anxietySubtext: {
    fontSize: fontSize.sm,
  },
  plansContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs / 2,
  },
  planPrice: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  planPeriod: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  savingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  savingText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  terms: {
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
