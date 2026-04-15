/**
 * Global App Store (Zustand)
 * Manages: Theme, Font Scale, Language, Audio Sync, Premium Status, Reading Progress, Streak Data, Onboarding
 * Single source of truth for all app state - all screens react instantly to changes
 */

import gitaDataJson from "@/assets/data.json";
import type { OnboardingGoal, OnboardingState } from "@/src/types/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DAY_MS = 86400000;

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TOTAL_VERSES = (gitaDataJson as { verse_count: number }[]).reduce(
  (sum, chapter) => sum + chapter.verse_count,
  0,
);

/**
 * Reading Progress Interface
 */
export interface ReadingProgress {
  chapterId: number;
  verseId: number;
  scrollPosition: number;
  lastReadAt: string;
}

/**
 * Streak Data Interface
 */
export interface StreakData {
  currentStreak: number;
  lastStreakDate: string;
  longestStreak: number;
  totalDaysRead: number;
  streakShields: number;
  readings: Record<string, number>; // date -> verses read count
}

export interface StreakRiskState {
  isAtRisk: boolean;
  missedDays: number;
}

/**
 * Audio Sync State
 */
export interface AudioSyncState {
  isPlaying: boolean;
  isEnabled: boolean;
  currentVerseIndex: number;
  playbackSpeed: number;
  highlightedWordIndex: number;
}

/**
 * Notification Settings
 */
export interface NotificationSettings {
  enabled: boolean;
  time: string; // "morning" | "evening" | "night" | custom time string
  permissionAsked: boolean;
}

/**
 * Rating Prompt State
 */
export interface RatingState {
  hasRated: boolean;
  slokasReadSinceLastPrompt: number;
  lastPromptDate: string | null;
  promptsShown: number;
}

/**
 * App Store State & Actions
 */
export interface AppStoreState {
  // Theme & Appearance
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  fontScale: number; // 0.8 to 1.5
  setFontScale: (scale: number) => void;
  lineHeight: number; // 1.2 to 2.0
  setLineHeight: (height: number) => void;

  // Language & Text
  language: "english" | "hindi" | "sanskrit";
  setLanguage: (lang: "english" | "hindi" | "sanskrit") => void;
  transliterationEnabled: boolean;
  setTransliterationEnabled: (enabled: boolean) => void;

  // Audio Features
  audioSync: AudioSyncState;
  setAudioSyncPlaying: (playing: boolean) => void;
  setAudioSyncEnabled: (enabled: boolean) => void;
  updateAudioSyncVerse: (verseIndex: number, wordIndex: number) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Monetization
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  showAds: boolean;
  setShowAds: (value: boolean) => void;

  // Reading Progress
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  currentVerse: number;
  setCurrentVerse: (verse: number) => void;
  readingHistory: ReadingProgress[];
  recordReading: (
    chapterId: number,
    verseId: number,
    scrollPos: number,
  ) => void;
  getScrollPosition: (chapterId: number) => number;

  // Streak & Japamala
  streak: StreakData;
  updateStreak: (versesRead: number) => void;
  jumpStreakTo: (date: string) => void;
  streakRisk: StreakRiskState;
  checkStreakRisk: () => void;
  acceptStreakShield: () => boolean;
  declineStreakShield: () => void;

  // Focus Mode
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;

  // Chapter Completion Tracking
  completedChapters: Set<number>;
  markChapterComplete: (chapterId: number) => void;
  isChapterComplete: (chapterId: number) => boolean;

  // Show celebration flag
  showCelebration: boolean;
  setShowCelebration: (show: boolean) => void;

  // Onboarding
  onboarding: OnboardingState;
  completeOnboarding: () => void;
  updateOnboardingStep: (step: number) => void;
  setOnboardingGoal: (goal: OnboardingGoal) => void;
  setOnboardingPreferences: (
    preferences: OnboardingState["preferences"],
  ) => void;
  setOnboardingAppearance: (appearance: OnboardingState["appearance"]) => void;
  hasCompletedOnboarding: () => boolean;
  resetOnboarding: () => void;

  // Gamification
  badges: string[];
  addBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
  achievements: { id: string; unlockedAt: string }[];
  unlockAchievement: (achievementId: string) => void;

  // Growth Features
  // Daily Sloka
  dailySlokaDate: string | null;
  generateDailySlokaIndex: () => number;

