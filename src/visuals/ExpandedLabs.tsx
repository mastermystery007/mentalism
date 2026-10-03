import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { expandedAssets } from './expandedAssets';
import { EFFECT_ACTIONS, forceStats, HYPNOSIS_CASES, matchingPositions, OBSERVATION_CASES, PREDICTION_ROUTES, SHAPES, swapPositions, SYMBOL_NAMES, Classification, PredictionChoice, ShapeChoice } from './learningLogic';

export type ExpandedDefinition = {
  slug: string; title: string; description: string; kind: string;
  links: { track: string; id: number }[];
  steps: { title: string; caption: string; coach: string; alt: string }[];
  sources?: { title: string; url: string }[];
};
type ButtonProps = { label: string; onPress: () => void; selected?: boolean; disabled?: boolean; accessibilityLabel?: string };
function Button({ label, onPress, selected, disabled, accessibilityLabel }: ButtonProps) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ selected: !!selected, disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, selected && s.active, disabled && s.disabled, pressed && s.pressed]}><Text style={[s.buttonText, selected && s.dark]}>{label}</Text></Pressable>;
}
function Body({ children }: { children: React.ReactNode }) { return <Text style={s.body}>{children}</Text>; }
function Feedback({ children }: { children: React.ReactNode }) { return <View accessibilityLiveRegion="polite" style={s.feedback}><Body>{children}</Body></View>; }

export default function ExpandedLab({ lesson }: { lesson: ExpandedDefinition }) {
  const [mode, setMode] = useState<'steps' | 'practice'>('steps');
  const [step, setStep] = useState(0);
  const [sourceError, setSourceError] = useState(false);
  const current = lesson.steps[step];
  return <View>
    <View style={s.row}><Button label="Guided steps" selected={mode === 'steps'} onPress={() => setMode('steps')} /><Button label="Practice" selected={mode === 'practice'} onPress={() => setMode('practice')} /></View>
    <View style={mode !== 'steps' && s.hidden} accessibilityElementsHidden={mode !== 'steps'} importantForAccessibility={mode !== 'steps' ? 'no-hide-descendants' : 'auto'}>
      <Text style={s.eyebrow}>STEP {step + 1} OF {lesson.steps.length} · COACHING VIEW</Text>
      <Text style={s.title}>{current.title}</Text>
      <View style={s.row}><Button label="Previous step" disabled={step === 0} onPress={() => setStep(step - 1)} /><Button label="Next step" disabled={step === lesson.steps.length - 1} onPress={() => setStep(step + 1)} /></View>
      <View style={s.row}>{lesson.steps.map((item, i) => <Button key={item.title} label={`${i + 1}`} accessibilityLabel={`${lesson.title}: step ${i + 1}, ${item.title}`} selected={step === i} onPress={() => setStep(i)} />)}</View>
      <Image source={expandedAssets[lesson.slug].frames[step]} style={s.frame} resizeMode="contain" accessible accessibilityLabel={current.alt} />
      <Body>{current.caption}</Body><Feedback>{current.coach}</Feedback>
      {step === lesson.steps.length - 1 && <Button label="Try the practice activity" onPress={() => setMode('practice')} />}
    </View>
    <View style={mode !== 'practice' && s.hidden} accessibilityElementsHidden={mode !== 'practice'} importantForAccessibility={mode !== 'practice' ? 'no-hide-descendants' : 'auto'}>
      <Text style={s.eyebrow}>PRACTICE · SESSION ONLY</Text>
      <Practice kind={lesson.kind} />
    </View>
    {lesson.sources && <View style={s.sources}><Text style={s.small}>Further reading · requires internet</Text>{lesson.sources.map(source => <Button key={source.url} label={source.title} onPress={() => { setSourceError(false); Linking.openURL(source.url).catch(() => setSourceError(true)); }} />)}{sourceError && <Feedback>The reading link could not open. Try again when an internet connection and browser are available.</Feedback>}</View>}
  </View>;
}

function Practice({ kind }: { kind: string }) {
  switch (kind) {
    case 'observation': return <ClassificationLab cases={OBSERVATION_CASES} labels={['Observation', 'Interpretation']} />;
    case 'hypnosis-model': return <ClassificationLab cases={HYPNOSIS_CASES} labels={['Careful model', 'Overclaim']} />;
    case 'forces': return <ForceLab />;
    case 'drawing': return <RevealLab family="drawing" />;
    case 'book': return <RevealLab family="book" />;
    case 'prediction': return <PredictionLab />;
    case 'effect': return <EffectLab />;
    case 'attention': return <AttentionLab />;
    case 'symbols': return <SymbolsLab />;
    case 'pretalk': return <PreTalkLab />;
    default: return null;
  }
}

