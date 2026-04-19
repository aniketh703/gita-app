## 2024-04-19 - Secure External URL Handling
**Vulnerability:** External links were opened without enforcing HTTPS, potentially exposing users to Man-In-The-Middle (MITM) attacks if HTTP links were clicked or navigated to.
**Learning:** Found two places (`SettingsScreen.tsx` and `external-link.tsx`) using `Linking.openURL` and `openBrowserAsync` without checking for HTTP. React Native and Expo do not auto-upgrade links by default in all environments.
**Prevention:** All external link triggers should parse and upgrade `http://` to `https://` prior to invocation to ensure secure data transit.
