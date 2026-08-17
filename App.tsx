import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Lesson, lessons as mentalismLessons } from './src/course';
import { hypnosisLessons } from './src/hypnosis';
import { magicLessons } from './src/magic';

const PROGRESS_KEY = 'arcana-progress-v1';
const BOOKMARK_KEY = 'arcana-bookmarks-v1';
const LEGACY_PROGRESS_KEY = 'mentalism-progress-v2';
const LEGACY_BOOKMARK_KEY = 'mentalism-bookmarks-v1';

type TrackId = 'mentalism' | 'hypnosis' | 'magic';
type Answers = Record<number, number>;
type Track = {
  id: TrackId;
  name: string;
  eyebrow: string;
  description: string;
  promise: string;
  lessons: Lesson[];
  caution: string;
};

const TRACKS: Track[] = [
  {
    id: 'mentalism',
    name: 'Mentalism',
    eyebrow: 'TRACK 01 · THOUGHT',
    description: 'Thought reading, prediction, psychological forces, memory, billets, readings and performance architecture.',
    promise: 'Learn to create the experience of impossible insight while keeping methods ethical and performances credible.',
    lessons: mentalismLessons,
    caution: 'For ethical entertainment. Never exploit grief, health fears, finances, private information or vulnerable people.'
  },
  {
    id: 'hypnosis',
    name: 'Hypnosis',
    eyebrow: 'TRACK 02 · SUGGESTION',
    description: 'Consent-first hypnosis, ideomotor response, inductions, hypnotic phenomena, suggestion design and self-practice.',
    promise: 'Build safe, adaptable hypnosis skills without myths about sleep, obedience or mind control.',
    lessons: hypnosisLessons,
    caution: 'Use only with informed consent in physically safe settings. This course is not medical or psychological treatment.'
  },
  {
    id: 'magic',
    name: 'Esoteric Magic',
    eyebrow: 'TRACK 03 · MYSTERY',
    description: 'Secret writing, drawing revelations, billets, predictions, book tests, strange coincidences and bizarre magic.',
    promise: 'Master practical mystery methods that feel less like tricks and more like impossible experiences.',
    lessons: magicLessons,
    caution: 'Use deception only for lawful entertainment. Do not use magic methods to obtain money, consent or consequential decisions dishonestly.'
  }
];

const lessonKey = (track: TrackId, id: number) => `${track}:${id}`;

