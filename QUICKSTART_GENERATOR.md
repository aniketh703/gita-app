# Quick Start: Generate Bhagavad Gita Chapters

## 30-Second Quick Start (Recommended)

### Windows
```bash
generate-chapters.bat
```

### macOS / Linux
```bash
chmod +x generate-chapters.sh
./generate-chapters.sh
```

### Node.js (Any OS)
```bash
cd gita-app
npm run generate-chapters
```

**That's it!** ✅ This fetches data from the free Bhagavad Gita API and generates all 18 chapters in 15-40 seconds.

---

## What Happens

```
🚀 Bhagavad Gita Chapter Generator

📡 Fetching from Bhagavad Gita API...
  Chapter 1/18... ✅ (35 verses)
  Chapter 2/18... ✅ (71 verses)
  ... [progress for all 18 chapters]
  Chapter 18/18... ✅ (78 verses)

✔️ Validating chapters...
   ✅ All chapters valid

📝 Writing chapter files to gita-app/data/chapters...
   ✅ chapter-01.json
   ✅ chapter-02.json
   ... [all 18 files]
   ✅ chapter-18.json

============================================================
✅ Complete! Generated 18/18 chapter files
📍 Location: C:\...\gita app\gita-app\data\chapters
============================================================
```

---

## If You Have Local Data

### From CSV File
```bash
# Windows
generate-chapters.bat csv bhagavad_gita_verses.csv

# macOS / Linux
./generate-chapters.sh csv bhagavad_gita_verses.csv

# Node.js
cd gita-app
npm run generate-chapters:csv
```

### From JSON File
```bash
# Windows
generate-chapters.bat json gita-data.json

# macOS / Linux
./generate-chapters.sh json gita-data.json

# Node.js
cd gita-app
npm run generate-chapters:json
```

---

## Output Structure

After running, you'll have:

```
gita-app/data/chapters/
├── chapter-01.json   (35 verses)
├── chapter-02.json   (71 verses)
├── chapter-03.json   (43 verses)
├── ...
└── chapter-18.json   (78 verses)

Total: 700 Bhagavad Gita verses across 18 chapters
Total JSON size: ~15-20 MB
```

Each file contains all verses with:
- Sanskrit (Devanagari script)
- Transliteration (IAST romanization)
- English translation
- Hindi, Tamil, Kannada translations (when available)
- Optional commentary

---

## Sample Output: chapter-01.json

```json
{
  "chapter": 1,
  "verse_count": 35,
  "name": {
    "english": "Arjuna Vishada Yoga",
    "hindi": "अर्जुन विषाद योग",
    "tamil": "அர்ஜுன விஷாத யோகம்",
    "kannada": "ಅರ್ಜುನ ವಿಷಾದ ಯೋಗ"
  },
  "verses": [
    {
      "verse": 1,
      "sanskrit": "धृतराष्ट्र उवाच...",
      "transliteration": "Dhritarashtra uvācha...",
      "translations": {
        "english": "Dhritarashtra said: O Sanjay, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?",
        "hindi": "धृतराष्ट्र के द्वारा नहीं पाया गया",
        "tamil": null,
        "kannada": null
      }
    },
    {
      "verse": 2,
      "sanskrit": "सञ्जय उवाच...",
      "transliteration": "Sanjaya uvācha...",
      "translations": {
        "english": "Sanjay said: On observing the Pandava army standing in military formation, King Duryodhan approached his teacher Dronacharya, and said the following words.",
        "hindi": null,
        "tamil": null,
        "kannada": null
      }
    },
    ...
  ]
}
```

---

## Data Quality

✅ **What's Guaranteed**
- All 18 chapters with all verses
- Sanskrit text preserved exactly
- Transliteration in IAST standard
- English translation (Swami Prabhupada)
- No extra whitespace or formatting issues
- All verse numbers are integers
- Missing translations set to `null` (not blanks or placeholders)

⚠️ **What Might Be Incomplete**
- Hindi, Tamil, Kannada translations (in progress across data sources)
- Commentary sections (optional, sparse)

---

## Troubleshooting

### "Command not found: node"
**Fix**: Install Node.js from https://nodejs.org (v12+)

### "HTTP 429: Too Many Requests"
**Fix**: Wait 5 minutes. The free API has rate limits. Try again.

### "Failed to connect"
**Fix**: Check your internet connection. Primary API might be temporarily down but system tries fallback automatically.

### No output files created
**Fix**: Run from the correct directory. The script creates: `gita-app/data/chapters/`

---

## Next Steps

After generating chapters, you can:

1. **Test in the app**
   ```bash
   npm start
   ```

2. **Update the app's data loader** to use `/data/chapters/` instead of inline data

3. **Add more languages** by modifying the API fetch or CSV parsing

4. **Deploy** with these chapter files bundled in the app

---

## Technical Details

- **Dependencies**: None! Uses only Node.js built-in modules
- **Time to complete**: ~15-40 seconds
- **Internet required**: Yes (for API fetch)
- **Data sources**: Free public Bhagavad Gita APIs
- **Supported formats**: JSON, CSV
- **Output format**: JSON (prettified, 2-space indent)

For full documentation, see **GENERATOR_USAGE.md**

---

**Last Updated**: February 7, 2026
**Script Version**: 1.0
