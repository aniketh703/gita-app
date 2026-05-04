/**
 * Search Screen
 * Search across Sanskrit, Transliteration, English, and Hindi
 * Unlocks 'curious-mind' badge on first use
 */

import gitaData from "@/assets/data.json";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchResult {
  chapterId: number;
  chapterName: string;
  verseId: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  english: string;
  hindi?: string;
  matchedIn: "sanskrit" | "transliteration" | "english" | "hindi";
}

interface SearchScreenProps {
  navigation: any;
  onNavigateToVerse?: (chapterId: number, verseId: number) => void;
}

export default function SearchScreen({
  navigation,
  onNavigateToVerse,
}: SearchScreenProps) {
  const { colors } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { addBadge, badges } = useAppStore();

  // Perform search across all verses
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return [];
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    gitaData.forEach((chapter: any) => {
      chapter.verses.forEach((verse: any, verseIndex: number) => {
        let matchedIn: SearchResult["matchedIn"] | null = null;

        // Search in Sanskrit
        if (verse.sanskrit?.toLowerCase().includes(query)) {
          matchedIn = "sanskrit";
        }
        // Search in Transliteration
        else if (verse.transliteration?.toLowerCase().includes(query)) {
          matchedIn = "transliteration";
        }
        // Search in English
        else if (verse.translations?.english?.toLowerCase().includes(query)) {
          matchedIn = "english";
        }
        // Search in Hindi
        else if (verse.translations?.hindi?.toLowerCase().includes(query)) {
          matchedIn = "hindi";
        }

        if (matchedIn) {
          const safeVerseId =
            typeof verse.id === "number"
              ? verse.id
              : typeof verse.verse === "number"
                ? verse.verse
                : verseIndex + 1;

          results.push({
            chapterId: chapter.chapter,
            chapterName: chapter.name?.english || `Chapter ${chapter.chapter}`,
            verseId: safeVerseId,
            verse: verse.verse,
            sanskrit: verse.sanskrit || "",
            transliteration: verse.transliteration || "",
            english: verse.translations?.english || "",
            hindi: verse.translations?.hindi,
            matchedIn,
          });
        }
      });
    });

    setIsSearching(false);

    // Unlock search badge on first meaningful search
    if (results.length > 0 && !badges.includes("curious-mind")) {
      addBadge("curious-mind");
    }

    return results;
  }, [searchQuery, addBadge, badges]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleResultPress = (result: SearchResult) => {
    if (onNavigateToVerse) {
      onNavigateToVerse(result.chapterId, result.verseId);
    } else if (navigation) {
      navigation.navigate("Reading", {
        ch: String(result.chapterId),
        verse: String(result.verseId),
      });
    }
  };

  // Build export text for sharing/copying
  const buildVerseExportText = (result: SearchResult): string => {
    let text = `${result.chapterName} - Verse ${result.verse}\n\n`;
    if (result.sanskrit) text += `${result.sanskrit}\n\n`;
    if (result.transliteration) text += `${result.transliteration}\n\n`;
    if (result.english) text += `${result.english}`;
    return text;
  };

  // Copy verse to clipboard
  const onCopyVerse = async (result: SearchResult) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = buildVerseExportText(result);
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Verse copied to clipboard");
  };

  // Share verse
  const onShareVerse = async (result: SearchResult) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = buildVerseExportText(result);
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const matchBadgeColors = {
      sanskrit: colors.accent,
      transliteration: colors.accent,
      english: colors.accent,
      hindi: colors.accent,
    };

    return (
      <TouchableOpacity
        style={[
          styles.resultCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => handleResultPress(item)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.resultHeader}>
          <Text style={[styles.resultChapter, { color: colors.textSecondary }]}>
            {item.chapterName} • Verse {item.verse}
          </Text>
          <View
            style={[
              styles.matchBadge,
              { backgroundColor: matchBadgeColors[item.matchedIn] + "20" },
            ]}
          >
            <Text
              style={[
                styles.matchBadgeText,
                { color: matchBadgeColors[item.matchedIn] },
              ]}
            >
              {item.matchedIn}
            </Text>
          </View>
        </View>

        {/* Sanskrit */}
        {item.sanskrit && (
          <Text
            style={[styles.resultSanskrit, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.sanskrit}
          </Text>
        )}

        {/* Transliteration */}
        {item.transliteration && (
          <Text
            style={[
              styles.resultTransliteration,
              { color: colors.textSecondary },
            ]}
            numberOfLines={2}
          >
            {item.transliteration}
          </Text>
        )}

        {/* English */}
        {item.english && (
          <Text
            style={[styles.resultEnglish, { color: colors.text }]}
            numberOfLines={3}
          >
            {item.english}
          </Text>
        )}

        {/* Action Buttons */}
        <View style={styles.verseActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.surfaceSoft },
            ]}
            onPress={() => onCopyVerse(item)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="content-copy"
              size={16}
              color={colors.accent}
            />
            <Text style={[styles.actionButtonText, { color: colors.accent }]}>
              Copy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.surfaceSoft },
            ]}
            onPress={() => onShareVerse(item)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="share" size={16} color={colors.accent} />
            <Text style={[styles.actionButtonText, { color: colors.accent }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        {/* Arrow Icon */}
        <View style={styles.resultArrow}>
          <MaterialIcons name="arrow-forward" size={18} color={colors.accent} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={["left", "right"]}
    >
      <ScreenHeader title="Search" onBack={() => navigation?.goBack()} />

      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surfaceSoft },
        ]}
      >
        <MaterialIcons name="search" size={24} color={colors.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search verses..."
          placeholderTextColor={colors.secondary}
          maxLength={100} // Sentinel: Prevent DoS risk and memory exhaustion
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <MaterialIcons
              name="close"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Info */}
      {searchQuery.length > 0 && (
        <View style={styles.searchInfo}>
          <Text
            style={[styles.searchInfoText, { color: colors.textSecondary }]}
          >
            {isSearching
              ? "Searching..."
              : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} found`}
          </Text>
        </View>
      )}

      {/* Results */}
      {searchQuery.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Search the Bhagavad Gita
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Search across Sanskrit, transliteration,{"\n"}English, and Hindi
            translations
          </Text>
        </View>
      ) : searchResults.length === 0 && !isSearching ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Results Found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) =>
            `${item.chapterId}-${item.verseId}-${item.matchedIn}-${index}`
          }
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    width: 40,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg - spacing.xs / 2,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === "ios" ? spacing.sm + 2 : spacing.sm - 2,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    ...Platform.select({
      ios: { paddingVertical: 0 },
      android: { paddingVertical: 0 },
    }),
  },
  searchInfo: {
    paddingHorizontal: spacing.lg - spacing.xs / 2,
    paddingBottom: spacing.sm,
  },
  searchInfoText: {
    fontSize: fontSize.sm,
  },
  resultsList: {
    padding: spacing.lg - spacing.xs / 2,
    paddingTop: 0,
    gap: spacing.md,
  },
  resultCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    position: "relative",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  resultChapter: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  matchBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm - 2,
  },
  matchBadgeText: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.semibold,
    textTransform: "capitalize",
  },
  resultSanskrit: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs - 2,
    lineHeight: 24,
  },
  resultTransliteration: {
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  resultEnglish: {
    fontSize: fontSize.sm,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  verseActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  actionButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  resultArrow: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl - spacing.xs,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
