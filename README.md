# Arcana Academy

A premium, offline-first Expo / React Native academy for **Mentalism → Hypnosis → Esoteric Magic**.

The app combines the three previously separate course concepts into one product with 45 lessons, one progress system and one purchase experience.

## Tracks

### 1. Mentalism — 15 lessons
Psychological forces, equivoque, billets, drawing duplication, predictions, one-ahead, cold reading, muscle reading, memory systems, book tests, dual reality, psychometry and complete show construction.

### 2. Hypnosis — 15 lessons
Consent and safety, pre-talk, ideomotor exercises, induction architecture, consent-first rapid inductions, deepeners, a hypnotic-phenomena ladder, catalepsy and harmless inhibition, temporary amnesia, sensory suggestion, post-hypnotic suggestions, conversational hypnosis, self-hypnosis and a complete safe demonstration.

### 3. Esoteric Magic — 15 lessons
Effect construction, misdirection, forces and outs, Swami/secret writing, drawing revelation, one-ahead, billet work, book tests, prediction systems, psychokinesis-style and haunted-object effects, hidden messages, ESP coincidences, bizarre magic, original gimmick design and a seven-minute capstone act.

## Product features

- 45 structured lessons in the requested order: Mentalism → Hypnosis → Magic
- Detailed theory sections, objectives and estimated study time
- Step-by-step practice procedures
- Model performance wording
- Skill drills and capstone assignments
- Troubleshooting for common failure modes
- Track-appropriate ethics and hypnosis safety boundaries
- Interactive quizzes with explanations
- Unified persistent completion tracking and bookmarks
- Automatic migration of previous Mentalism progress/bookmarks
- Search inside each course
- Dark premium academy interface
- Offline written curriculum
- No ads, subscriptions or locked lesson packs

## Run locally

```bash
npm install --legacy-peer-deps
npm start
```

## Validate

```bash
npm run typecheck
```

GitHub Actions runs TypeScript validation for pull requests and `main` pushes.

## Important files

- `App.tsx` — academy home, track navigation, lesson reader, search, bookmarks, progress and quizzes
- `src/course.ts` — Mentalism track
- `src/hypnosis.ts` — Hypnosis track
- `src/magic.ts` — Esoteric Magic track
- `PRODUCTION_MANIFEST.md` — media/store production backlog
- `app.json` — Expo identity (`Arcana Academy`)

## Current release boundary

The written curriculum and application shell are implemented. A public Play Store release still needs original app artwork, feature graphics/screenshots, selected demonstration videos, optional recorded hypnosis/self-practice audio, a hosted privacy policy, signed production builds and physical-device testing.

The lesson `media` fields deliberately list the visuals/audio that would improve each lesson; missing media does **not** block reading, drills, scripts or quizzes.

## Ethical scope

Arcana teaches theatrical entertainment, communication and consensual practice. Hypnosis material is non-clinical and does not teach covert control. Do not use deception or suggestion to exploit grief, health fears, finances, confidential information, consent or vulnerable people. Proprietary commercial routines, gimmicks and scripts should not be copied or exposed.
