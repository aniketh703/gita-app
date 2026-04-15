import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreferences, usePreferencesState } from '@/src/context/PreferencesContext';
import { FONT_SIZE_RANGE } from '@/src/types/preferences';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toast, useToast } from '@/components/ui/toast';
import { triggerLightHaptic } from '@/src/utils/haptics';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsScreen() {
  const prefs = usePreferencesState();
  const { setLanguage, setTheme, setFontSize, setToggle, resetPreferences } = usePreferences();
  const systemTheme = useColorScheme();
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const { toast, showToast, hideToast } = useToast();

  const isDark =
    prefs.theme === 'auto'
      ? systemTheme === 'dark'
      : prefs.theme === 'dark';

  const sliderColors = useMemo(
    () => ({
      accent: isDark ? '#d4a574' : '#8B4513',
      track: isDark ? '#333333' : '#eeeeee',
      thumbOff: isDark ? '#aaaaaa' : '#666666',
    }),
    [isDark]
  );

  const settingsTitle = prefs.language === 'english' ? 'Settings' : 'सेटिंग';
  const aboutTitle = prefs.language === 'english' ? 'About' : 'बारे में';
  const languageLabel = prefs.language === 'english' ? 'Language' : 'भाषा';
  const themeLabel = prefs.language === 'english' ? 'Theme' : 'थीम';
  const fontSizeLabel = prefs.language === 'english' ? 'Font Size' : 'फॉन्ट आकार';
  const featuresLabel = prefs.language === 'english' ? 'Features' : 'विशेषताएं';
  const resetLabel = prefs.language === 'english' ? 'Reset Settings' : 'सेटिंग्स रीसेट करें';

  const featureItems = [
    {
      key: 'showTransliteration',
      label:
        prefs.language === 'english'
          ? 'Show Transliteration'
          : 'ट्रांसलिटरेशन दिखाएं',
      hint: prefs.language === 'english'
        ? 'Display romanized Sanskrit text'
        : 'रोमनीकृत संस्कृत पाठ प्रदर्शित करें',
    },
    {
      key: 'showDevanagari',
      label:
        prefs.language === 'english'
          ? 'Show Devanagari'
          : 'देवनागरी दिखाएं',
      hint: prefs.language === 'english'
        ? 'Display text in Devanagari script'
        : 'देवनागरी लिपि में पाठ प्रदर्शित करें',
    },
    {
      key: 'enableHaptics',
      label:
        prefs.language === 'english'
          ? 'Enable Haptics'
          : 'हैप्टिक्स सक्षम करें',
      hint: prefs.language === 'english'
        ? 'Vibration feedback for interactions'
        : 'इंटरैक्शन के लिए कंपन फीडबैक',
    },
    {
      key: 'showCommentary',
      label:
        prefs.language === 'english'
          ? 'Show Commentary'
          : 'व्याख्या दिखाएं',
      hint: prefs.language === 'english'
        ? 'Display verse explanations'
        : 'श्लोक व्याख्या प्रदर्शित करें',
    },
    {
      key: 'expandAllVerses',
      label:
        prefs.language === 'english'
          ? 'Expand All Verses'
          : 'सभी श्लोक विस्तारित करें',
      hint: prefs.language === 'english'
        ? 'Show full text for all verses'
        : 'सभी श्लोकों के लिए पूर्ण पाठ दिखाएं',
    },
    {
      key: 'autoPlayAudio',
      label:
        prefs.language === 'english'
          ? 'Auto-play Audio'
          : 'स्वचालित रूप से ऑडियो चलाएं',
      hint: prefs.language === 'english'
        ? 'Automatically play verse pronunciation'
        : 'श्लोक उच्चारण स्वचालित रूप से चलाएं',
    },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-gita-bg dark:bg-gita-dark-bg">
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
        >
          {settingsTitle}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-6 bg-gita-card dark:bg-gita-dark-card border-gita-border dark:border-gita-dark-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gita-secondary dark:text-gita-dark-secondary">
              {languageLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              value={prefs.language}
              onValueChange={(value) => {
                if (value) {
                  setLanguage(value as 'english' | 'hindi');
                  triggerLightHaptic(prefs.toggles.enableHaptics);
                }
              }}
              className="w-full gap-2"
            >
              <ToggleGroupItem
                value="english"
                aria-label="Select English"
                className="flex-1"
                isFirst
              >
                <Text className="text-sm font-semibold">English</Text>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="hindi"
                aria-label="Select Hindi"
                className="flex-1"
                isLast
              >
                <Text className="text-sm font-semibold">हिन्दी</Text>
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gita-card dark:bg-gita-dark-card border-gita-border dark:border-gita-dark-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gita-secondary dark:text-gita-dark-secondary">
              {themeLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              value={prefs.theme}
              onValueChange={(value) => {
                if (value) {
                  setTheme(value as 'light' | 'dark' | 'auto');
                  triggerLightHaptic(prefs.toggles.enableHaptics);
                }
              }}
              className="w-full gap-2"
            >
              <ToggleGroupItem
                value="light"
                aria-label="Light theme"
                className="flex-1"
                isFirst
              >
                <Text className="text-sm font-semibold">☀️ Light</Text>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dark"
                aria-label="Dark theme"
                className="flex-1"
              >
                <Text className="text-sm font-semibold">🌙 Dark</Text>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="auto"
                aria-label="Auto theme"
                className="flex-1"
                isLast
              >
                <Text className="text-sm font-semibold">Auto</Text>
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gita-card dark:bg-gita-dark-card border-gita-border dark:border-gita-dark-border">
          <CardHeader className="pb-2">
            <View className="flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gita-secondary dark:text-gita-dark-secondary">
                {fontSizeLabel}
              </CardTitle>
              <Text className="text-xs font-semibold text-gita-accent dark:text-gita-dark-accent">
                {prefs.fontSize}px
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            <Slider
              style={{ height: 36 }}
              minimumValue={FONT_SIZE_RANGE.MIN}
              maximumValue={FONT_SIZE_RANGE.MAX}
              step={FONT_SIZE_RANGE.STEP}
              value={prefs.fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor={sliderColors.accent}
              maximumTrackTintColor={sliderColors.track}
              thumbTintColor={sliderColors.accent}
            />
            <View className="flex-row items-center justify-between pt-3">
              <Text className="text-xs font-medium text-gita-secondary dark:text-gita-dark-secondary">
                Small
              </Text>
              <Text
                className="font-semibold text-gita-text dark:text-gita-dark-text"
                style={{ fontSize: prefs.fontSize }}
              >
                Preview
              </Text>
              <Text className="text-xs font-medium text-gita-secondary dark:text-gita-dark-secondary">
                Large
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gita-card dark:bg-gita-dark-card border-gita-border dark:border-gita-dark-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gita-secondary dark:text-gita-dark-secondary">
              {featuresLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-0">
            {featureItems.map((item, index) => {
              const isLast = index === featureItems.length - 1;
              const isEnabled = prefs.toggles[item.key];
              return (
                <View
                  key={item.key}
                  accessible={true}
                  accessibilityRole="switch"
                  accessibilityLabel={item.label}
                  accessibilityHint={item.hint}
                  accessibilityState={{ checked: isEnabled }}
                  className={`flex-row items-center justify-between py-3 ${
                    isLast ? '' : 'border-b border-gita-border dark:border-gita-dark-border'
                  }`}
                  style={{ minHeight: 52 }}
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-gita-text dark:text-gita-dark-text">
                      {item.label}
                    </Text>
                    <Text className="text-xs text-gita-secondary dark:text-gita-dark-secondary mt-1">
                      {item.hint}
                    </Text>
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={(val) => {
                      setToggle(item.key, val);
                      triggerLightHaptic(
                        item.key === 'enableHaptics' ? val : prefs.toggles.enableHaptics
                      );
                    }}
                    trackColor={{
                      false: sliderColors.track,
                      true: sliderColors.accent,
                    }}
                    thumbColor={
                      isEnabled
                        ? '#ffffff'
                        : sliderColors.thumbOff
                    }
                    accessibilityLabel={item.label}
                  />
                </View>
              );
            })}
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gita-card dark:bg-gita-dark-card border-gita-border dark:border-gita-dark-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gita-secondary dark:text-gita-dark-secondary">
              {aboutTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-sm font-semibold text-gita-text dark:text-gita-dark-text">
              {prefs.language === 'english'
                ? 'Bhagavad Gita Reader v1.0'
                : 'भगवद्गीता रीडर v1.0'}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-gita-secondary dark:text-gita-dark-secondary">
              {prefs.language === 'english'
                ? 'Offline-first, bilingual reading experience. All content is available without internet connection.'
                : 'ऑफ़लाइन-पहले, द्विभाषी पढ़ने का अनुभव। सभी सामग्री इंटरनेट कनेक्शन के बिना उपलब्ध है।'}
            </Text>
          </CardContent>
        </Card>

        {/* Reset Settings with Alert Dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogTrigger asChild>
            <Button
              onPress={() => setShowResetDialog(true)}
              className="rounded-lg bg-red-600 dark:bg-red-700"
            >
              <Text className="font-semibold text-white">{resetLabel}</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {prefs.language === 'english'
                  ? 'Reset Settings?'
                  : 'सेटिंग्स रीसेट करें?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {prefs.language === 'english'
                  ? 'This will reset all settings to their default values. This action cannot be undone.'
                  : 'यह सभी सेटिंग्स को उनके डिफ़ॉल्ट मानों पर रीसेट कर देगा। इस कार्रवाई को पूर्ववत नहीं किया जा सकता।'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>
                  {prefs.language === 'english' ? 'Cancel' : 'रद्द करें'}
                </Text>
              </AlertDialogCancel>
              <AlertDialogAction
                onPress={async () => {
                  await resetPreferences();
                  setShowResetDialog(false);
                  showToast(
                    prefs.language === 'english'
                      ? 'Settings reset successfully ✨'
                      : 'सेटिंग्स सफलतापूर्वक रीसेट की गईं ✨',
                    'success'
                  );
                }}
              >
                <Text>
                  {prefs.language === 'english' ? 'Reset' : 'रीसेट करें'}
                </Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollView>
    </SafeAreaView>
  );
}

