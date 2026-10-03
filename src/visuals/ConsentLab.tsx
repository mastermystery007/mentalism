import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CONSENT_SCENARIOS = [
  { situation: 'A friend volunteers Alex. Alex looks uncertain and says, “I suppose I have to.”', choices: ['Begin because the friend agreed', 'Decline and remove the pressure'], answer: 1, explanation: 'Willingness must come from Alex. Do not begin while there is pressure or uncertainty.', route: ['Explain', 'Ask', 'Pause'], stop: true },
  { situation: 'Sam agreed to a seated relaxation exercise. You would now like to film it.', choices: ['Ask for separate filming permission', 'Film because the exercise is agreed'], answer: 0, explanation: 'Consent to an exercise does not include filming. Ask separately and accept a refusal without pressure.', route: ['Explain', 'Ask again', 'Check setting'], stop: false },
  { situation: 'During a voluntary exercise, Jo says, “Stop. I feel uncomfortable.”', choices: ['Finish the suggestion first', 'Stop, reorient and ask what support Jo wants'], answer: 1, explanation: 'Stop immediately. Cancel temporary suggestions, restore ordinary orientation and check in with Jo.', route: ['Stop', 'Reorient', 'Debrief'], stop: true },
  { situation: 'Lee wants to join in, but appears intoxicated. The exercise would take place near stairs.', choices: ['Do not proceed', 'Use a shorter exercise'], answer: 0, explanation: 'Neither the participant nor setting is suitable. Do not proceed. This course is not a clinical screening tool.', route: ['Check setting', 'Stop', 'Reschedule'], stop: true },
  { situation: 'A consensual exercise has finished and Pat appears comfortable.', choices: ['Assume everything has worn off', 'Cancel suggestions, reorient and debrief'], answer: 1, explanation: 'Remove temporary suggestions explicitly, restore ordinary alertness and ask how Pat feels.', route: ['Cancel', 'Reorient', 'Debrief'], stop: false },
];

export default function ConsentLab() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const scenario = CONSENT_SCENARIOS[index];
  const chosen = answers[index];
  const complete = Object.keys(answers).length === CONSENT_SCENARIOS.length;
  const score = CONSENT_SCENARIOS.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0);
  return <View>
    <Text style={styles.intro}>Practise decisions with fictional situations. Choose the next action, then inspect the route. No hypnosis exercise runs here.</Text>
    <View style={styles.flow}>{['Explain', 'Consent', 'Stop signal', 'Safe setting', 'Debrief'].map((label, i) => <View key={label} style={styles.node}><Text style={styles.nodeNumber}>{i + 1}</Text><Text style={styles.nodeText}>{label}</Text></View>)}</View>
    <Text style={styles.counter}>SCENARIO {index + 1} / {CONSENT_SCENARIOS.length}</Text>
    <Text style={styles.situation}>{scenario.situation}</Text>
    {scenario.choices.map((choice, i) => <TouchableOpacity key={choice} accessibilityRole="button" accessibilityState={{ selected: chosen === i, disabled: chosen !== undefined }} disabled={chosen !== undefined} onPress={() => setAnswers({ ...answers, [index]: i })} style={[styles.choice, chosen === i && styles.selected, chosen !== undefined && i === scenario.answer && styles.correct]}><Text style={styles.choiceText}>{choice}</Text></TouchableOpacity>)}
    {chosen !== undefined && <View accessibilityLiveRegion="polite" style={styles.feedback}>
      <Text style={[styles.result, chosen !== scenario.answer && styles.review]}>{chosen === scenario.answer ? 'Good decision' : 'Review this decision'}</Text>
      <Text style={styles.body}>{scenario.explanation}</Text>
      <View style={styles.route}>{scenario.route.map((label, i) => <React.Fragment key={label}>{i > 0 && <Text style={styles.arrow}>↓</Text>}<View style={[styles.routeNode, scenario.stop && (label === 'Stop' || label === 'Pause') && styles.stop]}><Text style={styles.routeText}>{label}</Text></View></React.Fragment>)}</View>
    </View>}
    {complete && <Text style={styles.score}>Decisions checked: {score}/{CONSENT_SCENARIOS.length}. Revisit any explanation you missed.</Text>}
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { setIndex(0); setAnswers({}); }}><Text style={styles.buttonText}>Reset</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: chosen === undefined }} disabled={chosen === undefined} style={[styles.button, styles.primary, chosen === undefined && styles.disabled]} onPress={() => setIndex((index + 1) % CONSENT_SCENARIOS.length)}><Text style={styles.primaryText}>{index === CONSENT_SCENARIOS.length - 1 ? 'Review again' : 'Next scenario'}</Text></TouchableOpacity>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  intro: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, marginBottom: 14 }, flow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }, node: { backgroundColor: '#18212b', borderRadius: 10, padding: 10, flexDirection: 'row', gap: 7, alignItems: 'center' }, nodeNumber: { color: '#f0d18d', fontWeight: '800' }, nodeText: { color: '#e2e5e8', fontSize: 12 }, counter: { color: '#f0d18d', fontSize: 12, fontWeight: '800', letterSpacing: 1 }, situation: { color: '#fff', fontSize: 17, lineHeight: 25, fontWeight: '600', marginVertical: 14 }, choice: { minHeight: 48, padding: 13, borderWidth: 1, borderColor: '#44505a', borderRadius: 12, marginBottom: 10 }, selected: { backgroundColor: '#352e21', borderColor: '#f0d18d' }, correct: { borderColor: '#8cddb0' }, choiceText: { color: '#e2e5e8', fontSize: 15, lineHeight: 22 }, feedback: { backgroundColor: '#18212b', padding: 14, borderRadius: 12, marginVertical: 8 }, result: { color: '#8cddb0', fontWeight: '800', fontSize: 16, marginBottom: 8 }, review: { color: '#f0d18d' }, body: { color: '#c6c9cd', lineHeight: 22, fontSize: 15 }, route: { marginTop: 14, alignItems: 'center' }, routeNode: { width: '100%', padding: 11, borderColor: '#58636e', borderWidth: 1, borderRadius: 9, alignItems: 'center' }, stop: { borderColor: '#e0a5a5', backgroundColor: '#3c262b' }, routeText: { color: '#fff', fontWeight: '700' }, arrow: { color: '#8cddb0', fontSize: 20 }, score: { color: '#8cddb0', lineHeight: 21, marginVertical: 12 }, controls: { flexDirection: 'row', gap: 10, marginTop: 12 }, button: { flex: 1, minHeight: 48, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#44505a', justifyContent: 'center', alignItems: 'center' }, buttonText: { color: '#e2e5e8', fontWeight: '700' }, primary: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, primaryText: { color: '#101419', fontWeight: '800' }, disabled: { opacity: 0.35 },
});
