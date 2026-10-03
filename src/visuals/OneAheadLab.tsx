import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ONE_AHEAD_STEPS = [
  { title: 'Set the starting point', audience: 'Three thoughts are still unrevealed.', private: 'A is known before the first reveal. B and C are unknown.', known: ['A'], revealed: [], next: 'Build a legitimate starting method into your plan.' },
  { title: 'Reveal A · learn B', audience: 'A is revealed as a sketch.', private: 'During this phase, an agreed routine provides private access to B.', known: ['A', 'B'], revealed: ['A'], next: 'You can reveal B next because its information is now available.' },
  { title: 'Reveal B · learn C', audience: 'B is revealed through a description.', private: 'This phase provides private access to C. All three items are now known.', known: ['A', 'B', 'C'], revealed: ['A', 'B'], next: 'Change the reveal style while keeping the information chain intact.' },
  { title: 'Reveal C', audience: 'C receives the final, clearest revelation.', private: 'C was acquired in the previous phase. No further item is needed.', known: ['A', 'B', 'C'], revealed: ['A', 'B', 'C'], next: 'Plan a clean final handling or independent ending before rehearsing.' },
  { title: 'Close the chain', audience: 'The three separate revelations form one complete routine.', private: 'Every item is accounted for. No unresolved information or cleanup remains.', known: ['A', 'B', 'C'], revealed: ['A', 'B', 'C'], next: 'Replay the map and explain what is known before each reveal.' },
];

export default function OneAheadLab() {
  const [index, setIndex] = useState(0);
  const step = ONE_AHEAD_STEPS[index];
  return <View>
    <Text style={styles.intro}>Move through the same moment from two viewpoints. This is a concept map; the physical acquisition method depends on your routine.</Text>
    <View style={styles.rail}>
      {ONE_AHEAD_STEPS.map((item, i) => <TouchableOpacity key={item.title} accessibilityRole="button" accessibilityLabel={`Step ${i + 1}: ${item.title}`} accessibilityState={{ selected: i === index }} onPress={() => setIndex(i)} style={[styles.stop, i === index && styles.activeStop]}><Text style={[styles.stopText, i === index && styles.activeText]}>{i + 1}</Text></TouchableOpacity>)}
    </View>
    <Text accessibilityLiveRegion="polite" style={styles.title}>{step.title}</Text>
    <View style={styles.lane}>
      <Text style={styles.eyebrow}>AUDIENCE VIEW</Text>
      <View style={styles.items}>{['A', 'B', 'C'].map((id) => <View key={id} style={[styles.item, step.revealed.includes(id) && styles.revealed]}><Text style={styles.itemText}>{id}</Text><Text style={styles.itemLabel}>{step.revealed.includes(id) ? 'Revealed' : 'Hidden'}</Text></View>)}</View>
      <Text style={styles.body}>{step.audience}</Text>
    </View>
    <Text style={styles.connector}>↓ Same moment · different information ↓</Text>
    <View style={[styles.lane, styles.privateLane]}>
      <Text style={[styles.eyebrow, styles.gold]}>PERFORMER VIEW</Text>
      <View style={styles.items}>{['A', 'B', 'C'].map((id) => <View key={id} style={[styles.item, step.known.includes(id) && styles.known]}><Text style={styles.itemText}>{id}</Text><Text style={styles.itemLabel}>{step.known.includes(id) ? 'Known' : 'Unknown'}</Text></View>)}</View>
      <Text style={styles.body}>{step.private}</Text>
    </View>
    <Text style={styles.note}>{step.next}</Text>
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" disabled={index === 0} accessibilityState={{ disabled: index === 0 }} style={[styles.button, index === 0 && styles.disabled]} onPress={() => setIndex(index - 1)}><Text style={styles.buttonText}>Previous</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" style={[styles.button, styles.primary]} onPress={() => setIndex(index === ONE_AHEAD_STEPS.length - 1 ? 0 : index + 1)}><Text style={styles.primaryText}>{index === ONE_AHEAD_STEPS.length - 1 ? 'Replay' : 'Next step'}</Text></TouchableOpacity>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  intro: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, marginBottom: 16 },
  rail: { flexDirection: 'row', gap: 8, marginBottom: 16 }, stop: { flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: '#364250', alignItems: 'center', justifyContent: 'center' }, activeStop: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, stopText: { color: '#c6c9cd', fontWeight: '800', fontSize: 16 }, activeText: { color: '#101419' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 14 }, lane: { backgroundColor: '#16232b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#304653' }, privateLane: { backgroundColor: '#252119', borderColor: '#55492f' }, eyebrow: { color: '#8cbadf', fontSize: 12, fontWeight: '800', letterSpacing: 1 }, gold: { color: '#f0d18d' }, items: { flexDirection: 'row', gap: 8, marginVertical: 12 }, item: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, borderWidth: 1, borderColor: '#43505c', borderRadius: 10, alignItems: 'center' }, revealed: { backgroundColor: '#244235', borderColor: '#8cddb0' }, known: { backgroundColor: '#514228', borderColor: '#f0d18d' }, itemText: { color: '#fff', fontSize: 21, fontWeight: '800' }, itemLabel: { color: '#e2e5e8', fontSize: 12, marginTop: 4 }, body: { color: '#e0e5e8', lineHeight: 22, fontSize: 15 }, connector: { color: '#98a4b0', fontSize: 12, textAlign: 'center', marginVertical: 12 }, note: { color: '#c6c9cd', fontSize: 14, lineHeight: 21, marginVertical: 14 }, controls: { flexDirection: 'row', gap: 10 }, button: { flex: 1, minHeight: 48, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#44505a', justifyContent: 'center', alignItems: 'center' }, buttonText: { color: '#e2e5e8', fontWeight: '700' }, primary: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, primaryText: { color: '#101419', fontWeight: '800' }, disabled: { opacity: 0.35 },
});
