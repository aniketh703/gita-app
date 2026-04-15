# Bhagavad Gita Reading App (v1)

An offline-first, multilingual React Native + Expo mobile application for reading the Bhagavad Gita on Android devices.

## Features (v1)

- **18 Chapters** with 597 verses
- **3 Languages**: English, Hindi, Sanskrit original
- **Offline-First**: All content bundled, no internet required
- **Dark Mode**: Light and dark theme support
- **Adjustable Typography**: Font size control (12-24px)
- **Transliteration Toggle**: Show/hide Latin script transliteration
- **Clean UI**: Distraction-free reading experience
- **Persistent Settings**: Preferences saved to device storage

## Tech Stack

- **Framework**: React Native (Expo Managed Workflow)
- **Language**: TypeScript
- **Navigation**: Expo Router with bottom tabs
- **State Management**: React Context API
- **Storage**: AsyncStorage (offline persistence)
- **Data Format**: JSON (bundled as assets)

## Project Structure

```
gita-app/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout with AppProvider
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   └── _layout.tsx          # Tabs configuration
│   ├── chapters.tsx             # Chapters list screen
│   ├── reading.tsx              # Verse reading screen
│   └── settings.tsx             # Settings/preferences screen
├── src/
│   ├── context/
│   │   └── AppContext.tsx       # Global app state (language, theme, font size)
│   ├── types.ts                 # TypeScript interfaces and types
│   ├── utils/
│   │   └── gitaData.ts          # Data loading and manipulation utilities
│   └── constants.ts             # App constants (fonts, colors, etc.)
├── assets/
│   └── data.json                # Bundled Gita data (18 chapters, 597 verses)
├── package.json
├── tsconfig.json
└── app.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android SDK (for Android development) or Expo Go app on Android device

### Installation

1. Navigate to project:

   ```bash
   cd gita-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Using Expo Go (Recommended for Testing)

```bash
npm start
```

Then:

- Press `a` for Android
- Scan QR code with Expo Go app on your Android device

#### Building for Android

```bash
expo build:android
```

Or use EAS Build:

```bash
npm install -g eas-cli
eas build --platform android
```

## Screens

### Home Screen

- Welcome message with app statistics
- Quick link to start reading
- Brief app description

### Chapters Screen

- List of all 18 chapters
- Chapter titles in selected language
- Verse count per chapter
- Direct access to first verse of each chapter

### Reading Screen

- Sanskrit original text (always visible)
- Transliteration (toggleable)
- Translation in selected language
- Optional commentary
- Previous/Next verse navigation
- Chapter and verse reference display

### Settings Screen

- **Language Selection**: English, हिन्दी (Hindi), संस्कृत (Sanskrit)
- **Dark Mode**: Enable/disable dark theme
- **Font Size**: Adjust text size (12-24px)
- **Transliteration**: Show/hide Latin script

## Data Structure

Gita content bundled in `assets/data.json`:

```json
{
  "chapter": 1,
  "verse_count": 47,
  "name": {
    "english": "Arjuna Vishada Yoga",
    "hindi": "अर्जुन विषाद योग",
    "sanskrit": "अर्जुन विषाद योग"
  },
  "verses": [
    {
      "verse": 1,
      "sanskrit": "धर्मक्षेत्रे कुरुक्षेत्रे...",
      "transliteration": "dharmakshetre kurukshetre...",
      "translations": {
        "english": "Dhritarashtra said...",
        "hindi": "...",
        "sanskrit": "..."
      },
      "commentary": { ... }
    }
  ]
}
```

## Navigation Structure

- **Home** (`/`) - Home screen with welcome and statistics
- **Chapters** (`/chapters`) - Browse all chapters
- **Reading List** (`/reading?ch=1`) - Read verses in a chapter
- **Verse Detail** (`/verse?ch=1&verse=1`) - Read an individual verse
- **Settings** (`/settings`) - Manage preferences

## AppContext Usage

State is managed via React Context in `src/context/AppContext.tsx`:

```typescript
const { language, setLanguage, theme, setTheme, fontSize, setFontSize } =
  useApp();
```

All settings are persisted to AsyncStorage automatically.

## Data Utilities

Functions in `src/utils/gitaData.ts`:

- `getGitaData()` - Get all chapters
- `getChapters()` - Get chapter summaries
- `getChapter(num)` - Get specific chapter with verses
- `getVerse(ch, v)` - Get individual verse
- `getNextVerse(ch, v)` - Navigate to next verse
- `getPreviousVerse(ch, v)` - Navigate to previous verse

## Development

### Adding Language Support

1. Update `LangKey` type in `src/types.ts`
2. Add translations to JSON data
3. Update UI label strings in screens
4. Add language option to settings

### Updating Content

1. Modify source CSV in parent directory
2. Run converter script
3. Replace `assets/data.json` with output

## Offline Capabilities

✓ All 18 chapters (597 verses) bundled  
✓ No backend API calls  
✓ No authentication required  
✓ Settings persist locally via AsyncStorage  
✓ Zero network dependency after app install

## Constraints (v1)

- Android only
- No audio/chanting
- No user accounts
- No cloud sync
- No sharing features
- No bookmarks/favorites
- No daily reading plans

These features are planned for future releases.

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)

---

**Version**: 1.0.0  
**Status**: Beta (Ready for Testing)  
**Target Platform**: Android

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
