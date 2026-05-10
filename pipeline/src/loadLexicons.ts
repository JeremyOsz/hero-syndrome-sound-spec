import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { WeatherCondition } from "./types.js";

export interface Lexicons {
  product: { instrumental_positives: string[]; instrumental_negatives: string[] };
  world: Record<string, string[]>;
  texture: Record<string, string[]>;
  mood: Record<string, string[]>;
  weather: Record<
    string,
    {
      scene: string[];
      texture_hints: string[];
    }
  >;
  moon: {
    tide_dynamics: Record<string, string[]>;
    undertow: Record<string, string[]>;
  };
  energy: Record<string, Record<string, string[]>>;
  body: Record<string, string[]>;
  day: Record<string, string[]>;
  location: Record<string, string[]>;
  negatives: {
    fixed: string[];
    conditional: Record<string, string[]>;
  };
  sectionArchetypes: Record<string, SectionArchetypeRow[]>;
}

export interface SectionArchetypeRow {
  id: string;
  section_name: string;
  duration_weight: number;
  positive_local_styles: string[];
  negative_local_styles: string[];
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function loadLexicons(lexiconRoot: string): Lexicons {
  const root = lexiconRoot;
  const sectionRaw = readJson<Record<string, SectionArchetypeRow[]>>(
    join(root, "section-archetypes.json"),
  );
  return {
    product: readJson(join(root, "product.json")),
    world: readJson(join(root, "world.json")),
    texture: readJson(join(root, "texture.json")),
    mood: readJson(join(root, "mood.json")),
    weather: readJson(join(root, "weather.json")),
    moon: readJson(join(root, "moon.json")),
    energy: readJson(join(root, "energy.json")),
    body: readJson(join(root, "body.json")),
    day: readJson(join(root, "day.json")),
    location: readJson(join(root, "location.json")),
    negatives: readJson(join(root, "negatives.json")),
    sectionArchetypes: sectionRaw,
  };
}

export function isWeatherCondition(
  lex: Lexicons,
  key: string,
): key is WeatherCondition {
  return key in lex.weather;
}
