import type {
  DayOfWeek,
  EnergyAxes,
  MoonPhase,
  MoodWeights,
  TimePhase,
  WeatherCondition,
} from "./types.js";

export const TIME_MOOD_SENSITIVITY: Record<TimePhase, number> = {
  witching_hour: 1.2,
  dawn: 1.1,
  morning: 0.85,
  noon: 0.75,
  afternoon: 0.8,
  golden_hour: 1.0,
  dusk: 1.15,
  night: 1.1,
};

export const WEATHER_MOOD_SENSITIVITY: Record<TimePhase, number> = {
  witching_hour: 1.25,
  dawn: 1.1,
  morning: 0.85,
  noon: 0.7,
  afternoon: 0.8,
  golden_hour: 1.0,
  dusk: 1.2,
  night: 1.15,
};

export const LUNAR_SENS_BY_PHASE: Record<TimePhase, number> = {
  witching_hour: 1.2,
  night: 1.15,
  dusk: 1.08,
  dawn: 1.05,
  golden_hour: 0.95,
  afternoon: 0.8,
  morning: 0.85,
  noon: 0.75,
};

export const TIDE_RANGE_MULT: Record<MoonPhase, number> = {
  new: 1.12,
  waxing_crescent: 1.02,
  first_quarter: 0.88,
  waxing_gibbous: 1.06,
  full: 1.12,
  waning_gibbous: 1.06,
  third_quarter: 0.88,
  waning_crescent: 1.02,
};

/** Undertow mood targets per moon phase (additive, smoothed in production). */
export const MOON_UNDERTOW_TARGETS: Record<MoonPhase, MoodWeights> = {
  new: { tentative: 0.08, unresolved: 0.07, sparse: 0.06 },
  waxing_crescent: { gathering: 0.06, sharpening: 0.04, purposeful: 0.04 },
  first_quarter: { steady: 0.05, neutral: 0.05, pragmatic: 0.04 },
  waxing_gibbous: { building: 0.06, luminous: 0.05, accumulating: 0.05 },
  full: { exposed: 0.07, charged: 0.06, luminous: 0.05 },
  waning_gibbous: { recounting: 0.06, simplifying: 0.04, distancing: 0.04 },
  third_quarter: { critical: 0.04, even: 0.05, released: 0.03 },
  waning_crescent: { emptied: 0.06, devotional: 0.04, drifting: 0.06 },
};

export const DAY_ENERGY_DELTA: Record<DayOfWeek, number> = {
  Monday: -0.04,
  Tuesday: -0.02,
  Wednesday: -0.08,
  Thursday: 0,
  Friday: 0.05,
  Saturday: 0.1,
  Sunday: -0.01,
};

/** Base mood deltas by weekday (before × time sensitivity). */
export const DAY_MOOD_DELTA: Record<DayOfWeek, MoodWeights> = {
  Monday: { focused: 0.04, serious: 0.03, playful: -0.03 },
  Tuesday: { steady: 0.03, practical: 0.03, dreamlike: -0.02 },
  Wednesday: {
    introspective: 0.07,
    fatigued: 0.06,
    flat: 0.05,
    social: -0.05,
    playful: -0.05,
  },
  Thursday: {},
  Friday: { anticipatory: 0.05, social: 0.04, expansive: 0.03 },
  Saturday: {
    social: 0.08,
    playful: 0.08,
    expansive: 0.06,
    fatigued: -0.03,
  },
  Sunday: {
    reflective: 0.06,
    tender: 0.04,
    slow: 0.03,
    urgent: -0.03,
  },
};

/** Weather mood deltas (before × weather sensitivity × tide). */
export const WEATHER_MOOD_DELTA: Record<WeatherCondition, MoodWeights> = {
  clear: { clear: 0.06, open: 0.05, uncertain: -0.03 },
  mainly_clear: { calm: 0.04, grounded: 0.03 },
  overcast: { reflective: 0.05, somber: 0.04, playful: -0.03 },
  fog: { uncanny: 0.07, intimate: 0.05, clarity: -0.06 },
  drizzle: { melancholic: 0.06, soft_focus: 0.05, urgent: -0.03 },
  rain: { reflective: 0.07, distant: 0.05, social: -0.04 },
  rain_showers: { restless: 0.05, uncertain: 0.05, steady: -0.03 },
  thunderstorm: { tense: 0.1, awe: 0.06, fragile: 0.03 },
  thunderstorm_hail: { threat: 0.11, chaotic: 0.08, warm: -0.04 },
  snow: { hushed: 0.08, tender: 0.05, tempo_drive: -0.04 },
  snow_grains: { brittle: 0.06, dry_cold: 0.05 },
  snow_showers: { volatile: 0.06, reflective: 0.04 },
  freezing_drizzle: { stark: 0.07, isolated: 0.05 },
  freezing_rain: { anxious: 0.08, tense: 0.07, social: -0.04 },
};

