/**
 * Gamification Types
 * Badges, achievements, and engagement mechanics
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  category: "reading" | "streak" | "exploration" | "mastery";
}

/**
 * Badge Definitions
 */
export const BADGES: Record<string, Omit<Badge, "unlockedAt">> = {
  // Reading Badges
  "first-sloka": {
    id: "first-sloka",
    name: "First Steps",
    description: "Read your first sloka",
    icon: "auto-stories",
    rarity: "common",
  },
  "wisdom-seeker": {
    id: "wisdom-seeker",
    name: "Wisdom Seeker",
    description: "Read 10 slokas",
    icon: "psychology",
    rarity: "common",
  },
  "chapter-explorer": {
    id: "chapter-explorer",
    name: "Chapter Explorer",
    description: "Complete your first chapter",
    icon: "explore",
    rarity: "rare",
  },
  "gita-scholar": {
    id: "gita-scholar",
    name: "Gita Scholar",
    description: "Complete 5 chapters",
    icon: "school",
    rarity: "epic",
  },
  "divine-wisdom": {
    id: "divine-wisdom",
    name: "Divine Wisdom",
    description: "Read all 700 verses",
    icon: "auto-awesome",
    rarity: "legendary",
  },

  // Streak Badges
  "committed-learner": {
    id: "committed-learner",
    name: "Committed Learner",
    description: "3-day reading streak",
    icon: "local-fire-department",
    rarity: "common",
  },
  "dedicated-soul": {
    id: "dedicated-soul",
    name: "Dedicated Soul",
    description: "7-day reading streak",
    icon: "whatshot",
    rarity: "rare",
  },
  "eternal-student": {
    id: "eternal-student",
    name: "Eternal Student",
    description: "30-day reading streak",
    icon: "stars",
    rarity: "epic",
  },
  "enlightened-path": {
    id: "enlightened-path",
    name: "Enlightened Path",
    description: "100-day reading streak",
    icon: "emoji-events",
    rarity: "legendary",
  },

  // Exploration Badges
  "curious-mind": {
    id: "curious-mind",
    name: "Curious Mind",
    description: "Used search feature",
    icon: "search",
    rarity: "common",
  },
  "bookmark-collector": {
    id: "bookmark-collector",
    name: "Bookmark Collector",
    description: "Saved 10 favorite verses",
    icon: "bookmarks",
    rarity: "rare",
  },
};

/**
 * Achievement Triggers
 * Checks if user has earned any new badges based on current state
 */
export interface UserStats {
  versesRead: number;
  chaptersCompleted: number;
  currentStreak: number;
  longestStreak: number;
  bookmarksCount: number;
  searchesCount: number;
}

export function checkBadgeUnlocks(
  stats: UserStats,
  currentBadges: string[],
): string[] {
  const newBadges: string[] = [];

  // Reading Badges
  if (stats.versesRead >= 1 && !currentBadges.includes("first-sloka")) {
    newBadges.push("first-sloka");
  }
  if (stats.versesRead >= 10 && !currentBadges.includes("wisdom-seeker")) {
    newBadges.push("wisdom-seeker");
  }
  if (
    stats.chaptersCompleted >= 1 &&
    !currentBadges.includes("chapter-explorer")
  ) {
    newBadges.push("chapter-explorer");
  }
  if (stats.chaptersCompleted >= 5 && !currentBadges.includes("gita-scholar")) {
    newBadges.push("gita-scholar");
  }
  if (stats.versesRead >= 700 && !currentBadges.includes("divine-wisdom")) {
    newBadges.push("divine-wisdom");
  }

  // Streak Badges
  if (
    stats.currentStreak >= 3 &&
    !currentBadges.includes("committed-learner")
  ) {
    newBadges.push("committed-learner");
  }
  if (stats.currentStreak >= 7 && !currentBadges.includes("dedicated-soul")) {
    newBadges.push("dedicated-soul");
  }
  if (stats.currentStreak >= 30 && !currentBadges.includes("eternal-student")) {
    newBadges.push("eternal-student");
  }
  if (
    stats.currentStreak >= 100 &&
    !currentBadges.includes("enlightened-path")
  ) {
    newBadges.push("enlightened-path");
  }

  // Exploration Badges
  if (stats.searchesCount >= 1 && !currentBadges.includes("curious-mind")) {
    newBadges.push("curious-mind");
  }
  if (
    stats.bookmarksCount >= 10 &&
    !currentBadges.includes("bookmark-collector")
  ) {
    newBadges.push("bookmark-collector");
  }

  return newBadges;
}