function ClassificationLab({ cases, labels }: { cases: Classification[]; labels: string[] }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const item = cases[index];
  const reset = () => { setIndex(0); setAnswer(null); setScore(0); setFinished(false); };
  if (finished) return <><Text style={s.title}>Review complete: {score}/{cases.length}</Text><Body>Revisit the explanations and keep facts separate from conclusions. Scores measure this exercise only.</Body><Button label="Start the sorting exercise again" onPress={reset} /></>;
  return <><Text style={s.small}>Statement {index + 1} of {cases.length}</Text><View style={s.statement}><Text style={s.title}>{item.statement}</Text></View>
    <View style={s.row}>{labels.map((label, i) => <Button key={label} label={label} disabled={answer !== null} selected={answer === i} onPress={() => { setAnswer(i); if (i === item.answer) setScore(score + 1); }} />)}</View>
    {answer !== null && <><Feedback>{answer === item.answer ? 'Correct. ' : `This belongs under ${labels[item.answer]}. `}{item.explanation}</Feedback><Button label={index === cases.length - 1 ? 'Review score' : 'Next statement'} onPress={() => { if (index === cases.length - 1) setFinished(true); else { setIndex(index + 1); setAnswer(null); } }} /></>}
    <Button label="Reset sorting" onPress={reset} />
  </>;
}

function ForceLab() {
  const [trials, setTrials] = useState<ShapeChoice[]>([]);
  const stats = forceStats(trials);
  const last = trials[trials.length - 1];
  return <><Text style={s.title}>Target: Circle</Text><Body>After a real rehearsal response, enter the shape chosen. This app does not force a participant's choice. Entries stay in this activity until you leave the lesson.</Body>
    <View style={s.row}>{SHAPES.map(shape => <Button key={shape} label={`Record ${shape}`} disabled={trials.length >= 20} onPress={() => setTrials([...trials, shape])} />)}</View>
    <Text accessibilityLiveRegion="polite" style={s.title}>{stats.total}/20 trials · {stats.hits} hits · {stats.misses} misses</Text>
    <View style={s.bar}><View style={[s.fill, { width: `${stats.rate ?? 0}%` }]} /></View><Body>{stats.rate === null ? 'No results recorded yet.' : `Observed hit rate: ${stats.rate}%. This session is a small sample, not a guarantee.`}</Body>
    {last && <Feedback>{last === 'Circle' ? 'Hit: use the exact reveal you prepared.' : `Miss: ${last} was chosen. Accept the answer, acknowledge the miss and move to your prepared alternate ending.`}</Feedback>}
    {stats.total === 20 && <Body>Batch complete. Note your wording and conditions separately before starting another batch.</Body>}
    <View style={s.row}><Button label="Undo last entry" disabled={!trials.length} onPress={() => setTrials(trials.slice(0, -1))} /><Button label="Clear trial log" onPress={() => setTrials([])} /></View>
  </>;
}

