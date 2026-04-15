import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { ROUTES } from "@/src/navigation/routes";

export default function ModalScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const prefs = usePreferencesState();
  const params = useLocalSearchParams<{ title?: string; content?: string }>();
  const title =
    typeof params.title === "string" && params.title.length > 0
      ? params.title
      : "This is a modal";
  const content =
    typeof params.content === "string" && params.content.length > 0
      ? params.content
      : "Additional information appears here.";

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
        }}
      >
        <Card
          style={{
            backgroundColor: colors.verseBox,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
            gap: spacing.md,
          }}
        >
          <View style={{ alignItems: "center", gap: spacing.sm }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${colors.accent}22`,
              }}
            >
              <MaterialIcons
                name="info-outline"
                size={24}
                color={colors.accent}
              />
            </View>
            <Text
              style={{
                fontSize: fontSize.xl,
                fontWeight: fontWeight.bold,
                lineHeight: 24,
                color: colors.text,
                textAlign: "center",
              }}
            >
              {title}
            </Text>
          </View>

          <Text
            style={{
              color: colors.secondary,
              fontSize: fontSize.md,
              lineHeight: 24,
              fontWeight: fontWeight.regular,
              textAlign: "center",
            }}
          >
            {content}
          </Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            <Button
              onPress={() => router.dismissTo("/")}
              style={{
                minHeight: 52,
                borderRadius: radius.lg,
                backgroundColor: colors.accent,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: fontWeight.semibold }}>
                {prefs.language === "english" ? "Go to Home" : "होम पर जाएं"}
              </Text>
            </Button>

            <TouchableOpacity
              onPress={handleClose}
              style={{
                minHeight: 48,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                }}
              >
                {prefs.language === "english" ? "Close" : "बंद करें"}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
