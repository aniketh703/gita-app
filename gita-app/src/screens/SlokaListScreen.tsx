/**
 * Sloka List Screen
 * Renders all verses for the active chapter with lateral swipe gestures
 * Swiping left/right dynamically swaps chapter data and triggers soft crossfade
 */

import gitaData from "@/assets/data.json";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAppStore } from "@/src/store/appStore";
import type { SlokaListScreenProps } from "@/src/types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VerseData {
  verse: number;
  sanskrit: string;
  transliteration: string;
  english: string;
}

const TOTAL_CHAPTERS = 18;

export default function SlokaListScreen({
  navigation,
  route,
}: SlokaListScreenProps) {
  const { chapterId, chapterName, verseCount } = route.params;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const { setCurrentChapter } = useAppStore();
  const [displayChapter, setDisplayChapter] = useState(chapterId);

  const swipeProgress = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  // Get verses for current chapter
  const verses: VerseData[] = useMemo(() => {
    const chapter = (gitaData as any[]).find(
      (ch) => ch.chapter === displayChapter,
    );
    return chapter?.verses || [];
  }, [displayChapter]);

  const getChapterColor = (): string => colors.accent;

  const handleSwipeNext = (direction: "left" | "right") => {
    const isNext = direction === "left";
    const nextChapter = isNext
      ? Math.min(displayChapter + 1, TOTAL_CHAPTERS)
      : Math.max(displayChapter - 1, 1);

    if (nextChapter !== displayChapter) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      contentOpacity.value = withTiming(0, { duration: 200 });

      setTimeout(() => {
        setDisplayChapter(nextChapter);
        setCurrentChapter(nextChapter);
        contentOpacity.value = withTiming(1, { duration: 200 });
      }, 150);
    }
  };

  // Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      swipeProgress.value = event.translationX / 100;
    })
    .onEnd((event) => {
      const threshold = 50;

      if (event.velocityX < -threshold || event.translationX < -threshold) {
        // Swipe left → next chapter
        handleSwipeNext("left");
      } else if (
        event.velocityX > threshold ||
        event.translationX > threshold
      ) {
        // Swipe right → previous chapter
        handleSwipeNext("right");
      }

      swipeProgress.value = withSpring(0);
    });

  const handleVersePress = (verse: VerseData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Reading", {
      chapterId: displayChapter,
      verseId: verse.verse,
      chapterName,
    });
  };

  const contentAnimStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const headerScale = useSharedValue(0.85);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerScale.value = withSpring(1, {
      damping: 8,
      mass: 1,
      stiffness: 100,
    });
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, [headerOpacity, headerScale]);

  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }));

  const currentChapterData = (gitaData as any[]).find(
    (ch) => ch.chapter === displayChapter,
  );
  const currentChapterName = currentChapterData?.name?.english || chapterName;
  const currentVerseCount = currentChapterData?.verse_count || verseCount;
  const chapterColor = getChapterColor();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        <Animated.View style={headerAnimStyle}>
          <ScreenHeader
            title={currentChapterName}
            onBack={() => navigation.goBack()}
            rightElement={
              <Text style={[styles.swipeHint, { color: colors.textSecondary }]}>
                ↔️ Swipe
              </Text>
            }
          />
        </Animated.View>

        <View style={styles.chapterMeta}>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {currentVerseCount} verses • Ch. {displayChapter}
          </Text>
        </View>

        {/* Verses List */}
        <Animated.View style={[{ flex: 1 }, contentAnimStyle]}>
          <FlashList
            data={verses}
            renderItem={({ item, index }) => (
              <VerseCard
                verse={item}
                index={index}
                textColor={colors.text}
                textSecondaryColor={colors.textSecondary}
                surfaceColor={colors.surface}
                chapterColor={chapterColor}
                badgeTextColor={colors.background}
                onPress={() => handleVersePress(item)}
              />
            )}
            contentContainerStyle={{
              paddingVertical: spacing.sm,
              paddingBottom: insets.bottom + spacing.xl,
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ color: colors.textSecondary }}>
                  Loading verses...
                </Text>
              </View>
            }
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

interface VerseCardProps {
  verse: VerseData;
  index: number;
  textColor: string;
  textSecondaryColor: string;
  surfaceColor: string;
  chapterColor: string;
  badgeTextColor: string;
  onPress: () => void;
}

function VerseCard({
  verse,
  index,
  textColor,
  textSecondaryColor,
  surfaceColor,
  chapterColor,
  badgeTextColor,
  onPress,
}: VerseCardProps) {
  const scaleProgress = useSharedValue(0);

  useEffect(() => {
    scaleProgress.value = withDelay(
      index * 20,
      withSpring(1, {
        damping: 8,
        mass: 1,
        stiffness: 100,
      }),
    );
  }, [index, scaleProgress]);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleProgress.value }],
  }));

  const handlePressIn = () => {
    scaleProgress.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleProgress.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.cardWrapper, cardAnimStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        style={[
          styles.card,
          {
            backgroundColor: surfaceColor,
            borderLeftColor: chapterColor,
          },
        ]}
      >
        <View style={styles.verseHeader}>
          <View style={[styles.verseBadge, { backgroundColor: chapterColor }]}>
            <Text style={[styles.verseBadgeText, { color: badgeTextColor }]}>
              {verse.verse}
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={chapterColor}
            style={{ marginLeft: "auto" }}
          />
        </View>

        <Text
          style={[styles.sanskritText, { color: textColor }]}
          numberOfLines={2}
        >
          {verse.sanskrit}
        </Text>

        <Text
          style={[styles.englishText, { color: textSecondaryColor }]}
          numberOfLines={2}
        >
          {verse.english}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chapterMeta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  swipeHint: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  cardWrapper: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  card: {
    padding: spacing.sm,
    borderRadius: radius.md,
    borderLeftWidth: spacing.xs / 2,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  verseBadge: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  verseBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  sanskritText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: 20,
    marginBottom: spacing.xs - 2,
  },
  englishText: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  emptyState: {
    paddingVertical: spacing.xxl * 2 + spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
