# Sound design spec — environment-aware instrumental music

This repository documents the **sound design specification** for *Hero Syndrome* (working title): phone signals (time, weather, movement, optional place) drive a **meta layer** (energy, mood, inspiration), which maps to musical style strings and, for prototyping, **ElevenLabs Music** `composition_plan` JSON.

## How the system is structured (short)

1. **Raw inputs** — e.g. `time.phase`, `weather.condition`, `dayOfWeek`, `body.activity`, moon phase (optional in product), `location.type`.
2. **Stack** — combine baselines and deltas per [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md) into **energy** (numeric axes), **mood** (tag weights), **inspiration** (world + textures).
3. **Render** — map that stack to English **style strings** and **sections** using JSON **lexicons** in [lexicon/](lexicon/).
4. **Output** — ElevenLabs [composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans) (`positive_global_styles`, `negative_global_styles`, `sections` with `duration_ms`; instrumental = empty `lines`).

Detailed pipeline: [schema-to-elevenlabs-pipeline.md](schema-to-elevenlabs-pipeline.md).

---

## Repository map


| Document                                                                                                     | Purpose                                                                                                       |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md)                       | **Authoritative** stacking rules: time phases, weekday, weather, moon-as-tide, formulas, example JSON shapes. |
| [schema-to-elevenlabs-pipeline.md](schema-to-elevenlabs-pipeline.md)                                         | Engineering path from stacked state → `composition_plan`.                                                     |
| [lexicon/](lexicon/)                                                                                         | Phrase pools and section archetypes the renderer pulls from ([lexicon/README.md](lexicon/README.md)).         |
| [examples/](examples/)                                                                                       | **24** worked `composition_plan` examples (three contrasting scenarios per time phase); index in [examples/README.md](examples/README.md). |


---

