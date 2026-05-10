# Sample ElevenLabs composition plans by time of day

**Purpose:** give collaborators **copy-pasteable** `composition_plan` objects to test the [ElevenLabs Music API](https://elevenlabs.io/docs/api-reference/music/compose-detailed) (detailed compose). Use them to align ears with the meta model before the automated renderer is finished.

**Request shape:** send JSON with top-level `composition_plan` (and e.g. `model_id`, `respect_sections_durations`) — the blocks below are **only** the inner `composition_plan` object.

**Instrumental:** every section uses `lines: []`. With composition plans, steer away from vocals via `negative_global_styles` (and product strings in `positive_global_styles`). The simple `prompt` path can use `force_instrumental: true` instead.

**Scenarios:** each example picks a plausible **weather · weekday · moon · activity** so you can discuss outcomes in shared language.

**Automation:** phrase pools and section templates live in [lexicon/](lexicon/); the full pipeline is [schema-to-elevenlabs-pipeline.md](schema-to-elevenlabs-pipeline.md).

---

## 1) Witching hour (02:00–05:00)

**Scenario:** fog · Wednesday · waning crescent · still · *tide: compressed (neap undertow)*

```json
{
  "positive_global_styles": [
    "instrumental only",
    "52 BPM",
    "sparse texture",
    "nocturnal ritual ambient",
    "sub-bass drone",
    "distant metallic shimmer",
    "slow unstable noise bed",
    "intimate uncanny mood",
    "heavy fog night",
    "narrow stereo field",
    "very low brightness mix"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "speech",
    "upbeat",
    "daylight",
    "busy percussion",
    "EDM",
    "major key cheer"
  ],
  "sections": [
    {
      "section_name": "Sub drift",
      "positive_local_styles": [
        "almost inaudible low register",
        "gradual filter sweep",
        "suspended harmony"
      ],
      "negative_local_styles": ["bright", "fast tempo", "catchy hook"],
      "duration_ms": 18000,
      "lines": []
    },
    {
      "section_name": "Shimmer intrusion",
      "positive_local_styles": [
        "high partials emerging",
        "slight dissonance",
        "tension without release"
      ],
      "negative_local_styles": ["resolution", "heroic brass"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Dissolve",
      "positive_local_styles": [
        "layers thinning",
        "reverb tail",
        "unresolved ending"
      ],
      "negative_local_styles": ["big finish", "vocals"],
      "duration_ms": 16000,
      "lines": []
    }
  ]
}
```

---

## 2) Dawn (05:00–07:00)

**Scenario:** drizzle · Tuesday · waxing crescent · walking · *spring-tide mood range (waxing toward full)*

```json
{
  "positive_global_styles": [
    "instrumental only",
    "68 BPM",
    "pastoral awakening",
    "fragile hopeful mood",
    "airy pad",
    "thin harmonic overtones",
    "soft-focus mix",
    "early winter morning drizzle",
    "light tape warmth"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "aggressive",
    "club music",
    "heavy bass drops",
    "dense metal"
  ],
  "sections": [
    {
      "section_name": "First light",
      "positive_local_styles": [
        "single sparse motif",
        "high-passed texture",
        "gentle granular rain bed"
      ],
      "negative_local_styles": ["full band", "loud drums"],
      "duration_ms": 16000,
      "lines": []
    },
    {
      "section_name": "Gathering",
      "positive_local_styles": [
        "second layer enters",
        "slightly wider stereo",
        "repeating ostinato fragment"
      ],
      "negative_local_styles": ["vocals", "four-on-the-floor kick"],
      "duration_ms": 22000,
      "lines": []
    },
    {
      "section_name": "Open window",
      "positive_local_styles": [
        "harmony brightens slightly",
        "soft transients",
        "walking pace groove implied"
      ],
      "negative_local_styles": ["dark techno", "screaming leads"],
      "duration_ms": 18000,
      "lines": []
    }
  ]
}
```

---

## 3) Morning (07:00–11:00)

**Scenario:** mainly clear · Friday · first quarter (neap) · walking

```json
{
  "positive_global_styles": [
    "instrumental only",
    "92 BPM",
    "urban kinetic light",
    "purposeful grounded mood",
    "soft pulse",
    "clean plucks",
    "light percussive transients",
    "clear dry-ish mix",
    "anticipatory Friday energy",
    "compressed emotional range"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "nightclub",
    "heavy reverb wash",
    "funeral slow",
    "orchestral epic trailer"
  ],
  "sections": [
    {
      "section_name": "Commute bed",
      "positive_local_styles": [
        "mid-tempo motorik hint",
        "electric piano and muted guitar",
        "tight low end"
      ],
      "negative_local_styles": ["symphonic", "choir"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Crosswalk",
      "positive_local_styles": [
        "syncopated hi-hat pattern",
        "bass enters",
        "forward motion"
      ],
      "negative_local_styles": ["ambient only", "no rhythm"],
      "duration_ms": 22000,
      "lines": []
    },
    {
      "section_name": "Arrival",
      "positive_local_styles": [
        "harmony stabilizes",
        "brighter top end",
        "small drop in density"
      ],
      "negative_local_styles": ["vocals", "melodic rap"],
      "duration_ms": 16000,
      "lines": []
    }
  ]
}
```

---

## 4) Noon (11:00–13:00)

**Scenario:** clear · Saturday (high day-energy) · full moon undertow · still

```json
{
  "positive_global_styles": [
    "instrumental only",
    "108 BPM",
    "daylight chamber",
    "open direct warm mood",
    "clear harmonic bed",
    "midrange-forward ensemble",
    "low noise floor",
    "sunny midday",
    "wide emotional dynamics",
    "playful social Saturday lift"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "dark ambient only",
    "slow doom",
    "rain sounds",
    "muddy mix"
  ],
  "sections": [
    {
      "section_name": "Ensemble entrance",
      "positive_local_styles": [
        "strings and woodwinds ensemble",
        "light staccato rhythm",
        "major-leaning harmony"
      ],
      "negative_local_styles": ["synthwave only", "distorted guitars"],
      "duration_ms": 18000,
      "lines": []
    },
    {
      "section_name": "Midday lift",
      "positive_local_styles": [
        "countermelody",
        "slightly louder dynamics",
        "breathing phrasing"
      ],
      "negative_local_styles": ["vocals", "four-on-the-floor house"],
      "duration_ms": 24000,
      "lines": []
    },
    {
      "section_name": "Chamber resolve",
      "positive_local_styles": [
        "sustained chord",
        "gentle decay",
        "return to clarity"
      ],
      "negative_local_styles": ["sad minor only", "harsh digital clipping"],
      "duration_ms": 16000,
      "lines": []
    }
  ]
}
```

---

## 5) Afternoon (13:00–16:00)

**Scenario:** overcast · Thursday · third quarter (neap) · vehicle

```json
{
  "positive_global_styles": [
    "instrumental only",
    "84 BPM",
    "mechanical flow",
    "steady practical focused mood",
    "repeating ostinati",
    "clocklike micro-rhythm",
    "tight room ambience",
    "grey afternoon light",
    "even restrained dynamics"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "romantic ballad",
    "orchestral swell epic",
    "chaotic free jazz"
  ],
  "sections": [
    {
      "section_name": "Grid",
      "positive_local_styles": [
        "dry programmed percussion",
        "mono-compatible bass",
        "hypnotic loop"
      ],
      "negative_local_styles": ["lush hall reverb", "choir"],
      "duration_ms": 22000,
      "lines": []
    },
    {
      "section_name": "Transit hum",
      "positive_local_styles": [
        "filtered noise layer",
        "subtle pitch drift",
        "sidechain to kick"
      ],
      "negative_local_styles": ["acoustic folk", "vocals"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Cooldown",
      "positive_local_styles": [
        "remove one layer",
        "longer reverb send on pad only",
        "neutral ending"
      ],
      "negative_local_styles": ["big drop", "singing"],
      "duration_ms": 16000,
      "lines": []
    }
  ]
}
```

---

## 6) Golden hour (16:00–19:00)

**Scenario:** snow · Sunday · waxing gibbous · still

```json
{
  "positive_global_styles": [
    "instrumental only",
    "76 BPM",
    "cinematic warmth",
    "nostalgic luminous tender mood",
    "long envelope swells",
    "gentle tape saturation",
    "high-end glow",
    "soft snowfall afternoon",
    "building lunar undertow"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "aggressive metal",
    "techno banger",
    "cold digital harshness"
  ],
  "sections": [
    {
      "section_name": "Amber bed",
      "positive_local_styles": [
        "warm pads",
        "slow chord movement",
        "soft tape hiss"
      ],
      "negative_local_styles": ["percussion forward", "vocals"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Snow light",
      "positive_local_styles": [
        "sparkling highs",
        "hushed transient smear",
        "wide sparse resonance"
      ],
      "negative_local_styles": ["busy drums", "rap"],
      "duration_ms": 24000,
      "lines": []
    },
    {
      "section_name": "Afterglow",
      "positive_local_styles": [
        "melody thins",
        "lowpass closes",
        "intimate ending"
      ],
      "negative_local_styles": ["sudden silence", "choir vocals"],
      "duration_ms": 18000,
      "lines": []
    }
  ]
}
```

---

## 7) Dusk (19:00–21:00)

**Scenario:** rain · Monday · new moon · walking

```json
{
  "positive_global_styles": [
    "instrumental only",
    "72 BPM",
    "urban dreamlike",
    "reflective uncertain intimate mood",
    "blurred piano",
    "grainy pulse",
    "wide dark reverb tails",
    "granular rain texture",
    "broken rhythmic fragment",
    "wet city evening",
    "wide mood pull from new moon spring tide"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "happy major pop",
    "bluegrass",
    "bright brass fanfare"
  ],
  "sections": [
    {
      "section_name": "Wet pavement",
      "positive_local_styles": [
        "distant kick",
        "filtered noise bed",
        "minor harmony"
      ],
      "negative_local_styles": ["acoustic campfire", "vocals"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Neon bleed",
      "positive_local_styles": [
        "arpeggiated synth",
        "delay throws",
        "slightly unstable tuning"
      ],
      "negative_local_styles": ["orchestral only", "choir"],
      "duration_ms": 22000,
      "lines": []
    },
    {
      "section_name": "Carry home",
      "positive_local_styles": [
        "piano motif returns softer",
        "low pass on mix",
        "tail-heavy ending"
      ],
      "negative_local_styles": ["big chorus vocals", "EDM riser"],
      "duration_ms": 18000,
      "lines": []
    }
  ]
}
```

---

## 8) Night (21:00–02:00)

**Scenario:** thunderstorm · Wednesday (low weekday energy) · full moon · still

```json
{
  "positive_global_styles": [
    "instrumental only",
    "64 BPM",
    "deep nocturnal",
    "melancholic distant contemplative mood",
    "subtle rhythmic ghosts",
    "degraded atmosphere",
    "slow harmonic drift",
    "impact swell suggestion",
    "sub pressure",
    "charged exposed lunar undertow",
    "electric storm distance"
  ],
  "negative_global_styles": [
    "vocals",
    "singing",
    "lyrics",
    "daytime picnic",
    "bluegrass",
    "chipper ukulele"
  ],
  "sections": [
    {
      "section_name": "Pressure drop",
      "positive_local_styles": [
        "low rumble",
        "sparse hits",
        "irregular silence"
      ],
      "negative_local_styles": ["steady dance beat", "vocals"],
      "duration_ms": 20000,
      "lines": []
    },
    {
      "section_name": "Lightning colour",
      "positive_local_styles": [
        "bright transient flash in highs",
        "quick filter open then close",
        "tension cluster harmony"
      ],
      "negative_local_styles": ["full drum kit rock", "singing"],
      "duration_ms": 22000,
      "lines": []
    },
    {
      "section_name": "After rain",
      "positive_local_styles": [
        "residual noise bed",
        "slow release",
        "single held tone"
      ],
      "negative_local_styles": ["party crowd", "vocals"],
      "duration_ms": 20000,
      "lines": []
    }
  ]
}
```

---

## Usage notes

- Total duration per plan is **54–62 seconds**; well within API total limits; each section is **16–24 s** (within 3–120 s per section).
- For **stems**, reuse the same scenario but change `section_name` / styles: e.g. one call with only “Bed” sections, another with only “Pulse”.
- Tune `respect_sections_durations` per [ElevenLabs composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans): `true` for timing, `false` if quality matters more than exact bar length.