export default function App() {
  const [activeTrackId, setActiveTrackId] = useState<TrackId | null>(null);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(PROGRESS_KEY),
      AsyncStorage.getItem(BOOKMARK_KEY),
      AsyncStorage.getItem(LEGACY_PROGRESS_KEY),
      AsyncStorage.getItem(LEGACY_BOOKMARK_KEY)
    ]).then(async ([savedDone, savedBookmarks, legacyDone, legacyBookmarks]) => {
      let nextDone: string[] = savedDone ? JSON.parse(savedDone) : [];
      let nextBookmarks: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      if (!savedDone && legacyDone) {
        nextDone = (JSON.parse(legacyDone) as number[]).map((id) => lessonKey('mentalism', id));
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(nextDone));
      }
      if (!savedBookmarks && legacyBookmarks) {
        nextBookmarks = (JSON.parse(legacyBookmarks) as number[]).map((id) => lessonKey('mentalism', id));
        await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(nextBookmarks));
      }
      setDone(nextDone);
      setBookmarks(nextBookmarks);
    }).catch(() => undefined);
  }, []);

  const activeTrack = TRACKS.find((track) => track.id === activeTrackId) ?? null;
  const filtered = useMemo(() => {
    if (!activeTrack) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return activeTrack.lessons;
    return activeTrack.lessons.filter((lesson) => [lesson.title, lesson.summary, lesson.level, ...lesson.objectives].join(' ').toLowerCase().includes(needle));
  }, [activeTrack, query]);

  const toggleComplete = async (track: TrackId, id: number) => {
    const key = lessonKey(track, id);
    const next = done.includes(key) ? done.filter((value) => value !== key) : [...done, key];
    setDone(next);
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };

  const toggleBookmark = async (track: TrackId, id: number) => {
    const key = lessonKey(track, id);
    const next = bookmarks.includes(key) ? bookmarks.filter((value) => value !== key) : [...bookmarks, key];
    setBookmarks(next);
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  };

  const openTrack = (track: TrackId) => {
    setActiveTrackId(track);
    setSelected(null);
    setQuery('');
    setAnswers({});
  };

  const openLesson = (lesson: Lesson) => {
    setSelected(lesson);
    setAnswers({});
  };

  if (activeTrack && selected) {
    const key = lessonKey(activeTrack.id, selected.id);
    const score = selected.quiz.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.back}>‹ {activeTrack.name}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBookmark(activeTrack.id, selected.id)}><Text style={styles.bookmark}>{bookmarks.includes(key) ? '★ Saved' : '☆ Save'}</Text></TouchableOpacity>
          </View>
          <Text style={styles.kicker}>{activeTrack.eyebrow} · LESSON {selected.id} · {selected.level.toUpperCase()}</Text>
          <Text style={styles.title}>{selected.title}</Text>
          <Text style={styles.lead}>{selected.summary}</Text>
          <Text style={styles.lessonTime}>{selected.duration}</Text>

          <Card title="Learning objectives">{selected.objectives.map((item) => <Bullet key={item} text={item} />)}</Card>
          {selected.sections.map((section) => <Card key={section.heading} title={section.heading}>{section.body.map((paragraph) => <Text key={paragraph} style={styles.body}>{paragraph}</Text>)}</Card>)}
          <Card title="Step-by-step practice">{selected.procedure.map((item, index) => <Numbered key={item} number={index + 1} text={item} />)}</Card>
          <Card title="Model wording">{selected.script.map((item) => <Text key={item} style={styles.quote}>“{item}”</Text>)}</Card>
          <Card title="Skill drills">{selected.drills.map((item) => <Bullet key={item} text={item} />)}</Card>
          <Card title="Troubleshooting">
            {selected.troubleshooting.map((item) => <View key={item.problem} style={styles.problemBlock}><Text style={styles.problem}>{item.problem}</Text><Text style={styles.body}>{item.response}</Text></View>)}
          </Card>
          <Card title={activeTrack.id === 'hypnosis' ? 'Safety boundary' : 'Ethical boundary'}>{selected.ethics.map((item) => <Bullet key={item} text={item} />)}</Card>
          <Card title="Performance assignment"><Text style={styles.body}>{selected.assignment}</Text></Card>
          <Card title="Knowledge check">
            {selected.quiz.map((item, questionIndex) => {
              const chosen = answers[questionIndex];
              return <View key={item.question} style={styles.quizBlock}>
                <Text style={styles.question}>{questionIndex + 1}. {item.question}</Text>
                {item.options.map((option, optionIndex) => {
                  const reveal = chosen !== undefined;
                  const correct = optionIndex === item.answer;
                  return <TouchableOpacity key={option} style={[styles.option, chosen === optionIndex && styles.optionChosen, reveal && correct && styles.optionCorrect]} onPress={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}><Text style={styles.optionText}>{option}</Text></TouchableOpacity>;
                })}
                {chosen !== undefined && <Text style={chosen === item.answer ? styles.feedbackCorrect : styles.feedbackWrong}>{chosen === item.answer ? 'Correct. ' : 'Review: '}{item.explanation}</Text>}
              </View>;
            })}
            <Text style={styles.score}>Score: {score}/{selected.quiz.length}</Text>
          </Card>
          <Card title="Media production list">{selected.media.map((item) => <Bullet key={item} text={item} muted />)}</Card>
          <TouchableOpacity style={[styles.button, done.includes(key) && styles.done]} onPress={() => toggleComplete(activeTrack.id, selected.id)}><Text style={styles.buttonText}>{done.includes(key) ? 'Completed ✓' : 'Mark lesson complete'}</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeTrack) {
    const completed = activeTrack.lessons.filter((lesson) => done.includes(lessonKey(activeTrack.id, lesson.id))).length;
    const saved = activeTrack.lessons.filter((lesson) => bookmarks.includes(lessonKey(activeTrack.id, lesson.id))).length;
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.page}>
          <TouchableOpacity onPress={() => { setActiveTrackId(null); setQuery(''); }}><Text style={styles.back}>‹ Academy</Text></TouchableOpacity>
          <Text style={styles.brand}>{activeTrack.eyebrow}</Text>
          <Text style={styles.hero}>{activeTrack.name}</Text>
          <Text style={styles.lead}>{activeTrack.promise}</Text>
          <View style={styles.progress}>
            <Text style={styles.progressText}>{completed}/{activeTrack.lessons.length} lessons complete · {saved} saved</Text>
            <View style={styles.track}><View style={[styles.fill, { width: `${(completed / activeTrack.lessons.length) * 100}%` }]} /></View>
          </View>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search titles, skills or objectives…" placeholderTextColor="#888" style={styles.search} />
          {filtered.map((lesson) => {
            const key = lessonKey(activeTrack.id, lesson.id);
            return <TouchableOpacity key={lesson.id} style={styles.lesson} onPress={() => openLesson(lesson)}>
              <View style={styles.num}><Text style={styles.numText}>{lesson.id}</Text></View>
              <View style={styles.lessonText}>
                <View style={styles.lessonTitleRow}><Text style={styles.lessonTitle}>{lesson.title}</Text>{bookmarks.includes(key) && <Text style={styles.star}>★</Text>}</View>
                <Text style={styles.lessonSummary} numberOfLines={2}>{lesson.summary}</Text>
                <Text style={styles.meta}>{lesson.duration} · {lesson.level} · {lesson.quiz.length} question quiz</Text>
              </View>
              <Text style={styles.chev}>{done.includes(key) ? '✓' : '›'}</Text>
            </TouchableOpacity>;
          })}
          <Text style={styles.disclaimer}>{activeTrack.caution}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const totalLessons = TRACKS.reduce((sum, track) => sum + track.lessons.length, 0);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.brand}>ARCANA ACADEMY</Text>
        <Text style={styles.hero}>Mentalism. Hypnosis. Magic.</Text>
        <Text style={styles.lead}>One premium mystery-arts curriculum: {totalLessons} deep lessons, original routines, scripts, drills, troubleshooting and assessments. Learn in order or enter any track.</Text>
        <View style={styles.overallCard}>
          <Text style={styles.overallValue}>{done.length}/{totalLessons}</Text>
          <Text style={styles.overallLabel}>lessons complete across the academy</Text>
        </View>
        {TRACKS.map((track, index) => {
          const completed = track.lessons.filter((lesson) => done.includes(lessonKey(track.id, lesson.id))).length;
          return <TouchableOpacity key={track.id} style={styles.trackCard} onPress={() => openTrack(track.id)}>
            <View style={styles.trackHeader}><Text style={styles.trackIndex}>0{index + 1}</Text><Text style={styles.trackEyebrow}>{track.eyebrow}</Text></View>
            <Text style={styles.trackTitle}>{track.name}</Text>
            <Text style={styles.trackDescription}>{track.description}</Text>
            <View style={styles.trackFooter}><Text style={styles.trackMeta}>{track.lessons.length} lessons · {completed} complete</Text><Text style={styles.enter}>ENTER ›</Text></View>
          </TouchableOpacity>;
        })}
        <View style={styles.promiseCard}>
          <Text style={styles.cardTitle}>One purchase. The complete academy.</Text>
          <Text style={styles.body}>No advertisements, subscriptions or lesson unlocks. Media listed inside lessons can be added later without blocking the written course, scripts, drills or quizzes.</Text>
        </View>
        <Text style={styles.disclaimer}>Training is for lawful entertainment, education and consensual practice. Hypnosis material is non-clinical. Do not use deception or suggestion to override consent or exploit vulnerable people.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>; }
