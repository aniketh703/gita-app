#!/usr/bin/env node

/**
 * Bhagavad Gita Data Normalizer
 * 
 * Normalizes Bhagavad Gita datasets (CSV or JSON) into canonical chapter schema.
 * 
 * Usage:
 *   node normalize-gita-data.js --input <path> --output <dir> [--source <type>]
 * 
 * Options:
 *   --input <path>    Input file (CSV or JSON)
 *   --output <dir>    Output directory (default: ./gita-app/data/chapters)
 *   --source <type>   Data source type: csv, json, infinity (default: auto-detect)
 *   --fetch-sanskrit  Fetch Sanskrit from API if missing (default: false)
 *   --help            Show this help message
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================================
// Configuration
// ============================================================================

const CHAPTER_METADATA = {
  1: { english: "Arjuna Vishada Yoga", hindi: "अर्जुन विषाद योग", tamil: "அர்ஜுன விஷாத யோகம்", kannada: "ಅರ್ಜುನ ವಿಷಾದ ಯೋಗ" },
  2: { english: "Sankhya Yoga", hindi: "सांख्य योग", tamil: "சாங்க்य யோகம்", kannada: "ಸಾಂಖ್ಯ ಯೋಗ" },
  3: { english: "Karma Yoga", hindi: "कर्म योग", tamil: "கர்ம யோகம்", kannada: "ಕರ್ಮ ಯೋಗ" },
  4: { english: "Jnana Yoga", hindi: "ज्ञान योग", tamil: "ஞான யோகம்", kannada: "ಜ್ಞಾನ ಯೋಗ" },
  5: { english: "Sannyasa Yoga", hindi: "संन्यास योग", tamil: "சன்னியாஸ யோகம்", kannada: "ಸನ್ನ್ಯಾಸ ಯೋಗ" },
  6: { english: "Dhyana Yoga", hindi: "ध्यान योग", tamil: "தியான யோகம்", kannada: "ಧ್ಯಾನ ಯೋಗ" },
  7: { english: "Jnana-Vijnana Yoga", hindi: "ज्ञान-विज्ञान योग", tamil: "ஞான-விஞ்ஞான யோகம்", kannada: "ಜ್ಞಾನ-ವಿಜ್ಞಾನ ಯೋಗ" },
  8: { english: "Aksara-Brahman Yoga", hindi: "अक्षर-ब्रह्मन योग", tamil: "அக्ஷர-ப्रह्म யோகம்", kannada: "ಅಕ್ಷರ-ಬ್ರಹ್ಮನ ಯೋಗ" },
  9: { english: "Raja-Guhya Yoga", hindi: "राज-गुह्य योग", tamil: "ராज-குஹ்ய யோகம்", kannada: "ರಾಜ-ಗುಹ್ಯ ಯೋಗ" },
  10: { english: "Vibhuti Yoga", hindi: "विभूति योग", tamil: "விபூதி யோகம்", kannada: "ವಿಭೂತಿ ಯೋಗ" },
  11: { english: "Visvarupa-Darsana Yoga", hindi: "विश्वरूप-दर्शन योग", tamil: "விஸ்வரூப-தர்ஶன யோகம்", kannada: "ವಿಶ್ವರೂಪ-ದರ್ಶನ ಯೋಗ" },
  12: { english: "Bhakti Yoga", hindi: "भक्ति योग", tamil: "பக்தி யோகம்", kannada: "ಭಕ್ತಿ ಯೋಗ" },
  13: { english: "Kshetra-Kshetrajna Yoga", hindi: "क्षेत्र-क्षेत्रज्ञ योग", tamil: "க्ஷ்ேத்ர-्க்ஷ्ேத்రज்ஞ யோகம்", kannada: "ಕ್ಷೇತ್ರ-ಕ್ಷೇತ್ರಜ್ಞ ಯೋಗ" },
  14: { english: "Gunatraya-Vibhaga Yoga", hindi: "गुणत्रय-विभाग योग", tamil: "குணத்ரய-விபாக யோகம்", kannada: "ಗುಣತ್ರಯ-ವಿಭಾಗ ಯೋಗ" },
  15: { english: "Purushottama Yoga", hindi: "पुरुषोत्तम योग", tamil: "புருஷோத்தம யோகம்", kannada: "ಪುರುಷೋತ್ತಮ ಯೋಗ" },
  16: { english: "Daivasura-Sampad-Vibhaga Yoga", hindi: "दैवासुर-सम्पद्-विभाग योग", tamil: "தைவாசுர-சம்பத்-விபாக யோகம்", kannada: "ದೈವಾಸುರ-ಸಂಪದ್-ವಿಭಾಗ ಯೋಗ" },
  17: { english: "Shraddhatraya-Vibhaga Yoga", hindi: "श्रद्धात्रय-विभाग योग", tamil: "ஶ்ரத்தாத్ర్య-విభాగ యోగం", kannada: "ಶ್ರದ್ಧಾತ್ರಯ-ವಿಭಾಗ ಯೋಗ" },
  18: { english: "Moksha-Sannyasa Yoga", hindi: "मोक्ष-संन्यास योग", tamil: "மோக்ஷ-சன்னியாஸ யோகம்", kannada: "ಮೋಕ್ಷ-ಸನ್ನ್ಯಾಸ ಯೋಗ" },
};

const VERSE_COUNTS = {
  1: 47, 2: 71, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28,
  9: 34, 10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

// ============================================================================
// Utilities
// ============================================================================

/**
 * Trim and clean text
 */
