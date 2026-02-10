import { getChapterById, getChapters, getVerse } from '@/src/data/gitaDataAccess';

describe('Gita data access module', () => {
  test('loads all chapters successfully', () => {
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

  test('returns correct verse content', () => {
    const verse = getVerse(1, 1);

    expect(verse).toBeDefined();
    expect(verse?.translations.english).toBe(
      'Dhritarashtra said: O Sanjay, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?'
    );
  });

  test('handles missing translations safely', () => {
    const chapters = getChapters();
    const verseWithPlaceholder = chapters
      .flatMap((ch) => ch.verses)
      .find((verse) => verse.translations.hindi.includes('translation needed'));

    expect(verseWithPlaceholder).toBeDefined();

    if (!verseWithPlaceholder) {
      return;
    }

    expect(verseWithPlaceholder.translations.english.length).toBeGreaterThan(0);
    expect(typeof verseWithPlaceholder.translations.hindi).toBe('string');

    const safeCommentary = verseWithPlaceholder.commentary?.hindi ?? null;
    expect(safeCommentary === null || typeof safeCommentary === 'string').toBe(true);
  });

  test('returns chapter by id', () => {
    const chapter = getChapterById(2);

    expect(chapter).toBeDefined();
    expect(chapter?.chapter).toBe(2);
    expect(chapter?.verses.length).toBeGreaterThan(0);
  });
});
