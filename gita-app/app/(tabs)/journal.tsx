import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useApp } from "@/src/context/AppContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type JournalEntry = {
  id: string;
  date: string;
  reflection: string;
  verseRef?: string;
};

const JOURNAL_STORAGE_KEY = "@gita_journal_entries";

export default function JournalScreen() {
  const { colors } = useAppTheme();
  const { language } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newReflection, setNewReflection] = useState("");

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  const saveEntry = async () => {
    if (!newReflection.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      reflection: newReflection.trim(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    try {
      await AsyncStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(updatedEntries),
      );
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    }

    setNewReflection("");
    setIsModalVisible(false);
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);

    try {
      await AsyncStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(updatedEntries),
      );
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(language === "english" ? "en-US" : "hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header with Add Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
          }}
        >
          {language === "english" ? "Reflections" : "विचार"}
        </Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={{
            backgroundColor: colors.accent,
            width: 44,
            height: 44,
            borderRadius: radius.full,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Journal Entries */}
      {entries.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          <MaterialIcons name="book" size={64} color={colors.border} />
          <Text
            style={{
              marginTop: spacing.md,
              fontSize: fontSize.md,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            {language === "english"
              ? "Start journaling your spiritual insights and reflections"
              : "अपने आध्यात्मिक विचारों को लिखना शुरू करें"}
          </Text>
          <Button
            onPress={() => setIsModalVisible(true)}
            style={{ marginTop: spacing.lg }}
          >
            <Text
              style={{
                color: colors.background,
                fontWeight: fontWeight.semibold,
              }}
            >
              {language === "english"
                ? "Write First Reflection"
                : "पहला विचार लिखें"}
            </Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingTop: spacing.lg,
            gap: spacing.md,
          }}
        >
          {entries.map((item) => (
            <Card
              key={item.id}
              style={{
                backgroundColor: colors.verseBox,
                borderColor: colors.border,
              }}
            >
              <CardContent style={{ padding: spacing.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Text
                    style={{ fontSize: fontSize.xs, color: colors.secondary }}
                  >
                    {formatDate(item.date)}
                  </Text>
                  <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                    <MaterialIcons
                      name="close"
                      size={20}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.text,
                    lineHeight: fontSize.sm * 1.5,
                  }}
                >
                  {item.reflection}
                </Text>
              </CardContent>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Add Reflection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.bg,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xl + spacing.xs,
              minHeight: "50%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.bold,
                  color: colors.text,
                }}
              >
                {language === "english" ? "New Reflection" : "नया विचार"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newReflection}
              onChangeText={setNewReflection}
              placeholder={
                language === "english"
                  ? "What wisdom resonates with you today?"
                  : "आज कौन सी बुद्धि आपके साथ प्रतिध्वनित होती है?"
              }
              placeholderTextColor={colors.secondary}
              multiline
              numberOfLines={8}
              maxLength={5000}
              textAlignVertical="top"
              style={{
                backgroundColor: colors.verseBox,
                borderRadius: radius.md,
                padding: spacing.md,
                fontSize: fontSize.md,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 200,
                marginBottom: spacing.md,
              }}
            />

            <Button
              onPress={saveEntry}
              disabled={!newReflection.trim()}
              style={{
                opacity: !newReflection.trim() ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: fontWeight.semibold,
                }}
              >
                {language === "english" ? "Save Reflection" : "सहेजें"}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
