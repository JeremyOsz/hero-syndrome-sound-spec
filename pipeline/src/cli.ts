#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { metaToCompositionPlanFromRoot } from "./pipeline.js";
import type {
  BodyActivity,
  DayOfWeek,
  MoonPhase,
  PipelineInput,
  TimePhase,
} from "./types.js";

const TIME_PHASES: TimePhase[] = [
  "witching_hour",
  "dawn",
  "morning",
  "noon",
  "afternoon",
  "golden_hour",
  "dusk",
  "night",
];

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MOONS: MoonPhase[] = [
  "new",
  "waxing_crescent",
  "first_quarter",
  "waxing_gibbous",
  "full",
  "waning_gibbous",
  "third_quarter",
  "waning_crescent",
];

const BODIES: BodyActivity[] = ["still", "walking", "running", "vehicle"];

function scriptDir(): string {
  return path.dirname(fileURLToPath(import.meta.url));
}

function defaultLexiconRoot(): string {
  const cwdLex = path.join(process.cwd(), "lexicon");
  if (existsSync(cwdLex)) return cwdLex;
  const nearRepo = path.resolve(scriptDir(), "..", "..", "lexicon");
  if (existsSync(nearRepo)) return nearRepo;
  return cwdLex;
}

function printHelp(exitCode: number): never {
  const lines = [
    "hero-sound-plan — run the Hero Syndrome meta → composition_plan pipeline",
    "",
    "Usage:",
    "  hero-sound-plan --phase <phase> --day <weekday> --weather <condition> --moon <phase> [options]",
    "",
    "Required:",
    "  --phase, --time-phase   Time phase: " + TIME_PHASES.join(", "),
    "  --day, --weekday        Day: Monday … Sunday",
    "  --weather               Weather (kebab or snake ok), e.g. rain, mainly-clear, rain_showers",
    "  --moon                  Moon phase: " + MOONS.join(", "),
    "",
    "Optional:",
    "  --body                  " + BODIES.join(", "),
    "  --location              cinema, theatre, park, cafe, transit_hub, museum, residential, unknown",
    "  --seed                  Deterministic seed string",
    "  --duration-ms           Total ms (default 60000)",
    "  --lexicon               Path to lexicon folder (default: ./lexicon if present, else ../lexicon from this package)",
    "  --lunar-strength        0.6–1.0 (default 0.8)",
    "  --mood-top-k            Max mood lines in globals (default 6)",
    "  --time-signature        Append 4/4 to globals",
    "  --plan-only             Output only the composition_plan object",
    "  --no-meta               Omit stacked meta and renderPlan from JSON",
    "  -o, --output <file>     Write composition_plan JSON to this file (API-ready blob)",
    "  --pretty                Indent JSON (stdout and file when -o is set)",
    "  -h, --help              Show this help",
    "",
    "Example:",
    '  hero-sound-plan --phase dusk --day Saturday --weather rain --moon full --body walking --location museum --seed demo-1 --pretty -o plan.json',
  ];
  console.error(lines.join("\n"));
  process.exit(exitCode);
}

function normalizeDay(raw: string): DayOfWeek {
  const s = raw.trim().toLowerCase();
  const cap = (s.charAt(0).toUpperCase() + s.slice(1)) as DayOfWeek;
  if (!DAYS.includes(cap)) {
    console.error(`Invalid --day: ${raw}. Use one of: ${DAYS.join(", ")}`);
    process.exit(1);
  }
  return cap;
}

function normalizeTimePhase(raw: string): TimePhase {
  const s = raw.trim().toLowerCase().replace(/-/g, "_") as TimePhase;
  if (!TIME_PHASES.includes(s)) {
    console.error(`Invalid --phase: ${raw}. Use one of: ${TIME_PHASES.join(", ")}`);
    process.exit(1);
  }
  return s;
}

function normalizeMoon(raw: string): MoonPhase {
  const s = raw.trim().toLowerCase().replace(/-/g, "_") as MoonPhase;
  if (!MOONS.includes(s)) {
    console.error(`Invalid --moon: ${raw}. Use one of: ${MOONS.join(", ")}`);
    process.exit(1);
  }
  return s;
}

