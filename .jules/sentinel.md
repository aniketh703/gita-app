## 2025-05-18 - [Enforce HTTPS for external links]
**Vulnerability:** External URLs passed to `openBrowserAsync` and `Linking.openURL` were not explicitly enforcing HTTPS, potentially exposing users to Man-In-The-Middle (MITM) attacks if HTTP URLs were used.
**Learning:** Explicitly validate and upgrade `http://` links to `https://` before opening external URLs in React Native/Expo apps to prevent unencrypted data transmission.
**Prevention:** Always sanitize and enforce HTTPS protocols when navigating to external websites or deep links using `expo-web-browser` or `Linking`.
