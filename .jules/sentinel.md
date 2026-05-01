## 2024-04-21 - [Enforce HTTPS for External Links]
**Vulnerability:** Use of potentially unencrypted `http://` URLs when opening external browser pages or deep linking, which could lead to Man-In-The-Middle (MITM) attacks where data is intercepted or manipulated.
**Learning:** Found two locations (`external-link.tsx` with `expo-web-browser` and `SettingsScreen.tsx` with `Linking.openURL`) where arbitrary or potentially dynamic URLs were not explicitly verified as secure (`https://`). React Native components often just execute what they are given.
**Prevention:** Always enforce HTTPS for external links by verifying/replacing the protocol before passing the URL to system APIs like `openBrowserAsync` or `Linking.openURL`.

## 2024-04-23 - [Prevent ReDoS in String Interpolation]
**Vulnerability:** Dynamically constructing regular expressions using `new RegExp(placeholder, "g")` in `interpolateTemplate` (`notificationService.ts`) with unsanitized keys from a dictionary can lead to Regular Expression Denial of Service (ReDoS) or regex injection if a key contains special regex characters.
**Learning:** React Native's JS environments (Hermes/V8) support modern ECMAScript features. Passing unescaped, dynamic input directly to `RegExp` constructors is a risky pattern.
**Prevention:** Use `String.prototype.replaceAll(searchString, replaceValue)` for straightforward string literal replacement instead of constructing regular expressions dynamically. It treats the search term strictly as a literal string.

## 2025-02-23 - [Prevent Memory Exhaustion and DoS via TextInput Length Limits]
**Vulnerability:** React Native `TextInput` components lacked explicit `maxLength` restrictions. This allowed unbounded input, leading to potential memory exhaustion, UI freezing, localized Denial of Service (DoS) risks, and `AsyncStorage` storage quota limit exhaustion.
**Learning:** React Native's `TextInput` does not inherently limit input length. When saving to unbounded storage mechanisms like `AsyncStorage` or passing to computationally intensive operations like filtering large lists (Search), missing length validations expose the app to performance and stability issues.
**Prevention:** Always explicitly define a reasonable `maxLength` property on all `TextInput` components (e.g., 100 characters for search inputs, 5000 characters for journal entries) to enforce bounds strictly at the UI layer.