function cleanText(text) {
  if (!text) return null;
  return String(text).trim();
}

/**
 * Parse verse number from various formats
 * Examples: "1.1", "1-1", "chapter_1_slok_1"
 */
function parseVerseNumber(str) {
  if (typeof str === 'number') return str;
  
  let match = String(str).match(/(\d+)\.(\d+)/);
  if (match) return parseInt(match[2], 10);
  
  match = String(str).match(/(\d+)-(\d+)$/);
  if (match) return parseInt(match[2], 10);
  
  match = String(str).match(/slok_(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  return parseInt(str, 10) || null;
}

/**
 * Fetch Sanskrit text from GitHub API (if available)
 */
async function fetchSanskritFromGitHub(chapter, verse) {
  return new Promise((resolve) => {
    setTimeout(resolve, 100); // Rate limiting
    
    const url = `https://api.github.com/repos/vedicscriptures/gita/contents/Chapters/${chapter}/${verse}.txt`;
    
    https.get(url, { headers: { 'User-Agent': 'GitaNormalizer' } }, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const content = Buffer.from(json.content, 'base64').toString('utf8');
            resolve(cleanText(content));
          } catch (e) {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
    }).on('error', () => resolve(null));
  });
}

/**
 * Create a normalized verse object
 */
function createVerseObject(verseNumber, sanskrit, transliteration, translations) {
  const verse = {
    verse: parseInt(verseNumber, 10),
    sanskrit: cleanText(sanskrit) || null,
    transliteration: cleanText(transliteration) || null,
    translations: {
      english: cleanText(translations?.english) || null,
      hindi: cleanText(translations?.hindi) || null,
      tamil: cleanText(translations?.tamil) || null,
      kannada: cleanText(translations?.kannada) || null,
    }
  };
  
  // Remove null translations, keep the structure
  Object.keys(verse.translations).forEach(key => {
    if (!verse.translations[key]) {
      verse.translations[key] = null;
    }
  });
  
  return verse;
}

// ============================================================================
// CSV Parser
// ============================================================================

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const verses = {};
  
  // Initialize all chapters
  for (let i = 1; i <= 18; i++) {
    verses[i] = {};
  }
  
  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV with quoted field support
    // Format: Chapter 1,Arjun Viṣhād Yog,1.1,"Translation text here"
    const match = line.match(/^([^,]+),([^,]+),([^,]+),"(.*)"\s*$/);
    if (!match) continue;
    
    const [, chapterStr, titleStr, verseStr, translation] = match;
    
    // Extract chapter number
    const chapterMatch = chapterStr.match(/(\d+)/);
    if (!chapterMatch) continue;
    
    const chapter = parseInt(chapterMatch[1], 10);
    const verseNum = parseVerseNumber(verseStr);
    
    if (!chapter || !verseNum || chapter < 1 || chapter > 18) continue;
    
    if (!verses[chapter][verseNum]) {
      verses[chapter][verseNum] = {
        verse: verseNum,
        sanskrit: null,
        transliteration: null,
        translations: {
          english: cleanText(translation),
          hindi: null,
          tamil: null,
          kannada: null,
        }
      };
    }
  }
  
  return verses;
}

