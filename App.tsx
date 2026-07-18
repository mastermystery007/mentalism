import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Lesson, lessons } from './src/course';

const PROGRESS_KEY = 'mentalism-progress-v2';
const BOOKMARK_KEY = 'mentalism-bookmarks-v1';
type Answers = Record<number, number>;

export default function App() {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(PROGRESS_KEY), AsyncStorage.getItem(BOOKMARK_KEY)])
      .then(([savedDone, savedBookmarks]) => {
        if (savedDone) setDone(JSON.parse(savedDone));
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return lessons;
    return lessons.filter((lesson) => [lesson.title, lesson.summary, lesson.level, ...lesson.objectives].join(' ').toLowerCase().includes(needle));
  }, [query]);

  const toggleComplete = async (id: number) => {
    const next = done.includes(id) ? done.filter((value) => value !== id) : [...done, id];
    setDone(next);
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };

  const toggleBookmark = async (id: number) => {
    const next = bookmarks.includes(id) ? bookmarks.filter((value) => value !== id) : [...bookmarks, id];
    setBookmarks(next);
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  };

  const openLesson = (lesson: Lesson) => {
    setSelected(lesson);
    setAnswers({});
  };

  if (selected) {
    const score = selected.quiz.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.back}>‹ Course</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBookmark(selected.id)}><Text style={styles.bookmark}>{bookmarks.includes(selected.id) ? '★ Saved' : '☆ Save'}</Text></TouchableOpacity>
          </View>
          <Text style={styles.kicker}>LESSON {selected.id} · {selected.level.toUpperCase()} · {selected.duration}</Text>
          <Text style={styles.title}>{selected.title}</Text>
          <Text style={styles.lead}>{selected.summary}</Text>

          <Card title="Learning objectives">{selected.objectives.map((item) => <Bullet key={item} text={item} />)}</Card>
          {selected.sections.map((section) => <Card key={section.heading} title={section.heading}>{section.body.map((paragraph) => <Text key={paragraph} style={styles.body}>{paragraph}</Text>)}</Card>)}
          <Card title="Step-by-step practice">{selected.procedure.map((item, index) => <Numbered key={item} number={index + 1} text={item} />)}</Card>
          <Card title="Model wording">{selected.script.map((item) => <Text key={item} style={styles.quote}>“{item}”</Text>)}</Card>
          <Card title="Skill drills">{selected.drills.map((item) => <Bullet key={item} text={item} />)}</Card>
          <Card title="Troubleshooting">
            {selected.troubleshooting.map((item) => <View key={item.problem} style={styles.problemBlock}><Text style={styles.problem}>{item.problem}</Text><Text style={styles.body}>{item.response}</Text></View>)}
          </Card>
          <Card title="Ethical boundary">{selected.ethics.map((item) => <Bullet key={item} text={item} />)}</Card>
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
          <TouchableOpacity style={[styles.button, done.includes(selected.id) && styles.done]} onPress={() => toggleComplete(selected.id)}><Text style={styles.buttonText}>{done.includes(selected.id) ? 'Completed ✓' : 'Mark lesson complete'}</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.brand}>MENTALISM MASTERY</Text>
        <Text style={styles.hero}>Thought Reading, Prediction and Psychological Performance</Text>
        <Text style={styles.lead}>Fifteen detailed lessons with original routines, model scripts, practice procedures, troubleshooting, ethics and interactive assessments.</Text>
        <View style={styles.progress}>
          <Text style={styles.progressText}>{done.length}/{lessons.length} lessons complete · {bookmarks.length} saved</Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${(done.length / lessons.length) * 100}%` }]} /></View>
        </View>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search titles, skills or objectives…" placeholderTextColor="#888" style={styles.search} />
        {filtered.map((lesson) => <TouchableOpacity key={lesson.id} style={styles.lesson} onPress={() => openLesson(lesson)}>
          <View style={styles.num}><Text style={styles.numText}>{lesson.id}</Text></View>
          <View style={styles.lessonText}>
            <View style={styles.lessonTitleRow}><Text style={styles.lessonTitle}>{lesson.title}</Text>{bookmarks.includes(lesson.id) && <Text style={styles.star}>★</Text>}</View>
            <Text style={styles.lessonSummary} numberOfLines={2}>{lesson.summary}</Text>
            <Text style={styles.meta}>{lesson.duration} · {lesson.level} · {lesson.quiz.length} question quiz</Text>
          </View>
          <Text style={styles.chev}>{done.includes(lesson.id) ? '✓' : '›'}</Text>
        </TouchableOpacity>)}
        <Text style={styles.disclaimer}>For ethical entertainment and education. Do not exploit grief, health fears, finances, private information or vulnerable people.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>; }
function Bullet({ text, muted = false }: { text: string; muted?: boolean }) { return <Text style={muted ? styles.muted : styles.body}>• {text}</Text>; }
function Numbered({ number, text }: { number: number; text: string }) { return <View style={styles.numbered}><Text style={styles.stepNumber}>{number}</Text><Text style={styles.stepText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090f12' }, page: { padding: 20, paddingBottom: 60 }, topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#70d7d0', fontSize: 13, fontWeight: '800', letterSpacing: 2, marginTop: 8 }, hero: { color: '#fff', fontSize: 35, fontWeight: '900', lineHeight: 40, marginTop: 10 }, lead: { color: '#c4ced0', fontSize: 16, lineHeight: 24, marginTop: 10 },
  progress: { backgroundColor: '#121c20', padding: 16, borderRadius: 16, marginTop: 22 }, progressText: { color: '#fff', fontWeight: '700' }, track: { height: 7, backgroundColor: '#26383c', borderRadius: 9, marginTop: 10, overflow: 'hidden' }, fill: { height: 7, backgroundColor: '#70d7d0' },
  search: { backgroundColor: '#121c20', color: '#fff', borderRadius: 14, padding: 15, marginVertical: 16 }, lesson: { flexDirection: 'row', gap: 13, alignItems: 'center', backgroundColor: '#10191d', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#213137' }, lessonText: { flex: 1 }, lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  num: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#173238', alignItems: 'center', justifyContent: 'center' }, numText: { color: '#9ff5ef', fontWeight: '900' }, lessonTitle: { color: '#fff', fontWeight: '800', fontSize: 16, flexShrink: 1 }, lessonSummary: { color: '#a7b4b6', fontSize: 13, lineHeight: 18, marginTop: 4 }, meta: { color: '#71868a', fontSize: 11, marginTop: 7 }, star: { color: '#9ff5ef' }, chev: { color: '#70d7d0', fontSize: 24 },
  back: { color: '#70d7d0', fontSize: 17, fontWeight: '700', marginBottom: 20 }, bookmark: { color: '#9ff5ef', fontWeight: '800', marginBottom: 20 }, kicker: { color: '#63b9b3', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#fff', fontSize: 31, fontWeight: '900', lineHeight: 36, marginTop: 8 },
  card: { backgroundColor: '#10191d', padding: 17, borderRadius: 16, marginTop: 14, borderWidth: 1, borderColor: '#213137' }, cardTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 10 }, body: { color: '#c4ced0', fontSize: 15, lineHeight: 23, marginBottom: 9 }, muted: { color: '#829497', fontSize: 15, lineHeight: 22, marginBottom: 7 },
  quote: { color: '#b5f2ed', fontSize: 15, fontStyle: 'italic', lineHeight: 23, marginBottom: 12, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#287f79' }, numbered: { flexDirection: 'row', gap: 12, marginBottom: 10 }, stepNumber: { color: '#090f12', backgroundColor: '#70d7d0', width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontWeight: '900' }, stepText: { color: '#c4ced0', fontSize: 15, lineHeight: 22, flex: 1 },
  problemBlock: { marginBottom: 10 }, problem: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 3 }, quizBlock: { marginBottom: 18 }, question: { color: '#fff', fontWeight: '800', fontSize: 15, lineHeight: 21, marginBottom: 8 }, option: { borderWidth: 1, borderColor: '#294047', borderRadius: 12, padding: 12, marginBottom: 7 }, optionChosen: { borderColor: '#70d7d0', backgroundColor: '#163035' }, optionCorrect: { borderColor: '#69b889' }, optionText: { color: '#d0dadb', lineHeight: 20 }, feedbackCorrect: { color: '#8cddb0', lineHeight: 20, marginTop: 5 }, feedbackWrong: { color: '#e0a5a5', lineHeight: 20, marginTop: 5 }, score: { color: '#fff', fontWeight: '800', marginTop: 3 },
  button: { backgroundColor: '#287f79', padding: 17, borderRadius: 15, alignItems: 'center', marginTop: 18 }, done: { backgroundColor: '#345a46' }, buttonText: { color: '#fff', fontWeight: '900', fontSize: 16 }, disclaimer: { color: '#68777a', fontSize: 12, lineHeight: 18, marginTop: 24 }
});
