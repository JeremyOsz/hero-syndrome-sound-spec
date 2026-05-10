import type { WeatherCondition } from "./types.js";

const WEATHER_ALIASES: Record<string, WeatherCondition> = {
  mainly_clear: "mainly_clear",
  "mainly-clear": "mainly_clear",
  rain_showers: "rain_showers",
  "rain-showers": "rain_showers",
  thunderstorm_hail: "thunderstorm_hail",
  "thunderstorm-hail": "thunderstorm_hail",
  snow_grains: "snow_grains",
  "snow-grains": "snow_grains",
  snow_showers: "snow_showers",
  "snow-showers": "snow_showers",
  freezing_drizzle: "freezing_drizzle",
  "freezing-drizzle": "freezing_drizzle",
  freezing_rain: "freezing_rain",
  "freezing-rain": "freezing_rain",
  clear: "clear",
  overcast: "overcast",
  fog: "fog",
  drizzle: "drizzle",
  rain: "rain",
  thunderstorm: "thunderstorm",
  snow: "snow",
};

export function normalizeWeatherCondition(raw: string): WeatherCondition {
  const k = raw.trim().toLowerCase().replace(/\s+/g, "_");
  const aliased = WEATHER_ALIASES[k] ?? (k as WeatherCondition);
  return aliased;
}

export function normalizeMoodTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/-/g, "_");
}

export function normalizeLocationType(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/café/g, "cafe")
    .replace(/\s+/g, "_");
}
