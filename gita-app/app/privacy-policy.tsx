/**
 * Privacy Policy Screen
 * Displays the privacy policy for the Bhagavad Gita App
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import { ROUTES } from "@/src/navigation/routes";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const { colors } = useAppTheme();
  const prefs = usePreferencesState();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.section,
            paddingTop: insets.top + 12,
            paddingBottom: 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {prefs.language === "english" ? "Privacy Policy" : "गोपनीयता नीति"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.lastUpdated, { color: colors.secondary }]}>
          {prefs.language === "english"
            ? "Last updated: March 2026"
            : "अंतिम अपडेट: मार्च 2026"}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "1. Information We Collect"
              : "1. हम जो जानकारी एकत्र करते हैं"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "This app operates primarily offline. We collect minimal information, including:\n\n• Your reading preferences (language, theme, font size)\n• Reading progress and bookmarks\n• Device-specific settings\n\nAll data is stored locally on your device and is not transmitted to external servers."
              : "यह ऐप मुख्य रूप से ऑफ़लाइन काम करता है। हम न्यूनतम जानकारी एकत्र करते हैं, जिसमें शामिल है:\n\n• आपकी पढ़ने की प्राथमिकताएं (भाषा, थीम, फ़ॉन्ट आकार)\n• पढ़ने की प्रगति और बुकमार्क\n• डिवाइस-विशिष्ट सेटिंग्स\n\nसभी डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत है और बाहरी सर्वर पर नहीं भेजा जाता है।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "2. Data Storage"
              : "2. डेटा स्टोरेज"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "All your personal data including reading progress, bookmarks, and preferences are stored locally on your device using secure storage mechanisms. We do not sync or backup your data to cloud servers without your explicit consent."
              : "आपकी व्यक्तिगत डेटा सहित पढ़ने की प्रगति, बुकमार्क और प्राथमिकताएं सुरक्षित स्टोरेज तंत्र का उपयोग करके आपके डिवाइस पर स्थानीय रूप से संग्रहीत है। हम आपकी स्पष्ट सहमति के बिना आपके डेटा को क्लाउड सर्वर में सिंक या बैकअप नहीं करते।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "3. Permissions" : "3. अनुमतियाँ"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "This app requests the following permissions:\n\n• Haptic Feedback: For vibration feedback during interactions\n• Clipboard: To allow copying verses\n• Sharing: To share verses with other apps\n\nThese permissions are only used when you explicitly request these actions."
              : "यह ऐप निम्नलिखित अनुमतियों का अनुरोध करता है:\n\n• हैप्टिक फीडबैक: इंटरैक्शन के दौरान कंपन फीडबैक के लिए\n• क्लिपबोर्ड: श्लोक कॉपी करने की अनुमति देने के लिए\n• साझा करना: अन्य ऐप्स के साथ श्लोक साझा करने के लिए\n\nये अनुमतियाँ केवल तब उपयोग की जाती हैं जब आप स्पष्ट रूप से इन कार्यों का अनुरोध करते हैं।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "4. Security" : "4. सुरक्षा"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "We implement industry-standard security measures to protect your data. Your data is encrypted and stored securely on your device. Since the app operates offline, your personal information is not exposed to network-based vulnerabilities."
              : "हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों को लागू करते हैं। आपका डेटा एन्क्रिप्ट किया गया है और आपके डिवाइस पर सुरक्षित रूप से संग्रहीत है। चूंकि ऐप ऑफ़लाइन काम करता है, आपकी व्यक्तिगत जानकारी नेटवर्क-आधारित कमजोरियों के संपर्क में नहीं आती है।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "5. Changes to This Policy"
              : "5. इस नीति में परिवर्तन"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "We may update this Privacy Policy from time to time. We will notify you of any changes by updating the 'Last updated' date above."
              : "हम इस गोपनीयता नीति को समय-समय पर अपडेट कर सकते हैं। हम ऊपर 'अंतिम अपडेट' की तारीख को अपडेट करके आपको किसी भी परिवर्तन की सूचना देंगे।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "6. Contact Us" : "6. संपर्क करें"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "If you have any questions about this Privacy Policy, please contact us at the email address provided in the app settings."
              : "यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न है, तो कृपया ऐप सेटिंग्स में प्रदान किए गए ईमेल पते पर हमसे संपर्क करें।"}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
