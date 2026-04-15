/**
 * Onboarding Types
 * Manages user onboarding flow, goals, and preferences setup
 */

export type OnboardingGoal = "daily-sloka" | "chapter-study" | "life-wisdom";

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  totalSteps: number;

  // User's selected goal (commitment psychology)
  selectedGoal: OnboardingGoal | null;

  // Reading preferences collected during onboarding
  preferences: {
    showSanskrit: boolean;
    showTransliteration: boolean;
    showEnglish: boolean;
    showHindi: boolean;
  };

  // Appearance preferences
  appearance: {
    fontSize: "small" | "medium" | "large";
    theme: "light" | "dark" | "system";
  };

  // Timestamp when onboarding was completed
  completedAt: string | null;
}

export interface OnboardingGoalOption {
  id: OnboardingGoal;
  title: string;
  description: string;
  icon: string;
}

export const ONBOARDING_GOALS: OnboardingGoalOption[] = [
  {
    id: "daily-sloka",
    title: "Read 1 sloka daily",
    description: "Build a consistent daily practice",
    icon: "today",
  },
  {
    id: "chapter-study",
    title: "Study chapter by chapter",
    description: "Deep dive into each teaching",
    icon: "menu-book",
  },
  {
    id: "life-wisdom",
    title: "Reflect on life wisdom",
    description: "Apply timeless teachings to modern life",
    icon: "psychology",
  },
];

export const ONBOARDING_TOTAL_STEPS = 5;
