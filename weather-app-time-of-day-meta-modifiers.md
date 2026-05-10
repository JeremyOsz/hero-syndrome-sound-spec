# Time-of-day & environment meta modifiers

**Audience:** designers and engineers implementing the *Hero Syndrome* / environment→music stack.  
**Role:** single reference for how **calendar, weather, weekday, and moon** combine into **energy**, **mood**, and **inspiration** before any ElevenLabs or DAW render.

**TL;DR**

1. Each `time.phase` sets a baseline for **energy** (four axes), **mood** (weighted tags), and **inspiration** (world + textures).
2. **Weekday** nudges energy and mood (Wednesday lowest energy, Saturday highest; mood deltas scaled by time-of-day sensitivity).
3. **Weather** adds mood + inspiration shifts, scaled by the same time phase.
4. **Moon** acts like **tide**: spring phases widen how strongly fast inputs pull mood; a slow **undertow** biases mood tags; see formulas below.
5. **Body** / **location** (product spec) apply on top — wired in your app, not fully duplicated here.

---

This note breaks down how each `time.phase` modifies the meta layer, plus universal `dayOfWeek`, weather, and **moon-phase (tidal mood)** modifiers:

- `Energy` (using sub-axes: `motion`, `density`, `tension`, `brightness`)
- `Mood` (weighted tags)
- `Inspiration` (world + texture direction)

These are baseline modifiers. Weather, body, and location should add or subtract from these values, not replace them.

## Modifier Model

- Value scale for energy sub-axes: `0.00` to `1.00`
- Mood weights: soft priorities, not hard labels
- Inspiration: seed world and texture language for rendering/prompting

## Universal Day-of-Week Modifier

Stack modifiers in roughly this order (moon only on the **mood** lane unless you deliberately extend it):

`energy ← timePhase + dayEnergyDelta + weatherEnergy (if any) + body + location`

`mood ← tidalCombine(timePhaseMood, dayMoodDelta, weatherMoodDelta, moonTideRange, moonUndertow) + optional body subtleties`

`inspiration ← timePhase + weatherInspiration + optional moon textureMergeTint`

See **Moon phase — tidal mood** for `tidalCombine`.

Wednesday is the universal low-energy point; Saturday is the universal high-energy point.

### Energy delta by day

- Monday: `-0.04`
- Tuesday: `-0.02`
- Wednesday: `-0.08` (lowest)
- Thursday: `+0.00`
- Friday: `+0.05`
- Saturday: `+0.10` (highest)
- Sunday: `-0.01`

### How the day delta applies

- Apply the delta primarily to `motion` and `density`
- Apply `tension` at half strength of the day delta (`delta * 0.5`)
- Apply `brightness` at 70% strength (`delta * 0.7`)

### Day-level mood bias (optional)

- Wednesday: bias `introspective`, `fatigued`, `flat`
- Saturday: bias `social`, `playful`, `expansive`

Keep this as a soft weighting layer so weather and body state can still dominate when strongly signaled.

### Day modifies mood of each time phase

Use day-specific mood vectors, then scale them by time-phase sensitivity.

#### Base mood deltas by day

- Monday: `focused +0.04`, `serious +0.03`, `playful -0.03`
- Tuesday: `steady +0.03`, `practical +0.03`, `dreamlike -0.02`
- Wednesday: `introspective +0.07`, `fatigued +0.06`, `flat +0.05`, `social -0.05`, `playful -0.05`
- Thursday: `neutral +0.00` (no strong mood bias)
- Friday: `anticipatory +0.05`, `social +0.04`, `expansive +0.03`
- Saturday: `social +0.08`, `playful +0.08`, `expansive +0.06`, `fatigued -0.03`
- Sunday: `reflective +0.06`, `tender +0.04`, `slow +0.03`, `urgent -0.03`

#### Time-phase mood sensitivity

- witching_hour: `1.20`
- dawn: `1.10`
- morning: `0.85`
- noon: `0.75`
- afternoon: `0.80`
- golden_hour: `1.00`
- dusk: `1.15`
- night: `1.10`

#### Mood formula

Day-only fragment (full mood stack adds weather deltas and moon tidal range + undertow):

`partialMood[tag] = timePhaseMood[tag] + (dayMoodDelta[tag] * timeMoodSensitivity)`

This makes the same day feel different across time:

- Wednesday at `dusk` amplifies introspection strongly.
- Wednesday at `noon` still lowers social/playful mood, but less dramatically.
- Saturday at `morning` adds lift, but Saturday at `night` feels most socially charged.

