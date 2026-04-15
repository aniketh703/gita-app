/**
 * Progress Dashboard Component
 * Displays reading statistics, chapter completion, and streaks
 * For integration in settings or explore screens
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { useChapterCompletion } from "@/hooks/use-chapter-completion";
import type { LangKey } from "@/src/types";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Card, CardContent } from "./ui/card";
import { ProgressIndicator } from "./ui/progress-indicator";
import { Text } from "./ui/text";

interface ProgressDashboardProps {
  language?: LangKey;
  onChapterPress?: (chapterNumber: number) => void;
}

export function ProgressDashboard({
  language = "english",
  onChapterPress,
}: ProgressDashboardProps) {
  const { colors } = useAppTheme();
  const { completedChapters, completionProgress, completionStreak, isLoading } =
    useChapterCompletion();

  const totalChapters = 18;
  const completedCount = completedChapters.size;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: colors.secondary }}>Loading progress...</Text>
      </View>
    );
  }

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
      {/* Header */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {language === "english" ? "Your Progress" : "आपकी प्रगति"}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: colors.secondary,
          marginBottom: 24,
        }}
      >
        {language === "english"
          ? "Track your journey through the Bhagavad Gita"
          : "भगवद गीता के माध्यम से अपनी यात्रा को ट्रैक करें"}
      </Text>

      {/* Overall Progress Card */}
      <Card
        style={{
          backgroundColor: colors.verseBox,
          borderColor: colors.border,
          marginBottom: 16,
        }}
      >
        <CardContent className="pt-6">
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              {language === "english" ? "Overall Completion" : "कुल पूर्णता"}
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: colors.accent,
              }}
            >
              {completionProgress}%
            </Text>
          </View>

          <ProgressIndicator
            current={completedCount}
            total={totalChapters}
            color={colors.accent}
            height={8}
            showPercentage={false}
          />

          <Text
            style={{
              fontSize: 13,
              color: colors.secondary,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {completedCount} of {totalChapters}{" "}
            {language === "english" ? "chapters completed" : "अध्याय पूर्ण"}
          </Text>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {/* Completed Chapters */}
        <Card
          style={{
            flex: 1,
            backgroundColor: colors.section,
            borderColor: colors.border,
          }}
        >
          <CardContent className="pt-4">
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: colors.accent,
                textAlign: "center",
              }}
            >
              {completedCount}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {language === "english" ? "Completed" : "पूर्ण"}
            </Text>
          </CardContent>
        </Card>

        {/* Remaining Chapters */}
        <Card
          style={{
            flex: 1,
            backgroundColor: colors.section,
            borderColor: colors.border,
          }}
        >
          <CardContent className="pt-4">
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              {totalChapters - completedCount}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {language === "english" ? "Remaining" : "शेष"}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Streak Card (if applicable) */}
      {completionStreak > 0 && (
        <Card
          style={{
            backgroundColor: colors.verseBox,
            borderColor: colors.accent,
            borderLeftWidth: 4,
            marginBottom: 24,
          }}
        >
          <CardContent className="pt-4">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 32 }}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {completionStreak}{" "}
                  {language === "english" ? "Day Streak" : "दिन की लकीर"}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.secondary,
                    marginTop: 2,
                  }}
                >
                  {language === "english"
                    ? "Keep up the momentum!"
                    : "गति बनाए रखें!"}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Chapter List */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        {language === "english" ? "Chapters" : "अध्याय"}
      </Text>

      <View style={{ gap: 12 }}>
        {Array.from({ length: totalChapters }, (_, i) => i + 1).map(
          (chapterNumber) => {
            const isCompleted = completedChapters.has(chapterNumber);

            return (
              <Pressable
                key={chapterNumber}
                onPress={() => onChapterPress?.(chapterNumber)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Card
                  style={{
                    backgroundColor: isCompleted
                      ? colors.section
                      : colors.verseBox,
                    borderColor: colors.border,
                  }}
                >
                  <CardContent className="pt-4">
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: isCompleted
                              ? colors.accent
                              : colors.border,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: isCompleted ? "#ffffff" : colors.text,
                            }}
                          >
                            {chapterNumber}
                          </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: colors.text,
                            }}
                          >
                            {language === "english"
                              ? `Chapter ${chapterNumber}`
                              : `अध्याय ${chapterNumber}`}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.secondary,
                              marginTop: 2,
                            }}
                          >
                            {isCompleted
                              ? language === "english"
                                ? "Completed"
                                : "पूर्ण"
                              : language === "english"
                                ? "Not started"
                                : "शुरू नहीं हुआ"}
                          </Text>
                        </View>
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
                  </CardContent>
                </Card>
              </Pressable>
            );
          },
        )}
      </View>

      {/* Completion Message */}
      {completedCount === totalChapters && (
        <Card
          style={{
            backgroundColor: colors.verseBox,
            borderColor: colors.accent,
            borderWidth: 2,
            marginTop: 24,
            marginBottom: 20,
          }}
        >
          <CardContent className="pt-6">
            <Text
              style={{
                fontSize: 48,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              🎉
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {language === "english" ? "Congratulations!" : "बधाई हो!"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {language === "english"
                ? "You have completed all 18 chapters of the Bhagavad Gita!"
                : "आपने भगवद गीता के सभी 18 अध्याय पूरे कर लिए हैं!"}
            </Text>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}
