export type MicroInteractionPreset = 'subtle' | 'minimal';

type MicroInteractionConfig = {
  toast: {
    initialScale: number;
    springTension: number;
    springFriction: number;
    glowPeak: number;
    glowInDuration: number;
    glowOutDuration: number;
    successHaptic: boolean;
  };
  haptics: {
    light: boolean;
    success: boolean;
  };
};

const PRESET_CONFIG: Record<MicroInteractionPreset, MicroInteractionConfig> = {
  subtle: {
    toast: {
      initialScale: 0.985,
      springTension: 95,
      springFriction: 12,
      glowPeak: 0.14,
      glowInDuration: 140,
      glowOutDuration: 320,
      successHaptic: true,
    },
    haptics: {
      light: true,
      success: true,
    },
  },
  minimal: {
    toast: {
      initialScale: 0.995,
      springTension: 85,
      springFriction: 14,
      glowPeak: 0.06,
      glowInDuration: 100,
      glowOutDuration: 220,
      successHaptic: false,
    },
    haptics: {
      light: false,
      success: false,
    },
  },
};

export const MICRO_INTERACTION_PRESET: MicroInteractionPreset = 'minimal';

export const MICRO_INTERACTION = PRESET_CONFIG[MICRO_INTERACTION_PRESET];
