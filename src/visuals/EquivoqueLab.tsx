import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type EquivoqueObject = 'Key' | 'Coin' | 'Stone';
const OBJECTS: EquivoqueObject[] = ['Key', 'Coin', 'Stone'];
const TARGET: EquivoqueObject = 'Coin';

export type PairBranch = {
  selected: EquivoqueObject[];
  remaining: EquivoqueObject[];
  removed: EquivoqueObject[];
  action: 'keep-pair' | 'discard-pair';
  wording: string;
  explanation: string;
};

export type FinalBranch = {
  selected: EquivoqueObject;
  remaining: EquivoqueObject[];
  removed: EquivoqueObject[];
  action: 'keep-one' | 'discard-one';
  wording: string;
  explanation: string;
};

function isKnownObject(item: EquivoqueObject) {
  return OBJECTS.includes(item);
}

export function resolveEquivoquePair(pair: readonly EquivoqueObject[]): PairBranch {
  if (pair.length !== 2 || new Set(pair).size !== 2 || !pair.every(isKnownObject)) {
    throw new Error('Choose two different objects from Key, Coin and Stone.');
  }
  const selected = OBJECTS.filter((item) => pair.includes(item));
  const keepPair = selected.includes(TARGET);
  const remaining = OBJECTS.filter((item) => keepPair === selected.includes(item));
  return {
    selected,
    remaining,
    removed: OBJECTS.filter((item) => !remaining.includes(item)),
    action: keepPair ? 'keep-pair' : 'discard-pair',
    wording: keepPair
      ? 'We will work with those two. Set the other object aside.'
      : 'Set those two aside. Let us focus on the object that remains.',
    explanation: keepPair
      ? 'The touched pair contains the Coin, so the performer keeps the pair.'
      : 'The touched pair leaves the Coin outside it, so the performer removes the pair.',
  };
}

export function resolveEquivoqueFinal(
  remaining: readonly EquivoqueObject[],
  selected: EquivoqueObject,
): FinalBranch {
  if (
    remaining.length !== 2 ||
    new Set(remaining).size !== 2 ||
    !remaining.every(isKnownObject) ||
    !remaining.includes(TARGET) ||
    !remaining.includes(selected)
  ) {
    throw new Error('Choose one of the two remaining objects, including the target Coin.');
  }
  const keepSelected = selected === TARGET;
  return {
    selected,
    remaining: [TARGET],
    removed: remaining.filter((item) => item !== TARGET),
    action: keepSelected ? 'keep-one' : 'discard-one',
    wording: keepSelected
      ? 'We will keep this one. Set the other object aside.'
      : 'Set that one aside. We will keep the object that remains.',
    explanation: keepSelected
      ? 'The spectator selects the Coin, so the performer keeps the selected object.'
      : 'The spectator selects the other object, so the performer removes that object.',
  };
}

function ObjectToken({ item }: { item: EquivoqueObject }) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.token, item === 'Coin' ? styles.coin : item === 'Stone' ? styles.stone : styles.key]}
    >
      <Text style={styles.tokenLetter}>{item.slice(0, 1)}</Text>
    </View>
  );
}

