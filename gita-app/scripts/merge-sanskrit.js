const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const slokDir = path.join(baseDir, 'Bhagwat-Gita-Infinity', 'slok');
const targets = [
  path.join(baseDir, 'assets', 'data.json'),
  path.join(baseDir, 'data', 'gita-data.json'),
];

function isPlaceholder(text, placeholderToken) {
  if (!text) return true;
  return text.toLowerCase().includes(placeholderToken);
}

function loadSlokMap() {
  const map = new Map();
  const files = fs.readdirSync(slokDir).filter((name) => name.endsWith('.json'));

  for (const fileName of files) {
    const filePath = path.join(slokDir, fileName);
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed.chapter !== 'number' || typeof parsed.verse !== 'number') {
      continue;
    }

    const key = `${parsed.chapter}.${parsed.verse}`;
    map.set(key, {
      sanskrit: parsed.slok || '',
      transliteration: parsed.transliteration || '',
    });
  }

  return map;
}

function updateTarget(targetPath, slokMap) {
  const raw = fs.readFileSync(targetPath, 'utf8');
  const data = JSON.parse(raw);
  let updatedSanskrit = 0;
  let updatedTranslit = 0;

  for (const chapter of data) {
    if (!chapter || !Array.isArray(chapter.verses)) {
      continue;
    }

    for (const verse of chapter.verses) {
      const key = `${chapter.chapter}.${verse.verse}`;
      const slok = slokMap.get(key);
      if (!slok) {
        continue;
      }

      if (isPlaceholder(verse.sanskrit, 'sanskrit text needed') && slok.sanskrit) {
        verse.sanskrit = slok.sanskrit;
        updatedSanskrit += 1;
      }

      if (isPlaceholder(verse.transliteration, 'transliteration needed') && slok.transliteration) {
        verse.transliteration = slok.transliteration;
        updatedTranslit += 1;
      }
    }
  }

  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n', 'utf8');

  return { updatedSanskrit, updatedTranslit };
}

function main() {
  const slokMap = loadSlokMap();

  for (const target of targets) {
    const result = updateTarget(target, slokMap);
    console.log(
      `${path.relative(baseDir, target)}: Sanskrit ${result.updatedSanskrit}, Transliteration ${result.updatedTranslit}`
    );
  }
}

main();
