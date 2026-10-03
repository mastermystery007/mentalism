# hypnomentalism

A premium, offline-first Expo / React Native app for **Mentalism → Hypnosis → Esoteric Magic**.

The app combines all three tracks into one product with 45 lessons, one progress system and one purchase experience.

## Identity

- App name: `hypnomentalism`
- Expo slug: `hypnomentalism`
- Android package: `com.mysterybox.hypnomentalism`
- iOS bundle identifier: `com.mysterybox.hypnomentalism`

## Tracks

### 1. Mentalism — 15 lessons
Psychological forces, equivoque, billets, drawing duplication, predictions, one-ahead, cold reading, muscle reading, memory systems, book tests, dual reality, psychometry and complete show construction.

### 2. Hypnosis — 15 lessons
Consent and safety, pre-talk, ideomotor exercises, induction architecture, consent-first rapid inductions, deepeners, a hypnotic-phenomena ladder, catalepsy and harmless inhibition, temporary amnesia, sensory suggestion, post-hypnotic suggestions, conversational hypnosis, self-hypnosis and a complete safe demonstration.

### 3. Esoteric Magic — 15 lessons
Effect construction, misdirection, forces and outs, Swami/secret writing, drawing revelation, one-ahead, billet work, book tests, prediction systems, psychokinesis-style and haunted-object effects, hidden messages, ESP coincidences, bizarre magic, original gimmick design and a seven-minute capstone act.

## Product features

- 45 structured lessons in the order Mentalism → Hypnosis → Magic
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
- Dark premium interface
- Offline written curriculum
- Interactive visual lessons: Mentalism 4 (Equivoque), 8 (One-Ahead), 11 (Memory Palace), Hypnosis 2 (Consent), and Magic 6 (One-Ahead)
- Four original illustrated overviews and four captioned animated MP4 explainers bundled for offline use
- Image enlargement, on-demand video playback and text transcripts
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

## Android Studio and standalone testing

The generated native project is in `android/`. Open that folder in Android Studio
and use JDK 17 or 21 for Gradle (Settings → Build Tools → Gradle → Gradle JDK).
Set the Android SDK location when prompted; `android/local.properties` is local
to each computer and is not committed.

For development, run `npm run android` from the repository root. This builds the
debug app and starts Metro; keep that terminal running while testing.

If you use Android Studio's Run button with the `debug` variant, first run
`npm run start:usb` from the repository root with one USB-connected Android
device. This forwards the device's port 8081 to Metro on your computer and
starts Expo's development server. Keep it running, then launch or reload the app.
The Android SDK's `adb` must be on your PATH. If multiple devices are connected,
set `ANDROID_SERIAL` to the desired device's serial number.

The error “Unable to load script / make sure Metro is running” means the debug
app cannot reach that server. A debug APK normally has no embedded JavaScript
bundle. Running only the native project in Android Studio does not start Metro.

To build and install a standalone test app instead, run `npm run android:preview`
from the repository root. It uses the release variant and packages the
JavaScript inside the APK. In Android Studio, select the `release` build variant
when you want this behavior; switching back to `debug` requires Metro again.

For a standalone test APK on Windows, run from `android/`:

```powershell
.\gradlew.bat :app:assembleRelease -PreactNativeArchitectures=arm64-v8a
```

The APK is at `android/app/build/outputs/apk/release/app-release.apk` and includes
the JavaScript bundle, so Metro is not required. This command targets ARM64
phones; omit the architecture option to build all configured architectures.
The generated release configuration uses the debug signing key for local
testing. Use a private production signing key before publishing to a store.

Expo's [local build documentation](https://docs.expo.dev/guides/local-app-production/)
describes the native project generation and release build workflow.

## Important files

- `App.tsx` — home, track navigation, lesson reader, search, bookmarks, progress and quizzes
- `src/course.ts` — Mentalism track
- `src/hypnosis.ts` — Hypnosis track
- `src/magic.ts` — Esoteric Magic track
- `PRODUCTION_MANIFEST.md` — media/store production backlog
- `app.json` — Expo identity for `hypnomentalism`
- `src/visuals/LessonExperience.tsx` — lesson-to-widget/media registry and accessible media tabs
- `src/visuals/` — native choice simulator, information timeline, memory drill and consent scenarios
- `assets/lesson-media/` — bundled PNG illustrations and silent captioned MP4 animations
- `scripts/build-lesson-media.py` — reproducible original diagram and animation generation (Python/Pillow and FFmpeg)

## Visual lesson authoring

The home screen links directly to the visual lessons; the course list also marks
them with an **INTERACTIVE · IMAGE · VIDEO** badge. Each visual lesson has Explore,
Image and Video tabs near its beginning. Tab changes preserve the current exercise;
opening a different lesson starts a fresh exercise. Videos play only on request,
pause when the app moves into the background, and stop when the video tab closes.

To extend the set, create a native widget in `src/visuals/`, add local PNG/MP4 assets,
then register the composite `track:lessonId` key in `LessonExperience.tsx`. Use
static `require` calls so Metro includes the media in the release APK. Include an
image description and a full text transcript. Rebuild the native app after adding
native dependencies. The current player uses the Expo SDK 52 compatible
`expo-video` 2.0.x package.

The current clips are original animated conceptual explanations with captions
and no audio. They do not replace recorded demonstrations of physical handling,
nor do the consent scenarios perform an induction or clinical screening.

### Equivoque: watch and practise

Mentalism lesson 4 now opens with **Setup walkthrough** and **Choice practice**
modes. Six coaching frames show participant and performer positions, object
placement, parking movements, exact wording and common mistakes. Tap objects to
inspect their role, switch to audience view to hide the training target, or turn
diagram annotations off. Previous/Next controls sit above the diagram and below
the coaching notes.

The Image tab contains all six frames plus the branch map. Tap a thumbnail to
inspect it and tap the main image to enlarge it. The Video tab offers a 36-second
**Setup walkthrough** animation and the shorter **Choice logic** clip. The
video supports half-speed playback and jumps to any of the six setup steps. The
alternate first-choice example resets the three objects before replaying. These
are illustrated coaching demonstrations; recorded hand technique will require
original footage or media licensed for redistribution in the app.

To regenerate the bundled media, install Python 3.10+ and FFmpeg with `libx264` on
your PATH, then run:

```bash
python -m pip install Pillow==12.3.0
python scripts/build-lesson-media.py
python scripts/build-equivoque-walkthrough.py
```

The scripts use Segoe UI on Windows or DejaVu Sans on Linux. Install one of those
font families before generation; platform fonts can change typography. The app
uses checked-in media and does not require Python or FFmpeg to build.

## Current release boundary

The written curriculum, application shell and first five visual lessons are implemented. The remaining lessons still use the written format. A public Play Store release still needs original app artwork, feature graphics/screenshots, recorded demonstrations of physical handling, optional recorded hypnosis/self-practice audio, a hosted privacy policy and signed production builds.

The lesson `media` fields are an internal production backlog. They are no longer
shown to learners as if media were already available. Implemented visuals live in
the typed lesson experience registry; missing media does not block the curriculum.

## Ethical scope

hypnomentalism teaches theatrical entertainment, communication and consensual practice. Hypnosis material is non-clinical and does not teach covert control. Do not use deception or suggestion to exploit grief, health fears, finances, confidential information, consent or vulnerable people. Proprietary commercial routines, gimmicks and scripts should not be copied or exposed.
