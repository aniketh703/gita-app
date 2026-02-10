#!/usr/bin/env node

/**
 * Bhagavad Gita Chapter Generator v2
 * 
 * Fetches data from free public sources, normalizes to canonical schema,
 * and generates individual chapter JSON files.
 * 
 * Uses reliable free APIs with proper error handling and retry logic.
 * 
 * Usage:
 *   node generate-gita-chapters.js [--source csv|json|api] [--input <file>]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================================================
// CONSTANTS
// ============================================================================

const TOTAL_CHAPTERS = 18;
const OUTPUT_DIR = path.join(__dirname, 'gita-app', 'data', 'chapters');
const MAX_RETRIES = 2;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Trim all whitespace from a string
 */
function trimWhitespace(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Normalize text value  
 */
function normalizeText(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return null;
  
  const trimmed = trimWhitespace(value);
  
  // Check for empty or placeholder values
  if (!trimmed || 
      /^\[.*needed|N\/A|TBD|pending\]?$/i.test(trimmed)) {
    return null;
  }
  
  return trimmed;
}

/**
 * Normalize verse number to integer
 */
function normalizeVerseNumber(num) {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * HTTP GET with retries and redirect handling
 */
function httpGet(url, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const makeRequest = (attempt) => {
      const client = url.startsWith('https') ? https : http;
      let fullData = '';
      
      const options = {
        timeout: 8000,
        headers: {
          'User-Agent': 'Gita-Generator/2.0'
        },
        rejectUnauthorized: false
      };
      
      const req = client.get(url, options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400) {
          const location = res.headers.location;
          if (location) {
            req.destroy();
            return httpGet(location, retries).then(resolve).catch(reject);
          }
        }
        
        if (res.statusCode !== 200) {
          req.destroy();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        
        res.on('data', chunk => { fullData += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(fullData));
          } catch (e) {
            reject(new Error(`Invalid JSON`));
          }
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        if (attempt < retries) {
          setTimeout(() => makeRequest(attempt + 1), 500);
        } else {
          reject(new Error('Timeout'));
        }
      });
      
      req.on('error', (err) => {
        if (attempt < retries) {
          setTimeout(() => makeRequest(attempt + 1), 500);
        } else {
          reject(err);
        }
      });
    };
    
    makeRequest(0);
  });
}

/**
 * Normalize a verse from various API formats
 */
function normalizeVerse(rawVerse) {
  const verse = {
    verse: null,
    sanskrit: null,
    transliteration: null,
    translations: {
      english: null,
      hindi: null,
      tamil: null,
      kannada: null
    }
  };
  
  // Verse number - try multiple field names
  verse.verse = normalizeVerseNumber(
    rawVerse.verse_number || 
    rawVerse.verseNumber ||
    rawVerse.verse ||
    rawVerse.id
  );
  
  // Sanskrit - try multiple field names
  verse.sanskrit = normalizeText(
    rawVerse.sanskrit ||
    rawVerse.sa ||
    rawVerse.text ||
    rawVerse.original
  );
  
  // Transliteration - try multiple field names
  verse.transliteration = normalizeText(
    rawVerse.transliteration ||
    rawVerse.translit ||
    rawVerse.iast ||
    rawVerse.romanized
  );
  
  // Translations object - various patterns
  if (rawVerse.translations && typeof rawVerse.translations === 'object') {
    Object.keys(verse.translations).forEach(lang => {
      verse.translations[lang] = normalizeText(rawVerse.translations[lang]);
    });
  }
  
  // Fallback: check for language-specific fields
  ['english', 'hindi', 'tamil', 'kannada'].forEach(lang => {
    if (!verse.translations[lang]) {
      verse.translations[lang] = normalizeText(
        rawVerse[lang] ||
        rawVerse[`${lang}_translation`] ||
        rawVerse[`${lang}_text`]
      );
    }
  });
  
  return verse;
}

/**
 * Fetch from Speakeasy Gita API
 */
