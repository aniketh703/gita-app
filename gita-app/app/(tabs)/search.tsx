import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useApp } from "@/src/context/AppContext";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { verseRoute } from "@/src/navigation/routes";
import type { Verse } from "@/src/types";
import { getChapter, getChapters, getTotalVerses } from "@/src/utils/gitaData";
import { triggerLightHaptic } from "@/src/utils/haptics";
import { saveReadingProgress } from "@/src/utils/readingProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchScreen() {
  const { colors } = useAppTheme();
  const { language } = useApp();
  const prefs = usePreferencesState();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const chapters = getChapters();
  const totalVerses = getTotalVerses();

  // Search through all verses
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: {
      chapter: number;
      verse: number;
      verseData: Verse;
      chapterName: string;
    }[] = [];

    chapters.forEach((chapterSummary) => {
      const fullChapter = getChapter(chapterSummary.chapter);
      if (!fullChapter) return;

      fullChapter.verses.forEach((verse: Verse) => {
        const sanskritMatch = verse.sanskrit?.toLowerCase().includes(query);
        const translationMatch =
          verse.translations?.english?.toLowerCase().includes(query) ||
          verse.translations?.hindi?.toLowerCase().includes(query);
        const transliterationMatch = verse.transliteration
          ?.toLowerCase()
          .includes(query);

        if (sanskritMatch || translationMatch || transliterationMatch) {
          results.push({
            chapter: chapterSummary.chapter,
            verse: verse.verse,
            verseData: verse,
            chapterName:
              language === "english"
                ? chapterSummary.name.english
                : chapterSummary.name.hindi || chapterSummary.name.english,
          });
        }
      });
    });

    return results.slice(0, 50); // Limit to 50 results
  }, [searchQuery, chapters, language]);

  const handleVersePress = async (chapter: number, verse: number) => {
    triggerLightHaptic(prefs.toggles.enableHaptics);
    await saveReadingProgress(chapter, verse);
    router.push(verseRoute(chapter, verse));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Search Input */}
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.bg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.verseBox,
            borderRadius: radius.md,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.sm - spacing.xs / 4,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MaterialIcons
            name="search"
            size={24}
            color={colors.secondary}
            style={{ marginRight: spacing.xs }}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              language === "english" ? "Search slokas..." : "श्लोक खोजें..."
            }
            placeholderTextColor={colors.secondary}
            maxLength={100}
            style={{
              flex: 1,
              fontSize: fontSize.md,
              color: colors.text,
              fontFamily: "System",
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {searchQuery.length < 2 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          <MaterialIcons name="search" size={64} color={colors.border} />
          <Text
            style={{
              marginTop: spacing.md,
              fontSize: fontSize.md,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            {language === "english"
              ? `Search through ${totalVerses} verses of the Bhagavad Gita`
              : `भगवद्गीता के ${totalVerses} श्लोकों में खोजें`}
          </Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          <MaterialIcons name="search-off" size={64} color={colors.border} />
          <Text
            style={{
              marginTop: spacing.md,
              fontSize: fontSize.md,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            {language === "english" ? "No verses found" : "कोई श्लोक नहीं मिला"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.chapter}-${item.verse}`}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleVersePress(item.chapter, item.verse)}
              style={{ marginBottom: spacing.sm }}
            >
              <Card
                style={{
                  backgroundColor: colors.verseBox,
                  borderColor: colors.border,
                }}
              >
                <CardContent className="pt-4">
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.xs,
                        fontWeight: fontWeight.semibold,
                        color: colors.accent,
                      }}
                    >
                      {item.chapter}.{item.verse}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSize.xs,
                        color: colors.secondary,
                      }}
                    >
                      {item.chapterName}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: fontSize.sm,
                      color: colors.text,
                      lineHeight: fontSize.sm * 1.43,
                    }}
                  >
                    {language === "english"
                      ? item.verseData.translations?.english
                      : item.verseData.translations?.hindi ||
                        item.verseData.translations?.english}
                  </Text>
                </CardContent>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