function parseBody(raw: string | undefined): BodyActivity | undefined {
  if (raw === undefined) return undefined;
  const s = raw.trim().toLowerCase() as BodyActivity;
  if (!BODIES.includes(s)) {
    console.error(`Invalid --body: ${raw}. Use one of: ${BODIES.join(", ")}`);
    process.exit(1);
  }
  return s;
}

function main(): void {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      phase: { type: "string" },
      "time-phase": { type: "string" },
      day: { type: "string" },
      weekday: { type: "string" },
      weather: { type: "string" },
      moon: { type: "string" },
      body: { type: "string" },
      location: { type: "string" },
      seed: { type: "string" },
      "duration-ms": { type: "string" },
      lexicon: { type: "string" },
      "lunar-strength": { type: "string" },
      "mood-top-k": { type: "string" },
      "time-signature": { type: "boolean" },
      "plan-only": { type: "boolean" },
      "no-meta": { type: "boolean" },
      output: { type: "string", short: "o" },
      pretty: { type: "boolean" },
    },
    strict: true,
    allowPositionals: false,
  });

  if (values.help) printHelp(0);

  const phaseRaw = values.phase ?? values["time-phase"];
  const dayRaw = values.day ?? values.weekday;
  const weatherRaw = values.weather;
  const moonRaw = values.moon;

  if (!phaseRaw || !dayRaw || !weatherRaw || !moonRaw) {
    console.error("Missing required flags: --phase, --day, --weather, --moon\n");
    printHelp(1);
  }

  const input: PipelineInput = {
    timePhase: normalizeTimePhase(phaseRaw),
    dayOfWeek: normalizeDay(dayRaw),
    weatherCondition: weatherRaw,
    moonPhase: normalizeMoon(moonRaw),
    bodyActivity: parseBody(values.body),
    locationType: values.location,
  };

  let lexiconRoot = values.lexicon ?? defaultLexiconRoot();
  if (!path.isAbsolute(lexiconRoot)) {
    lexiconRoot = path.resolve(process.cwd(), lexiconRoot);
  }

  const durationMs = values["duration-ms"]
    ? Number(values["duration-ms"])
    : undefined;
  if (durationMs !== undefined && (!Number.isFinite(durationMs) || durationMs < 3000)) {
    console.error("--duration-ms must be a number ≥ 3000");
    process.exit(1);
  }

  const lunarStrength = values["lunar-strength"]
    ? Number(values["lunar-strength"])
    : undefined;
  if (
    lunarStrength !== undefined &&
    (!Number.isFinite(lunarStrength) || lunarStrength < 0.6 || lunarStrength > 1)
  ) {
    console.error("--lunar-strength must be between 0.6 and 1");
    process.exit(1);
  }

  const moodTopK = values["mood-top-k"] ? Number(values["mood-top-k"]) : undefined;
  if (moodTopK !== undefined && (!Number.isFinite(moodTopK) || moodTopK < 1)) {
    console.error("--mood-top-k must be a positive integer");
    process.exit(1);
  }

  const result = metaToCompositionPlanFromRoot(input, {
    lexiconRoot,
    seed: values.seed,
    totalDurationMs: durationMs,
    lunarStrength,
    includeTimeSignature: values["time-signature"] === true,
    moodTopK: moodTopK !== undefined ? Math.floor(moodTopK) : undefined,
  });

  const space = values.pretty ? 2 : undefined;
  const planStr = `${JSON.stringify(result.compositionPlan, null, space)}\n`;

  if (values.output) {
    const outPath = path.isAbsolute(values.output)
      ? values.output
      : path.resolve(process.cwd(), values.output);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, planStr, "utf8");
  }

  if (values["plan-only"]) {
    process.stdout.write(planStr);
    return;
  }

  const payload: Record<string, unknown> = {
    input,
    composition_plan: result.compositionPlan,
  };
  if (!values["no-meta"]) {
    payload.stacked = result.stacked;
    payload.renderPlan = result.renderPlan;
  }

  process.stdout.write(`${JSON.stringify(payload, null, space)}\n`);
}

main();
