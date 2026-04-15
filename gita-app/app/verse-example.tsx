/**
 * Example Verse Screen using Reusables components
 * This shows one verse per page with language switching and navigation
 *
 * To use: Replace or update your existing verse.tsx with this implementation
 */

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useApp } from "@/src/context/AppContext";
import { verseRoute } from "@/src/navigation/routes";
import {
    getChapter,
    getNextVerse,
    getPreviousVerse,
} from "@/src/utils/gitaData";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerseScreenExample() {
  const { ch: chapterStr, verse: verseStr } = useLocalSearchParams<{
    ch: string;
    verse: string;
  }>();
  const router = useRouter();
  const { language } = useApp();
  const { colors } = useAppTheme();

  const chapter = parseInt(chapterStr || "1", 10);
  const verseNum = parseInt(verseStr || "1", 10);

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

  // Error state if verse not found
  if (!currentVerse || !chapterData) {
    return (
      <SafeAreaView className="flex-1 bg-gita-bg dark:bg-gita-dark-bg">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-gita-text dark:text-gita-dark-text">
            {language === "english" ? "Verse not found" : "श्लोक नहीं मिला"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gita-bg dark:bg-gita-dark-bg">
      <View className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold text-gita-text dark:text-gita-dark-text mb-6">
          {language === "english" ? "Verse Example" : "श्लोक उदाहरण"}
        </Text>

        {/* Navigation */}
        <View className="flex-row gap-2 mt-auto mb-4">
          <Button
            disabled={!prevVerse}
            onPress={() => {
              if (prevVerse) {
                router.push(verseRoute(prevVerse.chapter, prevVerse.verse));
              }
            }}
            className={`flex-1 ${
              prevVerse
                ? "bg-gita-accent dark:bg-gita-dark-accent"
                : "bg-gita-section dark:bg-gita-dark-section"
            }`}
          >
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={prevVerse ? "#ffffff" : colors.secondary}
              />
              <Text
                className={`font-semibold ${prevVerse ? "text-white" : "text-gita-secondary dark:text-gita-dark-secondary"}`}
              >
                Previous
              </Text>
            </View>
          </Button>

          <Button
            disabled={!nextVerse}
            onPress={() => {
              if (nextVerse) {
                router.push(verseRoute(nextVerse.chapter, nextVerse.verse));
              }
            }}
            className={`flex-1 ${
              nextVerse
                ? "bg-gita-accent dark:bg-gita-dark-accent"
                : "bg-gita-section dark:bg-gita-dark-section"
            }`}
          >
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text
                className={`font-semibold ${nextVerse ? "text-white" : "text-gita-secondary dark:text-gita-dark-secondary"}`}
              >
                Next
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={nextVerse ? "#ffffff" : colors.secondary}
              />
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
