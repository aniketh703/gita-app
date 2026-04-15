/**
 * Chapters List Screen
 */

import gitaData from "@/assets/data.json";
import { Card } from "@/components/ui/card";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAppStore } from "@/src/store/appStore";
import type { ChaptersScreenProps } from "@/src/types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChapterData {
  chapter: number;
  name: { english: string; hindi: string };
  verse_count: number;
}

export default function ChaptersScreen({ navigation }: ChaptersScreenProps) {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { currentChapter, isChapterComplete } = useAppStore();

  const chapters: ChapterData[] = useMemo(() => {
    return (gitaData as any[]).map((chapter: any) => ({
      chapter: chapter.chapter,
      name: chapter.name,
      verse_count: chapter.verse_count,
    }));
  }, []);
  const totalVerses = useMemo(
    () => chapters.reduce((sum, chapter) => sum + chapter.verse_count, 0),
    [chapters],
  );

  const handleChapterPress = async (chapter: ChapterData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("SlokaList", {
      chapterId: chapter.chapter,
      chapterName: chapter.name.english,
      verseCount: chapter.verse_count,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Chapters" onBack={() => navigation.goBack()} />

      <View style={styles.summaryWrap}>
        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
          18 chapters • {totalVerses} verses
        </Text>
      </View>

      <FlashList
        data={chapters}
        numColumns={2}
        keyExtractor={(item) => `chapter-${item.chapter}`}
        contentContainerStyle={{
          paddingHorizontal: spacing.sm,
          paddingTop: spacing.xs,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        renderItem={({ item }) => {
          const selected = item.chapter === currentChapter;
          const completed = isChapterComplete(item.chapter);

          return (
            <TouchableOpacity
              onPress={() => handleChapterPress(item)}
              activeOpacity={0.8}
              style={styles.cardTouch}
            >
              <Card
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.accentSoft },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: colors.accent }]}>
                      #{item.chapter}
                    </Text>
                  </View>
                  {completed ? (
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color={colors.success}
                    />
                  ) : null}
                </View>

                <Text
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {item.name.english}
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  {item.verse_count} verses
                </Text>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  summaryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  cardTouch: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  card: {
    minHeight: 150,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
