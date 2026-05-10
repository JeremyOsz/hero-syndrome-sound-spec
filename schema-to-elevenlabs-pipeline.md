# Meta stack → ElevenLabs `composition_plan`

**For collaborators:** this doc is the **engineering bridge**. The **sound design spec** — meta model, numeric stacking, and modifier rules — lives in [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md). ElevenLabs only accepts **English style strings** and **section metadata** — not our internal floats or tag maps.

**Approach:** compute a **`RenderPlan`** (one generation tick, fully resolved), then run a **pure renderer** that only reads [lexicon/](lexicon/) JSON and emits `composition_plan` JSON.

### Glossary

| Term | Meaning |
|------|---------|
| **Meta stack** | Energy + mood + inspiration after all modifiers (time, day, weather, moon, …). |
| **RenderPlan** | Compiled snapshot: scalars + tag weights + ids ready for string lookup (no API prose yet). |
| **Lexicon** | JSON map from stable ids/tags to `string[]` synonym pools. |
| **Archetype** | Named section template (local styles + duration weight) per `time.phase`. |

---

## 1. Canonical intermediate: `RenderPlan` (your schema, compiled)

Define a single struct (conceptually) that is *already* resolved for one generation tick:

| Field | Source (your doc) | Role |
|--------|-------------------|------|
| `timePhase` | time | Section archetypes, default BPM anchor, “lunarSens” |
| `energy` | motion, density, tension, brightness | BPM, density language, tension in negatives/positives |
| `mood` | final tag → weight map (top-K) | Ordered list of mood phrases |
| `inspiration` | world + textures | Global “world line” + texture bullets |
| `weather` | condition (+ optional modifiers) | Weather phrase + weather style deltas |
| `day` | weekday | Energy delta (already in energy) + optional mood tags |
| `moon` | phase + tideEffective + undertow | “Dynamics range” phrasing only (strings) |
| `constraints` | product rules | e.g. instrumental, max sections, total duration |
| `seed` / `sessionId` | quantum / random | Tie-break ordering, synonym choice |

Everything in `RenderPlan` should be **resolved scalars and short lists**, not raw API strings yet.

**Rule:** all stacking (time + day + weather + moon) happens **before** string rendering, using [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md).

---

## 2. Pipeline stages (order matters)

```
MetaState (raw inputs)
  → normalize + clamp
  → compute stacked mood / energy / inspiration (your existing formulas)
  → build RenderPlan
  → project RenderPlan → PromptSurface (strings + sections)
  → validate + cap
  → JSON composition_plan
```

### Stage A — Normalize

- Clamp all weights to `[0, 1]`, energies to sane bands.
- Map enums to stable keys (`dusk`, `rain`, `full`, …).

### Stage B — Stack (your doc)

- Time-phase baseline mood + inspiration.
- Apply day mood deltas × sensitivity.
- Apply weather mood deltas × sensitivity × tidal range on deltas.
- Add smoothed moon undertow to mood (not to “genre”).
- Apply day energy delta to `motion`/`density`/… as you already defined.

### Stage C — `RenderPlan` (numeric + symbolic)

Derive **presentation scalars** used only for wording:

| Derived | Typical formula (tune by ear) |
|---------|-------------------------------|
| `bpm` | `lerp(44, 120, motion) * phaseAnchor[timePhase]` then round to int |
| `sectionCount` | 3 default; 2 if `density < 0.25`; 4 if `density > 0.65` |
| `totalDurationMs` | product default e.g. `60000`; or stem length `20000` |
| `sectionDurationsMs[]` | split total by weights `[0.35, 0.4, 0.25]` ± jitter from `tension` |
| `dynamicsPhrase` | from `tideEffective`: wide vs even range (see moon section in doc) |
| `brightnessPhrase` | from `brightness`: dark mix vs airy highs |
| `densityPhrase` | from `density`: sparse vs layered |

Keep these **deterministic** from `RenderPlan` + optional `seed` for jitter.

### Stage D — `PromptSurface` (string projection)

**Libraries (repo):** phrase pools under [lexicon/](lexicon/) — [lexicon/README.md](lexicon/README.md).

