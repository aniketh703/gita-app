# Bhagavad Gita Data Normalizer

A Node.js script that normalizes Bhagavad Gita datasets from multiple sources (CSV, JSON, or Infinity dataset) into a canonical chapter schema with proper formatting and validation.

## Overview

This script provides a robust solution for:
- **Parsing multiple data sources**: CSV, JSON, and the comprehensive Bhagwat-Gita-Infinity dataset
- **Normalizing data** into a canonical schema with consistent structure
- **Merging data from multiple sources** to create enriched, comprehensive outputs
- **Preserving Sanskrit authenticity** with proper character handling and formatting
- **Handling missing translations gracefully** by setting them to `null` instead of placeholder text
- **Generating individual chapter files** (chapter-01.json through chapter-18.json)

## Output Schema

Each chapter file follows the canonical schema:

```json
{
  "chapter": number,
  "verse_count": number,
  "name": {
    "english": string,
    "hindi": string,
    "tamil": string,
    "kannada": string
  },
  "verses": [
    {
      "verse": number,
      "sanskrit": string | null,
      "transliteration": string | null,
      "translations": {
        "english": string | null,
        "hindi": string | null,
        "tamil": string | null,
        "kannada": string | null
      }
    }
  ]
}
```

## Installation

No additional dependencies required! The script uses only Node.js built-ins:
- `fs` - File system operations
- `path` - Path utilities
- `https` - HTTP requests (for optional Sanskrit fetching)

## Usage

### Basic Usage

```bash
# From CSV file
node normalize-gita-data.js --input bhagavad_gita_verses.csv

# From JSON file
node normalize-gita-data.js --input gita-data.json

# From Infinity dataset directory
node normalize-gita-data.js --input ./Bhagwat-Gita-Infinity

# Specify custom output directory
node normalize-gita-data.js --input input.csv --output ./output/chapters
```

### Merging Multiple Sources

Combine data from different sources to enrich the output:

```bash
# CSV + Infinity Dataset (Sanskrit from Infinity, translations from CSV)
node normalize-gita-data.js \
  --input bhagavad_gita_verses.csv \
  --input ./Bhagwat-Gita-Infinity \
  --output gita-app/data/chapters
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--input <path>` ⭐ | Input file or directory (required) | — |
| `--output <dir>` | Output directory for chapter files | `./gita-app/data/chapters` |
| `--source <type>` | Data source type: `csv`, `json`, `infinity` | Auto-detect |
| `--fetch-sanskrit` | Fetch Sanskrit from GitHub if missing | false |
| `--help` | Show usage information | — |

## 📋 Examples

### Example 1: Normalize from CSV

```bash
node normalize-gita-data.js --input bhagavad_gita_verses.csv
```

**Output:**
```
📖 Bhagavad Gita Data Normalizer

Input: bhagavad_gita_verses.csv
Output: gita-app/data/chapters

📂 Processing: bhagavad_gita_verses.csv
   → Detected as CSV file

🔀 Merging sources...
✅ Merge complete

📝 Writing chapter files...

✨ Normalization Complete!

✅ Succeeded: 18 chapters
   Chapter 1: 35 verses
   Chapter 2: 71 verses
   ...
```

### Example 2: Enrich CSV with Infinity Dataset

```bash
node normalize-gita-data.js \
  --input bhagavad_gita_verses.csv \
  --input gita-app/Bhagwat-Gita-Infinity \
  --output gita-app/data/chapters
```

This process:
1. **First processes** CSV file for translations
2. **Then merges** Infinity dataset which includes Sanskrit and transliteration
3. **Preserves** non-null values from both sources
4. **Creates** enriched output with maximum data

## 🏗️ Supported Data Formats

### CSV Format

```csv
Chapter 1,Arjun Viṣhād Yog,1.1,"Dhritarashtra said: O Sanjay..."
Chapter 1,Arjun Viṣhād Yog,1.2,"Sanjay said: On observing..."
```

**Expected columns:**
1. Chapter number
2. Chapter title
3. Verse reference (e.g., "1.1", "1-1", "chapter_1_slok_1")
4. Translation text

### JSON Format (gita-data.json)

```json
[
  {
    "chapter": 1,
    "verse_count": 47,
    "name": { "english": "...", "hindi": "...", ... },
    "verses": [
      {
        "verse": 1,
        "sanskrit": "...",
        "transliteration": "...",
        "translations": { "english": "...", "hindi": null, ... }
      }
    ]
  }
]
```

