import { pickFrom } from "./hash.js";
import type { Lexicons } from "./loadLexicons.js";
import {
  quantizeBrightness,
  quantizeDensity,
  quantizeMotion,
  quantizeTension,
} from "./energyQuantize.js";
import type {
  CompositionPlan,
  DayOfWeek,
  RenderPlan,
  TimePhase,
  WeatherCondition,
} from "./types.js";
import { normalizeMoodTag } from "./normalize.js";

function dedupe(strings: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of strings) {
    const t = s.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function dayKey(day: DayOfWeek): string {
  return day.toLowerCase();
}

function conditionalPoolKeys(
  timePhase: TimePhase,
  weather: WeatherCondition,
  brightness: number,
): string[] {
  const keys: string[] = [];
  if (timePhase === "witching_hour" || timePhase === "night") {
    keys.push("night_uncanny_phase");
  }
  if (
    (weather === "clear" || weather === "mainly_clear") &&
    brightness > 0.55 &&
    (timePhase === "morning" || timePhase === "noon" || timePhase === "afternoon")
  ) {
    keys.push("bright_day_clear_weather");
  }
  if (timePhase === "dawn") keys.push("fragile_dawn");
  if (timePhase === "afternoon") keys.push("mechanical_afternoon");
  if (timePhase === "golden_hour") keys.push("warm_golden_hour");
  if (
    timePhase === "dusk" &&
    (weather === "rain" || weather === "drizzle" || weather === "rain_showers")
  ) {
    keys.push("urban_dusk_rain");
  }
  if (weather === "thunderstorm" || weather === "thunderstorm_hail") {
    keys.push("storm_night");
  }
  if (
    timePhase === "morning" &&
    (weather === "clear" || weather === "mainly_clear")
  ) {
    keys.push("clear_morning");
  }
  return keys;
}

function tideDynamicsBucket(tideEffective: number): "high_spring" | "mid" | "low_neap" {
  if (tideEffective > 1.04) return "high_spring";
  if (tideEffective < 0.98) return "low_neap";
  return "mid";
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function renderCompositionPlan(
  lex: Lexicons,
  plan: RenderPlan,
  options?: {
    includeTimeSignature?: boolean;
    moodTopK?: number;
    dayOfWeek?: DayOfWeek;
  },
): CompositionPlan {
  const seed = plan.seed;
  const { meta, bpm, totalDurationMs } = plan;
  const moodTopK = options?.moodTopK ?? 6;

  const globals: string[] = [];

  const prodPos = pickFrom(seed, "prod+", lex.product.instrumental_positives);
  const prodPos2 = pickFrom(seed, "prod+2", lex.product.instrumental_positives);
  if (prodPos) globals.push(prodPos);
  if (prodPos2 && prodPos2 !== prodPos) globals.push(prodPos2);

  globals.push(`${bpm} BPM`);
  if (options?.includeTimeSignature) globals.push("4/4");

  const worldPrimary = meta.inspiration.world;
  const w1 = pickFrom(seed, `world:${worldPrimary}`, lex.world[worldPrimary]);
  if (w1) globals.push(w1);

  if (meta.inspiration.worldSecondary) {
    const w2 = pickFrom(
      seed,
      `world2:${meta.inspiration.worldSecondary}`,
      lex.world[meta.inspiration.worldSecondary],
    );
    if (w2) globals.push(w2);
  }

  let textureSlots = 0;
  const maxTextures = 5;
  for (const key of meta.inspiration.textureKeys) {
    if (textureSlots >= maxTextures) break;
    const pool = lex.texture[key];
    const line = pool ? pickFrom(seed, `tx:${key}`, pool) : undefined;
    if (line) {
      globals.push(line);
      textureSlots++;
    }
  }

  const weatherEntry = lex.weather[meta.weatherCondition];
  if (weatherEntry) {
    const scene = pickFrom(seed, "weather:scene", weatherEntry.scene);
    if (scene) globals.push(scene);
    for (const hint of weatherEntry.texture_hints) {
      if (textureSlots >= maxTextures) break;
      globals.push(hint);
      textureSlots++;
    }
  }

  const sortedMood = Object.entries(meta.mood)
    .filter(([, w]) => w > 0.05)
    .sort((a, b) => b[1] - a[1])
    .slice(0, moodTopK);

  for (const [tag] of sortedMood) {
    const key = normalizeMoodTag(tag);
    const pool = lex.mood[key];
    if (!pool?.length) continue;
    const phrase = pickFrom(seed, `mood:${key}`, pool);
    if (phrase) globals.push(phrase);
  }

  const tideKey = tideDynamicsBucket(meta.tideEffective);
  const dyn = pickFrom(seed, "moon:dyn", lex.moon.tide_dynamics[tideKey]);
  if (dyn) globals.push(dyn);

  const moonPhase = meta.moonPhase;
  const under = pickFrom(seed, "moon:u", lex.moon.undertow[moonPhase]);
  if (under) globals.push(under);

  const qm = quantizeMotion(meta.energy.motion);
  const qd = quantizeDensity(meta.energy.density);
  const qt = quantizeTension(meta.energy.tension);
  const qb = quantizeBrightness(meta.energy.brightness);

  const motionLine = pickFrom(seed, "en:m", lex.energy.motion[qm]);
  const densityLine = pickFrom(seed, "en:d", lex.energy.density[qd]);
  const tensionLine = pickFrom(seed, "en:t", lex.energy.tension[qt]);
  const brightLine = pickFrom(seed, "en:b", lex.energy.brightness[qb]);
  if (motionLine) globals.push(motionLine);
  if (densityLine) globals.push(densityLine);
  if (tensionLine && meta.energy.tension > 0.45) globals.push(tensionLine);
  if (brightLine) globals.push(brightLine);

  if (plan.bodyActivity) {
    const b = pickFrom(seed, `body:${plan.bodyActivity}`, lex.body[plan.bodyActivity]);
    if (b) globals.push(b);
  }

  if (options?.dayOfWeek) {
    const dk = dayKey(options.dayOfWeek);
    const dline = pickFrom(seed, `day:${dk}`, lex.day[dk]);
    if (dline) globals.push(dline);
  }

  if (plan.locationType && lex.location[plan.locationType]) {
    const loc = pickFrom(
      seed,
      `loc:${plan.locationType}`,
      lex.location[plan.locationType],
    );
    if (loc) globals.push(loc);
  }

  const negatives: string[] = [
    ...lex.product.instrumental_negatives,
    ...lex.negatives.fixed,
  ];

  const poolKeys = conditionalPoolKeys(
    meta.timePhase,
    meta.weatherCondition,
    meta.energy.brightness,
  );
  for (const pk of poolKeys) {
    const pool = lex.negatives.conditional[pk];
    const line = pool ? pickFrom(seed, `negc:${pk}`, pool) : undefined;
    if (line) negatives.push(line);
  }

  if (meta.energy.brightness > 0.62) {
    negatives.push("muddy mix");
  }
  if (meta.energy.tension < 0.32) {
    negatives.push("harsh aggressive distortion");
  }

  const archetypes = lex.sectionArchetypes[meta.timePhase];
  if (!archetypes?.length) {
    throw new Error(`No section archetypes for phase: ${meta.timePhase}`);
  }

  const wSum = archetypes.reduce((s, r) => s + r.duration_weight, 0);
  let allocated = 0;
  const sections = archetypes.map((row, i) => {
    const isLast = i === archetypes.length - 1;
    const raw = isLast
      ? totalDurationMs - allocated
      : Math.round((totalDurationMs * row.duration_weight) / wSum);
    const duration_ms = clamp(raw, 3000, 120000);
    if (!isLast) allocated += duration_ms;
    return {
      section_name: row.section_name,
      positive_local_styles: [...row.positive_local_styles],
      negative_local_styles: [...row.negative_local_styles],
      duration_ms,
      lines: [] as [],
    };
  });

  return {
    positive_global_styles: dedupe(globals),
    negative_global_styles: dedupe(negatives),
    sections,
  };
}