const REVEALS = {
  drawing: [
    { name: 'House', clues: ['Wider than it is tall', 'Mostly straight edges', 'A manufactured object', 'A doorway below a triangular roof', 'House'] },
    { name: 'Tree', clues: ['Taller than it is wide', 'A narrow stem with a broad upper shape', 'A living thing', 'Branches beneath leaves', 'Tree'] },
    { name: 'Boat', clues: ['A broad shape low in the picture', 'A curved base with a triangle above', 'A manufactured object used on water', 'A sail supported by a mast', 'Boat'] },
  ],
  book: [
    { name: 'Lantern', clues: ['A small source of light in a dark place', 'A portable manufactured object', 'Something carried or hung', 'A protective frame and handle', 'Lantern'] },
    { name: 'Forest', clues: ['An outdoor place with living things', 'A large natural area', 'Many tall plants rather than just one', 'Trees growing together', 'Forest'] },
    { name: 'Rocket', clues: ['An upward journey', 'A manufactured vehicle', 'Travel beyond the ground', 'Engines propelling it toward space', 'Rocket'] },
  ],
};
function RevealLab({ family }: { family: keyof typeof REVEALS }) {
  const [sample, setSample] = useState(0);
  const [beat, setBeat] = useState(-1);
  const item = REVEALS[family][sample];
  return <><Text style={s.title}>An openly known training target</Text><Body>Select a sample and practise its broad-to-specific reveal. This teaches presentation; it does not secretly acquire a drawing or word.</Body>
    <View style={s.row}>{REVEALS[family].map((choice, i) => <Button key={choice.name} label={choice.name} selected={sample === i} onPress={() => { setSample(i); setBeat(-1); }} />)}</View>
    <Art name={item.name} />
    {family === 'book' && <View style={s.statement}><Body>Original practice text: A lantern lit the path. Beyond the forest, a rocket traced a bright arc across the evening sky.</Body></View>}
    {item.clues.map((clue, i) => <View key={clue} style={[s.clue, beat === i && s.currentClue]}><Text style={s.body}>{i + 1}. {i <= beat ? clue : 'Not revealed yet'}</Text></View>)}
    <View style={s.row}><Button label={beat < 0 ? 'Reveal first clue' : beat === 3 ? 'Reveal exact name' : 'Reveal next clue'} disabled={beat === 4} onPress={() => setBeat(beat + 1)} /><Button label="Reset clue ladder" onPress={() => setBeat(-1)} /></View>
    {beat === 4 && <Feedback>End with one confirmation. In a real performance, adapt the clues to the actual target and accept an imperfect match honestly.</Feedback>}
  </>;
}

function Art({ name }: { name: string }) {
  const tree = <><View style={s.treeTop} /><View style={s.trunk} /></>;
  return <View style={s.art} accessible accessibilityLabel={`Original practice illustration: ${name}`}>
    {name === 'House' && <View style={s.house}><View style={s.roof} /><View style={s.houseBody}><View style={s.door} /></View></View>}
    {name === 'Tree' && <View style={s.tree}>{tree}</View>}
    {name === 'Forest' && <View style={s.row}>{[0, 1, 2].map(i => <View key={i} style={[s.tree, { transform: [{ scale: 0.65 }], width: 64 }]}>{tree}</View>)}</View>}
    {name === 'Boat' && <View style={s.boat}><View style={s.sail} /><View style={s.mast} /><View style={s.hull} /></View>}
    {name === 'Lantern' && <View><View style={s.handle} /><View style={s.lantern}><View style={s.light} /></View></View>}
    {name === 'Rocket' && <View><View style={s.rocketNose} /><View style={s.rocket}><View style={s.porthole} /></View><View style={s.flame} /></View>}
    <Text style={s.artLabel}>{name}</Text>
  </View>;
}

function PredictionLab() {
  const [audience, setAudience] = useState(false);
  const [choice, setChoice] = useState<PredictionChoice | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reset = () => { setChoice(null); setRevealed(false); };
  return <><Text style={s.title}>Three prepared outcomes</Text><Body>{audience ? 'The three envelopes were prepared before the choice. Choose one object and reveal its matching card when ready.' : 'A fixed training index pairs A with Key, B with Coin and C with Stone. Audience view hides the training contents until the reveal.'} This conceptual model does not show concealed retrieval.</Body>
    <Button label={audience ? 'Show performer contents' : 'Show audience view'} selected={audience} onPress={() => setAudience(!audience)} />
    <View style={s.row}>{(Object.keys(PREDICTION_ROUTES) as PredictionChoice[]).map(object => <View key={object} style={[s.envelope, choice === object && s.currentClue]}><Text style={s.title}>{PREDICTION_ROUTES[object]}</Text><Body>{!audience || (revealed && choice === object) ? object : 'Hidden'}</Body></View>)}</View>
    <Body>{choice ? `Choice accepted: ${choice}.` : 'Choose one object for this rehearsal.'}</Body>
    <View style={s.row}>{(Object.keys(PREDICTION_ROUTES) as PredictionChoice[]).map(object => <Button key={object} label={`Choose ${object}`} selected={choice === object} disabled={choice !== null} onPress={() => setChoice(object)} />)}</View>
    {choice && <><Feedback>{audience && !revealed ? 'The choice has been accepted. The training contents remain covered.' : `Rehearsed route: ${choice} → envelope ${PREDICTION_ROUTES[choice]}. Its card was prepared before this choice.`}</Feedback><Button label="Reveal the prepared card" disabled={revealed} onPress={() => setRevealed(true)} /></>}
    <Button label="Reset all envelopes" onPress={reset} />
  </>;
}

