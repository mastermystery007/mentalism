import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Phase = 'place' | 'study' | 'recall' | 'results';

const WORDS = ['Umbrella', 'Tiger', 'Orange', 'Drum', 'Cloud'];
const STOPS = [
  { name: 'Door', prompt: 'Imagine a giant {word} knocking on the door. Hear the knock.' },
  { name: 'Sofa', prompt: 'Imagine an enormous {word} bouncing on the sofa. See the cushions spring.' },
  { name: 'Lamp', prompt: 'Imagine a glowing {word} replacing the lamp shade. Notice its colour.' },
  { name: 'Desk', prompt: 'Imagine a {word} dancing on the desk. Make the scene surprising.' },
  { name: 'Window', prompt: 'Imagine a {word} filling the window. Picture it tapping on the glass.' },
];
const ROOM_ROWS = [[2, 3], [1, 4], [0]];
const PHASE_LABELS: Record<Phase, string> = {
  place: '1 / 3 · Place your words',
  study: '2 / 3 · Walk the route',
  recall: '3 / 3 · Recall without hints',
  results: 'Your practice results',
};

const normalise = (value: string) => value.trim().toLocaleLowerCase();

export default function MemoryPalace() {
  const [phase, setPhase] = useState<Phase>('place');
  const [selectedStop, setSelectedStop] = useState(0);
  const [placed, setPlaced] = useState<(string | null)[]>(Array(5).fill(null));
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(''));
  const allPlaced = placed.every((word) => word !== null);
  const allAnswered = answers.every((answer) => answer.trim().length > 0);
  const score = answers.reduce((total, answer, index) => total + (normalise(answer) === normalise(placed[index] ?? '') ? 1 : 0), 0);
  const showingWords = phase === 'place' || phase === 'study';

  const placeWord = (word: string) => {
    setPlaced((current) => {
      const next = [...current];
      const previousStop = next.indexOf(word);
      if (previousStop >= 0 && previousStop !== selectedStop) {
        next[previousStop] = next[selectedStop];
      }
      next[selectedStop] = word;
      return next;
    });
  };

  const startRecall = () => {
    setAnswers(Array(5).fill(''));
    setSelectedStop(0);
    setPhase('recall');
  };

  const reset = () => {
    setPlaced(Array(5).fill(null));
    setAnswers(Array(5).fill(''));
    setSelectedStop(0);
    setPhase('place');
  };

  const moveStop = (direction: number) => {
    setSelectedStop((current) => (current + direction + STOPS.length) % STOPS.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>TRY IT · MEMORY PALACE</Text>
      <Text style={styles.title}>Give each word a place</Text>
      <Text style={styles.body}>A locus is a familiar stop. Keeping the same route gives you an ordered set of cues; give each stop one vivid, active scene instead of repeating the word alone.</Text>
      <Text style={styles.phase} accessibilityLiveRegion="polite">{PHASE_LABELS[phase]}</Text>

      {phase === 'place' && <Text style={styles.body}>Tap a stop in the room, then a word below. Each word belongs in one place. Choosing a word already placed swaps its location.</Text>}
      {phase === 'study' && <Text style={styles.body}>Walk the numbered route. At each stop, imagine its word interacting with the room. Add your own sound, colour or movement, then hide the words when you are ready.</Text>}
      {phase === 'recall' && <Text style={styles.body}>The words and scenes are hidden. Walk the same route in your imagination and type the word you placed at each stop.</Text>}
      {phase === 'results' && <Text style={styles.body}>Compare each answer below, then revisit any scene that was hard to recall.</Text>}

      <View style={styles.room}>
        <Text style={styles.roomCaption}>YOUR ROOM · NUMBERED STOPS</Text>
        {ROOM_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.roomRow}>
            {row.map((stopIndex) => {
              const stop = STOPS[stopIndex];
              const word = placed[stopIndex];
              const isSelected = selectedStop === stopIndex;
              return (
                <Pressable
                  key={stop.name}
                  accessibilityRole="button"
                  accessibilityLabel={`Stop ${stopIndex + 1}, ${stop.name}${showingWords && word ? `, ${word}` : ''}`}
                  accessibilityHint={phase === 'place' ? 'Select this location to assign a word.' : phase === 'study' ? 'Select this location to study its scene.' : 'Select this location on the route.'}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedStop(stopIndex)}
                  style={({ pressed }) => [styles.stop, row.length === 1 && styles.doorStop, isSelected && styles.stopSelected, pressed && styles.pressed]}
                >
                  <Text style={styles.stopNumber}>{stopIndex + 1}</Text>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={[styles.stopWord, !word && styles.muted]}>{showingWords ? word ?? 'Tap to place' : 'Word hidden'}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      <Text style={styles.route}>Fixed route: Door → Sofa → Lamp → Desk → Window</Text>

      {phase === 'place' && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Place a word at {selectedStop + 1}. {STOPS[selectedStop].name}</Text>
          <View style={styles.wordBank}>
            {WORDS.map((word) => {
              const location = placed.indexOf(word);
              return (
                <Pressable
                  key={word}
                  accessibilityRole="button"
                  accessibilityLabel={`Assign ${word} to ${STOPS[selectedStop].name}${location >= 0 ? `. Currently at ${STOPS[location].name}` : ''}`}
                  accessibilityState={{ selected: placed[selectedStop] === word }}
                  onPress={() => placeWord(word)}
                  style={({ pressed }) => [styles.wordButton, placed[selectedStop] === word && styles.wordSelected, pressed && styles.pressed]}
                >
                  <Text style={styles.wordButtonText}>{word}</Text>
                  <Text style={styles.wordLocation}>{location >= 0 ? `Stop ${location + 1}` : 'Not placed'}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.caption} accessibilityLiveRegion="polite">{placed.filter(Boolean).length} of 5 words placed. Tap another stop to continue.</Text>
        </View>
      )}

      {phase === 'study' && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Scene {selectedStop + 1}: {STOPS[selectedStop].name}</Text>
          <Text style={styles.scene}>{STOPS[selectedStop].prompt.replace('{word}', (placed[selectedStop] ?? '').toLowerCase())}</Text>
          <Text style={styles.caption}>This is a starting idea. Make the association personal, specific and easy to picture.</Text>
          <View style={styles.navigation}>
            <Pressable accessibilityRole="button" accessibilityLabel="Study previous stop" onPress={() => moveStop(-1)} style={({ pressed }) => [styles.secondaryButton, styles.navButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>‹ Previous</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Study next stop" onPress={() => moveStop(1)} style={({ pressed }) => [styles.secondaryButton, styles.navButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>Next ›</Text></Pressable>
          </View>
        </View>
      )}

      {(phase === 'recall' || phase === 'results') && (
        <View style={styles.panel}>
          {STOPS.map((stop, index) => {
            const correct = normalise(answers[index]) === normalise(placed[index] ?? '');
            return (
              <View key={stop.name} style={styles.recallRow}>
                <Text style={styles.panelTitle}>{index + 1}. {stop.name}</Text>
                {phase === 'recall' ? (
                  <TextInput
                    accessibilityLabel={`Your recalled word for stop ${index + 1}, ${stop.name}`}
                    placeholder="Which word lived here?"
                    placeholderTextColor="#86909b"
                    style={styles.input}
                    value={answers[index]}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onFocus={() => setSelectedStop(index)}
                    onChangeText={(value) => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? value : answer))}
                  />
                ) : (
                  <View style={[styles.answerBox, correct ? styles.answerCorrect : styles.answerReview]}>
                    <Text style={correct ? styles.correctText : styles.reviewText}>{correct ? 'Correct' : 'Review'} · You recalled: {answers[index] || '(blank)'}</Text>
                    {!correct && <Text style={styles.body}>Placed word: {placed[index]}</Text>}
                  </View>
                )}
              </View>
            );
          })}
          {phase === 'results' && <Text style={styles.score} accessibilityLiveRegion="polite">{score} / 5 words recalled on this attempt</Text>}
        </View>
      )}

      {phase === 'place' && <Pressable accessibilityRole="button" accessibilityLabel="Study the completed memory route" accessibilityState={{ disabled: !allPlaced }} disabled={!allPlaced} onPress={() => { setSelectedStop(0); setPhase('study'); }} style={({ pressed }) => [styles.primaryButton, !allPlaced && styles.disabled, pressed && styles.pressed]}><Text style={styles.primaryText}>Study the route</Text></Pressable>}
      {phase === 'study' && <Pressable accessibilityRole="button" accessibilityLabel="Hide all words and start the recall drill" onPress={startRecall} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryText}>Hide words & try recall</Text></Pressable>}
      {phase === 'recall' && <>
        <Text style={styles.caption}>Enter all five words to check. Letter case and surrounding spaces do not affect your score.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Check all five recalled words" accessibilityState={{ disabled: !allAnswered }} disabled={!allAnswered} onPress={() => setPhase('results')} style={({ pressed }) => [styles.primaryButton, !allAnswered && styles.disabled, pressed && styles.pressed]}><Text style={styles.primaryText}>Check recall</Text></Pressable>
      </>}
      {(phase === 'recall' || phase === 'results') && <Pressable accessibilityRole="button" accessibilityLabel="Review the words and scenes again" onPress={() => { setSelectedStop(0); setPhase('study'); }} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>Review the route</Text></Pressable>}
      <Pressable accessibilityRole="button" accessibilityLabel="Reset this drill and choose new word locations" onPress={reset} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>Start again</Text></Pressable>
      <Text style={styles.caption}>A five-word practice exercise, not a measure of your overall memory. Next, use a room you know and gradually extend the route toward the lesson's ten-location drill.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#101419', borderColor: '#39434e', borderWidth: 1, borderRadius: 20, padding: 16, gap: 14 },
  eyebrow: { color: '#f0d18d', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { color: '#f0d18d', fontSize: 24, fontWeight: '700' },
  body: { color: '#c6c9cd', fontSize: 16, lineHeight: 25 },
  phase: { color: '#8cddb0', fontSize: 16, fontWeight: '700' },
  room: { borderRadius: 14, padding: 10, borderWidth: 2, borderColor: '#606873', backgroundColor: '#18212b', gap: 10 },
  roomCaption: { color: '#c6c9cd', fontSize: 12, letterSpacing: 0.8, fontWeight: '600' },
  roomRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stop: { flexGrow: 1, flexBasis: '44%', minWidth: 100, minHeight: 112, padding: 12, borderWidth: 1, borderColor: '#46525f', borderRadius: 12, backgroundColor: '#101419', gap: 5 },
  doorStop: { flexBasis: '100%' },
  stopSelected: { borderColor: '#f0d18d', borderWidth: 2, padding: 11, backgroundColor: '#2c2930' },
  stopNumber: { color: '#f0d18d', fontSize: 20, fontWeight: '700' },
  stopName: { color: '#c6c9cd', fontSize: 16, fontWeight: '700' },
  stopWord: { color: '#8cddb0', fontSize: 16 },
  muted: { color: '#a4adb8' },
  route: { color: '#f0d18d', fontSize: 14, lineHeight: 22 },
  panel: { backgroundColor: '#18212b', borderRadius: 14, padding: 14, gap: 12 },
  panelTitle: { color: '#c6c9cd', fontSize: 16, fontWeight: '700', lineHeight: 24 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordButton: { minHeight: 64, minWidth: 96, flexGrow: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 4, borderWidth: 1, borderColor: '#606873', borderRadius: 12 },
  wordSelected: { borderColor: '#8cddb0', backgroundColor: '#1c3530' },
  wordButtonText: { color: '#f0d18d', fontSize: 16, fontWeight: '700' },
  wordLocation: { color: '#c6c9cd', fontSize: 13 },
  scene: { color: '#f0d18d', fontSize: 18, lineHeight: 28 },
  caption: { color: '#a4adb8', fontSize: 14, lineHeight: 22 },
  navigation: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  navButton: { flexGrow: 1, flexBasis: '44%', minWidth: 96 },
  recallRow: { gap: 8, paddingVertical: 4 },
  input: { minHeight: 50, color: '#c6c9cd', fontSize: 16, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#606873', backgroundColor: '#101419' },
  answerBox: { borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 },
  answerCorrect: { borderColor: '#8cddb0', backgroundColor: '#1c3530' },
  answerReview: { borderColor: '#f0d18d', backgroundColor: '#2c2930' },
  correctText: { color: '#8cddb0', fontSize: 16, lineHeight: 24 },
  reviewText: { color: '#f0d18d', fontSize: 16, lineHeight: 24 },
  score: { color: '#8cddb0', fontSize: 20, fontWeight: '700', lineHeight: 28 },
  primaryButton: { backgroundColor: '#f0d18d', borderRadius: 12, minHeight: 50, padding: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#101419', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondaryButton: { borderColor: '#606873', borderWidth: 1, borderRadius: 12, minHeight: 48, padding: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#c6c9cd', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
});