function ObjectScene({ items, caption }: { items: EquivoqueObject[]; caption: string }) {
  return (
    <View style={styles.scene}>
      <Text style={styles.sceneCaption}>{caption}</Text>
      <View style={styles.objects}>
        {items.map((item) => (
          <View key={item} style={styles.sceneObject}>
            <ObjectToken item={item} />
            <Text style={styles.objectName}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BranchNote({
  step,
  spectator,
  wording,
  explanation,
  removed,
}: {
  step: number;
  spectator: string;
  wording: string;
  explanation: string;
  removed: EquivoqueObject[];
}) {
  return (
    <View style={styles.branchNote}>
      <Text style={styles.stepLabel}>DECISION {step}</Text>
      <Text style={styles.role}>Spectator action</Text>
      <Text style={styles.body}>{spectator}</Text>
      <Text style={styles.role}>Performer wording</Text>
      <Text style={styles.wording}>“{wording}”</Text>
      <Text style={styles.explanation}>{explanation}</Text>
      <Text style={styles.removed}>Set aside: {removed.join(' + ')}</Text>
    </View>
  );
}

export default function EquivoqueLab() {
  const [pair, setPair] = useState<EquivoqueObject[]>([]);
  const [firstBranch, setFirstBranch] = useState<PairBranch | null>(null);
  const [finalBranch, setFinalBranch] = useState<FinalBranch | null>(null);
  const complete = firstBranch !== null && (firstBranch.remaining.length === 1 || finalBranch !== null);

  const toggleObject = (item: EquivoqueObject) => {
    setPair((current) => current.includes(item)
      ? current.filter((value) => value !== item)
      : current.length < 2 ? [...current, item] : current);
  };

  const reset = () => {
    setPair([]);
    setFirstBranch(null);
    setFinalBranch(null);
  };

  return (
    <View style={styles.lab}>
      <Text style={styles.heading}>Explore the decision tree</Text>
      <Text style={styles.body}>Play the spectator, then see how each choice is interpreted. The performer has chosen the Coin as the target.</Text>
      <View style={styles.targetBadge}><Text style={styles.targetText}>PREDETERMINED TARGET · COIN</Text></View>

      <Text style={styles.progress} accessibilityLiveRegion="polite">
        {complete ? 'Branch complete' : firstBranch ? 'Decision 2 · Choose one remaining object' : `Decision 1 · Select two objects (${pair.length}/2)`}
      </Text>

      {!firstBranch && (
        <View style={styles.controlPanel}>
          <Text style={styles.prompt}>“Touch two objects.”</Text>
          <View style={styles.objects}>
            {OBJECTS.map((item) => {
              const selected = pair.includes(item);
              const disabled = pair.length === 2 && !selected;
              return (
                <TouchableOpacity
                  key={item}
                  accessibilityRole="button"
                  accessibilityLabel={`${item}${item === TARGET ? ', target object' : ''}`}
                  accessibilityHint={selected ? 'Remove this object from the selected pair.' : 'Add this object to the selected pair.'}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => toggleObject(item)}
                  style={[styles.objectButton, selected && styles.objectSelected, disabled && styles.disabled]}
                >
                  <ObjectToken item={item} />
                  <Text style={styles.objectName}>{item}</Text>
                  <Text style={styles.selection}>{selected ? 'Selected ✓' : 'Tap to select'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.hint}>Tap a selected object to change the pair.</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: pair.length !== 2 }}
            disabled={pair.length !== 2}
            onPress={() => setFirstBranch(resolveEquivoquePair(pair))}
            style={[styles.actionButton, pair.length !== 2 && styles.disabled]}
          >
            <Text style={styles.actionText}>See the performer’s response</Text>
          </TouchableOpacity>
        </View>
      )}

      {firstBranch && !complete && (
        <View style={styles.controlPanel}>
          <Text style={styles.prompt}>“Slide one object toward me.”</Text>
          <View style={styles.objects}>
            {firstBranch.remaining.map((item) => (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${item} for the second decision`}
                onPress={() => setFinalBranch(resolveEquivoqueFinal(firstBranch.remaining, item))}
                style={styles.objectButton}
              >
                <ObjectToken item={item} />
                <Text style={styles.objectName}>{item}</Text>
                <Text style={styles.selection}>Choose this one</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Try either object and compare the response.</Text>
        </View>
      )}

      {firstBranch && (
        <View style={styles.path}>
          <Text style={styles.pathTitle}>Your branch, step by step</Text>
          <ObjectScene items={OBJECTS} caption="Start · Three objects" />
          <Text style={styles.arrow} accessible={false}>↓</Text>
          <BranchNote
            step={1}
            spectator={`Touches ${firstBranch.selected.join(' + ')}.`}
            wording={firstBranch.wording}
            explanation={firstBranch.explanation}
            removed={firstBranch.removed}
          />
          <Text style={styles.arrow} accessible={false}>↓</Text>
          <ObjectScene items={firstBranch.remaining} caption={firstBranch.remaining.length === 1 ? 'One object remains' : 'Two objects remain'} />
          {finalBranch && (
            <>
              <Text style={styles.arrow} accessible={false}>↓</Text>
              <BranchNote
                step={2}
                spectator={`Slides ${finalBranch.selected} toward the performer.`}
                wording={finalBranch.wording}
                explanation={finalBranch.explanation}
                removed={finalBranch.removed}
              />
              <Text style={styles.arrow} accessible={false}>↓</Text>
              <ObjectScene items={finalBranch.remaining} caption="One object remains" />
            </>
          )}
        </View>
      )}

      {complete && (
        <View style={styles.result} accessibilityLiveRegion="polite">
          <Text style={styles.resultTitle}>Result · Coin</Text>
          <Text style={styles.body}>{finalBranch ? 'Both second choices lead to the Coin.' : 'The first choice leaves the Coin alone, so no second decision is needed.'} The wording determines whether the selected objects are kept or removed.</Text>
          <Text style={styles.hint}>Replay with a different pair to explore all five possible paths.</Text>
        </View>
      )}

      {firstBranch && (
        <TouchableOpacity accessibilityRole="button" onPress={reset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset and try another branch</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.boundary}>Teaching model: the branching is shown openly. Use only for entertainment; clarify instructions when a participant asks.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lab: { backgroundColor: '#101419', borderColor: '#34404b', borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  heading: { color: '#f0d18d', fontSize: 20, fontWeight: '800' },
  body: { color: '#c6c9cd', fontSize: 15, lineHeight: 23 },
  targetBadge: { alignSelf: 'flex-start', backgroundColor: '#282418', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  targetText: { color: '#f0d18d', fontSize: 12, fontWeight: '800' },
  progress: { color: '#8cddb0', fontSize: 14, fontWeight: '700' },
  controlPanel: { backgroundColor: '#18212b', borderRadius: 12, padding: 12, gap: 12 },
  prompt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  objects: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  objectButton: { flexBasis: 80, flexGrow: 1, minHeight: 112, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#46535f', backgroundColor: '#101419' },
  objectSelected: { borderColor: '#f0d18d', backgroundColor: '#282418' },
  disabled: { opacity: 0.45 },
  token: { width: 44, height: 44, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: '#c6c9cd', backgroundColor: '#25323e' },
  coin: { borderRadius: 22, borderColor: '#f0d18d', backgroundColor: '#3b301c' },
  key: { borderRadius: 8 },
  stone: { borderRadius: 15, borderColor: '#92a8bc' },
  tokenLetter: { color: '#fff', fontSize: 18, fontWeight: '800' },
  objectName: { color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  selection: { color: '#f0d18d', fontSize: 12, textAlign: 'center' },
  hint: { color: '#c6c9cd', fontSize: 13, lineHeight: 20 },
  actionButton: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0d18d', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12 },
  actionText: { color: '#101419', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  path: { gap: 8 },
  pathTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  scene: { backgroundColor: '#18212b', borderRadius: 12, padding: 12, gap: 12 },
  sceneCaption: { color: '#c6c9cd', fontSize: 13, textAlign: 'center' },
  sceneObject: { flexBasis: 64, flexGrow: 1, alignItems: 'center', gap: 6 },
  arrow: { color: '#f0d18d', fontSize: 24, textAlign: 'center' },
  branchNote: { borderColor: '#46535f', borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 },
  stepLabel: { color: '#f0d18d', fontSize: 12, fontWeight: '800', marginBottom: 2 },
  role: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 4 },
  wording: { color: '#f0d18d', fontSize: 15, lineHeight: 23 },
  explanation: { color: '#8cddb0', fontSize: 14, lineHeight: 21, marginTop: 4 },
  removed: { color: '#a7adb5', fontSize: 13, lineHeight: 20 },
  result: { backgroundColor: '#172b24', borderColor: '#3a6c53', borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  resultTitle: { color: '#8cddb0', fontSize: 18, fontWeight: '800' },
  resetButton: { minHeight: 48, borderColor: '#f0d18d', borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center', justifyContent: 'center' },
  resetText: { color: '#f0d18d', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  boundary: { color: '#a7adb5', fontSize: 12, lineHeight: 19 },
});
