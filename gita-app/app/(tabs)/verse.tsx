/**
 * Verse Screen - Minimal & Calm
 * Focus: Clear, centered Sanskrit with translations
 * Design: Card-based sections, no accordions, large breathing space
 * Uses Settings: Language, Theme, Font Size, Display Toggles
 */

import { DevanagariText } from "@/components/devanagari-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Toast, useToast } from "@/components/ui/toast";
import { radius, spacing } from "@/constants/spacing";
import { fontFamily, fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { ROUTES, verseRoute } from "@/src/navigation/routes";
import type { LangKey } from "@/src/types";
import {
  getChapter,
  getNextVerse,
  getPreviousVerse,
} from "@/src/utils/gitaData";
import { triggerLightHaptic } from "@/src/utils/haptics";
import {
  addBookmark,
  isBookmarked,
  removeBookmarkByVerse,
  saveReadingProgress,
} from "@/src/utils/readingProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

function getLocalizedText(
  text: { english: string; hindi: string } | undefined,
  lang: LangKey,
): string {
  if (!text) return "";
  return text[lang] || text["english"] || "";
}

function isMeaningfulText(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.trim().toLowerCase();
  return (
    normalized !== "" &&
    !normalized.includes("translation needed") &&
    !normalized.includes("commentary needed") &&
    !normalized.includes("transliteration needed")
  );
}

export default function VerseScreen() {
  const { ch: chapterStr, verse: verseStr } = useLocalSearchParams<{
    ch: string;
    verse: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();
  const prefs = usePreferencesState();
  const { colors } = useAppTheme();

  const chapter = parseInt(chapterStr || "1", 10);
  const verseNum = parseInt(verseStr || "1", 10);
  const [isVerseBookmarked, setIsVerseBookmarked] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [captureDurationMs, setCaptureDurationMs] = useState<number | null>(
    null,
  );
  const [captureStats, setCaptureStats] = useState({
    sampleCount: 0,
    totalMs: 0,
    maxMs: 0,
  });
  const { toast, showToast, hideToast } = useToast();
  const viewShotRef = useRef<ViewShot | null>(null);

  // Get chapter data and find current verse
  const chapterData = useMemo(() => getChapter(chapter), [chapter]);
  const currentVerse = useMemo(
    () => chapterData?.verses.find((v) => v.verse === verseNum),
    [chapterData, verseNum],
  );

  // Get next and previous verse info
  const nextVerse = useMemo(
    () => getNextVerse(chapter, verseNum),
    [chapter, verseNum],
  );
  const prevVerse = useMemo(
    () => getPreviousVerse(chapter, verseNum),
    [chapter, verseNum],
  );

  // Load bookmark status
  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const bookmarked = await isBookmarked(chapter, verseNum);
      setIsVerseBookmarked(bookmarked);
    };
    loadBookmarkStatus();
  }, [chapter, verseNum]);

  // Configure header
  useLayoutEffect(() => {
    const handleHeaderBack = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      router.replace(ROUTES.TABS_HOME);
    };

    navigation.setOptions({
      title:
        prefs.language === "english"
          ? `Chapter ${chapter} • Verse ${verseNum}`
          : `अध्याय ${chapter} • श्लोक ${verseNum}`,
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleHeaderBack}
          style={styles.headerBackButton}
          accessibilityRole="button"
          accessibilityLabel={
            prefs.language === "english" ? "Go back" : "वापस जाएं"
          }
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.accent} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, prefs.language, chapter, verseNum, colors.accent, router]);

  if (!currentVerse || !chapterData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "Verse not found"
              : "श्लोक नहीं मिला"}
          </Text>
        </View>
      </View>
    );
  }

  const translation = getLocalizedText(
    currentVerse.translations,
    prefs.language as LangKey,
  );
  const commentary = currentVerse.commentary
    ? getLocalizedText(
        currentVerse.commentary as { english: string; hindi: string },
        prefs.language as LangKey,
      )
    : "";
  const transliteration = currentVerse.transliteration || "";

  const verseExportText = `${chapterData.name.english} ${
    prefs.language === "english" ? "Verse" : "श्लोक"
  } ${verseNum}\n\n${currentVerse.sanskrit}\n\n${translation}`;

  const handleShare = async () => {
    try {
      triggerLightHaptic(prefs.toggles.enableHaptics);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({ message: verseExportText });
    } catch (error) {
      console.error("Error sharing verse:", error);
    }
  };

  const handleCopy = async () => {
    try {
      triggerLightHaptic(prefs.toggles.enableHaptics);
      await Clipboard.setStringAsync(verseExportText);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        prefs.language === "english" ? "Copied" : "कॉपी हो गया",
        prefs.language === "english"
          ? "Verse copied to clipboard."
          : "श्लोक क्लिपबोर्ड में कॉपी हो गया।",
      );
    } catch (error) {
      console.error("Error copying verse:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      triggerLightHaptic(prefs.toggles.enableHaptics);
      if (isVerseBookmarked) {
        await removeBookmarkByVerse(chapter, verseNum);
        showToast(
          prefs.language === "english"
            ? "Bookmark removed"
            : "बुकमार्क हटाया गया",
          "success",
        );
      } else {
        await addBookmark(chapter, verseNum);
        showToast(
          prefs.language === "english"
            ? "Verse bookmarked"
            : "श्लोक बुकमार्क किया गया",
          "success",
        );
      }
      setIsVerseBookmarked(!isVerseBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showToast(
        prefs.language === "english"
          ? "Failed to update bookmark"
          : "बुकमार्क अपडेट करने में समस्या हुई",
        "error",
      );
    }
  };

  const handleScreenshot = async () => {
    if (isCapturingScreenshot) {
      return;
    }

    try {
      setIsCapturingScreenshot(true);
      triggerLightHaptic(prefs.toggles.enableHaptics);
      showToast(
        prefs.language === "english"
          ? "Saving verse image..."
          : "श्लोक की तस्वीर सेव की जा रही है...",
        "info",
      );

      let permission = await MediaLibrary.getPermissionsAsync();
      if (!permission.granted && permission.canAskAgain) {
        permission = await MediaLibrary.requestPermissionsAsync();
      }

      if (!permission.granted) {
        showToast(
          prefs.language === "english"
            ? "Photos permission is required"
            : "फोटो सेव करने की अनुमति चाहिए",
          "error",
        );
        return;
      }

      if (!viewShotRef.current) {
        throw new Error("View shot ref is not ready");
      }

      const captureStart = Date.now();
      const captureUri = await viewShotRef.current.capture?.();

      if (!captureUri) {
        throw new Error("Capture failed");
      }

      const asset = await MediaLibrary.createAssetAsync(captureUri);
      if (asset && asset.uri && (MediaLibrary as any).createAlbumAsync) {
        await MediaLibrary.createAlbumAsync("Gita App", asset, false).catch(
          () => {
            // Album creation may fail if it already exists; asset is already saved.
          },
        );
      }
      const captureDurationMs = Date.now() - captureStart;
      setCaptureDurationMs(captureDurationMs);
      setCaptureStats((prev) => ({
        sampleCount: prev.sampleCount + 1,
        totalMs: prev.totalMs + captureDurationMs,
        maxMs: Math.max(prev.maxMs, captureDurationMs),
      }));

      if (__DEV__ && captureDurationMs > 1200) {
        console.warn(
          `[F-13] Screenshot capture exceeded target: ${captureDurationMs}ms`,
        );
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(
        prefs.language === "english"
          ? "Verse saved to your photos"
          : "श्लोक आपकी गैलरी में सेव हो गया",
        "success",
      );
    } catch (error) {
      console.error("Error saving verse screenshot:", error);
      showToast(
        prefs.language === "english"
          ? "Failed to save verse image"
          : "श्लोक की तस्वीर सेव नहीं हो सकी",
        "error",
      );
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        enableHaptic={prefs.toggles.enableHaptics}
        onHide={hideToast}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{
            format: "png",
            quality: 1,
            result: "tmpfile",
            snapshotContentContainer: true,
          }}
          style={[styles.captureContainer, { backgroundColor: colors.bg }]}
        >
          {/* Sanskrit */}
          <Card
            style={[styles.sanskritCard, { backgroundColor: colors.verseBox }]}
          >
            <View style={styles.sanskritSection}>
              <Text style={[styles.sectionLabel, { color: colors.accent }]}>
                Sanskrit
              </Text>
              <DevanagariText
                style={[
                  styles.sanskritText,
                  { color: colors.text, fontSize: prefs.fontSize * 1.2 },
                ]}
              >
                {currentVerse.sanskrit}
              </DevanagariText>
              <Text
                style={[styles.verseReference, { color: colors.secondary }]}
              >
                {chapterData.name.english} •{" "}
                {prefs.language === "english" ? "Verse" : "श्लोक"} {verseNum}
              </Text>
            </View>
          </Card>

          {/* Transliteration */}
          {prefs.toggles.showTransliteration &&
            isMeaningfulText(transliteration) && (
              <Card style={[styles.card, { backgroundColor: colors.verseBox }]}>
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.accent }]}>
                    {prefs.language === "english"
                      ? "Transliteration"
                      : "ट्रांसलिटरेशन"}
                  </Text>
                  <Text
                    style={[
                      styles.transliterationText,
                      {
                        color: colors.secondary,
                        fontSize: prefs.fontSize * 0.9,
                      },
                    ]}
                  >
                    {transliteration}
                  </Text>
                </View>
              </Card>
            )}

          {/* Translation */}
          {isMeaningfulText(translation) && (
            <Card style={[styles.card, { backgroundColor: colors.verseBox }]}>
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.accent }]}>
                  {prefs.language === "english" ? "Translation" : "अनुवाद"}
                </Text>
                {prefs.language === "hindi" ? (
                  <DevanagariText
                    style={[
                      styles.translationText,
                      { color: colors.text, fontSize: prefs.fontSize },
                    ]}
                  >
                    {translation}
                  </DevanagariText>
                ) : (
                  <Text
                    style={[
                      styles.translationText,
                      { color: colors.text, fontSize: prefs.fontSize },
                    ]}
                  >
                    {translation}
                  </Text>
                )}
              </View>
            </Card>
          )}

          {/* Commentary */}
          {prefs.toggles.showCommentary && isMeaningfulText(commentary) && (
            <Card style={[styles.card, { backgroundColor: colors.verseBox }]}>
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.accent }]}>
                  {prefs.language === "english" ? "Commentary" : "व्याख्या"}
                </Text>
                {prefs.language === "hindi" ? (
                  <DevanagariText
                    style={[
                      styles.commentaryText,
                      {
                        color: colors.secondary,
                        fontSize: prefs.fontSize * 0.9,
                      },
                    ]}
                  >
                    {commentary}
                  </DevanagariText>
                ) : (
                  <Text
                    style={[
                      styles.commentaryText,
                      {
                        color: colors.secondary,
                        fontSize: prefs.fontSize * 0.9,
                      },
                    ]}
                  >
                    {commentary}
                  </Text>
                )}
              </View>
            </Card>
          )}
        </ViewShot>

        <View style={styles.actionRow}>
          <Button
            onPress={handleBookmarkToggle}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.border }]}
          >
            <MaterialIcons
              name={isVerseBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={colors.accent}
            />
            <Text style={[styles.shareButtonText, { color: colors.accent }]}>
              {isVerseBookmarked
                ? prefs.language === "english"
                  ? "Bookmarked"
                  : "बुकमार्क किया हुआ"
                : prefs.language === "english"
                  ? "Bookmark"
                  : "बुकमार्क करें"}
            </Text>
          </Button>

          <Button
            onPress={handleScreenshot}
            disabled={isCapturingScreenshot}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.border }]}
          >
            <MaterialIcons
              name={isCapturingScreenshot ? "hourglass-top" : "photo-camera"}
              size={18}
              color={colors.accent}
            />
            <Text style={[styles.shareButtonText, { color: colors.accent }]}>
              {isCapturingScreenshot
                ? prefs.language === "english"
                  ? "Saving..."
                  : "सेव हो रहा है..."
                : prefs.language === "english"
                  ? "Save Verse"
                  : "श्लोक सेव करें"}
            </Text>
          </Button>

          <Button
            onPress={handleCopy}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.border }]}
          >
            <MaterialIcons
              name="content-copy"
              size={18}
              color={colors.accent}
            />
            <Text style={[styles.shareButtonText, { color: colors.accent }]}>
              {prefs.language === "english" ? "Copy Verse" : "श्लोक कॉपी करें"}
            </Text>
          </Button>

          <Button
            onPress={handleShare}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.border }]}
          >
            <MaterialIcons name="share" size={18} color={colors.accent} />
            <Text style={[styles.shareButtonText, { color: colors.accent }]}>
              {prefs.language === "english" ? "Share Verse" : "श्लोक साझा करें"}
            </Text>
          </Button>
        </View>

        {/* Previous / Next */}
        <View style={styles.navigationContainer}>
          <Button
            onPress={async () => {
              if (prevVerse) {
                triggerLightHaptic(prefs.toggles.enableHaptics);
                await saveReadingProgress(prevVerse.chapter, prevVerse.verse);
                router.push(verseRoute(prevVerse.chapter, prevVerse.verse));
              }
            }}
            disabled={!prevVerse}
            variant={prevVerse ? "default" : "outline"}
            style={[
              styles.navButton,
              !prevVerse && { borderColor: colors.border },
            ]}
          >
            <MaterialIcons
              name="chevron-left"
              size={20}
              color={prevVerse ? "#ffffff" : colors.secondary}
            />
            <Text
              style={[
                styles.navButtonText,
                { color: prevVerse ? "#ffffff" : colors.secondary },
              ]}
            >
              {prefs.language === "english" ? "Previous" : "पिछला"}
            </Text>
          </Button>

          <Button
            onPress={async () => {
              if (nextVerse) {
                triggerLightHaptic(prefs.toggles.enableHaptics);
                await saveReadingProgress(nextVerse.chapter, nextVerse.verse);
                router.push(verseRoute(nextVerse.chapter, nextVerse.verse));
              }
            }}
            disabled={!nextVerse}
            variant={nextVerse ? "default" : "outline"}
            style={[
              styles.navButton,
              !nextVerse && { borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: nextVerse ? "#ffffff" : colors.secondary },
              ]}
            >
              {prefs.language === "english" ? "Next" : "अगला"}
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={nextVerse ? "#ffffff" : colors.secondary}
            />
          </Button>
        </View>

        {__DEV__ && (
          <View
            style={[
              styles.devPanel,
              {
                backgroundColor: colors.verseBox,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.devTitle, { color: colors.accent }]}>
              F-13 Screenshot Diagnostics
            </Text>
            <Text style={[styles.devRow, { color: colors.textSecondary }]}>
              Last capture: {captureDurationMs ?? "--"}ms
            </Text>
            <Text style={[styles.devRow, { color: colors.textSecondary }]}>
              Average:{" "}
              {captureStats.sampleCount > 0
                ? Math.round(captureStats.totalMs / captureStats.sampleCount)
                : "--"}
              ms
            </Text>
            <Text style={[styles.devRow, { color: colors.textSecondary }]}>
              Max: {captureStats.maxMs || "--"}ms
            </Text>
            <Text
              style={[
                styles.devRow,
                {
                  color:
                    captureDurationMs !== null && captureDurationMs <= 1000
                      ? colors.success
                      : colors.accent,
                },
              ]}
            >
              Target (&lt;= 1000ms):{" "}
              {captureDurationMs !== null && captureDurationMs <= 1000
                ? "PASS"
                : "PENDING"}
            </Text>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  captureContainer: {
    marginBottom: spacing.xs,
  },
  sanskritCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  sanskritSection: {
    alignItems: "center",
  },
  sanskritText: {
    fontSize: fontSize.xxxl,
    lineHeight: 40,
    fontFamily: fontFamily.devanagari,
    textAlign: "center",
    marginVertical: spacing.md + spacing.xs / 2,
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  verseReference: {
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginTop: spacing.xs,
  },
  transliterationText: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontStyle: "italic",
  },
  translationText: {
    fontSize: fontSize.md,
    lineHeight: 26,
  },
  commentaryText: {
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  devPanel: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: spacing.xs / 2,
  },
  devTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  devRow: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.medium,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  shareButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 52,
    borderRadius: radius.lg,
    gap: 6,
  },
  navButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
