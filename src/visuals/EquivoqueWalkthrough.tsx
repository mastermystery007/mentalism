import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PropName = 'Key' | 'Coin' | 'Stone';
type CoachingStep = {
  title: string;
  audienceTitle?: string;
  caption: string;
  audienceCaption: string;
  wording: string;
  mistake: string;
  audienceMistake?: string;
  parked: PropName[];
  touched: PropName[];
  moving: PropName[];
};

const PROPS: PropName[] = ['Key', 'Coin', 'Stone'];
const POSITIONS = ['Left', 'Centre', 'Right'];
const STEPS: CoachingStep[] = [
  {
    title: 'Set the table',
    caption: 'Place Key on your left, Coin in the centre and Stone on your right. Keep a clear tray beyond Stone, to your right. Sit opposite your participant.',
    audienceCaption: 'The three objects begin in a clear row. The side tray is empty and will hold objects set aside.',
    wording: 'We will use three ordinary objects. Once an object is set aside, we will leave it there.',
    mistake: 'Starting with objects scattered around makes each later move harder to follow. Leave space between the row and the tray.',
    parked: [], touched: [], moving: [],
  },
  {
    title: 'Choose the target; invite a touch',
    audienceTitle: 'Invite the first touch',
    caption: 'For this rehearsal, choose Coin as your target before speaking. Keep that decision to yourself. Ask the participant to touch two objects; pause while they choose.',
    audienceCaption: 'The participant is invited to touch any two of the three objects. Nothing has been moved yet.',
    wording: 'Touch two objects.',
    mistake: 'Pointing at the target, naming it early or promising that touched objects will always be kept exposes or restricts the branch.',
    audienceMistake: 'Interrupting the participant before they have touched two objects makes the instruction unclear.',
    parked: [], touched: [], moving: [],
  },
  {
    title: 'Example: Key + Coin are touched',
    caption: 'Keep the touched Key and Coin where they are. Say the line, then slide the untouched Stone into the right-side tray. Only Key and Coin remain in play.',
    audienceCaption: 'The participant has touched Key and Coin. Those two stay in play; Stone is set aside in the side tray.',
    wording: 'We will work with those two. Set the other object aside.',
    mistake: 'Parking the touched pair on this branch removes Coin. Name the action clearly and move only the untouched Stone.',
    audienceMistake: 'Moving an object before explaining which one goes aside makes the action difficult to follow.',
    parked: ['Stone'], touched: ['Key', 'Coin'], moving: ['Stone'],
  },
  {
    title: 'Next, the participant chooses Key',
    caption: 'Ask them to slide one remaining object toward you. Here they choose Key. Say the line and park Key beside Stone. Leave Coin in its centre position; the branch is finished.',
    audienceCaption: 'The participant slides Key toward the performer. Key joins Stone in the tray and Coin is the only object left in play.',
    wording: 'Slide one object toward me. / Set that one aside. We will keep the object that remains.',
    mistake: 'Returning Stone from the tray or asking another choice after Coin is alone adds an unnecessary decision.',
    parked: ['Key', 'Stone'], touched: ['Key'], moving: ['Key'],
  },
  {
    title: 'Replay the alternate first pair',
    caption: 'Reset all three objects to the starting row first. Now imagine the participant touches Key and Stone. Park that touched pair together. Coin remains alone, so skip the second decision.',
    audienceCaption: 'This is a fresh replay from the full three-object setup. The participant touches Key and Stone; both are set aside, leaving Coin alone.',
    wording: 'Touch two objects. / Set those two aside. Let us focus on the object that remains.',
    mistake: 'Continuing from the previous frame instead of resetting means the first choice no longer has three objects. This alternate path starts afresh.',
    parked: ['Key', 'Stone'], touched: ['Key', 'Stone'], moving: ['Key', 'Stone'],
  },
  {
    title: 'Rehearse all five paths',
    caption: 'Reset the objects and switch to Choice practice using the mode button above this guide. Try all three possible first pairs, then each possible second choice. Speak the matching line before each physical move.',
    audienceCaption: 'The objects are reset. Switch to Choice practice above this guide to try every first pair and both second choices wherever two objects remain.',
    wording: 'Touch two objects. / If two remain: Slide one object toward me.',
    mistake: 'Practising only the friendly Key + Coin branch leaves other choices unrehearsed. If someone asks what an instruction means, clarify before they act.',
    parked: [], touched: [], moving: [],
  },
];

