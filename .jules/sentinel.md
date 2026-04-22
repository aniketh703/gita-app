## 2024-04-21 - [Enforce HTTPS for External Links]
**Vulnerability:** Use of potentially unencrypted `http://` URLs when opening external browser pages or deep linking, which could lead to Man-In-The-Middle (MITM) attacks where data is intercepted or manipulated.
**Learning:** Found two locations (`external-link.tsx` with `expo-web-browser` and `SettingsScreen.tsx` with `Linking.openURL`) where arbitrary or potentially dynamic URLs were not explicitly verified as secure (`https://`). React Native components often just execute what they are given.
**Prevention:** Always enforce HTTPS for external links by verifying/replacing the protocol before passing the URL to system APIs like `openBrowserAsync` or `Linking.openURL`.
## 2024-05-18 - [Fix ReDoS Vulnerability in Notification Service]
**Vulnerability:** Regular Expression Denial of Service (ReDoS) vulnerability in `interpolateTemplate` function due to dynamic generation of regular expressions from user inputs (`new RegExp(placeholder, "g")`).
**Learning:** Constructing regular expressions from unescaped dynamic strings allows for regex injection and potentially exponential evaluation times, which could degrade performance or break app logic.
**Prevention:** Use `String.prototype.replaceAll()` with string literals instead of `replace()` with dynamically constructed regular expressions for substituting variables in templates.
