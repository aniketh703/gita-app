import { useNotifications } from "@/src/context/NotificationContext";
import gitaData from "@/assets/data.json";
import { Button } from "@/components/ui/button";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAppStore } from "@/src/store/appStore";
import type { ReadingScreenProps } from "@/src/types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VerseData = {
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations?: { english?: string };
};

export default function ReadingScreen({
  navigation,
  route,
}: ReadingScreenProps) {
  const { onChapterComplete } = useNotifications();
  const { chapterId, chapterName } = route.params;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const {
    fontScale,
    lineHeight,
    language,
    transliterationEnabled,
    audioSync,
    focusMode,
    setFocusMode,
    markChapterComplete,
    isChapterComplete,
    updateStreak,
  } = useAppStore();

  const [navVisible, setNavVisible] = useState(true);
  const [celebrate, setCelebrate] = useState(false);

  const chapter = useMemo(
    () => (gitaData as any[]).find((c) => c.chapter === chapterId),
    [chapterId],
  );
  const verses: VerseData[] = chapter?.verses ?? [];

  const bgPulse = useSharedValue(0.03);
  React.useEffect(() => {
    bgPulse.value = withRepeat(
      withSequence(
        withTiming(0.09, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.03, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [bgPulse]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgPulse.value }));

  const chapterColor = colors.accent;
  const done = isChapterComplete(chapterId);

  const onComplete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!done) {
      markChapterComplete(chapterId);
      updateStreak(Math.max(1, verses.length));
      setCelebrate(true);
      // Trigger chapter completion notification
      onChapterComplete(chapterId).catch(console.error);
      setTimeout(() => setCelebrate(false), 1400);
    }
  };

  const buildVerseExportText = (item: VerseData) => {
    const translation = item.translations?.english ?? "";
    return `${chapterName} ${language === "english" ? "Verse" : "श्लोक"} ${item.verse}\n\n${item.sanskrit}\n\n${translation}`;
  };

  const onShareVerse = async (item: VerseData) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({ message: buildVerseExportText(item) });
    } catch (error) {
      console.error("Error sharing verse:", error);
    }
  };

  const onCopyVerse = async (item: VerseData) => {
    try {
      await Clipboard.setStringAsync(buildVerseExportText(item));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        language === "english" ? "Copied" : "कॉपी हो गया",
        language === "english"
          ? "Verse copied to clipboard."
          : "श्लोक क्लिपबोर्ड में कॉपी हो गया।",
      );
    } catch (error) {
      console.error("Error copying verse:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Animated.View
        style={[styles.mandala, { backgroundColor: chapterColor }, bgStyle]}
      />

      {navVisible && (
        <ScreenHeader
          title={chapterName}
          onBack={() => navigation.goBack()}
          rightElement={
            <TouchableOpacity
              onPress={() => setFocusMode(!focusMode)}
              style={[styles.iconBtn, { backgroundColor: colors.section }]}
              accessibilityRole="button"
              accessibilityLabel="Toggle focus mode"
            >
              <MaterialIcons
                name={focusMode ? "fullscreen-exit" : "center-focus-weak"}
                size={22}
                color={chapterColor}
              />
            </TouchableOpacity>
          }
        />
      )}

      <FlashList
        data={verses}
        keyExtractor={(item) => `${chapterId}-${item.verse}`}
        onScroll={(e) =>
          setNavVisible(e.nativeEvent.contentOffset.y < 44 || !focusMode)
        }
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
          paddingBottom: insets.bottom + spacing.xxl + spacing.lg,
        }}
        renderItem={({ item, index }) => {
          const isActive = audioSync.currentVerseIndex === index;
          return (
            <View
              style={[
                styles.verseCard,
                {
                  borderLeftColor: chapterColor,
                  backgroundColor: isActive
                    ? `${chapterColor}22`
                    : colors.surface,
                },
              ]}
            >
              <Text style={[styles.verseNum, { color: chapterColor }]}>
                {item.verse}
              </Text>
              <Text
                style={[
                  styles.sanskrit,
                  {
                    color: colors.text,
                    fontSize: fontSize.md * fontScale,
                    lineHeight: 23 * lineHeight,
                  },
                ]}
              >
                {item.sanskrit}
              </Text>
              {transliterationEnabled && (
                <Text
                  style={[
                    styles.transliteration,
                    {
                      color: colors.textSecondary,
                      fontSize: ((fontSize.xs + fontSize.sm) / 2) * fontScale,
                      lineHeight: 19 * lineHeight,
                    },
                  ]}
                >
                  {item.transliteration}
                </Text>
              )}
              <Text
                style={[
                  styles.translation,
                  {
                    color: colors.text,
                    fontSize: fontSize.sm * fontScale,
                    lineHeight: 20 * lineHeight,
                  },
                ]}
              >
                {item.translations?.english ?? ""}
              </Text>

              <View style={styles.verseActions}>
                <TouchableOpacity
                  onPress={() => onCopyVerse(item)}
                  style={[
                    styles.actionBtn,
                    { borderColor: colors.textSecondary },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Copy verse ${item.verse}`}
                >
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={chapterColor}
                  />
                  <Text style={[styles.actionTxt, { color: chapterColor }]}>
                    Copy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onShareVerse(item)}
                  style={[
                    styles.actionBtn,
                    { borderColor: colors.textSecondary },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Share verse ${item.verse}`}
                >
                  <MaterialIcons name="share" size={14} color={chapterColor} />
                  <Text style={[styles.actionTxt, { color: chapterColor }]}>
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + spacing.xs,
            borderTopColor: chapterColor,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Button
          style={[styles.completeBtn, { backgroundColor: colors.accent }]}
          onPress={onComplete}
        >
          <MaterialIcons
            name={done ? "check-circle" : "flag"}
            size={18}
            color={colors.background}
          />
          <Text style={[styles.completeTxt, { color: colors.background }]}>
            {done ? "Completed" : "Complete Chapter"}
          </Text>
        </Button>
      </View>

      {celebrate && (
        <View
          pointerEvents="none"
          style={[styles.glow, { backgroundColor: `${colors.accent}66` }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mandala: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: radius.full,
    top: -140,
    right: -120,
  },
  header: {
    borderBottomWidth: 2,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  verseCard: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  verseNum: { fontWeight: fontWeight.bold, marginBottom: spacing.xs },
  sanskrit: { fontWeight: fontWeight.semibold, marginBottom: spacing.xs },
  transliteration: { fontStyle: "italic", marginBottom: spacing.xs },
  translation: { fontWeight: fontWeight.medium },
  verseActions: {
    marginTop: spacing.xs,
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  actionTxt: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  completeBtn: {
    borderRadius: radius.md,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  completeTxt: { fontWeight: fontWeight.bold },
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: radius.full,
    left: "50%",
    marginLeft: -120,
    bottom: 80,
  },
});
