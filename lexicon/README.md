# ElevenLabs style lexicons

**Collaborators:** these files are the **wording layer** for API experiments. Editing them is the fastest way to change vibe without touching modifier math.

JSON phrase pools the **renderer** pulls from after the meta stack ([weather-app-time-of-day-meta-modifiers.md](../weather-app-time-of-day-meta-modifiers.md)) produces numeric tags and weights.

**Rules of thumb:** concrete audio language, no artist names, prefer synonym arrays over one perfect line. See [../CONTRIBUTING.md](../CONTRIBUTING.md).

## Files

| File | Pull when |
|------|-----------|
| [product.json](product.json) | Always: instrumental anchors + core vocal negatives |
| [world.json](world.json) | `inspiration.world` (from time phase ± weather blend) |
| [texture.json](texture.json) | `inspiration.textures` cues (snake_case ids → English) |
| [mood.json](mood.json) | Each **stacked mood tag** above threshold (pick 1 phrase per tag via seed) |
| [weather.json](weather.json) | `weather.condition` → scene line + optional texture hints |
| [moon.json](moon.json) | `moon.phase`, `tideEffective` bucket, undertow tags |
| [energy.json](energy.json) | Quantized `motion` / `density` / `tension` / `brightness` (from stacked energy) |
| [body.json](body.json) | `body.activity` → groove / motion clause |
| [day.json](day.json) | Optional flavour line from `dayOfWeek` (not a full mood model) |
| [negatives.json](negatives.json) | Fixed block + conditional pools (bright mix, night, storm, …) |
| [location.json](location.json) | Optional `location.type` POI hints |
| [section-archetypes.json](section-archetypes.json) | `time.phase` → section templates (`positive_local_styles`, `negative_local_styles`, `duration_weight`) |

## Assembly order (globals)

Matches [schema-to-elevenlabs-pipeline.md](../schema-to-elevenlabs-pipeline.md):

1. `product.instrumental_positives` (1–2)
2. `"{bpm} BPM"` from code, not lexicon
3. `world` + `texture` phrases (cap 3–5)
4. Top-K `mood` lexicon picks
5. One `weather.scene` phrase
6. Optional `moon.dynamics` + `moon.undertow` (0–1 each)
7. `energy` brightness / density lines if not redundant
8. Optional `body` / `day` / `location`

Negatives: `product.instrumental_negatives` ∪ `negatives.fixed` ∪ conditional picks from `negatives.conditional`.

## Keys

- Use **snake_case** for all JSON object keys (matches internal enums).
- Map mood tags from the modifiers doc: hyphenated names → underscore (`soft-focus` → `soft_focus`) before `mood.json` lookup.
- `location`: use `cafe` in JSON; alias `café` → `cafe` in code.
- **Energy quantization** (suggested): `motion` 0–0.2 very_low, 0.2–0.35 low, 0.35–0.55 mid, 0.55–0.75 high, else very_high; tune per playtest.
- **Negatives `conditional`**: choose pool from rules (e.g. `time.phase` in `witching_hour|night` → `night_uncanny_phase`; `weather.clear` + high `brightness` → `bright_day_clear_weather`; `weather.thunderstorm` → `storm_night`; etc.).
