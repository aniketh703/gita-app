# Bhagavad Gita Reading App - Complete Setup

All required files are now contained within the `gita-app` folder. This is a complete, self-contained React Native + Expo application for reading the Bhagavad Gita offline.

## 📁 Directory Structure

```
gita-app/
├── app/                              # Expo Router app directory
│   ├── _layout.tsx                   # Root layout
│   ├── (tabs)/                       # Tab-based navigation
│   │   ├── index.tsx                 # Home screen
│   │   ├── chapters.tsx              # Chapters list
│   │   ├── explore.tsx               # Explore screen
│   │   └── _layout.tsx               # Tabs config
│   ├── reading.tsx                   # Verse reading screen
│   ├── settings.tsx                  # Settings screen
│   └── modal.tsx                     # Modal screens
│
├── src/                              # Source code
│   ├── context/                      # React Context (global state)
│   ├── types.ts                      # TypeScript types
│   ├── constants/                    # App constants
│   ├── utils/                        # Utility functions
│   ├── data/                         # Data access layer
│   └── navigation/                   # Navigation setup
│
├── assets/                           # App assets
│   ├── data.json                     # ⭐ PRIMARY APP DATA (all verses)
│   └── images/                       # App images
│
├── data/                             # Data management
│   ├── chapters/                     # Individual chapter files (ch-01.json - ch-18.json)
│   │   └── chapter-01.json through chapter-18.json
│   └── input/                        # Source data files
│       └── bhagavad_gita_verses.csv  # CSV source data
│
├── scripts/                          # ⭐ Utility scripts
│   ├── consolidate-chapters.js       # Merge chapters into assets/data.json
│   ├── generate-gita-chapters.js     # Generate chapters from CSV/JSON/API
│   ├── convert-csv-simple.js         # CSV to JSON converter
│   ├── normalize-gita-data.js        # Data normalizer
│   ├── reset-project.js              # Reset to clean state
│   └── README.md                     # Scripts documentation
│
├── components/                       # React Native components
│   ├── verse-card.tsx                # Verse display component
│   ├── themed-text.tsx               # Themed text components
│   ├── ThemedView.tsx                # Themed container
│   ├── devanagari-text.tsx           # Devanagari script support
│   └── ui/                           # UI components
│
├── __tests__/                        # Test files
│   ├── gita-data.test.js             # Data validation tests
│   └── preferences.test.ts           # Preference tests
│
├── package.json                      # ⭐ Project dependencies and scripts
├── tsconfig.json                     # TypeScript config
├── jest.config.js                    # Jest test config
├── eslint.config.js                  # ESLint config
├── expo-env.d.ts                     # Expo type definitions
└── app.json                          # Expo app configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- (Optional) Android SDK or Expo Go app on Android device

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Then:
# Press 'a' for Android
# Scan QR code with Expo Go app on your Android device
# Or use Android emulator
```

### Available Commands

```bash
# Development
npm start                      # Start Expo dev server
npm run android               # Build for Android
npm run ios                   # Build for iOS
npm run web                   # Build for web
npm run lint                  # Run ESLint

# Data Management
npm run consolidate-data      # Merge chapters → assets/data.json
npm run generate-chapters     # Generate chapters from API
npm run generate-chapters:csv # Generate chapters from CSV source
npm run generate-chapters:json# Generate chapters from JSON source

# Testing
npm test                      # Run tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
npm run data-quality-report  # Generate data quality report
```

## 📊 Data Information

**Total Content:**
- 18 Chapters
- 719 Verses (Shlokas)
- 3 Languages: English, Hindi, Sanskrit
- Multiple translations: Transliteration, meanings

**Data Sources:**
- Sanskrit text and transliteration
- English translations (Swami Prabhupada)
- Hindi translations (Devanagari)
- Raw CSV backup: `data/input/bhagavad_gita_verses.csv`

**App Data File:**
- `assets/data.json` - Used by the app (automatically generated)
- Size: ~2.5 MB
- Format: JSON array of 18 chapter objects
- Bundled offline: No internet required

