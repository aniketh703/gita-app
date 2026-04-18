import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    FormLabel,
    FormRow,
    FormSection,
} from "@/src/components/FormPrimitives";
import NotificationSettingsSection from "@/src/components/NotificationSettingsSection";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import {
    usePreferences,
    usePreferencesState,
} from "@/src/context/PreferencesContext";
import { ROUTES } from "@/src/navigation/routes";
import { FONT_SIZE_RANGE } from "@/src/types/preferences";
import { getTotalVerses } from "@/src/utils/gitaData";
import { triggerLightHaptic } from "@/src/utils/haptics";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SettingsNavigation = {
  goBack?: () => void;
  navigate?: (
    routeName: string,
    params?: { title?: string; content?: string },
  ) => void;
};

export default function SettingsScreen({
  navigation,
}: { navigation?: SettingsNavigation } = {}) {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const legalConfig =
    (
      Constants.expoConfig?.extra as
        | {
            legal?: {
              privacyPolicyUrl?: string;
              termsUrl?: string;
            };
          }
        | undefined
    )?.legal ?? {};

  // Use PreferencesContext for all preference state
  const prefs = usePreferencesState();
  const { setLanguage, setTheme, setFontSize, setToggle, resetPreferences } =
    usePreferences();
  const totalVerses = getTotalVerses();

  const navigateToLegal = React.useCallback(
    async (
      page: "/privacy-policy" | "/terms-of-service",
      externalUrl?: string,
    ) => {
      triggerLightHaptic(prefs.toggles.enableHaptics);
      if (externalUrl) {
        // Enforce HTTPS to prevent MITM attacks
        const secureUrl = externalUrl.startsWith('http://')
          ? externalUrl.replace(/^http:\/\//i, 'https://')
          : externalUrl;

        const canOpen = await Linking.canOpenURL(secureUrl);
        if (canOpen) {
          await Linking.openURL(secureUrl);
          return;
        }
      }
      router.push(page);
    },
    [router, prefs.toggles.enableHaptics],
  );

  const handleBack = React.useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  }, [navigation, router]);

  const handleSupporterPreview = React.useCallback(() => {
    const modalPayload = {
      title: "Supporter Preview",
      content:
        "In-app purchases are disabled in this build. Supporter features are currently in preview.",
    };

    if (navigation?.navigate) {
      navigation.navigate("Modal", modalPayload);
      return;
    }

    router.push({
      pathname: "/modal",
      params: modalPayload,
    });
  }, [navigation, router]);

  React.useEffect(() => {
    // English-only launch path: migrate existing Hindi preference silently.
    if (prefs.language === "hindi") {
      setLanguage("english");
    }
  }, [prefs.language, setLanguage]);

  // Localized labels
  const labels = React.useMemo(
    () => ({
      settingsTitle: prefs.language === "english" ? "Settings" : "सेटिंग",
      appearanceSection: prefs.language === "english" ? "Appearance" : "दिखावट",
      readingSection: prefs.language === "english" ? "Reading" : "पढ़ना",
      contentSection:
        prefs.language === "english" ? "Content Display" : "सामग्री प्रदर्शन",
      audioSection: prefs.language === "english" ? "Audio & Playback" : "ऑडियो",
      interactionSection:
        prefs.language === "english" ? "Interaction" : "इंटरैक्शन",
      languageLabel: prefs.language === "english" ? "Language" : "भाषा",
      themeLabel: prefs.language === "english" ? "Theme" : "थीम",
      fontSizeLabel: prefs.language === "english" ? "Font Size" : "फॉन्ट आकार",
      resetLabel:
        prefs.language === "english" ? "Reset Settings" : "सेटिंग्स रीसेट करें",
      english: prefs.language === "english" ? "English" : "अंग्रेज़ी",
      hindi: prefs.language === "english" ? "Hindi" : "हिन्दी",
      light: prefs.language === "english" ? "Light" : "लाइट",
      sepia: prefs.language === "english" ? "Sepia" : "सेपिया",
      dark: prefs.language === "english" ? "Dark" : "डार्क",
      auto: prefs.language === "english" ? "Auto" : "ऑटो",
    }),
    [prefs.language],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader title="Settings" onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.lg,
          paddingTop: spacing.xs,
        }}
      >
        <FormSection title={labels.appearanceSection}>
          {/* Theme Selection */}
          <View
            style={{ paddingHorizontal: spacing.sm, paddingTop: spacing.xs }}
          >
            <FormLabel>{labels.themeLabel}</FormLabel>
            <View style={styles.chips}>
              {(["light", "sepia", "dark", "auto"] as const).map(
                (themeOption) => (
                  <TouchableOpacity
                    key={themeOption}
                    onPress={() => {
                      setTheme(themeOption);
                      triggerLightHaptic(prefs.toggles.enableHaptics);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          prefs.theme === themeOption
                            ? colors.accent
                            : isDark
                              ? colors.verseBox
                              : colors.section,
                        borderColor:
                          prefs.theme === themeOption
                            ? colors.accent
                            : colors.border,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={
                        themeOption === "light"
                          ? "light-mode"
                          : themeOption === "dark"
                            ? "dark-mode"
                            : themeOption === "sepia"
                              ? "wb-sunny"
                              : "brightness-auto"
                      }
                      size={16}
                      color={
                        prefs.theme === themeOption ? colors.bg : colors.text
                      }
                      style={{ marginRight: spacing.xs / 2 }}
                    />
                    <Text
                      style={{
                        color:
                          prefs.theme === themeOption ? colors.bg : colors.text,
                        fontWeight: "600",
                        fontSize: fontSize.xs,
                      }}
                    >
                      {labels[themeOption]}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          {/* Font Size Slider */}
          <SliderRow
            colors={colors}
            label={labels.fontSizeLabel}
            value={prefs.fontSize}
            min={FONT_SIZE_RANGE.MIN}
            max={FONT_SIZE_RANGE.MAX}
            step={FONT_SIZE_RANGE.STEP}
            onChange={(v) => {
              setFontSize(v);
              triggerLightHaptic(prefs.toggles.enableHaptics);
            }}
            suffix="px"
          />
        </FormSection>

        <FormSection title={labels.languageLabel}>
          <View style={styles.chips}>
            {(["english"] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => {
                  setLanguage(lang);
                  triggerLightHaptic(prefs.toggles.enableHaptics);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      prefs.language === lang
                        ? colors.accent
                        : isDark
                          ? colors.verseBox
                          : colors.section,
                    borderColor:
                      prefs.language === lang ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: prefs.language === lang ? colors.bg : colors.text,
                    fontWeight: "600",
                  }}
                >
                  {labels[lang]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            style={[
              styles.hint,
              { color: colors.secondary, paddingHorizontal: spacing.sm },
            ]}
          >
            Hindi will be re-enabled in a future update.
          </Text>
        </FormSection>

        {/* Content Display Section */}
        <FormSection title={labels.contentSection}>
          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Show Devanagari"
                  : "देवनागरी दिखाएं"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Display text in Devanagari script"
                  : "देवनागरी लिपि में पाठ प्रदर्शित करें"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.showDevanagari}
              onValueChange={(val) => {
                setToggle("showDevanagari", val);
                triggerLightHaptic(prefs.toggles.enableHaptics);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.showDevanagari ? colors.bg : colors.secondary
              }
            />
          </FormRow>

          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Show Transliteration"
                  : "ट्रांसलिटरेशन दिखाएं"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Display romanized Sanskrit text"
                  : "रोमनीकृत संस्कृत पाठ प्रदर्शित करें"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.showTransliteration}
              onValueChange={(val) => {
                setToggle("showTransliteration", val);
                triggerLightHaptic(prefs.toggles.enableHaptics);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.showTransliteration ? colors.bg : colors.secondary
              }
            />
          </FormRow>

          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Show Commentary"
                  : "व्याख्या दिखाएं"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Display verse explanations"
                  : "श्लोक व्याख्या प्रदर्शित करें"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.showCommentary}
              onValueChange={(val) => {
                setToggle("showCommentary", val);
                triggerLightHaptic(prefs.toggles.enableHaptics);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.showCommentary ? colors.bg : colors.secondary
              }
            />
          </FormRow>
        </FormSection>

        {/* Audio & Interaction Section
        <FormSection title={labels.audioSection}>
          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Auto-play Audio"
                  : "स्वचालित रूप से ऑडियो चलाएं"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Automatically play verse pronunciation"
                  : "श्लोक उच्चारण स्वचालित रूप से चलाएं"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.autoPlayAudio}
              onValueChange={(val) => {
                setToggle("autoPlayAudio", val);
                triggerLightHaptic(prefs.toggles.enableHaptics);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.autoPlayAudio ? colors.bg : colors.secondary
              }
            />
          </FormRow>
        </FormSection> */}

        <FormSection title={labels.interactionSection}>
          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Enable Haptics"
                  : "हैप्टिक्स सक्षम करें"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Vibration feedback for interactions"
                  : "इंटरैक्शन के लिए कंपन फीडबैक"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.enableHaptics}
              onValueChange={(val) => {
                setToggle("enableHaptics", val);
                triggerLightHaptic(val);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.enableHaptics ? colors.bg : colors.secondary
              }
            />
          </FormRow>

          <FormRow>
            <View style={{ flex: 1 }}>
              <FormLabel>
                {prefs.language === "english"
                  ? "Expand All Verses"
                  : "सभी श्लोक विस्तारित करें"}
              </FormLabel>
              <Text style={[styles.hint, { color: colors.secondary }]}>
                {prefs.language === "english"
                  ? "Show full text for all verses"
                  : "सभी श्लोकों के लिए पूर्ण पाठ दिखाएं"}
              </Text>
            </View>
            <Switch
              value={prefs.toggles.expandAllVerses}
              onValueChange={(val) => {
                setToggle("expandAllVerses", val);
                triggerLightHaptic(prefs.toggles.enableHaptics);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                prefs.toggles.expandAllVerses ? colors.bg : colors.secondary
              }
            />
          </FormRow>
        </FormSection>

        {/* Notification Settings */}
        <NotificationSettingsSection />

        <FormSection title="Supporter Preview">
          <TouchableOpacity
            onPress={handleSupporterPreview}
            style={[
              styles.paywallCard,
              {
                backgroundColor: colors.section,
                borderColor: colors.accent,
              },
            ]}
          >
            <View>
              <Text style={[styles.paywallTitle, { color: colors.accent }]}>
                Supporter features preview
              </Text>
              <Text style={[styles.paywallSub, { color: colors.secondary }]}>
                Purchases are disabled in this build.
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={colors.accent}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.hint,
              { color: colors.secondary, paddingHorizontal: spacing.sm },
            ]}
          >
            Billing will be enabled in a future release.
          </Text>
        </FormSection>

        <FormSection title="Legal">
          <TouchableOpacity
            style={[styles.legalRow, { borderBottomColor: colors.border }]}
            onPress={() =>
              navigateToLegal("/privacy-policy", legalConfig.privacyPolicyUrl)
            }
          >
            <FormLabel>Privacy Policy</FormLabel>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              navigateToLegal("/terms-of-service", legalConfig.termsUrl)
            }
          >
            <FormLabel>Terms of Service</FormLabel>
          </TouchableOpacity>
        </FormSection>

        <FormSection title="About & Sources">
          <FormRow>
            <FormLabel>App Version</FormLabel>
            <Text style={[styles.value, { color: colors.secondary }]}>
              v{appVersion}
            </Text>
          </FormRow>

          <View style={[styles.infoBlock, { borderTopColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Data: Bhagavad Gita (18 chapters, {totalVerses} verses).
            </Text>
            <Text style={[styles.infoText, { color: colors.secondary }]}>
              Includes Sanskrit text, transliteration, and English/Hindi
              translations in app data.
            </Text>
            <Text style={[styles.infoText, { color: colors.secondary }]}>
              Some commentary attribution notes are preserved exactly as
              provided in the source dataset.
            </Text>
          </View>
        </FormSection>

        {/* Reset Settings */}
        <View style={{ marginTop: spacing.lg }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                prefs.language === "english"
                  ? "Reset Settings"
                  : "सेटिंग्स रीसेट करें",
                prefs.language === "english"
                  ? "Are you sure you want to reset all settings to default values?"
                  : "क्या आप सभी सेटिंग्स को डिफ़ॉल्ट मानों पर रीसेट करना चाहते हैं?",
                [
                  {
                    text: prefs.language === "english" ? "Cancel" : "रद्द करें",
                    style: "cancel",
                  },
                  {
                    text: prefs.language === "english" ? "Reset" : "रीसेट करें",
                    style: "destructive",
                    onPress: () => {
                      resetPreferences();
                      triggerLightHaptic(true);
                    },
                  },
                ],
              );
            }}
            style={[
              styles.resetButton,
              {
                backgroundColor: isDark ? colors.verseBox : colors.section,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons name="refresh" size={20} color={colors.accent} />
            <Text style={[styles.resetText, { color: colors.accent }]}>
              {labels.resetLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SliderRow({
  colors,
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "x",
}: {
  colors: ReturnType<typeof useAppTheme>["colors"];
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <View style={[styles.sliderWrap, { borderBottomColor: colors.border }]}>
      <View style={styles.rowTop}>
        <FormLabel>{label}</FormLabel>
        <Text style={[styles.value, { color: colors.secondary }]}>
          {Math.round(value)}
          {suffix}
        </Text>
      </View>
      <Slider
        style={{ width: "100%", height: 34 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.accent}
        onValueChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pill: {
    minWidth: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  chips: {
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.sm,
    flexWrap: "wrap",
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  sliderWrap: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: { fontSize: fontSize.xs + 1, fontWeight: fontWeight.bold },
  hint: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs / 2,
    lineHeight: 16,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  resetText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  paywallCard: {
    margin: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paywallTitle: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.md,
    marginBottom: spacing.xs / 2,
  },
  paywallSub: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    maxWidth: 240,
  },
  legalRow: {
    minHeight: 52,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  readinessBanner: {
    margin: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  readinessText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    flex: 1,
    lineHeight: 16,
  },
  infoBlock: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    gap: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
});
