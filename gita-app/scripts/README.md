# Bhagavad Gita App - Scripts Directory

This directory contains all utility scripts for managing Bhagavad Gita data in the app.

## Available Scripts

### 1. `consolidate-chapters.js`
**Purpose:** Consolidates individual chapter JSON files into a single `data.json` file for the app.

**Command:**
```bash
npm run consolidate-data
```

**What it does:**
- Reads all 18 chapter JSON files from `../data/chapters/`
- Validates data structure
- Merges them into a single JSON array
- Writes output to `../assets/data.json`

**When to use:**
- After modifying individual chapter files
- When regenerating chapters from other sources
- As part of the data pipeline

---

### 2. `generate-gita-chapters.js`
**Purpose:** Generates individual chapter JSON files from various data sources (CSV, JSON, or API).

**Commands:**
```bash
# From CSV source
npm run generate-chapters:csv

# From JSON source  
npm run generate-chapters:json

# From API (default)
npm run generate-chapters
```

**Usage Examples:**
```bash
# Generate from built-in CSV file
node ./scripts/generate-gita-chapters.js --source csv --input ./data/input/bhagavad_gita_verses.csv

# Generate from JSON file
node ./scripts/generate-gita-chapters.js --source json --input ./data/gita-data.json

# Generate from API (fetches from online sources)
node ./scripts/generate-gita-chapters.js --source api
```

**What it does:**
- Reads data from specified source
- Normalizes to canonical schema
- Creates individual chapter-*.json files
- Saves to `../data/chapters/`

**Input file format:**
- CSV: Must have columns for chapter, verse, hindi, english, transliteration, etc.
- JSON: Must be an array of chapter objects

---

### 3. `convert-csv-simple.js`
**Purpose:** Simple CSV to JSON converter for basic data transformation.

**Command:**
```bash
node ./scripts/convert-csv-simple.js <input.csv> <output.json>
```

**Use case:** Converting raw CSV data before processing with `generate-gita-chapters.js`

---

### 4. `normalize-gita-data.js`
**Purpose:** Validates and normalizes Gita data to ensure consistent structure.

**Command:**
```bash
node ./scripts/normalize-gita-data.js <input.json> <output.json>
```

**Use case:** Cleaning and standardizing data from various sources

---

## Data Pipeline

The typical workflow for regenerating all data:

```bash
# 1. Convert CSV to JSON (if starting from CSV)
node ./scripts/convert-csv-simple.js ./data/input/bhagavad_gita_verses.csv ./data/gita-temp.json

# 2. Normalize the data
node ./scripts/normalize-gita-data.js ./data/gita-temp.json ./data/gita-data.json

# 3. Generate individual chapters
npm run generate-chapters:json

# 4. Consolidate into single data file
npm run consolidate-data
```

---

## Data Files

### Input Files
- `../data/input/bhagavad_gita_verses.csv` - CSV source data

### Output Files
- `../data/chapters/chapter-01.json` through `../data/chapters/chapter-18.json` - Individual chapters
- `../assets/data.json` - Consolidated data used by the app

---

## Data Schema

Each chapter file follows this structure:

```json
{
  "chapter": 1,
  "verse_count": 48,
  "name": {
    "english": "Chapter Name",
    "hindi": "अध्याय नाम"
  },
  "verses": [
    {
      "verse": 1,
      "sanskrit": "Sanskrit text...",
      "transliteration": "Transliteration...",
      "translations": {
        "english": "English translation...",
        "hindi": "Hindi translation..."
      }
    }
  ]
}
```

---

## Troubleshooting

### Error: "Invalid structure in chapter-*.json"
- Check that all chapter files have `chapter` and `verses` properties
- Verify JSON syntax is valid

### Error: "Expected 18 chapters, found X"
- Ensure all chapter files exist from chapter-01.json to chapter-18.json
- Check that all files are in `../data/chapters/`

### Error: "File not found"
- Verify the input file path is correct
- Use relative paths from the script location

---

## Adding New Verses

If you need to add, modify, or update verses:

1. Edit the individual chapter JSON files in `../data/chapters/`
2. Run `npm run consolidate-data` to regenerate the app data
3. Restart the app to see changes

---

## Dependencies

All scripts use Node.js built-in modules (fs, path, https, http):
- No external npm packages required
- Works offline (except for API source option)

---

## Notes

- The `assets/data.json` file is what the app actually uses
- Individual chapter files are useful for version control and editing
- The consolidation step is required after any changes to chapters
- All scripts validate data before writing output files
