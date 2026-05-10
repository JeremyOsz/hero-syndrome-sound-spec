# Sample ElevenLabs composition plans by time of day

**Purpose:** give collaborators **copy-pasteable** `composition_plan` objects to test the [ElevenLabs Music API](https://elevenlabs.io/docs/api-reference/music/compose-detailed) (detailed compose). Use them to align ears with the meta model before the automated renderer is finished.

**Request shape:** send JSON with top-level `composition_plan` (and e.g. `model_id`, `respect_sections_durations`) — each file below is **only** the inner `composition_plan` object.

**Instrumental:** every section uses `lines: []`. With composition plans, steer away from vocals via `negative_global_styles` (and product strings in `positive_global_styles`). The simple `prompt` path can use `force_instrumental: true` instead.

**Scenarios:** each example picks a plausible **weather · weekday · moon · activity** so you can discuss outcomes in shared language.

**Automation:** phrase pools and section templates live in [lexicon/](../lexicon/); the full pipeline is [schema-to-elevenlabs-pipeline.md](../schema-to-elevenlabs-pipeline.md).

## Examples (one per time phase)

| # | Phase | File |
|---|--------|------|
| 1 | Witching hour (02:00–05:00) | [01-witching-hour.md](01-witching-hour.md) |
| 2 | Dawn (05:00–07:00) | [02-dawn.md](02-dawn.md) |
| 3 | Morning (07:00–11:00) | [03-morning.md](03-morning.md) |
| 4 | Noon (11:00–13:00) | [04-noon.md](04-noon.md) |
| 5 | Afternoon (13:00–16:00) | [05-afternoon.md](05-afternoon.md) |
| 6 | Golden hour (16:00–19:00) | [06-golden-hour.md](06-golden-hour.md) |
| 7 | Dusk (19:00–21:00) | [07-dusk.md](07-dusk.md) |
| 8 | Night (21:00–02:00) | [08-night.md](08-night.md) |

## Usage notes

- Total duration per plan is **54–62 seconds**; well within API total limits; each section is **16–24 s** (within 3–120 s per section).
- For **stems**, reuse the same scenario but change `section_name` / styles: e.g. one call with only “Bed” sections, another with only “Pulse”.
- Tune `respect_sections_durations` per [ElevenLabs composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans): `true` for timing, `false` if quality matters more than exact bar length.
