import { renderCompositionPlan } from "./compositionPlan.js";
import type { Lexicons } from "./loadLexicons.js";
import { loadLexicons } from "./loadLexicons.js";
import { buildRenderPlan } from "./renderPlan.js";
import { stackMeta } from "./stack.js";
import type {
  CompositionPlan,
  PipelineInput,
  PipelineOptions,
  RenderPlan,
  StackedMeta,
} from "./types.js";
import { normalizeLocationType } from "./normalize.js";

export interface MetaToPlanResult {
  stacked: StackedMeta;
  renderPlan: RenderPlan;
  compositionPlan: CompositionPlan;
}

/**
 * End-to-end: raw inputs → stacked meta → `composition_plan` JSON for ElevenLabs.
 */
export function metaToCompositionPlan(
  lex: Lexicons,
  input: PipelineInput,
  options?: PipelineOptions,
): MetaToPlanResult {
  const seed = options?.seed ?? "default-seed";
  const totalMs = options?.totalDurationMs ?? 60_000;

  const stacked = stackMeta(input, {
    undertowSmooth: options?.undertowSmooth,
    lunarStrength: options?.lunarStrength,
    undertowInstantStrength: options?.undertowInstantStrength,
  });

  const renderPlan: RenderPlan = {
    ...buildRenderPlan(stacked, seed, totalMs),
    bodyActivity: input.bodyActivity,
    locationType: input.locationType
      ? normalizeLocationType(input.locationType as string)
      : undefined,
  };

  const compositionPlan = renderCompositionPlan(lex, renderPlan, {
    includeTimeSignature: options?.includeTimeSignature,
    moodTopK: options?.moodTopK,
    dayOfWeek: input.dayOfWeek,
  });

  return { stacked, renderPlan, compositionPlan };
}

/** Load lexicons from disk then run {@link metaToCompositionPlan}. */
export function metaToCompositionPlanFromRoot(
  input: PipelineInput,
  options: PipelineOptions,
): MetaToPlanResult {
  const lex = loadLexicons(options.lexiconRoot);
  return metaToCompositionPlan(lex, input, options);
}
