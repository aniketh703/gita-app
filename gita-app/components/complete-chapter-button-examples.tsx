/**
 * Complete Chapter Button - Usage Examples & Integration Guide
 *
 * This file demonstrates how to integrate CompleteChapterButton into your Bhagavad Gita app
 */

import { CompleteChapterButton } from "@/components/complete-chapter-button";
import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/hooks/use-app-theme";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

/**
 * EXAMPLE 1: Basic Usage
 * Simplest integration for marking chapter as complete
 */
export function BasicCompleteChapterExample() {
  const [completed, setCompleted] = useState(false);
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bg,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 20,
          color: colors.text,
        }}
      >
        Mark Chapter as Complete
      </Text>

      <CompleteChapterButton
        onComplete={async () => {
          // Simulate API call or AsyncStorage update
          await new Promise((resolve) => setTimeout(resolve, 800));
          setCompleted(true);
        }}
        isCompleted={completed}
        glowColor="#D4AF37"
      />

      {completed && (
        <Text
          style={{
            marginTop: 20,
            fontSize: 14,
            color: colors.secondary,
          }}
        >
          Great! Chapter marked complete ✨
        </Text>
      )}
    </View>
  );
}

/**
 * EXAMPLE 2: Integration with Chapter End Screen
 * Shows how to use in a reading completion context
 */
export function ChapterEndScreenExample() {
  const { colors } = useAppTheme();
  const chapterNumber = 1;

  const handleChapterComplete = async () => {
    // Save completion to AsyncStorage
    // updateReadingProgress({ chapterId: chapterNumber, completed: true })
    // Log analytics
    console.log(`Chapter ${chapterNumber} marked as complete`);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 60,
      }}
    >
      {/* Chapter Header */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 8,
          }}
        >
          Chapter {chapterNumber} Complete!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.secondary,
            lineHeight: 22,
          }}
        >
          You have finished Chapter {chapterNumber}. Well done on your spiritual
          journey.
        </Text>
      </View>

      {/* Chapter Statistics */}
      <View
        style={{
          backgroundColor: colors.section,
          borderRadius: 12,
          padding: 16,
          marginBottom: 30,
          borderLeftWidth: 4,
          borderLeftColor: colors.accent,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 12,
          }}
        >
          Chapter Summary
        </Text>
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.secondary,
            }}
          >
            📚 Verses Read: 47
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.secondary,
            }}
          >
            ⏱️ Time Spent: 28 minutes
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.secondary,
            }}
          >
            🔖 Bookmarks Made: 5
          </Text>
        </View>
      </View>

      {/* Completion Button */}
      <CompleteChapterButton
        chapterNumber={chapterNumber}
        onComplete={handleChapterComplete}
        glowColor="#D4AF37"
        style={{
          marginBottom: 20,
        }}
      />

      {/* Next Chapter CTA */}
      <View
        style={{
          backgroundColor: colors.verseBox,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 8,
          }}
        >
          Ready for more?
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.secondary,
            lineHeight: 20,
          }}
        >
          Chapter 2 awaits. Each chapter deepens your understanding of the
          Bhagavad Gita wisdom.
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * EXAMPLE 3: Multiple Chapter Progress
 * Shows completion buttons across multiple chapters with state management
 */
export function MultiChapterProgressExample() {
  const { colors } = useAppTheme();
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    new Set([1]),
  );

  const chapters = [
    { id: 1, name: "Arjuna's Dilemma", verses: 47 },
    { id: 2, name: "Knowledge of the Field", verses: 72 },
    { id: 3, name: "Karma Yoga", verses: 43 },
    { id: 4, name: "Knowledge and Sacrifice", verses: 42 },
  ];

  const handleChapterComplete = async (chapterId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCompletedChapters((prev) => new Set([...prev, chapterId]));
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 6,
        }}
      >
        Your Reading Journey
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: colors.secondary,
          marginBottom: 20,
        }}
      >
        {completedChapters.size} of {chapters.length} chapters complete
      </Text>

      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: colors.section,
          borderRadius: 4,
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${(completedChapters.size / chapters.length) * 100}%`,
            backgroundColor: colors.accent,
            borderRadius: 4,
          }}
        />
      </View>

      {/* Chapter List */}
      <View style={{ gap: 16 }}>
        {chapters.map((chapter) => {
          const isCompleted = completedChapters.has(chapter.id);
          const isNext = chapter.id === Math.max(...completedChapters) + 1;

          return (
            <View
              key={chapter.id}
              style={{
                backgroundColor: isCompleted ? colors.section : colors.verseBox,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.text,
                      marginBottom: 4,
                    }}
                  >
                    Chapter {chapter.id}: {chapter.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.secondary,
                    }}
                  >
                    {chapter.verses} verses
                  </Text>
                </View>

                {isCompleted && (
                  <Text
                    style={{
                      fontSize: 24,
                      color: colors.accent,
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>

              {!isCompleted && (
                <CompleteChapterButton
                  chapterNumber={chapter.id}
                  onComplete={() => handleChapterComplete(chapter.id)}
                  isCompleted={isCompleted}
                  glowColor="#D4AF37"
                  disabled={!isNext && completedChapters.size > 0}
                />
              )}

              {isCompleted && isNext && (
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.secondary,
                    fontStyle: "italic",
                    marginTop: 8,
                  }}
                >
                  Ready for the next chapter
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default {
  BasicCompleteChapterExample,
  ChapterEndScreenExample,
  MultiChapterProgressExample,
};