## Universal Weather Modifier (Mood + Inspiration)

Weather modifies both mood and inspiration for each time phase, using:

- condition-based mood deltas
- condition-based inspiration shifts (world blend + texture tags)
- time-phase weather sensitivity multipliers

### Weather condition mood deltas

- clear: `clear +0.06`, `open +0.05`, `uncertain -0.03`
- mainly-clear: `calm +0.04`, `grounded +0.03`
- overcast: `reflective +0.05`, `somber +0.04`, `playful -0.03`
- fog: `uncanny +0.07`, `intimate +0.05`, `clarity -0.06`
- drizzle: `melancholic +0.06`, `soft-focus +0.05`, `urgent -0.03`
- rain: `reflective +0.07`, `distant +0.05`, `social -0.04`
- rain-showers: `restless +0.05`, `uncertain +0.05`, `steady -0.03`
- thunderstorm: `tense +0.10`, `awe +0.06`, `fragile +0.03`
- thunderstorm-hail: `threat +0.11`, `chaotic +0.08`, `warm -0.04`
- snow: `hushed +0.08`, `tender +0.05`, `tempo-drive -0.04`
- snow-grains: `brittle +0.06`, `dry-cold +0.05`
- snow-showers: `volatile +0.06`, `reflective +0.04`
- freezing-drizzle: `stark +0.07`, `isolated +0.05`
- freezing-rain: `anxious +0.08`, `tense +0.07`, `social -0.04`

### Weather condition inspiration shifts

- clear/mainly-clear: blend toward `daylight_chamber`, `pastoral_awakening`; add `open interval`, `clean transient`, `air shimmer`
- overcast/fog: blend toward `urban_dreamlike`, `nocturnal_ritual`; add `blurred piano`, `grain veil`, `long tail reverb`
- drizzle/rain/rain-showers: blend toward `deep_nocturnal`, `mechanical_flow`; add `granular rain`, `broken pulse`, `filtered noise bed`
- thunderstorm/hail: blend toward `mechanical_flow`, `cinematic_warmth`; add `impact swell`, `rhythmic interruption`, `sub pressure`
- snow/snow-grains/snow-showers: blend toward `pastoral_awakening`, `nocturnal_ritual`; add `hushed highs`, `wide sparse resonance`, `soft transient smear`
- freezing-drizzle/freezing-rain: blend toward `deep_nocturnal`; add `glass harmonics`, `narrow-band hiss`, `unstable drift`

### Time-phase weather sensitivity

- witching_hour: `1.25`
- dawn: `1.10`
- morning: `0.85`
- noon: `0.70`
- afternoon: `0.80`
- golden_hour: `1.00`
- dusk: `1.20`
- night: `1.15`

### Weather formulas

Intermediates (before moon tidal range + undertow; see Moon section for the full `finalMood`):

`combinedMoodDelta[tag] = dayMoodDelta[tag] * daySensitivity + weatherMoodDelta[tag] * weatherSensitivity`

`finalInspiration = blend(baseWorld, weatherWorldTarget, weatherBlendStrength * weatherSensitivity)`

`finalTextures = merge(baseTextures, weatherTextureTags, weatherTextureWeight * weatherSensitivity)`

This ensures weather modifies mood and inspiration differently by time:

- `fog` at `dawn`: more fragile/intimate than eerie.
- `fog` at `night`: much stronger uncanny/nocturnal shift.
- `rain` at `noon`: gentle reflective tint.
- `rain` at `dusk`: clear urban-dreamlike darkening.

## Moon phase — tidal mood (spring / neap)

The moon is a **slow** control, analogous to tides: it changes how strongly **fast** signals (weather, day, body) can **pull mood away from baseline**, and it adds a **lagging undertow** (ocean mass) underneath.

### Tide range multiplier `tideRange` (spring vs neap)

**Spring tides** (largest highs/lows) → moods **swing wider** around the time-phase baseline when day and weather push.

**Neap tides** (smaller range) → moods stay **more compressed**, flatter interpretation.

Eight named phases (`tideRangeMult` scales day+weather mood deltas before clamp):

| `moonPhase` | `tideRangeMult` | Note |
|---|---:|---|
| `new` | `1.12` | Spring — maximum mood “pull” vs baseline |
| `waxing_crescent` | `1.02` | Transition toward neap |
| `first_quarter` | `0.88` | Neap — compressed emotional range |
| `waxing_gibbous` | `1.06` | Rising toward spring |
| `full` | `1.12` | Spring — same amplitude as new; different undertow |
| `waning_gibbous` | `1.06` | Falling from spring |
| `third_quarter` | `0.88` | Neap |
| `waning_crescent` | `1.02` | Transition toward new |

