# Bhagavad Gita Chapter Generator

This script fetches Bhagavad Gita data from free public sources, normalizes it to the canonical schema, and generates individual chapter JSON files.

## Features

✅ **Multiple Data Sources**
- Free public APIs (no authentication needed)
- Local CSV files
- Local JSON files
- Fallback sources if primary fails

✅ **Schema Normalization**
- Preserves Sanskrit text exactly
- Trims all whitespace
- Ensures verse numbers are integers
- Sets missing translations to `null` (not placeholders)
- Handles commentary fields (optional)

✅ **Robust Processing**
- Validates all data before output
- Handles missing or malformed fields gracefully
- Supports multiple field naming conventions
- Automatic error recovery

✅ **Output Structure**
```
gita-app/data/chapters/
├── chapter-01.json
├── chapter-02.json
├── ...
└── chapter-18.json
```

## Installation

No additional npm packages required! Uses only Node.js built-in modules:
- `fs` (file system)
- `path` (path utilities)
- `https`/`http` (network requests)

## Usage

### Option 1: Fetch from Free Public API (Recommended)

```bash
cd "path/to/gita app"
node generate-gita-chapters.js
```

This uses the **Bhagavad Gita API** (free, no registration):
- Primary: `api.bhagavadgitaapi.in`
- Fallback: `bhagavad-gita-api.herokuapp.com`

Expected output:
```
🚀 Bhagavad Gita Chapter Generator

📡 Fetching from Bhagavad Gita API...
  Chapter 1/18... ✅ (35 verses)
  Chapter 2/18... ✅ (71 verses)
  ...
  Chapter 18/18... ✅ (78 verses)

📝 Writing chapter files to gita-app/data/chapters...
   ✅ chapter-01.json
   ✅ chapter-02.json
   ...
   ✅ chapter-18.json

============================================================
✅ Complete! Generated 18/18 chapter files
📍 Location: C:\Users\Ani\OneDrive\Desktop\gita app\gita-app\data\chapters
============================================================
```

### Option 2: Load from Local CSV File

```bash
node generate-gita-chapters.js --source csv --input bhagavad_gita_verses.csv
```

**CSV Format Requirements:**
```csv
chapter,verse,sanskrit,transliteration,english,hindi,tamil,kannada
1,1,"Sanskrit text","transliteration","English translation","Hindi","Tamil","Kannada"
1,2,...
```

Field names are case-insensitive and support variants:
- `verse`, `verseNumber`, `verse_number`
- `sanskrit`, `text`, `sa`
- `transliteration`, `translit`, `iast`
- `english`, `english_translation`, `english_text`
- `hindi`, `hindi_translation`, etc.

### Option 3: Load from Local JSON File

```bash
node generate-gita-chapters.js --source json --input gita-data.json
```

**JSON Format Requirements:**
```json
[
  {
    "chapter": 1,
    "name": "Chapter Name (English)",
    "verses": [
      {
        "verse": 1,
        "sanskrit": "Sanskrit text",
        "transliteration": "Romanized text",
        "translations": {
          "english": "English translation",
          "hindi": "Hindi translation",
          "tamil": "Tamil translation",
          "kannada": "Kannada translation"
        },
        "commentary": { ... } // optional
      }
    ]
  }
]
```

## Output Schema

Each generated `chapter-XX.json` file contains:

```typescript
{
  "chapter": number,                    // 1-18
  "verse_count": number,                // Total verses in chapter
  "name": {
    "english": string | null,           // Chapter name in English
    "hindi": string | null,             // Chapter name in Hindi
    "tamil": string | null,             // Chapter name in Tamil
    "kannada": string | null            // Chapter name in Kannada
  },
  "verses": [
    {
      "verse": number,                  // Verse number (1-71 typical)
      "sanskrit": string | null,        // Original Sanskrit (Devanagari)
      "transliteration": string | null, // IAST romanization
      "translations": {
        "english": string | null,
        "hindi": string | null,
        "tamil": string | null,
        "kannada": string | null
      },
      "commentary": { ... }             // Optional commentary field
    }
  ]
}
```

## Data Quality & Normalization Rules

### ✅ What Gets Normalized

| Issue | Handling |
|-------|----------|
| Extra whitespace | Trimmed to single spaces |
| Empty strings | Converted to `null` |
| Placeholder text | `[text needed]`, `[translation needed]` → `null` |
| Verse numbers | Parsed as integers or `null` if invalid |
| Missing fields | Set to `null` (not omitted) |

