/**
 * Canonical JSON Schema for Bhagavad Gita App
 * 
 * OFFLINE REACT NATIVE COMPATIBILITY: ✅
 * - Designed for offline-first usage (bundled in assets/)
 * - No network dependencies required
 * - Supports Unicode scripts (Devanagari)
 * - Optimized for ~15-20MB bundled size
 * 
 * VERSION: 1.0 (Stable - No breaking changes)
 * LAST UPDATED: 2026-02-07
 */

/**
 * Language keys supported across the app
 * Currently supporting: English (required), Hindi
 * 
 * Usage:
 *   - User preference stored in AppContext
 *   - Falls back to 'english' if selected language missing
 *   - Used as object keys in LocalizableText interfaces
 */
export type LangKey = 'english' | 'hindi';

/**
 * Text content available in multiple languages
 * 
 * EDGE CASE HANDLING:
 *   - Some translations may be placeholder "[Language translation needed]" (data quality issue)
 *   - Recommended: Check at runtime and fall back to English if needed
 *   - Commentary often partially populated (use Partial<LocalizableText>)
 * 
 * FIELD DEFINITIONS:
 *   english: Always present; the primary translation (Swami Prabhupada translation)
 *   hindi:   Sanskrit-derived meaning in Devanagari; may be incomplete
 */
export interface LocalizableText {
  /** English translation by Swami A.C. Bhaktivedanta Prabhupada - PRIMARY SOURCE */
  english: string;
  /** Hindi translation in Devanagari script - in progress (Partial) */
  hindi: string;
}

/**
 * Single verse within a chapter
 * 
 * OFFLINE CONSIDERATIONS:
 *   - Each verse is ~2-5KB in memory when fully loaded
 *   - 700 verses × 5KB = ~3.5MB in memory (acceptable)
 *   - Stored as-is in JSON for O(1) array lookup
 * 
 * EDGE CASES:
 *   1. Long Verses: Some translations exceed 500 chars (e.g., 1.4)
 *      → UI Must handle with ScrollView; currently implemented ✅
 *   2. Missing Sanskrit: ALL verses currently have "[Sanskrit text needed]"
 *      → Required for educational correctness & transliteration
 *      → Data quality issue, not schema issue
 *   3. Missing Transliteration: ALL verses marked "[Transliteration needed]"
 *      → Can be generated from Sanskrit using IAST converter
 *      → Shows romanized pronunciation for users unfamiliar with Devanagari
 *   4. Verse Numbering: Some verses missing (e.g., 1.5, 1.6 skipped in chapter 1)
 *      → Use the 'verse' field as explicit ID, NOT array index
 *      → Allows future data reorganization without breaking code
 * 
 * SCHEMA DEFINITION:
 */
export interface Verse {
  /** Verse number within chapter (1-71 typical range, may have gaps) */
  verse: number;
  
  /** Original Sanskrit text in Devanagari script
   *  CRITICAL FIELD - Currently placeholder in all verses
   *  Used for: Authenticity, pronunciation learning, transliteration generation
   *  Example: "सञ्जय उवाच..." (Sanjaya said...)
   *  NOTE: Essential for app's core educational purpose
   */
  sanskrit: string;
  
  /** Latin romanization of Sanskrit (IAST standard intended)
   *  Used for: Users unfamiliar with Devanagari script
   *  Example: "Sanjaya uvācha..." (phonetic reading of Sanskrit)
   *  CURRENTLY PLACEHOLDER - Can be auto-generated from Sanskrit using iast-converter
   *  Character length: ~200-300 chars typical (plan for 500+ worst case)
   */
  transliteration: string;
  
  /** Translations in supported languages
   *  english: Always required & present (Prabhupada translation)
   *  hindi: May contain "[Language translation needed]" placeholder
   *  Character length: 200-500 chars typical (longest: 488 chars in 1.4)
   *  MOBILE CONSIDERATION: Translating longer verses requires scrollable text view
   */
  translations: LocalizableText;
  
  /** Commentary/explanation (OPTIONAL - may be none, partial, or complete)
   *  Usually only English provided; other languages incomplete
   *  Used for: Deeper understanding, historical context
   *  Partial<LocalizableText> = some languages may be undefined
   *  Character length: 300-1000+ chars when present
   *  CURRENT STATE: ~30% of verses have English commentary, <5% have any other language
   */
  commentary?: Partial<LocalizableText>;
  
  /** RESERVED FOR FUTURE USE (v1.1+)
   *  Suggested additions without breaking changes:
   *   - metadata?: { source?: string; translator?: string; completionStatus?: Record<LangKey, boolean>; }
   *   - speaker?: string; // "Krishna", "Arjuna", "Sanjaya", etc.
   *   - related_verses?: number[]; // Cross-references
   */
}