function EffectLab() {
  const [kept, setKept] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const missing = EFFECT_ACTIONS.filter((action, i) => action.essential && !kept.includes(i));
  const extra = EFFECT_ACTIONS.filter((action, i) => !action.essential && kept.includes(i));
  return <><Text style={s.title}>Keep the essential beats</Text><Body>Example effect: A visible prediction matches the participant's chosen object. Tap the actions you would keep, then check the structure.</Body>
    {EFFECT_ACTIONS.map((action, i) => <Button key={action.title} label={`${kept.includes(i) ? '✓ Keep' : '○ Cut'} · ${action.title}`} selected={kept.includes(i)} onPress={() => { setKept(kept.includes(i) ? kept.filter(n => n !== i) : [...kept, i]); setChecked(false); }} />)}
    <Button label="Check my routine structure" onPress={() => setChecked(true)} />
    {checked && <Feedback>{!missing.length && !extra.length ? 'Clear structure: commitment → choice → reveal. Test whether a viewer remembers that same event.' : `${missing.length ? `Missing: ${missing.map(x => x.title).join('; ')}. ` : ''}${extra.length ? `These repetitions add no new condition in this example: ${extra.map(x => x.title).join('; ')}.` : ''}`}</Feedback>}
    <Button label="Reset action choices" onPress={() => { setKept([]); setChecked(false); }} />
  </>;
}

const TIMING = [
  { name: 'Display', focus: 'Displayed card', reason: 'The prop is important right now. Unrelated handling is more likely to compete with the display.' },
  { name: 'Question', focus: 'Participant’s answer', reason: 'A meaningful question can create an offbeat. A pen handover or space-clearing action still needs an ordinary reason and an even rhythm.' },
  { name: 'Reveal', focus: 'Impossible result', reason: 'Give the result a clean moment. Extra movement can weaken the climax and obscure what the audience should remember.' },
];
function AttentionLab() {
  const [beat, setBeat] = useState(0);
  return <><Text style={s.title}>Compare three timing beats</Text><Body>Tap a beat to change the coaching attention map. This illustrates possible interest; it does not measure gaze or guarantee that handling is unseen.</Body>
    <View style={s.row}>{TIMING.map((item, i) => <Button key={item.name} label={item.name} selected={beat === i} onPress={() => setBeat(i)} />)}</View>
    <View style={s.stage}><Text style={s.small}>AUDIENCE</Text><View style={s.row}><View style={s.person} /><View style={s.person} /></View><View style={[s.focusLine, { transform: [{ rotate: `${(beat - 1) * 25}deg` }] }]} /><Text style={s.focus}>{TIMING[beat].focus}</Text><Text style={s.small}>FOCUS OF INTEREST · COACHING MODEL</Text></View>
    <Feedback>{TIMING[beat].reason}</Feedback><Body>Rehearsal check: purpose, gaze and rhythm should remain natural before, during and after the movement.</Body>
  </>;
}

