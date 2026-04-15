#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const csvPath = path.join(
  __dirname,
  "..",
  "data",
  "input",
  "bhagavad_gita_verses.csv",
);
const outputDir = path.join(__dirname, "..", "data");
const outputPath = path.join(outputDir, "gita-data.json");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Chapter names
const chapterNames = {
  1: {
    english: "Arjuna Vishada Yoga",
    hindi: "अर्जुन विषाद योग",
    tamil: "அர்ஜுன விஷாத யோகம்",
    kannada: "ಅರ್ಜುನ ವಿಷಾದ ಯೋಗ",
  },
  2: {
    english: "Sankhya Yoga",
    hindi: "सांख्य योग",
    tamil: "சாங்க்य யோகம்",
    kannada: "ಸಾಂಖ್ಯ ಯೋಗ",
  },
  3: {
    english: "Karma Yoga",
    hindi: "कर्म योग",
    tamil: "கர्ம யோகம்",
    kannada: "ಕರ್ಮ ಯೋಗ",
  },
  4: {
    english: "Jnana Yoga",
    hindi: "ज्ञान योग",
    tamil: "ஞான யோகம்",
    kannada: "ಜ್ಞಾನ ಯೋಗ",
  },
  5: {
    english: "Sannyasa Yoga",
    hindi: "संन्यास योग",
    tamil: "சன்னியாஸ யோகம்",
    kannada: "ಸನ್ನ್ಯಾಸ ಯೋಗ",
  },
  6: {
    english: "Dhyana Yoga",
    hindi: "ध्यान योग",
    tamil: "தியான யோகம்",
    kannada: "ಧ್ಯಾನ ಯೋಗ",
  },
  7: {
    english: "Jnana-Vijnana Yoga",
    hindi: "ज्ञान-विज्ञान योग",
    tamil: "ஞான-விஞ்ஞான யோகம்",
    kannada: "ಜ್ಞಾನ-ವಿಜ್ಞಾನ ಯೋಗ",
  },
  8: {
    english: "Aksara-Brahman Yoga",
    hindi: "अक्षर-ब्रह्मन योग",
    tamil: "அக்ஷர-ப्रह्म யோகம்",
    kannada: "ಅಕ್ಷರ-ಬ್ರಹ್ಮನ ಯೋಗ",
  },
  9: {
    english: "Raja-Guhya Yoga",
    hindi: "राज-गुह्य योग",
    tamil: "ராज-குஹ்ய யோகம்",
    kannada: "ರಾಜ-ಗುಹ್ಯ ಯೋಗ",
  },
  10: {
    english: "Vibhuti Yoga",
    hindi: "विभूति योग",
    tamil: "விபூதி யோகம்",
    kannada: "ವಿಭೂತಿ ಯೋಗ",
  },
  11: {
    english: "Visvarupa-Darsana Yoga",
    hindi: "विश्वरूप-दर्शन योग",
    tamil: "விஸ்வரூப-தர்ஶன யோகம்",
    kannada: "ವಿಶ್ವರೂಪ-ದರ್ಶನ ಯೋಗ",
  },
  12: {
    english: "Bhakti Yoga",
    hindi: "भक्ति योग",
    tamil: "பக்தி யோகம்",
    kannada: "ಭಕ್ತಿ ಯೋಗ",
  },
  13: {
    english: "Kshetra-Kshetrajna Yoga",
    hindi: "क्षेत्र-क्षेत्रज्ञ योग",
    tamil: "ක్ష്ේత్ర-్ క్ష్ేత్రజ్ఞ యోగం",
    kannada: "ಕ್ಷೇತ್ರ-ಕ್ಷೇತ್ರಜ್ಞ ಯೋಗ",
  },
  14: {
    english: "Gunatraya-Vibhaga Yoga",
    hindi: "गुणत्रय-विभाग योग",
    tamil: "குணத்ரய-விபாक யோகம்",
    kannada: "ಗುಣತ್ರಯ-ವಿಭಾಗ ಯೋಗ",
  },
  15: {
    english: "Purushottama Yoga",
    hindi: "पुरुषोत्तम योग",
    tamil: "புருஷோத்தம யோகம்",
    kannada: "ಪುರುಷೋತ್ತಮ ಯೋಗ",
  },
  16: {
    english: "Daivasura-Sampad-Vibhaga Yoga",
    hindi: "दैवासुर-सम्पद्-विभाग योग",
    tamil: "தைவாசுர-சம்பத்-விபாக யோகம்",
    kannada: "ದೈವಾಸುರ-ಸಂಪದ್-ವಿಭಾಗ ಯೋಗ",
  },
  17: {
    english: "Shraddhatraya-Vibhaga Yoga",
    hindi: "श्रद्धात्रय-विभाग योग",
    tamil: "ஶ்ரத்தாத్ర్య-విభాగ యోగం",
    kannada: "ಶ್ರದ್ಧಾತ್ರಯ-ವಿಭಾಗ ಯೋಗ",
  },
  18: {
    english: "Moksha-Sannyasa Yoga",
    hindi: "मोक्ष-संन्यास योग",
    tamil: "மோக்ஷ-சன்னியாஸ யோகம்",
    kannada: "ಮೋಕ್ಷ-ಸನ್ನ್ಯಾಸ ಯೋಗ",
  },
};

const content = fs.readFileSync(csvPath, "utf-8");
const lines = content.split("\n");

const chapters = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Parse CSV with quoted field support
  const match = line.match(/^([^,]+),([^,]+),([^,]+),"(.*)"/);
  if (!match) continue;

  const [, chapterStr, titleStr, verseStr, translation] = match;
  const chapterNum = parseInt(chapterStr.replace("Chapter ", ""), 10);
  const verseNum = parseInt(verseStr.split("–")[0].split(".")[1], 10);

  if (!chapters[chapterNum]) {
    chapters[chapterNum] = {
      chapter: chapterNum,
      verse_count: 0,
      name: chapterNames[chapterNum] || {
        english: `Chapter ${chapterNum}`,
        hindi: `अध्याय ${chapterNum}`,
        tamil: `அதிகாரம் ${chapterNum}`,
        kannada: `ಅಧ್ಯಾಯ ${chapterNum}`,
      },
      verses: [],
    };
  }

  chapters[chapterNum].verses.push({
    verse: verseNum,
    sanskrit: "[Sanskrit text needed]",
    transliteration: "[Transliteration needed]",
    translations: {
      english: translation,
      hindi: "[Hindi translation needed]",
      tamil: "[Tamil translation needed]",
      kannada: "[Kannada translation needed]",
    },
    commentary: {
      english: "[Commentary needed]",
      hindi: "[Commentary needed]",
    },
  });
}

// Sort and finalize
Object.values(chapters).forEach((ch) => {
  ch.verses.sort((a, b) => a.verse - b.verse);
  ch.verse_count = ch.verses.length;
});

const gitaData = Object.values(chapters).sort((a, b) => a.chapter - b.chapter);

fs.writeFileSync(outputPath, JSON.stringify(gitaData, null, 2), "utf-8");
console.log(`✓ Converted CSV to JSON: ${outputPath}`);
console.log(`✓ Total chapters: ${gitaData.length}`);
console.log(
  `✓ Total verses: ${gitaData.reduce((sum, ch) => sum + ch.verse_count, 0)}`,
);