### ✅ What Gets Preserved

- **Sanskrit text** - Exact character preservation (UTF-8 Devanagari)
- **Transliteration** - IAST standard maintained
- **Translations** - Original formatting and capitalization
- **Language content** - Exactly as provided by source

### 🔄 Type Conversions

```javascript
"1" → 1           // Verse numbers converted to integers
"  text  " → "text"  // Whitespace trimmed
"[text needed]" → null  // Placeholders removed
{ english: "text" } → { english: "text", hindi: null, ... }  // Normalized to 4-language object
```

## API Endpoints Used

### Primary: Bhagavad Gita API (api.bhagavadgitaapi.in)

Free, fast, comprehensive:
- Sanskrit text ✅
- Transliteration (IAST) ✅
- English translation ✅
- Multiple other languages ✅
- No authentication required
- No rate limiting known

Documentation: https://bhagavadgitaapi.in/

### Fallback: bhagavad-gita-api.herokuapp.com

Community-maintained, reliable alternative:
- Verse data with translations
- Used as fallback if primary fails
- No authentication required

## Error Handling

The script handles various failure scenarios:

```
⚠️ Chapter 5/18 Failed: HTTP 404        → Continues with other chapters
❌ API fetch failed: timeout              → Tries fallback API
❌ CSV load failed: ENOENT                → Exits with error (file doesn't exist)
⚠️ Chapter 3, Verse 15: Invalid verse number → Logged but processing continues
```

## Performance

- **API Fetch**: ~10-30 seconds (depends on network)
- **CSV Parse**: <100ms
- **JSON Parse**: <100ms
- **File Writing**: ~500ms
- **Total**: Usually 15-40 seconds for full 18 chapters

## Troubleshooting

### Issue: "HTTP 429: Too Many Requests"
**Solution**: Wait 5 minutes and retry. The free APIs have rate limits.

### Issue: "Failed to parse JSON from {url}"
**Solution**: Primary API may be down. Script automatically tries fallback.

### Issue: "CSV file must have header and at least one data row"
**Solution**: Ensure CSV file has proper format with headers on first line.

### Issue: "Cannot find module" errors
**Solution**: Script uses only built-in Node.js modules. No npm install needed. Ensure Node.js v12+ is installed.

### Issue: Blank chapters or missing verses
**Solution**: 
1. Try with `--source api` to verify expected data
2. Check if CSV/JSON has chapters 1-18
3. Verify verse numbers are valid integers

## Adding to package.json

Add this script to your `gita-app/package.json`:

```json
{
  "scripts": {
    "generate-chapters": "node ../generate-gita-chapters.js",
    "generate-chapters:csv": "node ../generate-gita-chapters.js --source csv --input ../bhagavad_gita_verses.csv",
    "generate-chapters:json": "node ../generate-gita-chapters.js --source json --input ../gita.json"
  }
}
```

Then run with:
```bash
npm run generate-chapters              # Fetch from API
npm run generate-chapters:csv          # Load from CSV (existing file)
npm run generate-chapters:json         # Load from JSON (if available)
```

## Development & Customization

### Modify API Endpoints
Edit the `API_ENDPOINTS` object in the script to use different sources:

```javascript
const API_ENDPOINTS = {
  chapters: 'https://your-api.com/chapters',
  verses: (chapterNum) => `https://your-api.com/chapters/${chapterNum}/verses`,
};
```

### Add More Languages
1. Update `LANGUAGE_KEYS` constant
2. Update `LocalizableText` interface in `types.ts`
3. Adjust normalization in `createLocalizable()` function

### Change Output Directory
Edit the `OUTPUT_DIR` constant:

```javascript
const OUTPUT_DIR = path.join(__dirname, 'custom', 'output', 'path');
```

## License & Attribution

- **Data Sources**: Free public APIs (no copyright restrictions)
- **Script**: Available for use in this project
- **Bhagavad Gita**: Public domain spiritual text

## References

- Bhagavad Gita API: https://bhagavadgitaapi.in/
- Vedic Scriptures (GitHub): https://github.com/vedicscriptures/gita
- RFC 3629 UTF-8 spec: Text encoding format used

---

**Last Updated**: February 7, 2026
**Script Version**: 1.0
**Compatible with**: Node.js v12+