const PATHS = [
  'Key + Coin → Key chosen → Coin remains',
  'Key + Coin → Coin chosen → Coin remains',
  'Coin + Stone → Stone chosen → Coin remains',
  'Coin + Stone → Coin chosen → Coin remains',
  'Key + Stone → Coin remains immediately',
];

function PropToken({ name }: { name: PropName }) {
  if (name === 'Key') {
    return (
      <View style={styles.keyDrawing} accessible={false} importantForAccessibility="no-hide-descendants">
        <View style={styles.keyRing} />
        <View style={styles.keyShaft} />
        <View style={styles.keyTooth} />
      </View>
    );
  }
  return <View accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.token, name === 'Coin' ? styles.coin : styles.stone]}><View style={name === 'Coin' ? styles.coinMark : styles.stoneMark} /></View>;
}

export default function EquivoqueWalkthrough() {
  const [stepIndex, setStepIndex] = useState(0);
  const [performerView, setPerformerView] = useState(true);
  const [annotations, setAnnotations] = useState(true);
  const [inspected, setInspected] = useState<PropName | null>(null);
  const step = STEPS[stepIndex];
  const targetVisible = performerView && annotations && stepIndex > 0;

  const goTo = (index: number) => {
    setStepIndex(index);
    setInspected(null);
  };

  const describeProp = (name: PropName) => {
    const position = POSITIONS[PROPS.indexOf(name)].toLowerCase();
    const target = targetVisible && name === 'Coin' ? ' Target object for this rehearsal.' : '';
    return `${name}.${target} ${step.parked.includes(name) ? 'Parked in the right-side tray; no longer in play.' : `In play in the ${position} starting slot.`}${annotations && step.touched.includes(name) ? ' Touched in this example.' : ''}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>WATCH AND PRACTISE · SIX COACHING FRAMES</Text>
      <Text style={styles.heading}>From setup to the final object</Text>
      <Text style={styles.body}>Follow the table, say the wording aloud and rehearse each move with three objects. These diagrams show coaching frames; they are not a recording of real hand movements.</Text>

      <View style={styles.toggleGroup}>
        <Text style={styles.controlLabel}>Diagram view</Text>
        <View style={styles.buttonRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Show performer training view" accessibilityState={{ selected: performerView }} onPress={() => setPerformerView(true)} style={({ pressed }) => [styles.toggleButton, performerView && styles.toggleSelected, pressed && styles.pressed]}><Text style={styles.buttonText}>Performer</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Show audience view with training target hidden" accessibilityState={{ selected: !performerView }} onPress={() => setPerformerView(false)} style={({ pressed }) => [styles.toggleButton, !performerView && styles.toggleSelected, pressed && styles.pressed]}><Text style={styles.buttonText}>Audience</Text></Pressable>
        </View>
        <Pressable accessibilityRole="switch" accessibilityLabel="Show diagram annotations" accessibilityState={{ checked: annotations }} onPress={() => setAnnotations((current) => !current)} style={({ pressed }) => [styles.annotationButton, pressed && styles.pressed]}><Text style={styles.buttonText}>Annotations: {annotations ? 'on' : 'off'}</Text><Text style={styles.caption}>Choice badges and movement arrows</Text></Pressable>
      </View>

      <View style={styles.buttonRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous setup step" accessibilityState={{ disabled: stepIndex === 0 }} disabled={stepIndex === 0} onPress={() => goTo(stepIndex - 1)} style={({ pressed }) => [styles.navButton, stepIndex === 0 && styles.disabled, pressed && styles.pressed]}><Text style={styles.buttonText}>‹ Previous</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={stepIndex === 5 ? 'Restart setup' : 'Next setup step'} onPress={() => goTo(stepIndex === 5 ? 0 : stepIndex + 1)} style={({ pressed }) => [styles.navButton, styles.nextButton, pressed && styles.pressed]}><Text style={styles.nextText}>{stepIndex === 5 ? 'Restart ↺' : 'Next ›'}</Text></Pressable>
      </View>
      <Text style={styles.stepHeading} accessibilityLiveRegion="polite">{stepIndex + 1} / 6 · {performerView ? step.title : step.audienceTitle ?? step.title}</Text>

      <View style={styles.diagram}>
        <View style={styles.playerLabel}><Text style={styles.playerName}>PARTICIPANT</Text><Text style={styles.caption}>Opposite the performer</Text></View>
        <View style={styles.table}>
          <Text style={styles.tableCaption}>TABLE · LEFT TO RIGHT FROM PERFORMER</Text>
          <View style={styles.objectRow}>
            {PROPS.map((name, index) => {
              const parked = step.parked.includes(name);
              const touched = annotations && step.touched.includes(name) && !parked;
              const target = targetVisible && name === 'Coin';
              return (
                <Pressable key={name} accessibilityRole="button" accessibilityLabel={`${POSITIONS[index]} starting slot. ${describeProp(name)}`} accessibilityHint="Inspect this object's current role and location." accessibilityState={{ selected: inspected === name }} onPress={() => setInspected(name)} style={({ pressed }) => [styles.objectSlot, touched && styles.touchedSlot, inspected === name && styles.inspectedSlot, pressed && styles.pressed]}>
                  <Text style={styles.position}>{POSITIONS[index]}</Text>
                  {parked ? <View style={styles.emptySlot}><Text style={styles.emptyMark} accessible={false}>·</Text></View> : <PropToken name={name} />}
                  <Text style={styles.objectName}>{name}</Text>
                  <Text style={styles.slotStatus}>{parked ? 'Moved to tray' : 'In play'}</Text>
                  {target && <Text style={styles.targetBadge}>Target</Text>}
                  {touched && <Text style={styles.touchBadge}>Touched</Text>}
                </Pressable>
              );
            })}
          </View>

          {annotations && step.moving.length > 0 && <View style={styles.moveNote}><Text style={styles.moveText}>{step.moving.join(' + ')} → right-side tray</Text></View>}

          <View style={styles.tray}>
            <Text style={styles.trayTitle}>RIGHT-SIDE PARKING TRAY</Text>
            {step.parked.length === 0 ? <Text style={styles.caption}>Empty · Keep this area clear</Text> : <>
              <View style={styles.trayObjects}>
                {PROPS.filter((name) => step.parked.includes(name)).map((name) => <Pressable key={name} accessibilityRole="button" accessibilityLabel={describeProp(name)} accessibilityHint="Inspect this parked object." accessibilityState={{ selected: inspected === name }} onPress={() => setInspected(name)} style={({ pressed }) => [styles.parkedProp, inspected === name && styles.inspectedSlot, pressed && styles.pressed]}><PropToken name={name} /><Text style={styles.objectName}>{name}</Text><Text style={styles.slotStatus}>Out of play</Text></Pressable>)}
              </View>
              <Text style={styles.caption}>Leave these objects aside.</Text>
            </>}
          </View>
          <Text style={styles.layoutNote}>Tray drawn below the row to fit your screen. On a real table, place it beyond Stone, to your right.</Text>
        </View>
        <View style={styles.playerLabel}><Text style={styles.playerName}>PERFORMER · YOU</Text><Text style={styles.caption}>Face the participant from this side</Text></View>
      </View>

      <View style={styles.inspection} accessibilityLiveRegion="polite"><Text style={styles.controlLabel}>{inspected ? `${inspected} · current role` : 'Tap a prop to inspect it'}</Text><Text style={styles.body}>{inspected ? describeProp(inspected) : 'Object taps show information; they do not move the props or choose a branch.'}</Text></View>

      <View style={styles.coaching}>
        <Text style={styles.controlLabel}>Your next action</Text>
        <Text style={styles.body}>{performerView ? step.caption : step.audienceCaption}</Text>
        <Text style={styles.controlLabel}>Say aloud</Text>
        {step.wording.split(' / ').map((line) => <Text key={line} style={styles.script}>“{line}”</Text>)}
        <Text style={styles.controlLabel}>Common mistake</Text>
        <Text style={styles.body}>{performerView ? step.mistake : step.audienceMistake ?? step.mistake}</Text>
      </View>

      {stepIndex === 5 && performerView && <View style={styles.coaching}><Text style={styles.controlLabel}>Five paths to rehearse</Text>{PATHS.map((path, index) => <Text key={path} style={styles.body}>{index + 1}. {path}</Text>)}<Text style={styles.caption}>Switch to Choice practice above this guide to choose each path yourself.</Text></View>}

      <View style={styles.stepDots}>
        {STEPS.map((item, index) => <Pressable key={item.title} accessibilityRole="button" accessibilityLabel={`Go to coaching frame ${index + 1}, ${!performerView && item.audienceTitle ? item.audienceTitle : item.title}`} accessibilityState={{ selected: stepIndex === index }} onPress={() => goTo(index)} style={({ pressed }) => [styles.dotButton, stepIndex === index && styles.activeDotButton, pressed && styles.pressed]}><View style={[styles.dot, stepIndex === index && styles.activeDot]} /><Text style={styles.dotNumber}>{index + 1}</Text></Pressable>)}
      </View>
      <View style={styles.buttonRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous coaching frame" accessibilityState={{ disabled: stepIndex === 0 }} disabled={stepIndex === 0} onPress={() => goTo(stepIndex - 1)} style={({ pressed }) => [styles.navButton, stepIndex === 0 && styles.disabled, pressed && styles.pressed]}><Text style={styles.buttonText}>‹ Previous</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={stepIndex === 5 ? 'Restart at the table setup' : 'Next coaching frame'} onPress={() => goTo(stepIndex === 5 ? 0 : stepIndex + 1)} style={({ pressed }) => [styles.navButton, styles.nextButton, pressed && styles.pressed]}><Text style={styles.nextText}>{stepIndex === 5 ? 'Restart ↺' : 'Next ›'}</Text></Pressable>
      </View>
      <Text style={styles.caption}>A learning model for agreed entertainment. Clarify any confusing instruction and accept a participant's refusal. Switch to Choice practice above this guide to explore choices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#101419', borderColor: '#34404b', borderWidth: 1, borderRadius: 18, padding: 14, gap: 14 },
  eyebrow: { color: '#f0d18d', fontSize: 12, fontWeight: '800', letterSpacing: 0.8, lineHeight: 19 },
  heading: { color: '#f0d18d', fontSize: 23, fontWeight: '800' },
  body: { color: '#c6c9cd', fontSize: 15, lineHeight: 24 },
  caption: { color: '#a7adb5', fontSize: 13, lineHeight: 21 },
  controlLabel: { color: '#f0d18d', fontSize: 14, fontWeight: '700', lineHeight: 22 },
  toggleGroup: { gap: 8 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toggleButton: { flexBasis: '44%', flexGrow: 1, minWidth: 90, minHeight: 48, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#606873', alignItems: 'center', justifyContent: 'center' },
  toggleSelected: { backgroundColor: '#282418', borderColor: '#f0d18d' },
  buttonText: { color: '#c6c9cd', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  annotationButton: { minHeight: 48, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#606873', gap: 4 },
  stepHeading: { color: '#8cddb0', fontSize: 18, lineHeight: 26, fontWeight: '700' },
  diagram: { gap: 10 },
  playerLabel: { backgroundColor: '#18212b', borderRadius: 10, padding: 10, gap: 3, alignItems: 'center' },
  playerName: { color: '#c6c9cd', fontSize: 13, fontWeight: '700', textAlign: 'center', lineHeight: 21 },
  table: { backgroundColor: '#1e242a', borderRadius: 18, borderWidth: 2, borderColor: '#606873', padding: 10, gap: 12 },
  tableCaption: { color: '#a7adb5', fontSize: 11, lineHeight: 18, textAlign: 'center', fontWeight: '700' },
  objectRow: { flexDirection: 'row', gap: 5, alignItems: 'stretch' },
  objectSlot: { flex: 1, minWidth: 0, minHeight: 142, borderRadius: 10, borderWidth: 1, borderColor: '#46535f', paddingVertical: 10, paddingHorizontal: 3, alignItems: 'center', gap: 7, backgroundColor: '#101419' },
  touchedSlot: { borderColor: '#8cddb0', backgroundColor: '#172b24' },
  inspectedSlot: { borderColor: '#f0d18d', backgroundColor: '#282418' },
  position: { color: '#a7adb5', fontSize: 12, lineHeight: 19, textAlign: 'center' },
  objectName: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, fontWeight: '700', textAlign: 'center' },
  slotStatus: { color: '#a7adb5', fontSize: 12, lineHeight: 19, textAlign: 'center' },
  token: { width: 44, height: 44, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  coin: { backgroundColor: '#3b301c', borderColor: '#d1b471', borderRadius: 22 },
  coinMark: { width: 26, height: 26, borderRadius: 13, borderColor: '#bda165', borderWidth: 1 },
  stone: { backgroundColor: '#536475', borderColor: '#92a8bc', borderTopLeftRadius: 18, borderTopRightRadius: 13, borderBottomRightRadius: 19, borderBottomLeftRadius: 12, transform: [{ rotate: '-8deg' }] },
  stoneMark: { width: 16, height: 10, borderRadius: 6, backgroundColor: '#6d8091' },
  keyDrawing: { width: 44, height: 44, justifyContent: 'center' },
  keyRing: { position: 'absolute', left: 0, top: 8, width: 25, height: 25, borderWidth: 4, borderColor: '#b7c4ce', borderRadius: 13 },
  keyShaft: { position: 'absolute', left: 22, top: 17, width: 21, height: 7, backgroundColor: '#b7c4ce', borderRadius: 2 },
  keyTooth: { position: 'absolute', right: 3, top: 20, width: 6, height: 12, backgroundColor: '#b7c4ce' },
  emptySlot: { width: 44, height: 44, borderWidth: 1, borderStyle: 'dashed', borderColor: '#606873', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  emptyMark: { color: '#a7adb5', fontSize: 24 },
  targetBadge: { color: '#f0d18d', fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 19 },
  touchBadge: { color: '#8cddb0', fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 19 },
  moveNote: { paddingVertical: 6, alignItems: 'flex-end' },
  moveText: { color: '#f0d18d', fontSize: 14, fontWeight: '700', lineHeight: 22, textAlign: 'right' },
  tray: { alignSelf: 'flex-end', width: '88%', backgroundColor: '#101419', borderColor: '#7b8590', borderWidth: 1, borderRadius: 12, padding: 10, gap: 8 },
  trayTitle: { color: '#a7adb5', fontSize: 11, lineHeight: 18, fontWeight: '800' },
  trayObjects: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  parkedProp: { flexGrow: 1, flexBasis: '42%', minWidth: 58, minHeight: 108, padding: 8, alignItems: 'center', gap: 5, borderRadius: 8, borderWidth: 1, borderColor: '#46535f' },
  layoutNote: { color: '#a7adb5', fontSize: 12, lineHeight: 19 },
  inspection: { backgroundColor: '#18212b', padding: 12, borderRadius: 10, gap: 6 },
  coaching: { backgroundColor: '#18212b', padding: 12, borderRadius: 12, gap: 9 },
  script: { color: '#f0d18d', fontSize: 16, lineHeight: 25, fontStyle: 'italic' },
  stepDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  dotButton: { minWidth: 48, minHeight: 48, padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#46535f', gap: 4, alignItems: 'center', justifyContent: 'center' },
  activeDotButton: { borderColor: '#f0d18d', backgroundColor: '#282418' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#606873' },
  activeDot: { backgroundColor: '#f0d18d' },
  dotNumber: { color: '#c6c9cd', fontSize: 13, lineHeight: 20 },
  navButton: { flexBasis: '44%', flexGrow: 1, minWidth: 90, minHeight: 48, borderWidth: 1, borderColor: '#606873', borderRadius: 10, padding: 12, justifyContent: 'center', alignItems: 'center' },
  nextButton: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' },
  nextText: { color: '#101419', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
});