function Bullet({ text, muted = false }: { text: string; muted?: boolean }) { return <Text style={muted ? styles.muted : styles.body}>• {text}</Text>; }
function Numbered({ number, text }: { number: number; text: string }) { return <View style={styles.numbered}><Text style={styles.stepNumber}>{number}</Text><Text style={styles.stepText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#080b0f' }, page: { padding: 20, paddingBottom: 60 }, topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#d7b56d', fontSize: 13, fontWeight: '900', letterSpacing: 2.4, marginTop: 8 }, hero: { color: '#fff', fontSize: 36, fontWeight: '900', lineHeight: 41, marginTop: 10 }, lead: { color: '#c6c9cd', fontSize: 16, lineHeight: 24, marginTop: 10 }, lessonTime: { color: '#8c939a', fontSize: 13, marginTop: 9 },
  overallCard: { backgroundColor: '#11151b', padding: 18, borderRadius: 18, marginTop: 22, borderWidth: 1, borderColor: '#282e37', flexDirection: 'row', alignItems: 'baseline', gap: 9 }, overallValue: { color: '#f0d18d', fontSize: 28, fontWeight: '900' }, overallLabel: { color: '#aeb5bd', flex: 1 },
  trackCard: { backgroundColor: '#11151b', padding: 18, borderRadius: 18, marginTop: 14, borderWidth: 1, borderColor: '#282e37' }, trackHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, trackIndex: { color: '#d7b56d', fontSize: 12, fontWeight: '900' }, trackEyebrow: { color: '#777f89', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, trackTitle: { color: '#fff', fontSize: 25, fontWeight: '900', marginTop: 10 }, trackDescription: { color: '#adb4bc', lineHeight: 21, marginTop: 7 }, trackFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }, trackMeta: { color: '#707985', fontSize: 12 }, enter: { color: '#f0d18d', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  promiseCard: { backgroundColor: '#15130f', padding: 18, borderRadius: 18, marginTop: 16, borderWidth: 1, borderColor: '#3a3221' },
  progress: { backgroundColor: '#11151b', padding: 16, borderRadius: 16, marginTop: 22 }, progressText: { color: '#fff', fontWeight: '700' }, track: { height: 7, backgroundColor: '#293039', borderRadius: 9, marginTop: 10, overflow: 'hidden' }, fill: { height: 7, backgroundColor: '#d7b56d' },
  search: { backgroundColor: '#11151b', color: '#fff', borderRadius: 14, padding: 15, marginVertical: 16, borderWidth: 1, borderColor: '#282e37' }, lesson: { flexDirection: 'row', gap: 13, alignItems: 'center', backgroundColor: '#101419', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#252c34' }, lessonText: { flex: 1 }, lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  num: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2b261b', alignItems: 'center', justifyContent: 'center' }, numText: { color: '#f0d18d', fontWeight: '900' }, lessonTitle: { color: '#fff', fontWeight: '800', fontSize: 16, flexShrink: 1 }, lessonSummary: { color: '#a7adb5', fontSize: 13, lineHeight: 18, marginTop: 4 }, meta: { color: '#6f7781', fontSize: 11, marginTop: 7 }, star: { color: '#f0d18d' }, chev: { color: '#d7b56d', fontSize: 24 },
  back: { color: '#d7b56d', fontSize: 17, fontWeight: '700', marginBottom: 20 }, bookmark: { color: '#f0d18d', fontWeight: '800', marginBottom: 20 }, kicker: { color: '#ae9154', fontSize: 11, fontWeight: '800', letterSpacing: 1.1 }, title: { color: '#fff', fontSize: 31, fontWeight: '900', lineHeight: 36, marginTop: 8 },
  card: { backgroundColor: '#101419', padding: 17, borderRadius: 16, marginTop: 14, borderWidth: 1, borderColor: '#252c34' }, cardTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 10 }, body: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, marginBottom: 9 }, muted: { color: '#858c94', fontSize: 15, lineHeight: 22, marginBottom: 7 },
  quote: { color: '#f0ddb2', fontSize: 15, fontStyle: 'italic', lineHeight: 23, marginBottom: 12, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#8d7138' }, numbered: { flexDirection: 'row', gap: 12, marginBottom: 10 }, stepNumber: { color: '#080b0f', backgroundColor: '#d7b56d', width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontWeight: '900' }, stepText: { color: '#c6c9cd', fontSize: 15, lineHeight: 22, flex: 1 },
  problemBlock: { marginBottom: 10 }, problem: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 3 }, quizBlock: { marginBottom: 18 }, question: { color: '#fff', fontWeight: '800', fontSize: 15, lineHeight: 21, marginBottom: 8 }, option: { borderWidth: 1, borderColor: '#333b45', borderRadius: 12, padding: 12, marginBottom: 7 }, optionChosen: { borderColor: '#d7b56d', backgroundColor: '#282418' }, optionCorrect: { borderColor: '#69b889' }, optionText: { color: '#d0d3d7', lineHeight: 20 }, feedbackCorrect: { color: '#8cddb0', lineHeight: 20, marginTop: 5 }, feedbackWrong: { color: '#e0a5a5', lineHeight: 20, marginTop: 5 }, score: { color: '#fff', fontWeight: '800', marginTop: 3 },
  button: { backgroundColor: '#8d7138', padding: 17, borderRadius: 15, alignItems: 'center', marginTop: 18 }, done: { backgroundColor: '#3e694e' }, buttonText: { color: '#fff', fontWeight: '900', fontSize: 16 }, disclaimer: { color: '#6d737b', fontSize: 12, lineHeight: 18, marginTop: 24 }
});