async function fetchFromSpeakeasy() {
  console.log('📡 Fetching from Speakeasy Gita API...');
  const chapters = [];
  
  for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
    process.stdout.write(`  Chapter ${i}/18... `);
    
    try {
      const url = `https://bhagavadgita.api.speakeasy.com/v1/chapters/${i}/verses`;
      const data = await httpGet(url);
      
      let verses = [];
      if (Array.isArray(data)) {
        verses = data.map(normalizeVerse);
      } else if (data.verses && Array.isArray(data.verses)) {
        verses = data.verses.map(normalizeVerse);
      }
      
      if (verses.length > 0) {
        chapters.push({
          chapter: i,
          verse_count: verses.length,
          name: {
            english: null,
            hindi: null,
            tamil: null,
            kannada: null
          },
          verses: verses
        });
        console.log(`✅ (${verses.length} verses)`);
      } else {
        console.log(`⚠️ No verses found`);
        // Still continue, might be partial data
      }
    } catch (error) {
      console.log(`⚠️ (${error.message})`);
      // Continue with next chapter
    }
  }
  
  return chapters.length > 0 ? chapters : null;
}

/**
 * Fetch from Heroku API
 */
async function fetchFromHeroku() {
  console.log('📡 Fetching from Heroku Gita API...');
  const chapters = [];
  
  try {
    // Try to fetch all chapters at once first
    const allData = await httpGet('https://bhagavad-gita-api.herokuapp.com/v1/chapters');
    
    if (Array.isArray(allData)) {
      for (let chNum = 1; chNum <= TOTAL_CHAPTERS; chNum++) {
        process.stdout.write(`  Chapter ${chNum}/18... `);
        
        const chapterData = allData.find(ch => 
          ch.chapter_number === chNum || ch.chapter === chNum
        );
        
        if (!chapterData) {
          console.log(`⚠️ Not found`);
          continue;
        }
        
        let verses = [];
        if (Array.isArray(chapterData.verses)) {
          verses = chapterData.verses.map(normalizeVerse);
        }
        
        chapters.push({
          chapter: chNum,
          verse_count: verses.length,
          name: {
            english: chapterData.name || null,
            hindi: null,
            tamil: null,
            kannada: null
          },
          verses: verses
        });
        
        console.log(`✅ (${verses.length} verses)`);
      }
      
      return chapters.length > 0 ? chapters : null;
    }
  } catch (error) {
    console.log(`⚠️ Heroku API failed: ${error.message}`);
  }
  
  return null;
}

/**
 * Load from CSV file with smart parsing
 */
function loadFromCSV(csvPath) {
  console.log(`📄 Loading from CSV: ${csvPath}`);
  
  try {
    let content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV must have header and data rows');
    }
    
    // Detect delimiter and structure
    const headerLine = lines[0];
    const hasQuotes = headerLine.includes('"');
    
    const chaptersMap = new Map();
    let chapterNames = {};
    
    // Parse with support for quoted fields
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      if (!line.trim()) continue;
      
      // Simple CSV parser that handles quoted fields
      const fields = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const next = line[j + 1];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim().replace(/^"|"$/g, ''));
      
      // Parse based on CSV format (chapter_number, chapter_title, chapter_verse, translation)
      if (fields.length >= 4) {
        const chapterText = fields[0].toLowerCase();
        const chapterTitle = fields[1];
        const verseText = fields[2];
        const translation = fields[3];
        
        // Extract chapter number from "Chapter N" format
        const chMatch = chapterText.match(/chapter\s+(\d+)/);
        const chNum = chMatch ? parseInt(chMatch[1], 10) : null;
        
        if (!chNum || chNum < 1 || chNum > 18) continue;
        
        // Store chapter name
        if (!chapterNames[chNum] && chapterTitle) {
          chapterNames[chNum] = normalizeText(chapterTitle) || null;
        }
        
        // Extract verse numbers from "1.1" or "1.1 - 1.3" format
        const verseMatches = verseText.match(/(\d+\.\d+)/g);
        if (!verseMatches) continue;
        
        for (const verseMatch of verseMatches) {
          const verseParts = verseMatch.split('.');
          if (verseParts.length === 2) {
            const verseNum = parseInt(verseParts[1], 10);
            
            if (!chaptersMap.has(chNum)) {
              chaptersMap.set(chNum, []);
            }
            
            // Check if we already have this verse (avoid duplicates)
            const existing = chaptersMap.get(chNum).find(v => v.verse === verseNum);
            if (!existing) {
              chaptersMap.get(chNum).push({
                verse: verseNum,
                sanskrit: null,
                transliteration: null,
                translations: {
                  english: normalizeText(translation),
                  hindi: null,
                  tamil: null,
                  kannada: null
                }
              });
            }
          }
        }
      }
    }
    
    // Build chapters array with sorted verses
    const chapters = [];
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
      const verseList = chaptersMap.get(i) || [];
      // Sort verses by number
      verseList.sort((a, b) => (a.verse || 0) - (b.verse || 0));
      
      chapters.push({
        chapter: i,
        verse_count: verseList.length,
        name: {
          english: chapterNames[i] || null,
          hindi: null,
          tamil: null,
          kannada: null
        },
        verses: verseList
      });
    }
    
    return chapters;
  } catch (error) {
    console.error(`❌ CSV load failed: ${error.message}`);
    return null;
  }
}

