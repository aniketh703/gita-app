/**
 * Bookmarks Screen
 * Display all bookmarked verses
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Toast, useToast } from "@/components/ui/toast";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useApp } from "@/src/context/AppContext";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { verseRoute } from "@/src/navigation/routes";
import {
    getBookmarks,
    removeBookmark,
    type Bookmark,
} from "@/src/utils/readingProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

export default function BookmarksScreen() {
  const prefs = usePreferencesState();
  const { language } = useApp();
  const { colors } = useAppTheme();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteBookmark, setDeleteBookmark] = useState<Bookmark | null>(null);
  const { toast, showToast, hideToast } = useToast();

  // Load bookmarks on screen focus
  const loadBookmarks = useCallback(async () => {
    const data = await getBookmarks();
    // Sort by chapter and verse
    data.sort((a, b) => {
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
    setBookmarks(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks]),
  );

  const handleRemoveBookmark = async (bookmark: Bookmark) => {
    await removeBookmark(bookmark.id);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
    setDeleteBookmark(null);
    showToast(
      language === "english" ? "Bookmark removed" : "बुकमार्क हटाया गया",
      "success",
    );
  };

  const handleBookmarkPress = (bookmark: Bookmark) => {
    router.push(verseRoute(bookmark.chapter, bookmark.verse));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gita-bg dark:bg-gita-dark-bg justify-center items-center">
        <Text className="text-gita-secondary dark:text-gita-dark-secondary">
          {language === "english"
            ? "Loading bookmarks..."
            : "बुकमार्क लोड हो रहे हैं..."}
        </Text>
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 bg-gita-bg dark:bg-gita-dark-bg">
        <View className="px-4 py-6 border-b border-gita-border dark:border-gita-dark-border">
          <Text
            className="text-2xl font-bold text-gita-text dark:text-gita-dark-text"
            style={{ fontSize: Math.min(24, prefs.fontSize + 8) }}
            accessibilityRole="header"
          >
            {language === "english" ? "Bookmarks" : "बुकमार्क"}
          </Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: radius.full,
              backgroundColor: `${colors.accent}20`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons
              name="bookmark-border"
              size={48}
              color={colors.accent}
            />
          </View>
          <Text
            className="text-center text-gita-text dark:text-gita-dark-text text-lg font-semibold mb-2"
            style={{ fontSize: Math.min(18, prefs.fontSize) }}
          >
            {language === "english"
              ? "No Bookmarks Yet"
              : "अभी तक कोई बुकमार्क नहीं"}
          </Text>
          <Text
            className="text-center text-gita-secondary dark:text-gita-dark-secondary"
            style={{ fontSize: Math.min(14, prefs.fontSize - 2) }}
          >
            {language === "english"
              ? "Tap the star icon on verses to bookmark them for later reading"
              : "बाद में पढ़ने के लिए श्लोकों पर तारे के आइकन को टैप करें"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gita-bg dark:bg-gita-dark-bg">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        enableHaptic={prefs.toggles.enableHaptics}
        onHide={hideToast}
      />

      <View className="px-4 py-6 border-b border-gita-border dark:border-gita-dark-border">
        <Text
          className="text-2xl font-bold text-gita-text dark:text-gita-dark-text"
          style={{ fontSize: Math.min(24, prefs.fontSize + 8) }}
          accessibilityRole="header"
        >
          {language === "english" ? "Bookmarks" : "बुकमार्क"}
        </Text>
        <Text
          className="text-sm text-gita-secondary dark:text-gita-dark-secondary mt-1"
          style={{ fontSize: Math.min(14, prefs.fontSize - 2) }}
        >
          {language === "english"
            ? `${bookmarks.length} saved verse${bookmarks.length !== 1 ? "s" : ""}`
            : `${bookmarks.length} सहेजे गए श्लोक`}
        </Text>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.md,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleBookmarkPress(item)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${language === "english" ? "Chapter" : "अध्याय"} ${item.chapter}, ${language === "english" ? "Verse" : "श्लोक"} ${item.verse}`}
          >
            <Card
              style={{
                backgroundColor: colors.verseBox,
                borderColor: colors.border,
                borderRadius: radius.lg,
              }}
            >
              <CardContent style={{ padding: spacing.lg }}>
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-3">
                    <Text
                      className="font-semibold mb-2"
                      style={{
                        color: colors.accent,
                        fontSize: Math.min(fontSize.md, prefs.fontSize),
                        fontWeight: fontWeight.semibold,
                      }}
                    >
                      {language === "english"
                        ? `Chapter ${item.chapter} • Verse ${item.verse}`
                        : `अध्याय ${item.chapter} • श्लोक ${item.verse}`}
                    </Text>
                    {item.note && (
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: Math.min(fontSize.sm, prefs.fontSize - 2),
                          lineHeight: Math.min(22, prefs.fontSize + 6),
                        }}
                        numberOfLines={2}
                      >
                        {item.note}
                      </Text>
                    )}
                    <Text
                      className="mt-2"
                      style={{
                        color: colors.secondary,
                        fontSize: Math.max(fontSize.xs - 1, prefs.fontSize - 5),
                      }}
                    >
                      {language === "english"
                        ? `Saved ${new Date(item.timestamp).toLocaleDateString()}`
                        : `${new Date(item.timestamp).toLocaleDateString()} को सहेजा गया`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setDeleteBookmark(item);
                    }}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel={
                      language === "english"
                        ? "Remove bookmark"
                        : "बुकमार्क हटाएं"
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radius.full,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="close"
                      size={22}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        )}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={10}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteBookmark}
        onOpenChange={(open) => !open && setDeleteBookmark(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "english" ? "Remove Bookmark?" : "बुकमार्क हटाएं?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "english"
                ? `Are you sure you want to remove the bookmark for Chapter ${deleteBookmark?.chapter}, Verse ${deleteBookmark?.verse}? This action cannot be undone.`
                : `क्या आप वाकई अध्याय ${deleteBookmark?.chapter}, श्लोक ${deleteBookmark?.verse} के बुकमार्क को हटाना चाहते हैं? इस कार्रवाई को पूर्ववत नहीं किया जा सकता।`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setDeleteBookmark(null)}>
              <Text>{language === "english" ? "Cancel" : "रद्द करें"}</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={() =>
                deleteBookmark && handleRemoveBookmark(deleteBookmark)
              }
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-white">
                {language === "english" ? "Remove" : "हटाएं"}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
