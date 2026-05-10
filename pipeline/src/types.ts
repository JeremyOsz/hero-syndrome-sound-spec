/** Time-of-day phase (local clock, hysteresis applied upstream). */
export type TimePhase =
  | "witching_hour"
  | "dawn"
  | "morning"
  | "noon"
  | "afternoon"
  | "golden_hour"
  | "dusk"
  | "night";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MoonPhase =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "third_quarter"
  | "waning_crescent";

export type BodyActivity = "still" | "walking" | "running" | "vehicle";

/** Normalized weather keys matching `lexicon/weather.json`. */
export type WeatherCondition =
  | "clear"
  | "mainly_clear"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "rain_showers"
  | "thunderstorm"
  | "thunderstorm_hail"
  | "snow"
  | "snow_grains"
  | "snow_showers"
  | "freezing_drizzle"
  | "freezing_rain";

export type LocationType =
  | "cinema"
  | "theatre"
  | "park"
  | "cafe"
  | "transit_hub"
  | "museum"
  | "residential"
  | "unknown";

export interface EnergyAxes {
  motion: number;
  density: number;
  tension: number;
  brightness: number;
}

/** Weighted mood tags after stacking (0–1). */
export type MoodWeights = Record<string, number>;

export interface InspirationState {
  /** Primary world id (`lexicon/world.json`). */
  world: string;
  /** Secondary world from weather blend, if any. */
  worldSecondary?: string;
  /** Texture cue ids (`lexicon/texture.json`) and/or freeform fallbacks. */
  textureKeys: string[];
}

/** Output of modifier stacking (numeric + symbolic). */
export interface StackedMeta {
  energy: EnergyAxes;
  mood: MoodWeights;
  inspiration: InspirationState;
  /** Effective tide multiplier applied to fast mood deltas. */
  tideEffective: number;
  weatherCondition: WeatherCondition;
  timePhase: TimePhase;
  moonPhase: MoonPhase;
}

export interface RenderPlan {
  meta: StackedMeta;
  bpm: number;
  totalDurationMs: number;
  seed: string;
  bodyActivity?: BodyActivity;
  /** Normalized location key for `lexicon/location.json`. */
  locationType?: string;
}

export interface CompositionPlanSection {
  section_name: string;
  positive_local_styles: string[];
  negative_local_styles: string[];
  duration_ms: number;
  lines: [];
}

export interface CompositionPlan {
  positive_global_styles: string[];
  negative_global_styles: string[];
  sections: CompositionPlanSection[];
}

export interface PipelineOptions {
  /** Root folder containing `product.json`, `mood.json`, … */
  lexiconRoot: string;
  /** Quantum / session seed — same inputs + same seed ⇒ same plan. */
  seed?: string;
  /** Default 0.8 per spec (`lunarStrength` ∈ [0.6, 1.0]). */
  lunarStrength?: number;
  /** When undertow is not supplied, scale moon undertow targets (default 0.65). */
  undertowInstantStrength?: number;
  /** Smoothed undertow mood; if provided, overrides synthesized undertow. */
  undertowSmooth?: MoodWeights;
  totalDurationMs?: number;
  /** If true, append `"4/4"` after BPM in globals. */
  includeTimeSignature?: boolean;
  /** Max mood tags to render (default 6). */
  moodTopK?: number;
}

export interface PipelineInput {
  timePhase: TimePhase;
  dayOfWeek: DayOfWeek;
  weatherCondition: WeatherCondition | string;
  moonPhase: MoonPhase;
  bodyActivity?: BodyActivity;
  locationType?: LocationType | string;
}