## 🛠️ Data Pipeline

If you need to regenerate app data from scratch:

```bash
# 1. Generate chapters from CSV source
npm run generate-chapters:csv

# 2. Consolidate into single data file
npm run consolidate-data
```

See `scripts/README.md` for detailed information about data management scripts.

## 📚 App Features

✅ **Offline-First:** All data bundled, no internet required
✅ **Multilingual:** English, Hindi, Sanskrit with Devanagari support
✅ **Dark Mode:** Light and dark theme support
✅ **Adjustable Typography:** Font size control (12-24px)
✅ **Transliteration:** Toggle Latin script transliteration
✅ **Persistent Settings:** Preferences saved to device
✅ **Fast Navigation:** Tab-based interface with smooth transitions
✅ **Clean UI:** Distraction-free reading experience

## 🔧 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based routing)
- **State Management:** React Context API
- **Storage:** AsyncStorage
- **Data Format:** JSON
- **Testing:** Jest
- **Linting:** ESLint

## 📱 Screen Structure

1. **Home Screen** - App intro and statistics
2. **Chapters Screen** - List of all 18 chapters
3. **Reading Screen** - Full verse display with translations
4. **Settings Screen** - App preferences (theme, language, font size)
5. **Explore Screen** - Additional features (future)

## 💾 Settings & Preferences

The app saves these preferences locally:
- Selected language (English/Hindi)
- Theme preference (Light/Dark/Auto)
- Font size (12-24px)
- Current reading position
- Custom bookmarks (future feature)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- gita-data.test.js
```

## 📝 Development Notes

### Adding a New Feature
1. Create component in `components/` or `src/`
2. Add navigation route in `app/` if needed
3. Update context in `src/context/` if state needed
4. Add tests in `__tests__/`
5. Update types in `src/types.ts`

### Modifying Verses
1. Edit chapter JSON files in `data/chapters/`
2. Run `npm run consolidate-data`
3. App automatically loads updated data on restart

### Updating Translations
1. Edit `translations` field in chapter files
2. Ensure both `english` and `hindi` fields are present
3. Run `npm run consolidate-data`

## 🐛 Troubleshooting

**App won't start:**
- Clear Expo cache: `expo start --clear`
- Reinstall dependencies: `npm install`

**Data not showing:**
- Verify `assets/data.json` exists and is valid JSON
- Run `npm run consolidate-data` to regenerate
- Check console for errors: `npm start` and check terminal

**Build issues:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start --clear`

## 📦 Building for Production

### Android APK
```bash
npm install -g eas-cli
eas build --platform android
```

### For Standalone App
1. Create Expo account at expo.dev
2. Log in: `expo login`
3. Build: `eas build --platform android`
4. Download APK and test on real device

## 📄 File Management

- **Source code:** Version control (git)
- **Data files:** Can be regenerated from scripts
- **Assets:** Bundled with app
- **No requirements:** External APIs, network, subscriptions

## 🤝 Contributing

When adding new content:
1. Ensure JSON schema validity
2. Run tests: `npm test`
3. Check data quality: `npm run data-quality-report`
4. Consolidate data: `npm run consolidate-data`

## 📖 Documentation

- App structure: See directory layout above
- Scripts: See `scripts/README.md`
- API Reference: See `app/API_REFERENCE.md`
- Preferences: See `PREFERENCES_IMPLEMENTATION.md`
- Type definitions: See `src/types.ts`

## ✅ Checklist for Running

- ✅ Node.js 18+ installed
- ✅ Dependencies installed: `npm install`
- ✅ All data files present in `data/chapters/`
- ✅ `assets/data.json` generated and valid
- ✅ Run `npm start` to launch
- ✅ All required files in `gita-app/` folder

## 🎯 Project Status

**Version:** 1.0.0 (Stable)
**Status:** ✅ Complete and functional
**Data Completeness:** 100% (719/719 verses)
**Platform Support:** Android (primary), iOS, Web

---

**Note:** This app is completely self-contained. All files needed to run and develop are within this `gita-app` folder. No external resources or dependencies are required for the app to function.
