import { describe, expect, it } from "vitest";
import { stackMeta } from "../src/stack.js";

describe("stackMeta", () => {
  it("clamps mood weights to 0–1", () => {
    const stacked = stackMeta({
      timePhase: "noon",
      dayOfWeek: "Saturday",
      weatherCondition: "thunderstorm",
      moonPhase: "full",
    });
    for (const w of Object.values(stacked.mood)) {
      expect(w).toBeGreaterThanOrEqual(0);
      expect(w).toBeLessThanOrEqual(1);
    }
  });

  it("clamps energy axes to 0–1", () => {
    const stacked = stackMeta({
      timePhase: "morning",
      dayOfWeek: "Saturday",
      weatherCondition: "clear",
      moonPhase: "full",
      bodyActivity: "running",
    });
    for (const k of ["motion", "density", "tension", "brightness"] as const) {
      expect(stacked.energy[k]).toBeGreaterThanOrEqual(0);
      expect(stacked.energy[k]).toBeLessThanOrEqual(1);
    }
  });

  it("computes tideEffective from moon + lunar sensitivity", () => {
    const stacked = stackMeta(
      {
        timePhase: "witching_hour",
        dayOfWeek: "Wednesday",
        weatherCondition: "fog",
        moonPhase: "first_quarter",
      },
      { lunarStrength: 0.8 },
    );
    expect(stacked.tideEffective).toBeGreaterThan(0);
    expect(stacked.tideEffective).toBeLessThan(2);
  });

  it("sets secondary world when weather blend differs from phase world", () => {
    const stacked = stackMeta({
      timePhase: "dusk",
      dayOfWeek: "Monday",
      weatherCondition: "rain",
      moonPhase: "new",
    });
    expect(stacked.inspiration.world).toBe("urban_dreamlike");
    expect(stacked.inspiration.worldSecondary).toBe("deep_nocturnal");
  });
});