// ============================================================================
// JSON Parser (gita-data.json format)
// ============================================================================

function parseJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const verses = {};
  
  if (!Array.isArray(data)) {
    throw new Error('JSON must be an array of chapters');
  }
  
  data.forEach(chapter => {
    const chNum = parseInt(chapter.chapter, 10);
    if (!chNum) return;
    
    verses[chNum] = {};
    
    if (Array.isArray(chapter.verses)) {
      chapter.verses.forEach(verse => {
        const vNum = parseInt(verse.verse, 10);
        if (vNum) {
          verses[chNum][vNum] = verse;
        }
      });
    }
  });
  
  return verses;
}

// ============================================================================
// Bhagwat-Gita-Infinity Parser
// ============================================================================

function parseInfinityDataset(infinityDir) {
  const verses = {};
  
  // Initialize chapters
  for (let i = 1; i <= 18; i++) {
    verses[i] = {};
  }
  
  const slokDir = path.join(infinityDir, 'slok');
  
  if (!fs.existsSync(slokDir)) {
    console.warn('⚠ Slok directory not found:', slokDir);
    return verses;
  }
  
  // Process all slok files
  const files = fs.readdirSync(slokDir);
  files.forEach(file => {
    const match = file.match(/chapter_(\d+)_slok_(\d+)\.json/);
    if (!match) return;
    
    const chapter = parseInt(match[1], 10);
    const slok = parseInt(match[2], 10);
    
    try {
      const content = fs.readFileSync(path.join(slokDir, file), 'utf-8');
      const data = JSON.parse(content);
      
      verses[chapter][slok] = {
        verse: slok,
        sanskrit: cleanText(data.slok),
        transliteration: cleanText(data.transliteration),
        translations: {
          english: extractTranslation(data, 'et') || extractTranslation(data, 'english'),
          hindi: extractTranslation(data, 'ht') || extractTranslation(data, 'hindi'),
          tamil: null,
          kannada: null,
        }
      };
    } catch (e) {
      console.warn(`⚠ Failed to parse ${file}:`, e.message);
    }
  });
  
  return verses;
}

function extractTranslation(data, ...keys) {
  for (const key of keys) {
    for (const commentator of Object.values(data)) {
      if (typeof commentator === 'object' && commentator[key]) {
        return commentator[key];
      }
    }
  }
  return null;
}

// ============================================================================
// Merger
// ============================================================================

function mergeVersesData(sourcesArray) {
  const merged = {};
  
  // Initialize all chapters
  for (let i = 1; i <= 18; i++) {
    merged[i] = {};
  }
  
  // Merge from sources (later sources override earlier ones for non-null values)
  sourcesArray.forEach(sourceData => {
    Object.entries(sourceData).forEach(([chapter, versesInChapter]) => {
      const chNum = parseInt(chapter, 10);
      if (merged[chNum]) {
        Object.entries(versesInChapter).forEach(([verseNum, verseData]) => {
          const vNum = parseInt(verseNum, 10);
          if (!merged[chNum][vNum]) {
            merged[chNum][vNum] = { ...verseData };
          } else {
            // Merge verse data, preferring non-null values
            const existing = merged[chNum][vNum];
            if (!existing.sanskrit && verseData.sanskrit) {
              existing.sanskrit = verseData.sanskrit;
            }
            if (!existing.transliteration && verseData.transliteration) {
              existing.transliteration = verseData.transliteration;
            }
            Object.keys(verseData.translations || {}).forEach(lang => {
              if (!existing.translations[lang] && verseData.translations[lang]) {
                existing.translations[lang] = verseData.translations[lang];
              }
            });
          }
        });
      }
    });
  });
  
  return merged;
}

// ============================================================================
// Output Writer
// ============================================================================

