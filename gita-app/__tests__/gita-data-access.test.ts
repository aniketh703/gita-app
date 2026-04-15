import {
    getChapterById,
    getChapters,
    getVerse,
} from "@/src/data/gitaDataAccess";

describe("Gita data access module", () => {
  test("loads all chapters successfully", () => {
    const chapters = getChapters();

    expect(Array.isArray(chapters)).toBe(true);
    expect(chapters.length).toBe(18);

    const chapterNumbers = new Set(chapters.map((ch) => ch.chapter));
    expect(chapterNumbers.size).toBe(18);

    chapters.forEach((chapter) => {
      expect(chapter.verses.length).toBeGreaterThan(0);
      expect(chapter.verse_count).toBe(chapter.verses.length);
    });
  });

  test("returns correct verse content", () => {
    const verse = getVerse(1, 1);

    expect(verse).toBeDefined();
    expect(typeof verse?.translations.english).toBe("string");
    expect(verse?.translations.english.length).toBeGreaterThan(20);
    expect(verse?.translations.english.toLowerCase()).toContain("kurukshetra");
    expect(verse?.translations.english.toLowerCase()).toContain("sanjaya");
  });

  test("handles missing translations safely", () => {
    const chapters = getChapters();
    const verses = chapters.flatMap((chapter) => chapter.verses);

    expect(verses.length).toBeGreaterThan(0);

    verses.forEach((verse) => {
      expect(typeof verse.translations.english).toBe("string");
      expect(verse.translations.english.trim().length).toBeGreaterThan(0);
      expect(typeof verse.translations.hindi).toBe("string");

      const safeHindiCommentary = verse.commentary?.hindi ?? null;
      expect(
        safeHindiCommentary === null || typeof safeHindiCommentary === "string",
      ).toBe(true);
    });
  });

  test("returns chapter by id", () => {
    const chapter = getChapterById(2);

    expect(chapter).toBeDefined();
    expect(chapter?.chapter).toBe(2);
    expect(chapter?.verses.length).toBeGreaterThan(0);
  });
});
