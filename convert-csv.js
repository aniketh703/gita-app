#!/usr/bin/env node
/**
 * CSV to JSON Converter for Bhagavad Gita
 * Converts bhagavad_gita_verses.csv to chapter-based JSON structure
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'bhagavad_gita_verses.csv');
const outputDir = path.join(__dirname, 'gita-app', 'data');
const outputPath = path.join(outputDir, 'gita-data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Simple CSV parser - handles quoted fields with commas
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const records = [];
  
  let buffer = '';
  let inQuotes = false;
  
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    
    // Track quote state
    const quoteCount = (line.match(/"/g) || []).length;
    buffer += (buffer ? '\n' : '') + line;
    
    if (quoteCount % 2 === 1) {
      inQuotes = !inQuotes;
    }
    
    // If not in quotes and we have a complete line
    if (!inQuotes && buffer.trim()) {
      const fields = [];
      let current = '';
      let quote = false;
      
      for (let j = 0; j < buffer.length; j++) {
        const char = buffer[j];
        
        if (char === '"') {
          quote = !quote;
        } else if (char === ',' && !quote) {
          fields.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim().replace(/^"|"$/g, ''));
      
      if (fields.length === headers.length) {
        const record = {};
        headers.forEach((header, idx) => {
          record[header] = fields[idx];
        });
        records.push(record);
      }
      
      buffer = '';
    }
  }
  
  return records;
}

// Chapter names mapping (from spec + common knowledge)
const chapterNames = {
  1: { english: 'Arjuna Vishada Yoga', hindi: 'अर्जुन विषाद योग', tamil: 'அர்ஜுன விஷாத யோகம்', kannada: 'ಅರ್ಜುನ ವಿಷಾದ ಯೋಗ' },
  2: { english: 'Sankhya Yoga', hindi: 'सांख्य योग', tamil: 'சாங்க்য யோகம்', kannada: 'ಸಾಂಖ್ಯ ಯೋಗ' },
  3: { english: 'Karma Yoga', hindi: 'कर्म योग', tamil: 'கர்ம யோகம்', kannada: 'ಕರ್ಮ ಯೋಗ' },
  4: { english: 'Jnana Yoga', hindi: 'ज्ञान योग', tamil: 'ஞான யோகம்', kannada: 'ಜ್ಞಾನ ಯೋಗ' },
  5: { english: 'Sannyasa Yoga', hindi: 'संन्यास योग', tamil: 'சன்னியாस யோகம்', kannada: 'ಸನ್ನ್ಯಾಸ ಯೋಗ' },
  6: { english: 'Dhyana Yoga', hindi: 'ध्यान योग', tamil: 'தியான யோகம்', kannada: 'ಧ್ಯಾನ ಯೋಗ' },
  7: { english: 'Jnana-Vijnana Yoga', hindi: 'ज्ञान-विज्ञान योग', tamil: 'ஞான-விஞ்ஞான யோகம்', kannada: 'ಜ್ಞಾನ-ವಿಜ್ಞಾನ ಯೋಗ' },
  8: { english: 'Aksara-Brahman Yoga', hindi: 'अक्षर-ब्रह्मन योग', tamil: 'அக்ஷர-ப்ரহ்ம யோகம்', kannada: 'ಅಕ್ಷರ-ಬ್ರಹ್ಮನ ಯೋಗ' },
  9: { english: 'Raja-Guhya Yoga', hindi: 'राज-गुह्य योग', tamil: 'ராज-குஹ்ய யோகம்', kannada: 'ರಾಜ-ಗುಹ್ಯ ಯೋಗ' },
  10: { english: 'Vibhuti Yoga', hindi: 'विभूति योग', tamil: 'விபூதி யோகம்', kannada: 'ವಿಭೂತಿ ಯೋಗ' },
  11: { english: 'Visvarupa-Darsana Yoga', hindi: 'विश्वरूप-दर्शन योग', tamil: 'விஸ்வரூப-தர்ஶன யோகம்', kannada: 'ವಿಶ್ವರೂಪ-ದರ್ಶನ ಯೋಗ' },
  12: { english: 'Bhakti Yoga', hindi: 'भक्ति योग', tamil: 'பக்தி யோகம்', kannada: 'ಭಕ್ತಿ ಯೋಗ' },
  13: { english: 'Kshetra-Kshetrajna Yoga', hindi: 'क्षेत्र-क्षेत्रज्ञ योग', tamil: 'ක্ഷേത്ര-ക്ഷേത്രജ്ഞ யோகം', kannada: 'ಕ್ಷೇತ್ರ-ಕ್ಷೇತ್ರಜ್ಞ ಯೋಗ' },
  14: { english: 'Gunatraya-Vibhaga Yoga', hindi: 'गुणत्रय-विभाग योग', tamil: 'குணத்ரய-விபாக யோகம்', kannada: 'ಗುಣತ್ರಯ-ವಿಭಾಗ ಯೋಗ' },
  15: { english: 'Purushottama Yoga', hindi: 'पुरुषोत्तम योग', tamil: 'புருஷோத்தம யோகம்', kannada: 'ಪುರುಷೋತ್ತಮ ಯೋಗ' },
  16: { english: 'Daivasura-Sampad-Vibhaga Yoga', hindi: 'दैवासुर-सम्पद्-विभाग योग', tamil: 'தைவாசுர-சம்பத்-விபாக யோகம்', kannada: 'ದೈವಾಸುರ-ಸಂಪದ್-ವಿಭಾಗ ಯೋಗ' },
  17: { english: 'Shraddhatraya-Vibhaga Yoga', hindi: 'श्रद्धात्रय-विभाग योग', tamil: 'ஶ்ரத்தாத்ரய-விபாக யோகம்', kannada: 'ಶ್ರದ್ಧಾತ್ರಯ-ವಿಭಾಗ ಯೋಗ' },
  18: { english: 'Moksha-Sannyasa Yoga', hindi: 'मोक्ष-संन्यास योग', tamil: 'மோக்ஷ-சன்னியாஸ யோகம்', kannada: 'ಮೋಕ್ಷ-ಸನ್ನ್ಯಾಸ ಯೋಗ' },
};

// Group verses by chapter
const chapters = {};

records.forEach((record) => {
  const chapterNum = parseInt(record.chapter_number.replace('Chapter ', ''), 10);
  const verseNum = record.chapter_verse.split('–')[0].trim(); // Handle verse ranges like "1.4 – 1.6"
  const verseMatch = verseNum.match(/(\d+)\.(\d+)/);
  
  if (!verseMatch) return;
  
  const [, ch, v] = verseMatch.map(Number);
  
  if (!chapters[ch]) {
    chapters[ch] = {
      chapter: ch,
      verse_count: 0,
      name: chapterNames[ch] || {
        english: `Chapter ${ch}`,
        hindi: `अध्याय ${ch}`,
        tamil: `அதிகாரம் ${ch}`,
        kannada: `ಅಧ್ಯಾಯ ${ch}`,
      },
      verses: [],
    };
  }
  
  chapters[ch].verses.push({
    verse: v,
    sanskrit: `[Sanskrit text needed]`, // Placeholder
    transliteration: `[Transliteration needed]`, // Placeholder
    translations: {
      english: record.translation,
      hindi: '[Hindi translation needed]',
      tamil: '[Tamil translation needed]',
      kannada: '[Kannada translation needed]',
    },
    commentary: {
      english: '[Commentary needed]',
      hindi: '[Commentary needed]',
    },
  });
});

// Sort verses and set verse_count
Object.values(chapters).forEach((chapter) => {
  chapter.verses.sort((a, b) => a.verse - b.verse);
  chapter.verse_count = chapter.verses.length;
});

// Convert to array and sort by chapter number
const gitaData = Object.values(chapters).sort((a, b) => a.chapter - b.chapter);

// Write to JSON file
fs.writeFileSync(outputPath, JSON.stringify(gitaData, null, 2), 'utf-8');
console.log(`✓ Converted CSV to JSON: ${outputPath}`);
console.log(`✓ Total chapters: ${gitaData.length}`);
console.log(`✓ Total verses: ${gitaData.reduce((sum, ch) => sum + ch.verse_count, 0)}`);