function writeChapterFiles(allVerses, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const results = { succeeded: [], failed: [] };
  
  for (let chapter = 1; chapter <= 18; chapter++) {
    try {
      const verseCount = VERSE_COUNTS[chapter];
      const verseNumbers = Object.keys(allVerses[chapter])
        .map(v => parseInt(v, 10))
        .sort((a, b) => a - b);
      
      const chapterData = {
        chapter,
        verse_count: verseCount,
        name: CHAPTER_METADATA[chapter],
        verses: verseNumbers.map(verseNum => {
          const verse = allVerses[chapter][verseNum];
          return createVerseObject(
            verseNum,
            verse.sanskrit,
            verse.transliteration,
            verse.translations
          );
        })
      };
      
      const filename = `chapter-${String(chapter).padStart(2, '0')}.json`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(chapterData, null, 2), 'utf-8');
      results.succeeded.push({ chapter, filepath, verses: verseNumbers.length });
    } catch (e) {
      results.failed.push({ chapter, error: e.message });
    }
  }
  
  return results;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Bhagavad Gita Data Normalizer

Usage:
  node normalize-gita-data.js --input <path> [--output <dir>] [--source <type>]

Options:
  --input <path>       Input file or directory (CSV, JSON, or Infinity dataset)
  --output <dir>       Output directory (default: ./gita-app/data/chapters)
  --source <type>      Data source: csv, json, infinity (default: auto-detect)
  --fetch-sanskrit     Fetch Sanskrit from GitHub if missing (default: false)
  --help               Show this help message

Examples:
  # From CSV file
  node normalize-gita-data.js --input bhagavad_gita_verses.csv

  # From JSON file
  node normalize-gita-data.js --input gita-data.json

  # From Infinity dataset
  node normalize-gita-data.js --input ./Bhagwat-Gita-Infinity --source infinity

  # Merge multiple sources
  node normalize-gita-data.js --input csv_file.csv --input json_file.json
      `);
      process.exit(0);
    }
    
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      
      if (value && !value.startsWith('--')) {
        options[key] = value;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  
  if (!options.input) {
    console.error('❌ Error: --input is required\n');
    console.log('Use --help for usage information');
    process.exit(1);
  }
  
  const outputDir = options.output || path.join(__dirname, 'gita-app', 'data', 'chapters');
  
  console.log('📖 Bhagavad Gita Data Normalizer\n');
  console.log('Input:', options.input);
  console.log('Output:', outputDir);
  console.log('');
  
  try {
    const allSources = [];
    const inputPaths = Array.isArray(options.input) ? options.input : [options.input];
    
    for (const inputPath of inputPaths) {
      console.log(`📂 Processing: ${inputPath}`);
      
      let sourceData;
      const stats = fs.statSync(inputPath);
      
      if (stats.isDirectory()) {
        console.log('   → Detected as Infinity dataset');
        sourceData = parseInfinityDataset(inputPath);
      } else if (inputPath.endsWith('.csv')) {
        console.log('   → Detected as CSV file');
        sourceData = parseCSV(inputPath);
      } else if (inputPath.endsWith('.json')) {
        console.log('   → Detected as JSON file');
        sourceData = parseJSON(inputPath);
      } else {
        throw new Error(`Unknown file type: ${inputPath}`);
      }
      
      allSources.push(sourceData);
    }
    
    console.log('');
    console.log('🔀 Merging sources...');
    const merged = mergeVersesData(allSources);
    
    console.log('✅ Merge complete');
    console.log('');
    console.log('📝 Writing chapter files...');
    
    const results = writeChapterFiles(merged, outputDir);
    
    console.log('');
    console.log('✨ Normalization Complete!\n');
    
    console.log(`✅ Succeeded: ${results.succeeded.length} chapters`);
    results.succeeded.forEach(({ chapter, verses }) => {
      console.log(`   Chapter ${chapter}: ${verses} verses`);
    });
    
    if (results.failed.length > 0) {
      console.log(`\n❌ Failed: ${results.failed.length} chapters`);
      results.failed.forEach(({ chapter, error }) => {
        console.log(`   Chapter ${chapter}: ${error}`);
      });
    }
    
    console.log(`\n📁 Output directory: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { parseCSV, parseJSON, parseInfinityDataset, mergeVersesData, writeChapterFiles };