Optional **continuous** form (if you have phase angle \(\phi \in [0,1)\) one lunation):

`tideRangeMult = lerp(neapMult, springMult, abs(cos(2π * φ)))`

with `neapMult ≈ 0.88`, `springMult ≈ 1.12`.

### Undertow targets (slow mood bias)

These are **not** instant deltas: update an `undertow[tag]` state with a multi-hour or multi-day **low-pass** toward the targets below (`tau` hours configurable). Multiply targets by lunar sensitivity.

| `moonPhase` | Undertow tags (additive targets toward which you smooth) |
|---|---|
| `new` | `tentative +0.08`, `unresolved +0.07`, `sparse +0.06` |
| `waxing_crescent` | `gathering +0.06`, `sharpening +0.04`, `purposeful +0.04` |
| `first_quarter` | `steady +0.05`, `neutral +0.05`, `pragmatic +0.04` |
| `waxing_gibbous` | `building +0.06`, `luminous +0.05`, `accumulating +0.05` |
| `full` | `exposed +0.07`, `charged +0.06`, `luminous +0.05` |
| `waning_gibbous` | `recounting +0.06`, `simplifying +0.04`, `distancing +0.04` |
| `third_quarter` | `critical +0.04`, `even +0.05`, `released +0.03` |
| `waning_crescent` | `emptied +0.06`, `devotional +0.04`, `drifting +0.06` |

**New vs full** share high `tideRange` but differ in undertow: new leans **inward/unresolved**, full leans **exposed/charged**.

### Time-phase lunar sensitivity

Night-adjacent phases feel lunar influence more strongly (applied to undertow magnitude and optionally to how much `tideRange` differs from `1.0`):

| time phase | `lunarSens` |
|---|---:|
| witching_hour | `1.20` |
| night | `1.15` |
| dusk | `1.08` |
| dawn | `1.05` |
| golden_hour | `0.95` |
| afternoon | `0.80` |
| morning | `0.85` |
| noon | `0.75` |

### Tidal mood formulas

Let `combinedMoodDelta[tag] = dayMoodDelta[tag] * daySensitivity + weatherMoodDelta[tag] * weatherSensitivity`.

**Effective tide range** (how much fast inputs stretch mood):

`tideEffective = 1 + (tideRangeMult(moonPhase) - 1) * lunarSens * lunarStrength`

Use `lunarStrength` in `[0.6, 1.0]` as a global tuning constant.

**Mood**

`finalMood[tag] = clamp(timePhaseMood[tag] + combinedMoodDelta[tag] * tideEffective + undertowSmooth[tag], 0, 1)`

Where `undertowSmooth` is the low-passed blend toward `undertowTarget(moonPhase) * lunarSens`.

**Inspiration (optional tidal tint)**

Spring phases can slightly widen how much weather texture merges:

`textureMergeWeight *= lerp(0.92, 1.08, (tideEffective - minTide)/(maxTide - minTide))` — keep subtle.

### Implementation notes — moon

- Low-pass moon-driven undertow over **hours**, not beat-by-beat.
- Combined with scene inertia: at high `tideEffective`, allow slightly faster scene drift; at neap, resist scene churn (optional hook into your scene manager).

---

## 1) Witching Hour (02:00-05:00)

**Energy**
- motion: `0.18`
- density: `0.22`
- tension: `0.58`
- brightness: `0.12`

**Mood weights**
- uncanny: `0.55`
- intimate: `0.40`
- melancholic: `0.35`
- suspended: `0.30`

**Inspiration**
- world: `nocturnal_ritual`
- texture cues: `sub-bass drone`, `distant metallic shimmer`, `slow unstable noise bed`

---

## 2) Dawn (05:00-07:00)

**Energy**
- motion: `0.28`
- density: `0.30`
- tension: `0.40`
- brightness: `0.32`

**Mood weights**
- fragile: `0.52`
- hopeful: `0.34`
- reflective: `0.30`
- soft-focus: `0.26`

**Inspiration**
- world: `pastoral_awakening`
- texture cues: `airy pad`, `filtered birdsong-like motion`, `thin harmonic overtones`

---

## 3) Morning (07:00-11:00)

**Energy**
- motion: `0.46`
- density: `0.42`
- tension: `0.30`
- brightness: `0.52`

**Mood weights**
- clear: `0.45`
- purposeful: `0.42`
- social: `0.30`
- grounded: `0.28`

**Inspiration**
- world: `urban_kinetic_light`
- texture cues: `soft pulse`, `clean plucks`, `light percussive transients`

