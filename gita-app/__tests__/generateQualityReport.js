const fs = require('fs');
const path = require('path');

/**
 * Data Quality Report Generator
 * 
 * This script generates a detailed report of data quality issues in the Gita JSON files.
 * Run with: npm run data-quality-report
 */

function generateReport() {
  const dataDir = path.join(__dirname, '../data');
  const chaptersDir = path.join(dataDir, 'chapters');

  const report = {
    timestamp: new Date().toISOString(),
    chapters: {},
    summary: {
      totalChapters: 18,
      totalVerses: 0,
      chaptersWithVerseNumberingIssues: [],
      versesWithMissingContent: {
        sanskrit: 0,
        transliteration: 0,
      },
      fileSizes: {},
    },
  };

  // Analyze each chapter
  for (let i = 1; i <= 18; i++) {
    const chapterNum = String(i).padStart(2, '0');
    const filePath = path.join(chaptersDir, `chapter-${chapterNum}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const chapterReport = {
      chapter: i,
      verseCount: data.verse_count,
      actualVersesInArray: data.verses.length,
      match: data.verse_count === data.verses.length,
      verseNumberingIssues: [],
      missingContent: {
        sanskrit: 0,
        transliteration: 0,
      },
      fileSize: fs.statSync(filePath).size,
    };

    // Check verse numbering
    for (let j = 0; j < data.verses.length; j++) {
      const expected = j + 1;
      const actual = data.verses[j].verse;

      if (expected !== actual) {
        chapterReport.verseNumberingIssues.push({
          arrayPosition: j,
          expectedVerseNumber: expected,
          actualVerseNumber: actual,
        });
      }

      // Check content
      if (!data.verses[j].sanskrit) {
        chapterReport.missingContent.sanskrit++;
      }
      if (!data.verses[j].transliteration) {
        chapterReport.missingContent.transliteration++;
      }
    }

    report.chapters[`chapter-${chapterNum}`] = chapterReport;
    report.summary.totalVerses += data.verse_count;
    report.summary.fileSizes[`chapter-${chapterNum}`] = `${(chapterReport.fileSize / 1024).toFixed(2)} KB`;

    if (chapterReport.verseNumberingIssues.length > 0) {
      report.summary.chaptersWithVerseNumberingIssues.push(i);
    }

    report.summary.versesWithMissingContent.sanskrit += chapterReport.missingContent.sanskrit;
    report.summary.versesWithMissingContent.transliteration += chapterReport.missingContent.transliteration;
  }

  return report;
}

// Export for use in other modules
module.exports = { generateReport };

// If run directly
if (require.main === module) {
  const report = generateReport();
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         BHAGAVAD GITA DATA QUALITY REPORT                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  console.log('\n📊 SUMMARY');
  console.log('─'.repeat(64));
  console.log(`Total Chapters: ${report.summary.totalChapters}`);
  console.log(`Total Verses: ${report.summary.totalVerses}`);
  console.log(`\nContentIssues:`);
  console.log(`  • Sanskrit Missing: ${report.summary.versesWithMissingContent.sanskrit} verses (${((report.summary.versesWithMissingContent.sanskrit / report.summary.totalVerses) * 100).toFixed(1)}%)`);
  console.log(`  • Transliteration Missing: ${report.summary.versesWithMissingContent.transliteration} verses (${((report.summary.versesWithMissingContent.transliteration / report.summary.totalVerses) * 100).toFixed(1)}%)`);
  
  console.log(`\n🔢 Verse Numbering Issues`);
  console.log('─'.repeat(64));
  if (report.summary.chaptersWithVerseNumberingIssues.length === 0) {
    console.log('✓ All chapters have correct sequential verse numbering');
  } else {
    console.log(`${report.summary.chaptersWithVerseNumberingIssues.length} chapters have numbering issues:`);
    report.summary.chaptersWithVerseNumberingIssues.forEach(chapterNum => {
      const chReport = report.chapters[`chapter-${String(chapterNum).padStart(2, '0')}`];
      console.log(`\n  Chapter ${chapterNum}:`);
      chReport.verseNumberingIssues.slice(0, 5).forEach(issue => {
        console.log(
          `    Position ${issue.arrayPosition}: Expected verse ${issue.expectedVerseNumber}, ` +
          `found verse ${issue.actualVerseNumber}`
        );
      });
      if (chReport.verseNumberingIssues.length > 5) {
        console.log(`    ... and ${chReport.verseNumberingIssues.length - 5} more issues`);
      }
    });
  }

  console.log(`\n📁 File Sizes`);
  console.log('─'.repeat(64));
  let totalSize = 0;
  Object.entries(report.summary.fileSizes).forEach(([name, size]) => {
    console.log(`  ${name}: ${size}`);
    totalSize += parseFloat(size);
  });
  console.log(`  ──────────────────`);
  console.log(`  Total: ${(totalSize / 1024).toFixed(2)} MB`);

  console.log('\n✅ STRUCTURE VALIDATION');
  console.log('─'.repeat(64));
  let structureIssues = 0;
  Object.values(report.chapters).forEach(chapter => {
    if (!chapter.match) {
      console.log(`⚠️  Chapter ${chapter.chapter}: verse_count (${chapter.verseCount}) !== verses.length (${chapter.actualVersesInArray})`);
      structureIssues++;
    }
  });
  if (structureIssues === 0) {
    console.log('✓ All chapters have verse_count matching verses array length');
  }

  console.log('\n' + '═'.repeat(64));
  console.log('Report generated:', report.timestamp);
  console.log('═'.repeat(64) + '\n');

  // Save report to file
  const reportPath = path.join(__dirname, '../data-quality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 Detailed report saved to: data-quality-report.json\n`);
}