### Infinity Dataset Format

Directory structure with:
- `chapter/` - Chapter metadata files
- `slok/` - Individual verse files with Sanskrit, transliteration, and commentaries

Format: `bhagavadgita_chapter_{N}_slok_{V}.json`

## 🎯 Processing Rules

### Data Normalization
✅ **Preserved exactly:**
- Sanskrit text (Devanagari script)
- Original character encoding
- Formatting and line breaks

✅ **Trimmed:**
- Leading/trailing whitespace
- Extra spaces

✅ **Validated:**
- Verse numbers converted to integers
- Ch apters constrained to 1-18 range
- Invalid entries skipped with warnings

✅ **Missing data:**
- Set to `null` (not placeholder strings)
- Allows apps to handle missing content gracefully

### Merging Strategy
When combining multiple sources:
1. **Initialize** empty structure for all 18 chapters
2. **Process sources in order**
3. **Merge non-null values** (later sources override earlier in specified order)
4. **Preserve** all translations and metadata

## 📊 Output Statistics

The script generates:
- **18 chapter files** (chapter-01.json through chapter-18.json)
- **710 verses** total (747 with Infinity dataset, accounting for verse numbers)
- **Multilingual metadata** (English, Hindi, Tamil, Kannada)
- **UTF-8 encoded** with proper Devanagari support

## 🔍 Verse Numbering

The script handles various verse number formats:
- `1.1` → verse 1
- `1-1` → verse 1
- `chapter_1_slok_1` → verse 1
- Range references like `1.4 – 1.6` → extracted as verse 4

**Note:** Some verses may be grouped in source data (e.g., verses 4-6 treated as single entry) but normalized individually.

## 🛠️ Advanced Use Cases

### Adding Sanskrit from External Sources

Uncomment the `--fetch-sanskrit` option and provide API integration:

```javascript
// In script: Enable fetching from GitHub repository
// async function fetchSanskritFromGitHub(chapter, verse) { ... }
```

Source: [vedicscriptures/gita](https://github.com/vedicscriptures/gita)

### Custom Output Directory Structure

```bash
# Store in project assets
node normalize-gita-data.js \
  --input bhagavad_gita_verses.csv \
  --output ./gita-app/assets/data/chapters
```

### Integrating with React Native

Reference the output directory in your app:

```typescript
// In your app
import chapters from '../data/chapters/chapter-01.json';

type Chapter = typeof chapters;
type Verse = Chapter['verses'][0];
```

## 🧹 Data Quality Notes

### Current Data Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Sanskrit | ✅ Complete | From Infinity dataset |
| Transliteration (IAST) | ✅ Complete | From Infinity dataset |
| English translations | ✅ Complete | From Swami Sivananda |
| Hindi translations | ⚠️ Partial | From some commentaries |
| Tamil translations | ❌ Missing | Not in current sources |
| Kannada translations | ❌ Missing | Not in current sources |

### Missing Translation Strategy

Rather than placeholder text like `"[Tamil translation needed]"`, the script sets missing translations to `null`. This allows your app to:
- Show a graceful UI message
- Hide the translation section
- Track which content is truly available
- Migrate data when translations become available later

## 🔗 Data Sources Used

1. **bhagavad_gita_verses.csv** - Swami Sivananda's English translations
2. **Bhagwat-Gita-Infinity Dataset** - Comprehensive Sanskrit and multiple commentaries
3. [GitHub: vedicscriptures/gita](https://github.com/vedicscriptures/gita) - Public domain Sanskrit

## 📝 Example Output File

See `gita-app/data/chapters/chapter-01.json` for a complete normalized output.

## 🤝 Contributing

To improve this normalizer:

1. **Add new data sources** by implementing a `parse*` function
2. **Enhance existing parsers** for better data extraction
3. **Add translation sources** for Tamil, Kannada, and other languages
4. **Report data quality issues** for specific verses

## 📄 License

This script processes public domain and openly licensed Bhagavad Gita data. Always respect the licenses of your data sources.

## Troubleshooting

### "Unknown file type" Error

Ensure input file has correct extension (.csv or .json), or specify `--source`:

```bash
node normalize-gita-data.js --input data.txt --source csv
```

### Missing Verses

Check that source data includes all expected verses. Run with verbose output to identify gaps.

### Character Encoding Issues

Ensure files are UTF-8 encoded:
```bash
file -i input.csv  # Check encoding on Linux/Mac
```

---

**Version:** 1.0  
**Last Updated:** February 2026