function Symbol({ id }: { id: number }) {
  return <View style={s.symbol} accessible accessibilityLabel={SYMBOL_NAMES[id]}>
    {id === 0 && <View style={s.circle} />}{id === 1 && <View style={s.triangle} />}
    {id === 2 && <View style={s.row}><View style={s.symbolBar} /><View style={s.symbolBar} /></View>}
    {id === 3 && <View style={s.dots}>{[0, 1, 2].map(i => <View key={i} style={s.dot} />)}</View>}
    {id === 4 && <Text style={s.wave}>∿</Text>}
  </View>;
}
function SymbolsLab() {
  const [row, setRow] = useState([0, 2, 1, 4, 3]);
  const [first, setFirst] = useState<number | null>(null);
  const [compare, setCompare] = useState(false);
  const matches = matchingPositions(row);
  const clear = () => { setRow([0, 2, 1, 4, 3]); setFirst(null); setCompare(false); };
  return <><Text style={s.title}>Two rows, five positions</Text><Body>Tap two participant cards to swap them, or rotate the row. Then reveal which positions match. This is an arrangement exercise, not a test of ESP.</Body>
    <Text style={s.small}>PERFORMER ROW</Text><View style={s.symbolRow}>{SYMBOL_NAMES.map((name, i) => <View key={name} style={[s.symbolCard, compare && matches.includes(i) && s.match]}><Symbol id={i} /><Text style={s.symbolName}>{name}</Text></View>)}</View>
    <Text style={s.small}>PARTICIPANT ROW · TAP TWO TO SWAP</Text><View style={s.symbolRow}>{row.map((id, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Participant position ${i + 1}: ${SYMBOL_NAMES[id]}`} accessibilityState={{ selected: first === i }} style={[s.symbolCard, first === i && s.currentClue, compare && matches.includes(i) && s.match]} onPress={() => { setCompare(false); if (first === null) setFirst(i); else { setRow(swapPositions(row, first, i)); setFirst(null); } }}><Symbol id={id} /><Text style={s.symbolName}>{i + 1}</Text></Pressable>)}</View>
    <Body>{first === null ? 'Choose a card to begin a swap.' : `Position ${first + 1} selected. Tap another position, or the same one to cancel.`}</Body>
    <View style={s.row}><Button label="Rotate participant row" onPress={() => { setRow([...row.slice(1), row[0]]); setFirst(null); setCompare(false); }} /><Button label="Reveal matches" onPress={() => { setFirst(null); setCompare(true); }} /></View>
    {compare && <Feedback>{matches.length}/5 matching positions{matches.length ? `: ${matches.map(i => i + 1).join(', ')}` : ''}. Only identical symbols at the same position count. The arrangements have not been changed by the reveal.</Feedback>}
    <Button label="Reset both symbol rows" onPress={clear} />
  </>;
}

const PRETALK_CASES = [
  { question: '“Will I lose control?”', options: ['You can pause or stop, and participation is voluntary.', 'I can make you obey once you agree.'], answer: 0, explanation: 'Explain agency in ordinary words and commit to acting on a stop request.' },
  { question: '“What if nothing happens?”', options: ['Only intelligent people respond well.', 'Different or absent responses are acceptable; tell me honestly.'], answer: 1, explanation: 'Remove performance pressure. A reported response should be real, not a way to please the facilitator.' },
  { question: '“Can you also film this?”', options: ['The activity and filming need separate agreement.', 'Agreeing to the exercise automatically covers filming.'], answer: 0, explanation: 'Consent to one activity does not cover another. Ask about filming separately and accept a refusal.' },
  { question: '“I am unsure whether I want to try.”', options: ['You already listened, so you should finish.', 'We can stop here; take time to decide without pressure.'], answer: 1, explanation: 'Uncertainty is not permission to proceed. A short pre-talk ends with a clear, specific consent check.' },
];
function PreTalkLab() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const reset = () => { setIndex(0); setAnswer(null); setScore(0); setFinished(false); };
  const item = PRETALK_CASES[index];
  return <><Text style={s.title}>{finished ? 'Pre-talk review' : `Participant question ${index + 1}/4`}</Text><Body>Fictional conversation rehearsal. This activity performs no induction or clinical screening.</Body>
    {finished ? <><Feedback>{score}/4 first responses followed the lesson principles. Review: explain the limited activity, preserve agency, accept variable responses, and check specific consent.</Feedback><Button label="Rehearse the pre-talk again" onPress={reset} /></> : <><View style={s.statement}><Text style={s.title}>{item.question}</Text></View>{item.options.map((option, i) => <Button key={option} label={option} selected={answer === i} disabled={answer !== null} onPress={() => { setAnswer(i); if (i === item.answer) setScore(score + 1); }} />)}{answer !== null && <><Feedback>{answer === item.answer ? 'Useful response. ' : 'Reconsider this wording. '}{item.explanation}</Feedback><Button label={index === 3 ? 'Review all four principles' : 'Next participant question'} onPress={() => { if (index === 3) setFinished(true); else { setIndex(index + 1); setAnswer(null); } }} /></>}</>}
    {!finished && <Button label="Reset pre-talk rehearsal" onPress={reset} />}
  </>;
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }, button: { minWidth: 48, maxWidth: '100%', minHeight: 48, borderWidth: 1, borderColor: '#52616b', borderRadius: 10, padding: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }, buttonText: { color: '#e7ecef', fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 20 }, active: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, dark: { color: '#101419' }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.75 }, hidden: { display: 'none' },
  eyebrow: { color: '#f0d18d', fontSize: 11, fontWeight: '800', marginTop: 18, marginBottom: 12 }, title: { color: '#f2f4f5', fontSize: 20, lineHeight: 28, fontWeight: '700', marginVertical: 10 }, body: { color: '#c6cfd5', fontSize: 15, lineHeight: 23, marginBottom: 10 }, small: { color: '#aebcc6', fontSize: 12, lineHeight: 19, marginVertical: 8 }, frame: { width: '100%', height: undefined, aspectRatio: 4 / 3, marginVertical: 12 }, feedback: { padding: 14, backgroundColor: '#1c2930', borderLeftWidth: 3, borderLeftColor: '#8cddb0', borderRadius: 8, marginVertical: 12 }, statement: { padding: 14, backgroundColor: '#1a2228', borderRadius: 12, marginVertical: 10 }, clue: { borderWidth: 1, borderColor: '#3b4b55', padding: 10, borderRadius: 8, marginBottom: 6 }, currentClue: { borderColor: '#f0d18d', backgroundColor: '#29271e' }, sources: { marginTop: 16 },
  bar: { height: 22, backgroundColor: '#29353e', borderRadius: 10, overflow: 'hidden', marginVertical: 10 }, fill: { height: '100%', backgroundColor: '#8cddb0' }, envelope: { flex: 1, minWidth: 64, borderWidth: 1, borderColor: '#687b89', padding: 12, borderRadius: 8, alignItems: 'center' },
  art: { height: 214, backgroundColor: '#19232b', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginVertical: 12 }, artLabel: { position: 'absolute', bottom: 8, color: '#f0d18d', fontSize: 16, fontWeight: '700' }, house: { alignItems: 'center' }, roof: { width: 0, height: 0, borderLeftWidth: 72, borderRightWidth: 72, borderBottomWidth: 52, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#8cbadf' }, houseBody: { width: 126, height: 62, borderWidth: 3, borderColor: '#f0d18d', justifyContent: 'flex-end', alignItems: 'center' }, door: { width: 28, height: 40, borderWidth: 3, borderColor: '#f0d18d', marginBottom: -3 }, tree: { width: 104, height: 132, alignItems: 'center' }, treeTop: { width: 98, height: 76, borderRadius: 44, borderWidth: 3, borderColor: '#8cddb0' }, trunk: { width: 18, height: 54, borderWidth: 3, borderColor: '#f0d18d' }, boat: { width: 160, height: 132 }, sail: { position: 'absolute', left: 66, top: 4, width: 0, height: 0, borderRightWidth: 54, borderBottomWidth: 80, borderRightColor: 'transparent', borderBottomColor: '#8cbadf' }, mast: { position: 'absolute', left: 62, top: 4, height: 94, width: 4, backgroundColor: '#f0d18d' }, hull: { position: 'absolute', top: 94, width: 160, height: 26, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, borderWidth: 3, borderColor: '#f0d18d' }, handle: { width: 46, height: 30, borderWidth: 3, borderColor: '#8cbadf', borderRadius: 18, alignSelf: 'center' }, lantern: { width: 76, height: 90, borderWidth: 4, borderColor: '#8cbadf', justifyContent: 'center', alignItems: 'center' }, light: { width: 22, height: 40, borderRadius: 12, backgroundColor: '#f0d18d' }, rocketNose: { width: 0, height: 0, borderLeftWidth: 27, borderRightWidth: 27, borderBottomWidth: 38, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#8cbadf' }, rocket: { width: 54, height: 74, borderWidth: 3, borderColor: '#8cbadf', alignItems: 'center', justifyContent: 'center' }, porthole: { width: 23, height: 23, borderRadius: 12, borderWidth: 3, borderColor: '#f0d18d' }, flame: { width: 16, height: 20, backgroundColor: '#f0d18d', alignSelf: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  stage: { alignItems: 'center', backgroundColor: '#19232b', borderRadius: 14, padding: 18, marginVertical: 12 }, person: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#8cbadf' }, focusLine: { width: 3, height: 60, backgroundColor: '#f0d18d', marginVertical: 14 }, focus: { color: '#f0d18d', fontSize: 17, fontWeight: '800', textAlign: 'center' },
  symbolRow: { flexDirection: 'row', gap: 4, marginVertical: 8 }, symbolCard: { flex: 1, minHeight: 82, borderWidth: 1, borderColor: '#52616b', borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 3 }, match: { borderColor: '#8cddb0', borderWidth: 2 }, symbol: { minHeight: 34, alignItems: 'center', justifyContent: 'center' }, symbolName: { color: '#c6cfd5', fontSize: 10, textAlign: 'center', lineHeight: 15 }, circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#8cbadf' }, triangle: { width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 23, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#8cbadf' }, symbolBar: { width: 4, height: 23, backgroundColor: '#8cbadf' }, dots: { flexDirection: 'row', gap: 3 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8cbadf' }, wave: { color: '#8cbadf', fontSize: 35, lineHeight: 36 },
});
