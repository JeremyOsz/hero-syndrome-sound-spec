import { PHASE_BPM_MULT } from "./constants.js";
import type { RenderPlan, StackedMeta } from "./types.js";

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Derives BPM and timing budget; section layout comes from lexicon archetypes. */
export function buildRenderPlan(
  meta: StackedMeta,
  seed: string,
  totalDurationMs: number,
): RenderPlan {
  const { motion } = meta.energy;
  const baseBpm = 44 + (120 - 44) * clamp(motion, 0, 1);
  const bpm = clamp(
    Math.round(baseBpm * PHASE_BPM_MULT[meta.timePhase]),
    40,
    140,
  );

  return {
    meta,
    bpm,
    totalDurationMs,
    seed,
  };
}
