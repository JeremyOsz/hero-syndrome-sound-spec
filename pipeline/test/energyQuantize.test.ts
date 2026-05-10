import { describe, expect, it } from "vitest";
import {
  quantizeBrightness,
  quantizeDensity,
  quantizeEnergy,
  quantizeMotion,
  quantizeTension,
} from "../src/energyQuantize.js";

describe("quantizeMotion", () => {
  it("buckets per spec bands", () => {
    expect(quantizeMotion(0)).toBe("very_low");
    expect(quantizeMotion(0.19)).toBe("very_low");
    expect(quantizeMotion(0.2)).toBe("low");
    expect(quantizeMotion(0.54)).toBe("mid");
    expect(quantizeMotion(0.74)).toBe("high");
    expect(quantizeMotion(0.99)).toBe("very_high");
  });
});

describe("quantizeEnergy", () => {
  it("returns all axes", () => {
    const q = quantizeEnergy({
      motion: 0.5,
      density: 0.5,
      tension: 0.5,
      brightness: 0.5,
    });
    expect(q.motion).toBe("mid");
    expect(q.density).toBe("moderate");
    expect(q.tension).toBe("moderate");
    expect(q.brightness).toBe("neutral");
  });
});

describe("quantizeBrightness", () => {
  it("handles extremes", () => {
    expect(quantizeBrightness(0.1)).toBe("very_dark");
    expect(quantizeBrightness(0.9)).toBe("very_bright");
  });
});
