import { describe, expect, it } from "vitest";
import {
  normalizeLocationType,
  normalizeMoodTag,
  normalizeWeatherCondition,
} from "../src/normalize.js";

describe("normalizeWeatherCondition", () => {
  it("maps kebab-case and aliases to lexicon keys", () => {
    expect(normalizeWeatherCondition("rain")).toBe("rain");
    expect(normalizeWeatherCondition("rain-showers")).toBe("rain_showers");
    expect(normalizeWeatherCondition("mainly-clear")).toBe("mainly_clear");
    expect(normalizeWeatherCondition("FREEZING_DRIZZLE")).toBe("freezing_drizzle");
  });
});

describe("normalizeMoodTag", () => {
  it("converts hyphens to snake_case", () => {
    expect(normalizeMoodTag("soft-focus")).toBe("soft_focus");
    expect(normalizeMoodTag("dry-cold")).toBe("dry_cold");
  });
});

describe("normalizeLocationType", () => {
  it("strips accents and lowercases", () => {
    expect(normalizeLocationType("Café")).toBe("cafe");
    expect(normalizeLocationType("Transit Hub")).toBe("transit_hub");
  });
});