/** Extra world ids to blend from weather (first = secondary world candidate). */
export const WEATHER_WORLD_TARGETS: Record<WeatherCondition, string[]> = {
  clear: ["daylight_chamber", "pastoral_awakening"],
  mainly_clear: ["daylight_chamber", "pastoral_awakening"],
  overcast: ["urban_dreamlike", "nocturnal_ritual"],
  fog: ["urban_dreamlike", "nocturnal_ritual"],
  drizzle: ["deep_nocturnal", "mechanical_flow"],
  rain: ["deep_nocturnal", "mechanical_flow"],
  rain_showers: ["deep_nocturnal", "mechanical_flow"],
  thunderstorm: ["mechanical_flow", "cinematic_warmth"],
  thunderstorm_hail: ["mechanical_flow", "cinematic_warmth"],
  snow: ["pastoral_awakening", "nocturnal_ritual"],
  snow_grains: ["pastoral_awakening", "nocturnal_ritual"],
  snow_showers: ["pastoral_awakening", "nocturnal_ritual"],
  freezing_drizzle: ["deep_nocturnal"],
  freezing_rain: ["deep_nocturnal"],
};

/**
 * Phase baseline texture keys (`lexicon/texture.json`).
 * Maps spec prose cues to stable ids.
 */
export const PHASE_TEXTURE_KEYS: Record<TimePhase, string[]> = {
  witching_hour: [
    "sub_bass_drone",
    "distant_metallic_shimmer",
    "slow_unstable_noise_bed",
  ],
  dawn: ["airy_pad", "filtered_birdsong_motion", "thin_harmonic_overtones"],
  morning: ["soft_pulse", "clean_plucks", "light_percussive_transients"],
  noon: ["clear_harmonic_bed", "midrange_forward_ensemble", "reduced_noise_floor"],
  afternoon: ["repeating_ostinati", "clocklike_micro_rhythm", "tight_room_ambience"],
  golden_hour: ["long_envelope_swells", "gentle_tape_saturation", "high_end_glow"],
  dusk: ["blurred_piano", "grainy_pulse", "wide_dark_reverb_tails"],
  night: ["subtle_rhythmic_ghosts", "degraded_atmosphere", "slow_harmonic_drift"],
};

export const PHASE_WORLD: Record<TimePhase, string> = {
  witching_hour: "nocturnal_ritual",
  dawn: "pastoral_awakening",
  morning: "urban_kinetic_light",
  noon: "daylight_chamber",
  afternoon: "mechanical_flow",
  golden_hour: "cinematic_warmth",
  dusk: "urban_dreamlike",
  night: "deep_nocturnal",
};

export const PHASE_ENERGY_MOOD_INSPIRATION: Record<
  TimePhase,
  { energy: EnergyAxes; mood: MoodWeights }
> = {
  witching_hour: {
    energy: { motion: 0.18, density: 0.22, tension: 0.58, brightness: 0.12 },
    mood: {
      uncanny: 0.55,
      intimate: 0.4,
      melancholic: 0.35,
      suspended: 0.3,
    },
  },
  dawn: {
    energy: { motion: 0.28, density: 0.3, tension: 0.4, brightness: 0.32 },
    mood: {
      fragile: 0.52,
      hopeful: 0.34,
      reflective: 0.3,
      soft_focus: 0.26,
    },
  },
  morning: {
    energy: { motion: 0.46, density: 0.42, tension: 0.3, brightness: 0.52 },
    mood: {
      clear: 0.45,
      purposeful: 0.42,
      social: 0.3,
      grounded: 0.28,
    },
  },
  noon: {
    energy: { motion: 0.56, density: 0.52, tension: 0.24, brightness: 0.64 },
    mood: {
      open: 0.48,
      direct: 0.4,
      warm: 0.34,
      extroverted: 0.28,
    },
  },
  afternoon: {
    energy: { motion: 0.5, density: 0.48, tension: 0.28, brightness: 0.5 },
    mood: {
      steady: 0.46,
      practical: 0.4,
      focused: 0.36,
      neutral: 0.3,
    },
  },
  golden_hour: {
    energy: { motion: 0.44, density: 0.4, tension: 0.32, brightness: 0.58 },
    mood: {
      nostalgic: 0.52,
      luminous: 0.46,
      tender: 0.34,
      expansive: 0.3,
    },
  },
  dusk: {
    energy: { motion: 0.34, density: 0.36, tension: 0.46, brightness: 0.28 },
    mood: {
      reflective: 0.5,
      uncertain: 0.42,
      intimate: 0.38,
      drifting: 0.3,
    },
  },
  night: {
    energy: { motion: 0.26, density: 0.34, tension: 0.5, brightness: 0.18 },
    mood: {
      melancholic: 0.5,
      distant: 0.44,
      contemplative: 0.36,
      porous: 0.28,
    },
  },
};

/** Multiplier on `lerp(44, 120, motion)` for BPM. */
export const PHASE_BPM_MULT: Record<TimePhase, number> = {
  witching_hour: 0.9,
  dawn: 1.02,
  morning: 1.0,
  noon: 1.04,
  afternoon: 1.02,
  golden_hour: 1.0,
  dusk: 0.95,
  night: 0.92,
};
