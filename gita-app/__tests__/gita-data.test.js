const fs = require("fs");
const path = require("path");

describe("Bhagavad Gita Data Validation", () => {
  const dataDir = path.join(__dirname, "../data");
  const chaptersDir = path.join(dataDir, "chapters");

  // Test 1: Verify exactly 18 chapters exist
  describe("Chapter Count", () => {
    test("should have exactly 18 chapters", () => {
      const files = fs
        .readdirSync(chaptersDir)
        .filter(
          (file) => file.startsWith("chapter-") && file.endsWith(".json"),
        );
      expect(files).toHaveLength(18);
    });

    test("chapters should be numbered 1-18", () => {
      const files = fs
        .readdirSync(chaptersDir)
        .filter((file) => file.startsWith("chapter-") && file.endsWith(".json"))
        .sort();

      for (let i = 0; i < 18; i++) {
        const expectedNum = String(i + 1).padStart(2, "0");
        expect(files[i]).toBe(`chapter-${expectedNum}.json`);
      }
    });
  });

  // Test 2: Verify verse_count matches verses.length
  describe("Verse Count Validation", () => {
    let allChapters = [];

    beforeAll(() => {
      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        allChapters.push({ chapter: i, filePath, data });
      }
    });

    test("each chapter verse_count should match verses array length", () => {
      allChapters.forEach(({ chapter, data }) => {
        expect(data.verse_count).toBe(data.verses.length);
      });
    });
  });

  // Test 3: Verify Sanskrit is never empty
  describe("Sanskrit Content Validation", () => {
    let allVerses = [];

    beforeAll(() => {
      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        data.verses.forEach((verse) => {
          allVerses.push({
            chapter: data.chapter,
            verse: verse.verse,
            sanskrit: verse.sanskrit,
            filePath,
          });
        });
      }
    });

    test("Sanskrit should never be null, empty, or undefined", () => {
      const emptyVerses = allVerses.filter(
        (v) =>
          v.sanskrit === null || v.sanskrit === "" || v.sanskrit === undefined,
      );

      if (emptyVerses.length > 0) {
        const examples = emptyVerses
          .slice(0, 5)
          .map((v) => `Chapter ${v.chapter}, Verse ${v.verse}`)
          .join(", ");

        console.error(
          `\n❌ Found ${emptyVerses.length} verses with empty Sanskrit text\n` +
            `Examples: ${examples}\n`,
        );
      }

      expect(emptyVerses).toEqual([]);
    });

    test("Sanskrit should contain actual text content", () => {
      const versesWithShortSanskrit = allVerses.filter(
        (v) => v.sanskrit && v.sanskrit.trim().length < 10,
      );

      if (versesWithShortSanskrit.length > 0) {
        console.warn(
          `\n⚠️  Warning: ${versesWithShortSanskrit.length} verses have surprisingly short Sanskrit text (< 10 chars)`,
        );
      }

      // All Sanskrit fields should be meaningful strings
      allVerses.forEach((v) => {
        expect(typeof v.sanskrit).toBe("string");
        expect(v.sanskrit.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // Test 4: Verify verse numbers are sequential
  describe("Verse Numbering Validation", () => {
    test("should detect and report verse numbering issues", () => {
      const issues = [];

      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // Check if array positions match verse numbers
        for (
          let verseIndex = 0;
          verseIndex < data.verses.length;
          verseIndex++
        ) {
          const expectedVerseNum = verseIndex + 1;
          const actualVerseNum = data.verses[verseIndex].verse;

          if (actualVerseNum !== expectedVerseNum) {
            issues.push({
              chapter: i,
              position: verseIndex,
              expected: expectedVerseNum,
              actual: actualVerseNum,
            });
          }
        }
      }

      if (issues.length > 0) {
        console.log(`\nVerse Numbering Issues Found: ${issues.length}`);
        issues.slice(0, 10).forEach((issue) => {
          console.log(
            `  Chapter ${String(issue.chapter).padStart(2, "0")}, ` +
              `Array Position ${issue.position}: Expected verse ${issue.expected}, found verse ${issue.actual}`,
          );
        });
        if (issues.length > 10) {
          console.log(`  ... and ${issues.length - 10} more issues`);
        }
        console.log(
          `\n⚠️  Action Required: Fix verse numbering in ${new Set(issues.map((i) => i.chapter)).size} chapter(s)`,
        );
      }

      // Test fails if issues exist - use STRICT mode
      // To allow warnings without failure, comment out the line below
      expect(issues.length).toBe(0);
    });

    test("no duplicate verse numbers within a chapter", () => {
      let duplicateCount = 0;

      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const verseNumbers = data.verses.map((v) => v.verse);
        const uniqueNumbers = new Set(verseNumbers);

        if (uniqueNumbers.size !== verseNumbers.length) {
          duplicateCount++;
          const duplicates = verseNumbers.filter(
            (v, i) => verseNumbers.indexOf(v) !== i,
          );
          console.log(
            `\nChapter ${i} has duplicate verses: ${[...new Set(duplicates)].join(", ")}`,
          );
        }

        expect(uniqueNumbers.size).toBe(verseNumbers.length);
      }
    });
  });

  // Test 5: Verify no JSON files exceed reasonable size limits
  describe("File Size Validation", () => {
    const MAX_FILE_SIZE = 1024 * 1024; // 1 MB - reasonable for a single chapter
    const MAX_GITA_DATA_SIZE = 10 * 1024 * 1024; // 10 MB - reasonable for all verses

    test("no chapter file should exceed 1 MB", () => {
      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const stats = fs.statSync(filePath);

        expect(stats.size).toBeLessThan(MAX_FILE_SIZE);
      }
    });

    test("gita-data.json should not exceed 10 MB", () => {
      const gitaDataPath = path.join(dataDir, "gita-data.json");
      if (fs.existsSync(gitaDataPath)) {
        const stats = fs.statSync(gitaDataPath);
        expect(stats.size).toBeLessThan(MAX_GITA_DATA_SIZE);
      }
    });

    test("chapter files should be reasonably sized (> 1 KB)", () => {
      const MIN_FILE_SIZE = 1024; // 1 KB minimum

      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const stats = fs.statSync(filePath);

        expect(stats.size).toBeGreaterThan(MIN_FILE_SIZE);
      }
    });

    test("should report file sizes for monitoring", () => {
      const sizes = {};
      let totalSize = 0;

      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const stats = fs.statSync(filePath);
        sizes[`chapter-${chapterNum}`] = `${(stats.size / 1024).toFixed(2)} KB`;
        totalSize += stats.size;
      }

      const gitaDataPath = path.join(dataDir, "gita-data.json");
      if (fs.existsSync(gitaDataPath)) {
        const stats = fs.statSync(gitaDataPath);
        sizes["gita-data"] = `${(stats.size / 1024).toFixed(2)} KB`;
        totalSize += stats.size;
      }

      sizes["total"] = `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
      console.log("\nFile Sizes:", JSON.stringify(sizes, null, 2));
    });
  });

  // Integration test
  describe("Complete Data Integrity", () => {
    test("all chapters should be valid JSON with required fields", () => {
      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        expect(data).toHaveProperty("chapter");
        expect(data).toHaveProperty("verse_count");
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("verses");
        expect(Array.isArray(data.verses)).toBe(true);
      }
    });

    test("all verses should have required fields", () => {
      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        data.verses.forEach((verse) => {
          expect(verse).toHaveProperty("verse");
          expect(verse).toHaveProperty("sanskrit");
          expect(verse).toHaveProperty("transliteration");
          expect(verse).toHaveProperty("translations");
        });
      }
    });

    test("summary: Total verse count across all chapters", () => {
      let totalVerses = 0;

      for (let i = 1; i <= 18; i++) {
        const chapterNum = String(i).padStart(2, "0");
        const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        totalVerses += data.verse_count;
      }

      console.log(`\nTotal verses in Bhagavad Gita: ${totalVerses}`);
      expect(totalVerses).toBe(719);
    });

    test("canonical totals are aligned across generated data artifacts", () => {
      const assetsDataPath = path.join(__dirname, "../assets/data.json");
      const sourceDataPath = path.join(dataDir, "gita-data.json");

      const assetsData = JSON.parse(fs.readFileSync(assetsDataPath, "utf8"));
      const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, "utf8"));

      const getTotal = (chapters) =>
        chapters.reduce((sum, chapter) => sum + chapter.verse_count, 0);

      const assetsTotal = getTotal(assetsData);
      const sourceTotal = getTotal(sourceData);

      expect(assetsTotal).toBe(719);
      expect(sourceTotal).toBe(719);
      expect(assetsTotal).toBe(sourceTotal);
    });
  });
});
