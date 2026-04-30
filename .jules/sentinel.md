## 2024-04-21 - [Enforce HTTPS for External Links]
**Vulnerability:** Use of potentially unencrypted `http://` URLs when opening external browser pages or deep linking, which could lead to Man-In-The-Middle (MITM) attacks where data is intercepted or manipulated.
**Learning:** Found two locations (`external-link.tsx` with `expo-web-browser` and `SettingsScreen.tsx` with `Linking.openURL`) where arbitrary or potentially dynamic URLs were not explicitly verified as secure (`https://`). React Native components often just execute what they are given.
**Prevention:** Always enforce HTTPS for external links by verifying/replacing the protocol before passing the URL to system APIs like `openBrowserAsync` or `Linking.openURL`.

## 2024-04-23 - [Prevent ReDoS in String Interpolation]
**Vulnerability:** Dynamically constructing regular expressions using `new RegExp(placeholder, "g")` in `interpolateTemplate` (`notificationService.ts`) with unsanitized keys from a dictionary can lead to Regular Expression Denial of Service (ReDoS) or regex injection if a key contains special regex characters.
**Learning:** React Native's JS environments (Hermes/V8) support modern ECMAScript features. Passing unescaped, dynamic input directly to `RegExp` constructors is a risky pattern.
**Prevention:** Use `String.prototype.replaceAll(searchString, replaceValue)` for straightforward string literal replacement instead of constructing regular expressions dynamically. It treats the search term strictly as a literal string.

## 2024-04-30 - [Prevent UI Freezing and Storage Exhaustion via TextInput maxLength]
**Vulnerability:** React Native `TextInput` components without a `maxLength` property allow users to paste or type an unlimited amount of text. In extreme cases, excessively large inputs can freeze the app UI due to memory exhaustion or exceed storage quotas when saved to local storage (e.g. `AsyncStorage` for journal reflections).
**Learning:** Found several TextInputs (`journal.tsx` and `search.tsx`) missing any length constraint, potentially opening the app to local Denial of Service (DoS).
**Prevention:** Always set an appropriate `maxLength` for any user-facing `TextInput` based on the context (e.g. 5000 characters for long journal entries, 100 characters for search queries) to cap memory and storage usage.