/**
 * Load from JSON file
 */
function loadFromJSON(jsonPath) {
  console.log(`📄 Loading from JSON: ${jsonPath}`);
  
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of chapters');
    }
    
    return data.slice(0, TOTAL_CHAPTERS).map((ch, idx) => ({
      chapter: ch.chapter || (idx + 1),
      verse_count: (ch.verses || []).length,
      name: ch.name || { english: null, hindi: null, tamil: null, kannada: null },
      verses: (ch.verses || []).map(normalizeVerse)
    }));
  } catch (error) {
    console.error(`❌ JSON load failed: ${error.message}`);
    return null;
  }
}

/**
 * Write chapter files
 */
async function writeChapters(chapters) {
  console.log(`\n📝 Writing chapter files...`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`   Created: ${OUTPUT_DIR}`);
  }
  
  let successCount = 0;
  for (const chapter of chapters) {
    const filename = `chapter-${String(chapter.chapter).padStart(2, '0')}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    try {
      fs.writeFileSync(filepath, JSON.stringify(chapter, null, 2));
      console.log(`   ✅ ${filename} (${chapter.verse_count} verses)`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ ${filename}: ${error.message}`);
    }
  }
  
  return successCount;
}

/**
 * Validate chapters
 */
function validateChapters(chapters) {
  console.log('\n✔️ Validating...');
  let totalVerses = 0;
  
  chapters.forEach(ch => {
    if (ch.verses && Array.isArray(ch.verses)) {
      totalVerses += ch.verses.filter(v => v.verse !== null).length;
    }
  });
  
  console.log(`   ✅ ${chapters.length} chapters, ${totalVerses} verses found`);
  return true;
}

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { source: 'api', input: null };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && i + 1 < args.length) {
      config.source = args[i + 1];
      i++;
    } else if (args[i] === '--input' && i + 1 < args.length) {
      config.input = args[i + 1];
      i++;
    }
  }
  
  return config;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('\n🚀 Bhagavad Gita Chapter Generator v2.0\n');
  
  const config = parseArgs();
  let chapters = null;
  
  // Load from source
  if (config.source === 'csv') {
    if (!config.input) {
      console.error('❌ --input required for CSV source');
      process.exit(1);
    }
    chapters = loadFromCSV(config.input);
  } else if (config.source === 'json') {
    if (!config.input) {
      console.error('❌ --input required for JSON source');
      process.exit(1);
    }
    chapters = loadFromJSON(config.input);
  } else if (config.source === 'api') {
    // Try APIs in order
    chapters = await fetchFromSpeakeasy();
    if (!chapters || chapters.length === 0) {
      console.log();
      chapters = await fetchFromHeroku();
    }
  } else {
    console.error(`❌ Unknown source: ${config.source}`);
    process.exit(1);
  }
  
  if (!chapters || chapters.length === 0) {
    console.error('\n❌ Failed to load chapters from any source');
    process.exit(1);
  }
  
  // Validate
  validateChapters(chapters);
  
  // Write files
  const count = await writeChapters(chapters);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success! Generated ${count}/${TOTAL_CHAPTERS} chapter files`);
  console.log(`📍 Location: ${OUTPUT_DIR}`);
  console.log('='.repeat(60) + '\n');
  
  process.exit(count > 0 ? 0 : 1);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