1. **Mood** — [lexicon/mood.json](lexicon/mood.json): tag → `string[]`. Normalize `soft-focus` → `soft_focus` before lookup. Pick with `hash(seed, tag)`.
2. **World** — [lexicon/world.json](lexicon/world.json): `inspiration.world` id.
3. **Textures** — [lexicon/texture.json](lexicon/texture.json): texture cue ids.
4. **Weather** — [lexicon/weather.json](lexicon/weather.json): `scene` + `texture_hints` per condition.
5. **Moon** — [lexicon/moon.json](lexicon/moon.json): `tide_dynamics` + `undertow` by phase.
6. **Energy** — [lexicon/energy.json](lexicon/energy.json): quantize axes in code, then pick phrases.
7. **Body / day / location** — [lexicon/body.json](lexicon/body.json), [lexicon/day.json](lexicon/day.json), [lexicon/location.json](lexicon/location.json).
8. **Negatives** — [lexicon/negatives.json](lexicon/negatives.json): `fixed` ∪ rule-selected `conditional` pools.
9. **Sections** — [lexicon/section-archetypes.json](lexicon/section-archetypes.json): `time.phase` → archetypes; `duration_weight` × `totalDurationMs` → `duration_ms`.

**Assembly order for `positive_global_styles` (stable):**

1. Product anchors: `"instrumental only"` (and any brand-safe clause).
2. Technical: `"{bpm} BPM"`, optional `"4/4"` if you always want it.
3. World + textures (from inspiration, max 3–5 phrases).
4. Top-K mood tags by weight (K=4–6), each through lexicon.
5. Weather clause (1 phrase).
6. Moon/tide dynamics clause (0–1 phrase).
7. Brightness/density clauses (1 each if not redundant).

**Dedupe**, **max length** (ElevenLabs: practical limit ~50 items per array; stay under ~15 globals for clarity).

**`negative_global_styles`:**

- Fixed block for your app: vocals, singing, lyrics, speech, …
- Conditional: if `brightness > 0.6` add `"muddy mix"`; if `tension < 0.3` add `"harsh aggressive distortion"`; if instrumental stem add `"prominent lead vocal"`.

### Stage E — Section planner

Use [lexicon/section-archetypes.json](lexicon/section-archetypes.json): each `time.phase` has an **ordered list** of sections with `section_name`, `positive_local_styles`, `negative_local_styles`, and `duration_weight`.

- Compute `duration_ms` for each row as `round(duration_weight * totalDurationMs)`; adjust last section so the sum matches `totalDurationMs` and each section stays within API bounds (3–120 s).
- **Optional v2:** replace fixed strings with templates + **slots** (`{texture}`, `{weather_micro}`) filled from the same lexicons; v1 can ship with static strings as in the JSON.

`lines`: always `[]` for instrumental output.

### Stage F — Validate

- Each section `duration_ms` in `[3000, 120000]`.
- Sum of sections in `[3000, 600000]` (API limits).
- No empty `positive_global_styles` / `negative_global_styles` if the API requires non-empty — use `["minimal instrumentation"]` / `["vocals"]` as safe defaults.
- Copyright: avoid artist names in styles (ElevenLabs may reject); use your **material** descriptors only.

---

## 3. Determinism vs variety

- **Same `MetaState` + same `seed`** → same `composition_plan` (good for QA).
- **Same `MetaState` + different `seed`** → synonym rotation, slight section duration jitter, reorder of non-critical style lines (still same bucket).

Your **quantum seed** can set: `seed`, section jitter, and synonym index — not the structural table lookups.

---

## 4. Stems vs full scene

- **Full scene:** one `RenderPlan` → one `composition_plan` (what you hand-authored).
- **Stems:** same `RenderPlan`, different **`layer`** flag:
  - `layer: bed` → only pad/harmony archetypes; drop percussion lexicon.
  - `layer: pulse` → rhythm-forward templates; negatives include `"lush reverb wash"`.
  - `layer: weather` → noise/granular templates; short duration.

Same pipeline; different **archetype table** and **negative blocks**.

---

## 5. Minimal implementation checklist

1. **JSON schema** for `MetaState` (what your app already produces after stacking).
2. **Lexicons** — done: [lexicon/](lexicon/) (JSON phrase pools + [lexicon/section-archetypes.json](lexicon/section-archetypes.json)).
3. **One function** `metaToCompositionPlan(meta, options)` loading those files.
4. **Golden tests**: freeze one `MetaState` per phase; snapshot the output JSON.

---

## 6. Relation to the hand-written examples

The file `elevenlabs-sample-composition-plans-by-time-phase.md` is what you get when a human runs **Stage D–E** once per phase. The pipeline above is how you **automate** the same structure so every user session is consistent with your modifier doc.

---

## 7. Optional next step

- `meta-state.schema.json` — input shape after stacking
- Small Node/TS script: load `lexicon/*`, quantize energy, select conditional negatives, emit `composition_plan`
