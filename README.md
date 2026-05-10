# Sound design spec — environment-aware instrumental music

This repository documents the **sound design specification** for *Hero Syndrome* (working title): phone signals (time, weather, movement, optional place) drive a **meta layer** (energy, mood, inspiration), which maps to musical style strings and, for prototyping, **ElevenLabs Music** `composition_plan` JSON.

## How the system is structured (short)

1. **Raw inputs** — e.g. `time.phase`, `weather.condition`, `dayOfWeek`, `body.activity`, moon phase (optional in product), `location.type`.
2. **Stack** — combine baselines and deltas per [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md) into **energy** (numeric axes), **mood** (tag weights), **inspiration** (world + textures).
3. **Render** — map that stack to English **style strings** and **sections** using JSON **lexicons** in [lexicon/](lexicon/).
4. **Output** — ElevenLabs [composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans) (`positive_global_styles`, `negative_global_styles`, `sections` with `duration_ms`; instrumental = empty `lines`).

Detailed pipeline: [schema-to-elevenlabs-pipeline.md](schema-to-elevenlabs-pipeline.md).

---

## Pipeline CLI (try the stack → `composition_plan`)

The [pipeline/](pipeline/) package implements the spec in TypeScript and ships a small CLI, **`hero-sound-plan`**, for local experiments.

**Setup** (from repo root or from `pipeline/`):

```bash
cd pipeline && npm install && npm run build
```

**Run** — required flags: `--phase`, `--day`, `--weather`, `--moon`. Optional: `--body`, `--location`, `--seed`, `--duration-ms`, `--lexicon`, `--lunar-strength`, `--mood-top-k`, `--time-signature`, `--pretty`, `--plan-only` (print only the inner `composition_plan`), `--no-meta` (omit stacked meta / render plan in the JSON), **`-o` / `--output <file>`** (write the `composition_plan` object to a file; same formatting as `--pretty`; parent directories are created).

```bash
# From repo root (uses ./lexicon when present)
node pipeline/dist/cli.js --phase dusk --day Saturday --weather rain --moon full \
  --body walking --location museum --seed demo-1 --pretty -o composition-plan.json

# Same, via npm script from pipeline/
cd pipeline && npm run cli -- --phase dawn --day Tuesday --weather drizzle --moon waxing_crescent --pretty --plan-only
```

After a global link or install, you can call `hero-sound-plan` instead of `node pipeline/dist/cli.js`. **`--help`** lists all phases, weekdays, weather aliases, and moon phases.

**Lexicon path:** by default the CLI uses `./lexicon` relative to the current working directory if that folder exists; otherwise it resolves the repo’s `lexicon/` next to `pipeline/`. Override with `--lexicon /absolute/or/relative/path`.

**Tests:** `cd pipeline && npm test`

---

## Repository map


| Document                                                                                                     | Purpose                                                                                                       |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| [weather-app-time-of-day-meta-modifiers.md](weather-app-time-of-day-meta-modifiers.md)                       | **Authoritative** stacking rules: time phases, weekday, weather, moon-as-tide, formulas, example JSON shapes. |
| [schema-to-elevenlabs-pipeline.md](schema-to-elevenlabs-pipeline.md)                                         | Engineering path from stacked state → `composition_plan`.                                                     |
| [lexicon/](lexicon/)                                                                                         | Phrase pools and section archetypes the renderer pulls from ([lexicon/README.md](lexicon/README.md)).         |
| [examples/](examples/)                                                                                       | **24** worked `composition_plan` examples (three contrasting scenarios per time phase); index in [examples/README.md](examples/README.md). |
| [pipeline/](pipeline/)                                                                                       | TypeScript implementation, tests, and **`hero-sound-plan`** CLI (see section above).                                                        |


---

