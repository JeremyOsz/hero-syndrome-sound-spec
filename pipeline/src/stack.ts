import {
  DAY_ENERGY_DELTA,
  DAY_MOOD_DELTA,
  LUNAR_SENS_BY_PHASE,
  MOON_UNDERTOW_TARGETS,
  PHASE_TEXTURE_KEYS,
  PHASE_WORLD,
  PHASE_ENERGY_MOOD_INSPIRATION,
  TIDE_RANGE_MULT,
  TIME_MOOD_SENSITIVITY,
  WEATHER_MOOD_DELTA,
  WEATHER_MOOD_SENSITIVITY,
  WEATHER_WORLD_TARGETS,
} from "./constants.js";
import type {
  BodyActivity,
  DayOfWeek,
  EnergyAxes,
  InspirationState,
  MoonPhase,
  MoodWeights,
  PipelineInput,
  StackedMeta,
  TimePhase,
  WeatherCondition,
} from "./types.js";
import { normalizeWeatherCondition } from "./normalize.js";

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

function mergeWeights(a: MoodWeights, b: MoodWeights, scaleB = 1): MoodWeights {
  const out: MoodWeights = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = (out[k] ?? 0) + v * scaleB;
  }
  return out;
}

function applyBodyToEnergy(e: EnergyAxes, activity?: BodyActivity): EnergyAxes {
  if (!activity) return e;
  const next = { ...e };
  switch (activity) {
    case "still":
      next.motion = clamp01(next.motion - 0.04);
      next.density = clamp01(next.density - 0.02);
      break;
    case "walking":
      break;
    case "running":
      next.motion = clamp01(next.motion + 0.12);
      next.density = clamp01(next.density + 0.04);
      next.tension = clamp01(next.tension + 0.06);
      break;
    case "vehicle":
      next.motion = clamp01(next.motion + 0.02);
      next.density = clamp01(next.density + 0.03);
      break;
  }
  return next;
}

function applyDayEnergyDelta(e: EnergyAxes, day: DayOfWeek): EnergyAxes {
  const d = DAY_ENERGY_DELTA[day];
  return {
    motion: clamp01(e.motion + d),
    density: clamp01(e.density + d),
    tension: clamp01(e.tension + d * 0.5),
    brightness: clamp01(e.brightness + d * 0.7),
  };
}

/**
 * Full modifier stack per `weather-app-time-of-day-meta-modifiers.md`.
 * Supply `undertowSmooth` via options when you maintain low-pass moon state.
 */
export function stackMeta(
  input: PipelineInput,
  options?: {
    undertowSmooth?: MoodWeights;
    lunarStrength?: number;
    undertowInstantStrength?: number;
  },
): StackedMeta {
  const { timePhase, dayOfWeek, moonPhase } = input;
  const weatherCondition = normalizeWeatherCondition(
    input.weatherCondition as string,
  ) as WeatherCondition;

  const base = PHASE_ENERGY_MOOD_INSPIRATION[timePhase];
  if (!base) throw new Error(`Unknown time phase: ${String(timePhase)}`);

  let energy = applyBodyToEnergy(
    applyDayEnergyDelta({ ...base.energy }, dayOfWeek),
    input.bodyActivity,
  );

  const timeSens = TIME_MOOD_SENSITIVITY[timePhase];
  const weatherSens = WEATHER_MOOD_SENSITIVITY[timePhase];

  const dayMoodPart: MoodWeights = {};
  const dayDelta = DAY_MOOD_DELTA[dayOfWeek];
  for (const [tag, w] of Object.entries(dayDelta)) {
    dayMoodPart[tag] = w * timeSens;
  }

  const weatherDeltaTable = WEATHER_MOOD_DELTA[weatherCondition];
  const weatherPart: MoodWeights = {};
  if (weatherDeltaTable) {
    for (const [tag, w] of Object.entries(weatherDeltaTable)) {
      weatherPart[tag] = w * weatherSens;
    }
  }

  const combinedDelta = mergeWeights(dayMoodPart, weatherPart, 1);

  const lunarSens = LUNAR_SENS_BY_PHASE[timePhase];
  const lunarStrength = options?.lunarStrength ?? 0.8;
  const tideRangeMult = TIDE_RANGE_MULT[moonPhase];
  const tideEffective =
    1 + (tideRangeMult - 1) * lunarSens * lunarStrength;

  const undertowInstant = options?.undertowInstantStrength ?? 0.65;
  const undertowFromMoon: MoodWeights = {};
  const targets = MOON_UNDERTOW_TARGETS[moonPhase];
  for (const [tag, w] of Object.entries(targets)) {
    undertowFromMoon[tag] = w * lunarSens * undertowInstant;
  }

  const undertow =
    options?.undertowSmooth ??
    undertowFromMoon;

  const mood: MoodWeights = { ...base.mood };
  for (const [tag, delta] of Object.entries(combinedDelta)) {
    mood[tag] = clamp01((mood[tag] ?? 0) + delta * tideEffective);
  }
  for (const [tag, w] of Object.entries(undertow)) {
    mood[tag] = clamp01((mood[tag] ?? 0) + w);
  }

  const primaryWorld = PHASE_WORLD[timePhase];
  const weatherWorlds = WEATHER_WORLD_TARGETS[weatherCondition] ?? [];
  const secondary =
    weatherWorlds.find((w) => w !== primaryWorld) ?? weatherWorlds[0];

  const textureKeys = [...PHASE_TEXTURE_KEYS[timePhase]];

  const inspiration: InspirationState = {
    world: primaryWorld,
    worldSecondary:
      secondary && secondary !== primaryWorld ? secondary : undefined,
    textureKeys,
  };

  return {
    energy,
    mood,
    inspiration,
    tideEffective,
    weatherCondition,
    timePhase,
    moonPhase,
  };
}