  // Rating Prompt
  ratingState: RatingState;
  incrementSlokasRead: () => void;
  markAsRated: () => void;
  shouldShowRatingPrompt: () => boolean;

  // Notification Settings
  notificationSettings: NotificationSettings;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setNotificationPermissionAsked: (asked: boolean) => void;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // First Launch
  isFirstLaunch: boolean;
  setFirstLaunchComplete: () => void;

  // Theme Selection (Premium Themes)
  selectedTheme: string;
  setSelectedTheme: (themeId: string) => void;

  // 3-Day Challenge System
  challengeStartDate: string | null;
  challengeCompleted: boolean;
  startChallenge: () => void;
  completeChallenge: () => void;

  // Rating State Updates
  updateRatingState: (updates: Partial<RatingState>) => void;
}

const INITIAL_STREAK: StreakData = {
  currentStreak: 0,
  lastStreakDate: "",
  longestStreak: 0,
  totalDaysRead: 0,
  streakShields: 1,
  readings: {},
};

const INITIAL_STREAK_RISK: StreakRiskState = {
  isAtRisk: false,
  missedDays: 0,
};

const INITIAL_ONBOARDING: OnboardingState = {
  completed: false,
  currentStep: 1,
  totalSteps: 5,
  selectedGoal: null,
  preferences: {
    showSanskrit: true,
    showTransliteration: true,
    showEnglish: true,
    showHindi: false,
  },
  appearance: {
    fontSize: "medium",
    theme: "system",
  },
  completedAt: null,
};

const INITIAL_RATING_STATE: RatingState = {
  hasRated: false,
  slokasReadSinceLastPrompt: 0,
  lastPromptDate: null,
  promptsShown: 0,
};

