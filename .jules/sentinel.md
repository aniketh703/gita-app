## 2024-04-21 - [Enforce HTTPS for External Links]
**Vulnerability:** Use of potentially unencrypted `http://` URLs when opening external browser pages or deep linking, which could lead to Man-In-The-Middle (MITM) attacks where data is intercepted or manipulated.
**Learning:** Found two locations (`external-link.tsx` with `expo-web-browser` and `SettingsScreen.tsx` with `Linking.openURL`) where arbitrary or potentially dynamic URLs were not explicitly verified as secure (`https://`). React Native components often just execute what they are given.
**Prevention:** Always enforce HTTPS for external links by verifying/replacing the protocol before passing the URL to system APIs like `openBrowserAsync` or `Linking.openURL`.

## 2024-04-23 - [Prevent ReDoS in String Interpolation]
**Vulnerability:** Dynamically constructing regular expressions using `new RegExp(placeholder, "g")` in `interpolateTemplate` (`notificationService.ts`) with unsanitized keys from a dictionary can lead to Regular Expression Denial of Service (ReDoS) or regex injection if a key contains special regex characters.
**Learning:** React Native's JS environments (Hermes/V8) support modern ECMAScript features. Passing unescaped, dynamic input directly to `RegExp` constructors is a risky pattern.
**Prevention:** Use `String.prototype.replaceAll(searchString, replaceValue)` for straightforward string literal replacement instead of constructing regular expressions dynamically. It treats the search term strictly as a literal string.

## 2026-05-03 - [Missing maxLength on React Native TextInputs]
**Vulnerability:** React Native `TextInput` components were lacking a `maxLength` property.
**Learning:** This exposes the app to localized Denial of Service (DoS) risks, memory exhaustion, UI freezing, and storage quota issues, especially when user inputs (like journal entries or search queries) are stored locally in AsyncStorage. A maliciously large input pasted into the text box could crash the app or fill the storage.
**Prevention:** Always define explicit `maxLength` boundaries on `TextInput` components to enforce input length limits directly at the UI layer.
