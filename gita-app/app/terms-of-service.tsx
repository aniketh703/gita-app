/**
 * Terms of Service Screen
 * Displays the terms of service for the Bhagavad Gita App
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

export default function TermsOfServiceScreen() {
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
          {prefs.language === "english" ? "Terms of Service" : "सेवा की शर्तें"}
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
              ? "1. Acceptance of Terms"
              : "1. शर्तों की स्वीकृति"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "By using this app, you agree to be bound by these terms and conditions. If you do not agree to abide by the above, please do not use this service."
              : "इस ऐप का उपयोग करके, आप इन शर्तों और शर्तों से बंधे होने के लिए सहमत हैं। यदि आप उपरोक्त का पालन करने के लिए सहमत नहीं हैं, तो कृपया इस सेवा का उपयोग न करें।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "2. Use License"
              : "2. उपयोग लाइसेंस"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "Permission is granted to temporarily download one copy of the materials (information or software) on the Bhagavad Gita App for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n\n• Modify or copy the materials\n• Use the materials for any commercial purpose\n• Attempt to decompile or reverse engineer any software\n• Remove any copyright or other proprietary notations\n• Transfer the materials to another person or 'mirror' the materials on any other server"
              : "भगवद्गीता ऐप पर सामग्री (जानकारी या सॉफ़्टवेयर) की एक प्रति को व्यक्तिगत, गैर-वाणिज्यिक अस्थायी देखने के लिए अस्थायी रूप से डाउनलोड करने की अनुमति दी गई है। यह शीर्षक का एक हस्तांतरण नहीं है, और इस लाइसेंस के तहत आप नहीं कर सकते:\n\n• सामग्री को संशोधित या कॉपी करें\n• सामग्री का किसी भी वाणिज्यिक उद्देश्य के लिए उपयोग करें\n• किसी भी सॉफ़्टवेयर को विघटित या रिवर्स इंजीनियर करने का प्रयास करें\n• कोई भी कॉपीराइट या अन्य स्वामित्व संकेत हटाएँ\n• सामग्री को किसी अन्य व्यक्ति को स्थानांतरित करें या किसी अन्य सर्वर पर सामग्री को 'मिरर' करें"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "3. Disclaimer" : "3. अस्वीकरण"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "The materials on the Bhagavad Gita App are provided on an 'as is' basis. The app makes no representations or warranties, express or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
              : "भगवद्गीता ऐप पर सामग्री 'जैसी है' के आधार पर प्रदान की जाती है। ऐप कोई प्रतिनिधित्व या वारंटी नहीं देता है, चाहे वह व्यक्त हो या निहित, और यहां सभी अन्य वारंटियों को अस्वीकार और नकारता है, जिसमें सीमा के बिना, व्यापारिकता की निहित वारंटी या किसी विशेष उद्देश्य के लिए फिटनेस शामिल है।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "4. Limitations" : "4. सीमाएँ"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "In no event shall the Bhagavad Gita App or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the app."
              : "किसी भी परिस्थिति में भगवद्गीता ऐप या इसके आपूर्तिकर्ता किसी भी नुकसान के लिए liable नहीं होंगे (डेटा या लाभ के नुकसान के लिए नुकसान सहित, या व्यावसायिक व्यवधान के कारण) ऐप पर सामग्री के उपयोग या उपयोग करने में असमर्थता के कारण।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "5. Accuracy of Materials"
              : "5. सामग्री की सटीकता"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "The materials appearing on the Bhagavad Gita App could include technical, typographical, or photographic errors. The app does not warrant that any of the materials on its website are accurate, complete, or current."
              : "भगवद्गीता ऐप पर दिखाई देने वाली सामग्री में तकनीकी, टाइपोग्राफिक, या फोटोग्राफिक त्रुटियां हो सकती हैं। ऐप यह वारंटी नहीं देता है कि इसकी वेबसाइट पर कोई भी सामग्री सटीक, पूर्ण, या वर्तमान है।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english" ? "6. Modifications" : "6. संशोधन"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "The app may revise these terms of service for its website at any time without notice. By using this app, you are agreeing to be bound by the then current version of these terms of service."
              : "ऐप किसी भी समय बिना सूचना के अपनी वेबसाइट के लिए सेवा की इन शर्तों को संशोधित कर सकता है। इस ऐप का उपयोग करके, आप सेवा की इन शर्तों के तत्कालीन वर्तमान संस्करण से बंधे होने के लिए सहमत हैं।"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {prefs.language === "english"
              ? "7. Governing Law"
              : "7. प्रशासनिक कानून"}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {prefs.language === "english"
              ? "These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
              : "ये शर्तें भारत के कानूनों द्वारा संचालित होती हैं और उन्हीं के अनुसार बनाई जाती हैं, और आप उस स्थान की अदालतों के एकमात्र अधिकार क्षेत्र को अपरिवर्तनीय रूप से स्वीकार करते हैं।"}
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
