## 2024-04-21 - [Enforce HTTPS for External Links]
**Vulnerability:** Use of potentially unencrypted `http://` URLs when opening external browser pages or deep linking, which could lead to Man-In-The-Middle (MITM) attacks where data is intercepted or manipulated.
**Learning:** Found two locations (`external-link.tsx` with `expo-web-browser` and `SettingsScreen.tsx` with `Linking.openURL`) where arbitrary or potentially dynamic URLs were not explicitly verified as secure (`https://`). React Native components often just execute what they are given.
**Prevention:** Always enforce HTTPS for external links by verifying/replacing the protocol before passing the URL to system APIs like `openBrowserAsync` or `Linking.openURL`.

## 2024-04-23 - [Prevent ReDoS in String Interpolation]
**Vulnerability:** Dynamically constructing regular expressions using `new RegExp(placeholder, "g")` in `interpolateTemplate` (`notificationService.ts`) with unsanitized keys from a dictionary can lead to Regular Expression Denial of Service (ReDoS) or regex injection if a key contains special regex characters.
**Learning:** React Native's JS environments (Hermes/V8) support modern ECMAScript features. Passing unescaped, dynamic input directly to `RegExp` constructors is a risky pattern.
**Prevention:** Use `String.prototype.replaceAll(searchString, replaceValue)` for straightforward string literal replacement instead of constructing regular expressions dynamically. It treats the search term strictly as a literal string.

## 2024-05-05 - [Prevent Localized DoS in Text Inputs]
**Vulnerability:** Missing `maxLength` properties on React Native `TextInput` components (e.g., search fields, journal entries) can allow excessively large inputs, leading to localized Denial of Service (DoS) due to memory exhaustion, UI freezing, or storage quota issues when saved to AsyncStorage.
**Learning:** By default, `TextInput` allows unbound input. Because user input is persisted locally in `AsyncStorage` (like journal entries) and UI states handle large renders, unrestricted sizes pose a stability risk on low-end mobile devices.
**Prevention:** Always define a sensible `maxLength` for text inputs (e.g., 100 characters for search, 5000 characters for journal reflections).