---

## 4) Noon (11:00-13:00)

**Energy**
- motion: `0.56`
- density: `0.52`
- tension: `0.24`
- brightness: `0.64`

**Mood weights**
- open: `0.48`
- direct: `0.40`
- warm: `0.34`
- extroverted: `0.28`

**Inspiration**
- world: `daylight_chamber`
- texture cues: `clear harmonic bed`, `midrange-forward ensemble tones`, `reduced noise floor`

---

## 5) Afternoon (13:00-16:00)

**Energy**
- motion: `0.50`
- density: `0.48`
- tension: `0.28`
- brightness: `0.50`

**Mood weights**
- steady: `0.46`
- practical: `0.40`
- focused: `0.36`
- neutral: `0.30`

**Inspiration**
- world: `mechanical_flow`
- texture cues: `repeating ostinati`, `clocklike micro-rhythm`, `tight room ambience`

---

## 6) Golden Hour (16:00-19:00)

**Energy**
- motion: `0.44`
- density: `0.40`
- tension: `0.32`
- brightness: `0.58`

**Mood weights**
- nostalgic: `0.52`
- luminous: `0.46`
- tender: `0.34`
- expansive: `0.30`

**Inspiration**
- world: `cinematic_warmth`
- texture cues: `long envelope swells`, `gentle tape saturation`, `high-end glow`

---

## 7) Dusk (19:00-21:00)

**Energy**
- motion: `0.34`
- density: `0.36`
- tension: `0.46`
- brightness: `0.28`

**Mood weights**
- reflective: `0.50`
- uncertain: `0.42`
- intimate: `0.38`
- drifting: `0.30`

**Inspiration**
- world: `urban_dreamlike`
- texture cues: `blurred piano`, `grainy pulse`, `wide dark reverb tails`

---

## 8) Night (21:00-02:00)

**Energy**
- motion: `0.26`
- density: `0.34`
- tension: `0.50`
- brightness: `0.18`

**Mood weights**
- melancholic: `0.50`
- distant: `0.44`
- contemplative: `0.36`
- porous: `0.28`

**Inspiration**
- world: `deep_nocturnal`
- texture cues: `subtle rhythmic ghosts`, `degraded atmosphere`, `slow harmonic drift`

---

## Implementation Notes

- Treat each phase as a stable "scene seed" rather than direct synthesis mapping.
- Use smoothing/hysteresis on phase changes to avoid hard jumps at boundaries.
- Let weather/body/location apply `delta` shifts on top of these phase baselines.
- Apply **moon** as tidal **range** on fast mood deltas + smoothed **undertow** (see formulas above).
- Keep composition elements (mode, motif family) more stable than performance elements (dynamics, articulation, FX send).

## Suggested JSON Shape

```json
{
  "dayOfWeek": "Saturday",
  "timePhase": "dusk",
  "dayModifier": {
    "energyDelta": 0.1,
    "moodDelta": {
      "social": 0.08,
      "playful": 0.08,
      "expansive": 0.06,
      "fatigued": -0.03
    }
  },
  "weather": {
    "condition": "rain",
    "weatherModifier": {
      "moodDelta": {
        "reflective": 0.07,
        "distant": 0.05,
        "social": -0.04
      },
      "inspirationShift": {
        "worldTargets": ["deep_nocturnal", "mechanical_flow"],
        "textures": ["granular rain", "broken pulse", "filtered noise bed"]
      }
    }
  },
  "moon": {
    "phase": "full",
    "tidal": {
      "tideRangeMult": 1.12,
      "lunarSens": 1.2,
      "tideEffective": 1.144,
      "undertowTargets": {
        "exposed": 0.07,
        "charged": 0.06,
        "luminous": 0.05
      }
    }
  },
  "meta": {
    "energy": {
      "motion": 0.44,
      "density": 0.46,
      "tension": 0.51,
      "brightness": 0.35
    },
    "mood": {
      "reflective": 0.5,
      "social": 0.39,
      "playful": 0.24,
      "uncertain": 0.42,
      "intimate": 0.38,
      "drifting": 0.3
    },
    "inspiration": {
      "world": "urban_dreamlike+deep_nocturnal",
      "textures": ["blurred piano", "grainy pulse", "wide dark reverb tails", "granular rain", "filtered noise bed"]
    }
  }
}
```

---

## Document changelog

| Date | Change |
|------|--------|
| 2026-05-10 | Renamed title for sharing; added collaborator **TL;DR** at top. **No change** to numeric tables or formulas. |