const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  time: "morning",
  permissionAsked: false,
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Theme & Appearance
      isDarkMode: true,
      setDarkMode: (value) => set({ isDarkMode: value }),
      fontScale: 1.0,
      setFontScale: (scale) =>
        set({ fontScale: Math.max(0.8, Math.min(1.5, scale)) }),
      lineHeight: 1.6,
      setLineHeight: (height) =>
        set({ lineHeight: Math.max(1.2, Math.min(2.0, height)) }),

      // Language & Text
      language: "english",
      setLanguage: (lang) => set({ language: lang }),
      transliterationEnabled: true,
      setTransliterationEnabled: (enabled) =>
        set({ transliterationEnabled: enabled }),

      // Audio Features
      audioSync: {
        isPlaying: false,
        isEnabled: false,
        currentVerseIndex: 0,
        playbackSpeed: 1.0,
        highlightedWordIndex: -1,
      },
      setAudioSyncPlaying: (playing) =>
        set((state) => ({
          audioSync: { ...state.audioSync, isPlaying: playing },
        })),
      setAudioSyncEnabled: (enabled) =>
        set((state) => ({
          audioSync: { ...state.audioSync, isEnabled: enabled },
        })),
      updateAudioSyncVerse: (verseIndex, wordIndex) =>
        set((state) => ({
          audioSync: {
            ...state.audioSync,
            currentVerseIndex: verseIndex,
            highlightedWordIndex: wordIndex,
          },
        })),
      setPlaybackSpeed: (speed) =>
        set((state) => ({
          audioSync: {
            ...state.audioSync,
            playbackSpeed: Math.max(0.5, Math.min(2.0, speed)),
          },
        })),

      // Monetization
      isPremium: false,
      setPremium: (value) => set({ isPremium: value }),
      showAds: true,
      setShowAds: (value) => set({ showAds: value }),

      // Reading Progress
      currentChapter: 1,
      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
      currentVerse: 1,
      setCurrentVerse: (verse) => set({ currentVerse: verse }),
      readingHistory: [],
      recordReading: (chapterId, verseId, scrollPos) =>
        set((state) => {
          const history = [...state.readingHistory];
          const existingIndex = history.findIndex(
            (r) => r.chapterId === chapterId && r.verseId === verseId,
          );
          const entry: ReadingProgress = {
            chapterId,
            verseId,
            scrollPosition: scrollPos,
            lastReadAt: new Date().toISOString(),
          };
          if (existingIndex >= 0) {
            history[existingIndex] = entry;
          } else {
            history.push(entry);
          }
          return { readingHistory: history };
        }),
      getScrollPosition: (chapterId) => {
        const history = get().readingHistory;
        const entry = history.find((r) => r.chapterId === chapterId);
        return entry?.scrollPosition ?? 0;
      },

      // Streak & Japamala
      streak: INITIAL_STREAK,
      updateStreak: (versesRead) =>
        set((state) => {
          const today = toLocalDateKey(new Date());
          const yesterday = toLocalDateKey(new Date(Date.now() - DAY_MS));
          const streak = {
            ...state.streak,
            readings: { ...state.streak.readings },
          };

          if (!streak.readings[today]) {
            streak.readings[today] = 0;
          }
          streak.readings[today] += versesRead;

          // Update streak only once per day and enforce strict day-over-day continuity.
          if (today !== streak.lastStreakDate) {
            if (!streak.lastStreakDate) {
              streak.currentStreak = 1;
            } else if (streak.lastStreakDate === yesterday) {
              streak.currentStreak += 1;
            } else {
              streak.currentStreak = 1;
            }
            streak.lastStreakDate = today;
          }

          streak.totalDaysRead = Object.keys(streak.readings).length;
          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }

          return {
            streak,
            streakRisk: INITIAL_STREAK_RISK,
          };
        }),
      jumpStreakTo: (date) =>
        set((state) => ({
          streak: {
            ...state.streak,
            lastStreakDate: date,
          },
        })),
      streakRisk: INITIAL_STREAK_RISK,
      checkStreakRisk: () =>
        set((state) => {
          const { currentStreak, lastStreakDate } = state.streak;

          if (!lastStreakDate || currentStreak <= 0) {
            return { streakRisk: INITIAL_STREAK_RISK };
          }

          const todayKey = toLocalDateKey(new Date());
          const yesterdayKey = toLocalDateKey(new Date(Date.now() - DAY_MS));

          if (lastStreakDate === todayKey || lastStreakDate === yesterdayKey) {
            return { streakRisk: INITIAL_STREAK_RISK };
          }

          const parsedLastDate = new Date(`${lastStreakDate}T00:00:00`);
          const parsedToday = new Date(`${todayKey}T00:00:00`);
          const dayDiff = Math.max(
            1,
            Math.floor(
              (parsedToday.getTime() - parsedLastDate.getTime()) / DAY_MS,
            ),
          );

          return {
            streakRisk: {
              isAtRisk: true,
              missedDays: dayDiff,
            },
          };
        }),
      acceptStreakShield: () => {
        let wasApplied = false;
        set((state) => {
          if (!state.streakRisk.isAtRisk || state.streak.streakShields <= 0) {
            wasApplied = false;
            return state;
          }

          wasApplied = true;
          const yesterdayKey = toLocalDateKey(new Date(Date.now() - DAY_MS));

          return {
            streak: {
              ...state.streak,
              streakShields: Math.max(0, state.streak.streakShields - 1),
              lastStreakDate: yesterdayKey,
            },
            streakRisk: INITIAL_STREAK_RISK,
          };
        });

        return wasApplied;
      },
      declineStreakShield: () =>
        set((state) => ({
          streak: {
            ...state.streak,
            currentStreak: 0,
          },
          streakRisk: INITIAL_STREAK_RISK,
        })),

      // Focus Mode
      focusMode: false,
      setFocusMode: (enabled) => set({ focusMode: enabled }),

      // Chapter Completion
      completedChapters: new Set<number>(),
      markChapterComplete: (chapterId) =>
        set((state) => {
          const completed = new Set(state.completedChapters);
          completed.add(chapterId);
          return { completedChapters: completed };
        }),
      isChapterComplete: (chapterId) => get().completedChapters.has(chapterId),

      // Celebration
      showCelebration: false,
      setShowCelebration: (show) => set({ showCelebration: show }),

      // Onboarding
      onboarding: INITIAL_ONBOARDING,
      completeOnboarding: () =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        })),
      updateOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        })),
      setOnboardingGoal: (goal) =>
        set((state) => ({
          onboarding: { ...state.onboarding, selectedGoal: goal },
        })),
      setOnboardingPreferences: (preferences) =>
        set((state) => ({
          onboarding: { ...state.onboarding, preferences },
        })),
      setOnboardingAppearance: (appearance) =>
        set((state) => ({
          onboarding: { ...state.onboarding, appearance },
        })),
      hasCompletedOnboarding: () => get().onboarding.completed,
      resetOnboarding: () => set({ onboarding: INITIAL_ONBOARDING }),

      // Gamification
      badges: [],
      addBadge: (badgeId) =>
        set((state) => {
          if (state.badges.includes(badgeId)) return state;
          return { badges: [...state.badges, badgeId] };
        }),
      hasBadge: (badgeId) => get().badges.includes(badgeId),
      achievements: [],
      unlockAchievement: (achievementId) =>
        set((state) => {
          const exists = state.achievements.some((a) => a.id === achievementId);
          if (exists) return state;
          return {
            achievements: [
              ...state.achievements,
              { id: achievementId, unlockedAt: new Date().toISOString() },
            ],
          };
        }),

      // Growth Features
      // Daily Sloka
      dailySlokaDate: null,
      generateDailySlokaIndex: () => {
        const dayOfYear = Math.floor(
          (new Date().getTime() -
            new Date(new Date().getFullYear(), 0, 0).getTime()) /
            86400000,
        );
        // Use day of year to generate consistent random index for the day
        return dayOfYear % TOTAL_VERSES;
      },

      // Rating Prompt
      ratingState: INITIAL_RATING_STATE,
      incrementSlokasRead: () =>
        set((state) => ({
          ratingState: {
            ...state.ratingState,
            slokasReadSinceLastPrompt:
              state.ratingState.slokasReadSinceLastPrompt + 1,
          },
        })),
      markAsRated: () =>
        set((state) => ({
          ratingState: {
            ...state.ratingState,
            hasRated: true,
            slokasReadSinceLastPrompt: 0,
            lastPromptDate: new Date().toISOString(),
          },
        })),
      shouldShowRatingPrompt: () => {
        const state = get();
        if (state.ratingState.hasRated) return false;
        if (state.ratingState.promptsShown >= 3) return false; // Max 3 prompts
        if (state.ratingState.slokasReadSinceLastPrompt >= 10) {
          // Check if at least 24 hours since last prompt
          if (state.ratingState.lastPromptDate) {
            const lastPrompt = new Date(state.ratingState.lastPromptDate);
            const now = new Date();
            const hoursSinceLastPrompt =
              (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60);
            return hoursSinceLastPrompt >= 24;
          }
          return true;
        }
        return false;
      },

      // Notification Settings
      notificationSettings: INITIAL_NOTIFICATION_SETTINGS,
      setNotificationEnabled: (enabled) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            enabled,
          },
        })),
      setNotificationTime: (time) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            time,
          },
        })),
      setNotificationPermissionAsked: (asked) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            permissionAsked: asked,
          },
        })),
      setNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            ...settings,
          },
        })),

      // First Launch
      isFirstLaunch: true,
      setFirstLaunchComplete: () => set({ isFirstLaunch: false }),

      // Theme Selection
      selectedTheme: "light-default",
      setSelectedTheme: (themeId) => set({ selectedTheme: themeId }),

      // 3-Day Challenge System
      challengeStartDate: null,
      challengeCompleted: false,
      startChallenge: () =>
        set({
          challengeStartDate: new Date().toISOString(),
          challengeCompleted: false,
        }),
      completeChallenge: () => set({ challengeCompleted: true }),

      // Rating State Updates
      updateRatingState: (updates) =>
        set((state) => ({
          ratingState: {
            ...state.ratingState,
            ...updates,
          },
        })),
    }),
    {
      name: "gita-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        fontScale: state.fontScale,
        lineHeight: state.lineHeight,
        language: state.language,
        transliterationEnabled: state.transliterationEnabled,
        isPremium: state.isPremium,
        showAds: state.showAds,
        currentChapter: state.currentChapter,
        currentVerse: state.currentVerse,
        readingHistory: state.readingHistory,
        streak: state.streak,
        streakRisk: state.streakRisk,
        focusMode: state.focusMode,
        completedChapters: Array.from(state.completedChapters),
        onboarding: state.onboarding,
        badges: state.badges,
        achievements: state.achievements,
        dailySlokaDate: state.dailySlokaDate,
        ratingState: state.ratingState,
        notificationSettings: state.notificationSettings,
        isFirstLaunch: state.isFirstLaunch,
        selectedTheme: state.selectedTheme,
        challengeStartDate: state.challengeStartDate,
        challengeCompleted: state.challengeCompleted,
      }),
      onRehydrateStorage: function () {
        return function (state) {
          if (
            state &&
            state.completedChapters &&
            Array.isArray(state.completedChapters)
          ) {
            state.completedChapters = new Set(state.completedChapters);
          }
        };
      },
    },
  ),
);
