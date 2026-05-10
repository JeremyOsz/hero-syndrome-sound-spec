import { describe, expect, it } from "vitest";
import { loadLexicons } from "../src/loadLexicons.js";
import { metaToCompositionPlan, metaToCompositionPlanFromRoot } from "../src/pipeline.js";
import { LEXICON_ROOT } from "./lexiconRoot.js";

const sampleInput = {
  timePhase: "dusk" as const,
  dayOfWeek: "Saturday" as const,
  weatherCondition: "rain",
  moonPhase: "full" as const,
  bodyActivity: "walking" as const,
  locationType: "museum",
};

describe("metaToCompositionPlan (e2e)", () => {
  const lex = loadLexicons(LEXICON_ROOT);

  it("produces valid composition_plan shape", () => {
    const { compositionPlan, stacked, renderPlan } = metaToCompositionPlan(
      lex,
      sampleInput,
      {
        lexiconRoot: LEXICON_ROOT,
        seed: "golden-e2e-1",
        totalDurationMs: 58_000,
      },
    );

    expect(stacked.weatherCondition).toBe("rain");
    expect(renderPlan.bpm).toBeGreaterThanOrEqual(40);
    expect(renderPlan.bpm).toBeLessThanOrEqual(140);

    expect(compositionPlan.positive_global_styles.length).toBeGreaterThan(3);
    expect(compositionPlan.negative_global_styles.length).toBeGreaterThan(3);

    expect(compositionPlan.sections.length).toBeGreaterThan(0);
    let sum = 0;
    for (const sec of compositionPlan.sections) {
      expect(sec.duration_ms).toBeGreaterThanOrEqual(3000);
      expect(sec.duration_ms).toBeLessThanOrEqual(120_000);
      expect(sec.lines).toEqual([]);
      expect(sec.positive_local_styles.length).toBeGreaterThan(0);
      sum += sec.duration_ms;
    }
    expect(sum).toBe(58_000);
  });

  it("is deterministic for same seed and inputs", () => {
    const opts = {
      lexiconRoot: LEXICON_ROOT,
      seed: "determinism-check",
      totalDurationMs: 60_000,
    };
    const a = metaToCompositionPlan(lex, sampleInput, opts).compositionPlan;
    const b = metaToCompositionPlan(lex, sampleInput, opts).compositionPlan;
    expect(a).toEqual(b);
  });

  it("changes output when seed changes", () => {
    const base = { lexiconRoot: LEXICON_ROOT, totalDurationMs: 60_000 };
    const a = metaToCompositionPlan(lex, sampleInput, {
      ...base,
      seed: "seed-a",
    }).compositionPlan;
    const b = metaToCompositionPlan(lex, sampleInput, {
      ...base,
      seed: "seed-b",
    }).compositionPlan;
    expect(a.positive_global_styles).not.toEqual(b.positive_global_styles);
  });
});

describe("metaToCompositionPlanFromRoot", () => {
  it("loads lexicons and runs pipeline", () => {
    const { compositionPlan } = metaToCompositionPlanFromRoot(
      {
        timePhase: "morning",
        dayOfWeek: "Tuesday",
        weatherCondition: "mainly-clear",
        moonPhase: "waning_crescent",
      },
      { lexiconRoot: LEXICON_ROOT, seed: "from-root" },
    );
    expect(compositionPlan.sections[0]?.section_name).toBeTruthy();
  });
});