/**
 * A complete chapter of verses
 * 
 * OFFLINE CONSIDERATIONS:
 *   - 18 chapters total (some have 35 verses, some 71)
 *   - Top-level array has 18 items = fast iteration
 *   - Each chapter is independently loadable (no dependencies)
 * 
 * EDGE CASES:
 *   1. Verse count consistency: Verify count matches array length
 *   2. Name availability: All languages may not have translations yet
 *   3. Name length: Titles are short (20-50 chars), no wrapping issues
 * 
 * SCHEMA DEFINITION:
 */
export interface Chapter {
  /** Chapter number (1-18) 
   *  Immutable identifier; never changes
   *  Used for: Navigation, deep linking, local storage keys
   */
  chapter: number;
  
  /** Number of verses in this chapter (accurate count)
   *  Range: 35-71 verses per chapter
   *  Used for: UI progress bars, validation checks
   *  VALIDATION: Should match verses.length in runtime
   */
  verse_count: number;
  
  /** Chapter title in supported languages
   *  Each title is a yoga (union/path) name in Sanskrit philosophy
   *  Examples:
   *    - Chapter 1: "Arjuna Vishada Yoga" (Yoga of Arjuna's Despair)
   *    - Chapter 2: "Sankhya Yoga" (Yoga of Knowledge)
   *  Character length: 20-50 chars per language (no wrapping issues)
   *  English: Always present & translated
   *  Other languages: May have "[Language translation needed]" placeholder
   */
  name: LocalizableText;
  
  /** Array of all verses in this chapter
   *  ORDERING: Verses are in sequential order (may have gaps in numbering)
   *  LOOKUP: Use verse.verse field to find specific verse, NOT array index
   *  EXAMPLE: verses[0].verse might be 1, but verses[1] might be verse #3 (if 2 is skipped)
   *  PERFORMANCE: Array access is O(n) on chapter vs O(1) on verse number
   *  RECOMMENDATION: For app navigation, iterate array by index; store selected via verse number
   */
  verses: Verse[];
}

/**
 * Application theme settings
 * OFFLINE PERSISTENCE: Stored via AsyncStorage
 * USAGE: Propagated through React Context
 */
export interface AppTheme {
  /** Dark mode toggle - affects all text/background colors throughout app */
  isDark: boolean;
  
  /** RESERVED FOR FUTURE (v1.1+):
   *    - primaryColor?: string; // Theme accent color
   *    - fontFamily?: 'default' | 'serif' | 'mono'; // Typography preference
   *    - highContrast?: boolean; // Accessibility mode
   */
}

/**
 * Global application state & context
 * 
 * OFFLINE BEHAVIOR:
 *   - All settings persisted to AsyncStorage on change
 *   - Settings restored from AsyncStorage on app launch
 *   - No network calls required
 *   - Preferences survive app restart/update
 * 
 * MOBILE CONSIDERATIONS:
 *   - Language change triggers re-render via context (fast)
 *   - Theme change affects system nav bar (native integration)
 *   - Font size change rescales entire UI (12-24px range)
 *   - All setters are memoized to prevent unnecessary re-renders
 */
export interface AppContextType {
  /** User's selected language for UI & content display
   *  Default: 'english' (fallback if selected language unavailable)
   *  Persisted: Yes (AsyncStorage key: 'gita_language')
   *  Affects: All visible text, chapter names, verse translations
  *  EDGE CASE: If Hindi translation is missing, UI should fall back to English
   */
  language: LangKey;
  setLanguage: (lang: LangKey) => void;
  
  /** App visual theme (light/dark mode)
   *  Default: false (light mode)
   *  Persisted: Yes (AsyncStorage key: 'gita_theme')
   *  Affects: Background colors, text colors, nav bar style
   *  Native Integration: Updates system status bar on Android
   */
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  
  /** Font size scaling factor
   *  Range: 12-24px (5 preset sizes: 12, 14, 16, 20, 24)
   *  Default: 16px
   *  Persisted: Yes (AsyncStorage key: 'gita_fontSize')
   *  Affects: Verse text size, all readable content
   *  ACCESSIBILITY: Supports users with vision impairment
   *  LAYOUT: All text views use flex scaling; no hardcoded widths
   */
  fontSize: number;
  setFontSize: (size: number) => void;
  
  /** Toggle transliteration display (Latin script rendering of Sanskrit)
   *  Default: true (users often unfamiliar with Devanagari)
   *  Persisted: Yes (AsyncStorage key: 'gita_transliteration')
   *  Currently: All transliterations marked "[Transliteration needed]" - not populated
   *  Future: When Sanskrit populated, transliteration can be auto-generated
   */
  showTransliteration: boolean;
  setShowTransliteration: (show: boolean) => void;
}

/**
 * Chapter metadata for list views
 * USAGE: Shown in chapters.tsx (browse all chapters)
 * OPTIMIZATION: Lightweight version of Chapter (no full verses array)
 */
export interface ChapterSummary {
  /** Chapter number (1-18) for navigation */
  chapter: number;
  
  /** Chapter title (yoga name) in selected language */
  name: LocalizableText;
  
  /** Verse count for progress display & lazy-loading hints */
  verse_count: number;
}
