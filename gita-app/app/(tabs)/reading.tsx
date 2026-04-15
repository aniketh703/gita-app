/**
 * Reading Screen - Minimal Verse List with Settings Integration
 * Focus: Simple list of verses with bookmarks and tap navigation
 * Design: Clean cards, responsive to all preference settings
 */

import { DevanagariText } from "@/components/devanagari-text";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Toast, useToast } from "@/components/ui/toast";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { verseRoute } from "@/src/navigation/routes";
import type { Verse } from "@/src/types";
import { getChapter } from "@/src/utils/gitaData";
import { triggerLightHaptic } from "@/src/utils/haptics";
import {
    addBookmark,
    isBookmarked as checkBookmarked,
    removeBookmarkByVerse,
    saveReadingProgress,
} from "@/src/utils/readingProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function ReadingScreen() {
  const { ch: chapterStr } = useLocalSearchParams<{ ch: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const prefs = usePreferencesState();
  const { colors } = useAppTheme();

  const chapter = parseInt(chapterStr || "1", 10);
  const chapterData = useMemo(() => getChapter(chapter), [chapter]);

  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(
    new Set(),
  );
  const { toast, showToast, hideToast } = useToast();

  // Load bookmarks on chapter change
  useEffect(() => {
    const loadBookmarks = async () => {
      if (chapterData) {
        // Parallelize bookmark checks for better performance
        const bookmarkPromises = chapterData.verses.map((verse) =>
          checkBookmarked(chapter, verse.verse).then((marked) => ({
            verse: verse.verse,
            marked,
          })),
        );
        const results = await Promise.all(bookmarkPromises);
        const bookmarked = new Set<number>(
          results.filter((r) => r.marked).map((r) => r.verse),
        );
        setBookmarkedVerses(bookmarked);
      }
    };
    loadBookmarks();
  }, [chapter, chapterData]);

  // Configure header
  useLayoutEffect(() => {
    if (chapterData) {
      navigation.setOptions({
        title:
          prefs.language === "english"
            ? `${chapterData.name.english} (${chapterData.verse_count} Verses)`
            : `${chapterData.name.hindi || chapterData.name.english} (${chapterData.verse_count} श्लोक)`,
        headerShown: true,
      });
    }
  }, [navigation, prefs.language, chapterData]);

  if (!chapterData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {prefs.language === "english"
            ? "Chapter not found"
            : "अध्याय नहीं मिला"}
        </Text>
      </View>
    );
  }

  const handleBookmarkToggle = async (verseNum: number) => {
    triggerLightHaptic(prefs.toggles.enableHaptics);
    const isCurrentlyBookmarked = bookmarkedVerses.has(verseNum);

    if (isCurrentlyBookmarked) {
      try {
        const removed = await removeBookmarkByVerse(chapter, verseNum);
        if (removed) {
          setBookmarkedVerses((prev) => {
            const next = new Set(prev);
            next.delete(verseNum);
            return next;
          });
          showToast(
            prefs.language === "english"
              ? "Bookmark removed"
              : "बुकमार्क हटाया गया",
            "success",
          );
        }
      } catch (error) {
        console.error("Error removing bookmark:", error);
        showToast(
          prefs.language === "english"
            ? "Failed to remove bookmark"
            : "बुकमार्क हटाने में समस्या हुई",
          "error",
        );
      }
    } else {
      await addBookmark(chapter, verseNum);
      setBookmarkedVerses((prev) => new Set(prev).add(verseNum));
      showToast(
        prefs.language === "english"
          ? "Verse bookmarked"
          : "श्लोक बुकमार्क किया गया",
        "success",
      );
    }
  };

  const handleVersePress = async (verse: Verse) => {
    triggerLightHaptic(prefs.toggles.enableHaptics);
    // Save progress
    await saveReadingProgress(chapter, verse.verse);
    // Navigate to detail
    router.push(verseRoute(chapter, verse.verse));
  };

  const renderVerse: ListRenderItem<Verse> = ({ item }) => {
    const isMarked = bookmarkedVerses.has(item.verse);

    return (
      <TouchableOpacity
        onPress={() => handleVersePress(item)}
        activeOpacity={0.7}
      >
        <Card style={[styles.verseCard, { backgroundColor: colors.verseBox }]}>
          <View style={styles.verseHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.verseNumber,
                  { color: colors.accent, fontSize: prefs.fontSize },
                ]}
              >
                {prefs.language === "english"
                  ? `Verse ${item.verse}`
                  : `श्लोक ${item.verse}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleBookmarkToggle(item.verse)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <MaterialIcons
                name={isMarked ? "bookmark" : "bookmark-border"}
                size={24}
                color={isMarked ? colors.accent : colors.secondary}
              />
            </TouchableOpacity>
          </View>

          {prefs.toggles.showDevanagari && (
            <View style={styles.sanskritPreview}>
              <DevanagariText
                style={[
                  styles.sanskritText,
                  {
                    color: colors.text,
                    fontSize: prefs.fontSize,
                  },
                ]}
                numberOfLines={prefs.toggles.expandAllVerses ? undefined : 2}
              >
                {item.sanskrit}
              </DevanagariText>
            </View>
          )}

          {prefs.toggles.showTransliteration && item.transliteration && (
            <View style={styles.transliterationPreview}>
              <Text
                style={[
                  styles.transliterationText,
                  {
                    color: colors.secondary,
                    fontSize: prefs.fontSize * 0.9,
                  },
                ]}
                numberOfLines={prefs.toggles.expandAllVerses ? undefined : 1}
              >
                {item.transliteration}
              </Text>
            </View>
          )}

          {prefs.toggles.showCommentary && item.commentary?.english && (
            <View style={styles.translationPreview}>
              <Text
                style={[
                  styles.translationText,
                  {
                    color: colors.text,
                    fontSize: prefs.fontSize * 0.85,
                  },
                ]}
                numberOfLines={prefs.toggles.expandAllVerses ? undefined : 2}
              >
                {item.commentary.english}
              </Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
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
      <FlatList
        data={chapterData.verses}
        key={prefs.fontSize.toString()}
        keyExtractor={(item) => `${chapter}-${item.verse}`}
        renderItem={renderVerse}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        initialNumToRender={15}
        windowSize={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  verseCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  verseNumber: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  sanskritPreview: {
    marginBottom: spacing.sm,
  },
  sanskritText: {
    fontSize: fontSize.md,
    lineHeight: 26,
  },
  transliterationPreview: {
    marginBottom: spacing.sm,
  },
  transliterationText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontStyle: "italic",
  },
  translationPreview: {
    marginTop: spacing.sm,
  },
  translationText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
