#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Paths
const chaptersDir = path.join(__dirname, "..", "data", "chapters");
const outputPaths = [
  path.join(__dirname, "..", "assets", "data.json"),
  path.join(__dirname, "..", "data", "gita-data.json"),
];

console.log("📚 Consolidating Bhagavad Gita chapters...\n");

// Array to store all chapters
const allChapters = [];

// Read all chapter files
for (let i = 1; i <= 18; i++) {
  const chapterFile = path.join(
    chaptersDir,
    `chapter-${String(i).padStart(2, "0")}.json`,
  );

  try {
    const fileContent = fs.readFileSync(chapterFile, "utf-8");
    const chapterData = JSON.parse(fileContent);

    // Verify data structure
    if (!chapterData.chapter || !chapterData.verses) {
      throw new Error(`Invalid structure in ${chapterFile}`);
    }

    allChapters.push(chapterData);
    console.log(
      `✓ Chapter ${i}: ${chapterData.name.english} (${chapterData.verse_count} verses)`,
    );
  } catch (error) {
    console.error(`✗ Error loading chapter ${i}:`, error.message);
    process.exit(1);
  }
}

// Verify we have all 18 chapters
if (allChapters.length !== 18) {
  console.error(`\n✗ Expected 18 chapters, found ${allChapters.length}`);
  process.exit(1);
}

// Calculate total verses
const totalVerses = allChapters.reduce((sum, ch) => sum + ch.verse_count, 0);
console.log(`\n📊 Total verses: ${totalVerses}`);

// Write consolidated data
try {
  for (const outputPath of outputPaths) {
    fs.writeFileSync(outputPath, JSON.stringify(allChapters, null, 2), "utf-8");
  }
  console.log(`\n✅ Successfully consolidated data to:`);
  outputPaths.forEach((outputPath) => console.log(`   ${outputPath}`));
} catch (error) {
  console.error(`\n✗ Error writing consolidated data:`, error.message);
  process.exit(1);
}

console.log("\n🎉 Done! The app is now ready to use with complete Gita data.");
