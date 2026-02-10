#!/bin/bash
# Quick Start Guide for Bhagavad Gita Data Normalizer

echo "======================================================================"
echo "  Bhagavad Gita Data Normalizer - Quick Start"
echo "======================================================================"
echo ""

# Scenario 1: Simple CSV to Chapters
echo "📖 SCENARIO 1: Normalize CSV to Chapter Files"
echo "─────────────────────────────────────────────"
echo "Command:"
echo "  node normalize-gita-data.js --input bhagavad_gita_verses.csv"
echo ""
echo "Output: 18 JSON files in gita-app/data/chapters/"
echo "        ✅ English translations"
echo "        ❌ Sanskrit (null)"
echo "        ❌ Transliteration (null)"
echo ""
echo ""

# Scenario 2: Enrich with Infinity Dataset
echo "📖 SCENARIO 2: Enrich with Sanskrit & Transliteration"
echo "───────────────────────────────────────────────────────"
echo "Command:"
echo "  node normalize-gita-data.js \\"
echo "    --input bhagavad_gita_verses.csv \\"
echo "    --input gita-app/Bhagwat-Gita-Infinity"
echo ""
echo "Output: 18 JSON files with:"
echo "        ✅ Sanskrit (from Infinity)"
echo "        ✅ Transliteration (IAST from Infinity)"
echo "        ✅ English translations (from CSV)"
echo "        ✅ Hindi translations (from Infinity commentaries)"
echo "        ⚠️  Tamil/Kannada (null)"
echo ""
echo ""

# Scenario 3: Use existing JSON
echo "📖 SCENARIO 3: Normalize Existing gita-data.json"
echo "──────────────────────────────────────────────────"
echo "Command:"
echo "  node normalize-gita-data.js --input gita-app/data/gita-data.json"
echo ""
echo "Output: Individual chapter files from existing JSON"
echo ""
echo ""

# Scenario 4: Custom output location
echo "📖 SCENARIO 4: Custom Output Directory"
echo "──────────────────────────────────────"
echo "Command:"
echo "  node normalize-gita-data.js \\"
echo "    --input bhagavad_gita_verses.csv \\"
echo "    --output ./my-custom-output/chapters"
echo ""
echo "Creates: my-custom-output/chapters/chapter-01.json through chapter-18.json"
echo ""
echo ""

# File structure info
echo "📁 OUTPUT FILE STRUCTURE"
echo "────────────────────────"
cat << 'EOF'
gita-app/data/chapters/
├── chapter-01.json  (Arjuna Vishada Yoga - 47 verses)
├── chapter-02.json  (Sankhya Yoga - 71 verses)
├── chapter-03.json  (Karma Yoga - 43 verses)
├── ...
└── chapter-18.json  (Moksha-Sannyasa Yoga - 78 verses)

Total: 710+ verses across 18 chapters
EOF
echo ""
echo ""

# Sample output
echo "📄 SAMPLE OUTPUT (chapter-01.json)"
echo "──────────────────────────────────"
cat << 'EOF'
{
  "chapter": 1,
  "verse_count": 47,
  "name": {
    "english": "Arjuna Vishada Yoga",
    "hindi": "अर्जुन विषाद योग",
    "tamil": "அர்ஜுன விஷாத யோகம்",
    "kannada": "ಅರ್ಜುನ ವಿಷಾದ ಯೋಗ"
  },
  "verses": [
    {
      "verse": 1,
      "sanskrit": "धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे...",
      "transliteration": "dhṛtarāṣṭra uvāca .\ndharmakṣetre kurukṣetre...",
      "translations": {
        "english": "Dhritarashtra said...",
        "hindi": "धृतराष्ट्र ने कहा...",
        "tamil": null,
        "kannada": null
      }
    },
    ...
  ]
}
EOF
echo ""
echo ""

# Tips
echo "💡 TIPS & BEST PRACTICES"
echo "──────────────────────────"
cat << 'EOF'
1. Use the Infinity Dataset for Sanskrit accuracy
   - Contains verified Sanskrit from authentic sources
   - Includes transliteration in IAST format
   - Provides commentary from multiple scholars

2. Merge multiple sources
   - CSV provides English translations
   - Infinity provides Sanskrit
   - Combined output is most complete

3. Handle null values gracefully in your app
   - Don't display "[Translation needed]"
   - Show UI message like "Translation coming soon"
   - Track which verses have full translations

4. Validate output
   - Check chapter-01.json through chapter-18.json
   - Verify verse numbering (may have gaps)
   - Confirm character encoding (UTF-8)

5. Include in your project
   - Copy chapters/ folder to your assets
   - Import as needed in your app
   - Use TypeScript for type safety
EOF
echo ""
echo ""

# Usage help
echo "📚 GET HELP"
echo "─────────────"
echo "Command:"
echo "  node normalize-gita-data.js --help"
echo ""
echo "======================================================================"
