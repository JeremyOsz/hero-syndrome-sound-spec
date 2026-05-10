# Sample ElevenLabs composition plans by time of day

**Purpose:** give collaborators **copy-pasteable** `composition_plan` objects to test the [ElevenLabs Music API](https://elevenlabs.io/docs/api-reference/music/compose-detailed) (detailed compose). Use them to align ears with the meta model before the automated renderer is finished.

**Request shape:** send JSON with top-level `composition_plan` (and e.g. `model_id`, `respect_sections_durations`) — each file below is **only** the inner `composition_plan` object.

**Instrumental:** every section uses `lines: []`. With composition plans, steer away from vocals via `negative_global_styles` (and product strings in `positive_global_styles`). The simple `prompt` path can use `force_instrumental: true` instead.

**Scenarios:** each example picks a plausible **weather · weekday · moon · activity** so you can discuss outcomes in shared language.

**Contrasts:** for each `time.phase` there are **three** plans — **A** (base `0X-*.md`), **B** (`0Xb-*.md`), **C** (`0Xc-*.md`). They deliberately differ in weather, body/vehicle context, weekday energy, lunar tide language, BPM, and texture so A/B/C are easy to tell apart in listening tests.

**Automation:** phrase pools and section templates live in [lexicon/](../lexicon/); the full pipeline is [schema-to-elevenlabs-pipeline.md](../schema-to-elevenlabs-pipeline.md).

## Examples by time phase

### 1 — Witching hour (02:00–05:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [01-witching-hour.md](01-witching-hour.md) | Fog, still, neap — sparse ritual ambient, narrow |
| B | [01b-witching-hour-clear-running-saturday.md](01b-witching-hour-clear-running-saturday.md) | Clear, running, Saturday — wide neon runner pulse |
| C | [01c-witching-hour-freezing-drizzle-vehicle.md](01c-witching-hour-freezing-drizzle-vehicle.md) | Freezing drizzle, vehicle — glassy isolated cabin |

### 2 — Dawn (05:00–07:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [02-dawn.md](02-dawn.md) | Drizzle, walking — fragile pastoral awakening |
| B | [02b-dawn-clear-vehicle-saturday.md](02b-dawn-clear-vehicle-saturday.md) | Clear, vehicle, Saturday full moon — highway motor |
| C | [02c-dawn-fog-still-wednesday.md](02c-dawn-fog-still-wednesday.md) | Fog, still, Wednesday — grey hesitation, no beat |

### 3 — Morning (07:00–11:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [03-morning.md](03-morning.md) | Mainly clear, Friday, walking — urban kinetic |
| B | [03b-morning-overcast-desk-wednesday.md](03b-morning-overcast-desk-wednesday.md) | Overcast, Wednesday, still — flat desk interior |
| C | [03c-morning-rain-showers-running-thursday.md](03c-morning-rain-showers-running-thursday.md) | Rain-showers, running — broken syncopated athletic |

### 4 — Noon (11:00–13:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [04-noon.md](04-noon.md) | Clear, Saturday, still — bright chamber ensemble |
| B | [04b-noon-overcast-walking-wednesday.md](04b-noon-overcast-walking-wednesday.md) | Overcast, Wednesday, walking — subdued grey chamber |
| C | [04c-noon-mainly-clear-vehicle-friday.md](04c-noon-mainly-clear-vehicle-friday.md) | Mainly clear, Friday, vehicle — synth road-trip pulse |

### 5 — Afternoon (13:00–16:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [05-afternoon.md](05-afternoon.md) | Overcast, vehicle — mechanical grid |
| B | [05b-afternoon-clear-pastoral-saturday.md](05b-afternoon-clear-pastoral-saturday.md) | Clear, Saturday, still — acoustic air and pluck |
| C | [05c-afternoon-drizzle-walking-monday.md](05c-afternoon-drizzle-walking-monday.md) | Drizzle, Monday, walking — soft melancholic organic |

### 6 — Golden hour (16:00–19:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [06-golden-hour.md](06-golden-hour.md) | Snow, Sunday, still — tape warmth, hush |
| B | [06b-golden-hour-clear-running-friday.md](06b-golden-hour-clear-running-friday.md) | Clear, Friday, running — athletic sunset drive |
| C | [06c-golden-hour-thunderstorm-hail-vehicle.md](06c-golden-hour-thunderstorm-hail-vehicle.md) | Thunderstorm-hail, vehicle — threat under warmth |

### 7 — Dusk (19:00–21:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [07-dusk.md](07-dusk.md) | Rain, Monday, walking — blurred urban dream |
| B | [07b-dusk-clear-rooftop-saturday.md](07b-dusk-clear-rooftop-saturday.md) | Clear, Saturday, still — wide rooftop social lift |
| C | [07c-dusk-fog-tunnel-wednesday.md](07c-dusk-fog-tunnel-wednesday.md) | Fog, Wednesday, vehicle — narrow tunnel uncanny |

### 8 — Night (21:00–02:00)

| Variant | File | Sketch |
|--------|------|--------|
| A | [08-night.md](08-night.md) | Thunderstorm, Wednesday, still — deep pressure |
| B | [08b-night-mainly-clear-walking-saturday.md](08b-night-mainly-clear-walking-saturday.md) | Mainly clear, Saturday, walking — lighter groove |
| C | [08c-night-drizzle-vehicle-friday.md](08c-night-drizzle-vehicle-friday.md) | Drizzle, Friday, vehicle — windshield intimate |

## Usage notes

- Total duration per plan is **54–62 seconds**; well within API total limits; each section is **16–24 s** (within 3–120 s per section).
- For **stems**, reuse the same scenario but change `section_name` / styles: e.g. one call with only “Bed” sections, another with only “Pulse”.
- Tune `respect_sections_durations` per [ElevenLabs composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans): `true` for timing, `false` if quality matters more than exact bar length.
