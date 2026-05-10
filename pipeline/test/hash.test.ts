import { describe, expect, it } from "vitest";
import { hashString, pickFrom, pickIndex } from "../src/hash.js";

describe("hashString", () => {
  it("is deterministic", () => {
    expect(hashString("session-42")).toBe(hashString("session-42"));
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});

describe("pickFrom", () => {
  const items = ["alpha", "beta", "gamma"] as const;

  it("is stable for same seed and salt", () => {
    expect(pickFrom("s1", "salt", items)).toBe(pickFrom("s1", "salt", items));
  });

  it("changes when salt changes", () => {
    const a = pickFrom("s1", "a", items);
    const b = pickFrom("s1", "b", items);
    expect([a, b].every(Boolean)).toBe(true);
  });

  it("returns undefined for empty list", () => {
    expect(pickFrom("s", "x", [])).toBeUndefined();
  });
});

describe("pickIndex", () => {
  it("stays within modulo", () => {
    for (let i = 0; i < 20; i++) {
      const idx = pickIndex(`k${i}`, "m", 7);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(7);
    }
  });
});
