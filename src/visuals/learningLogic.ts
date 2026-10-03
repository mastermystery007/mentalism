export const SHAPES = ['Circle', 'Triangle', 'Square'] as const;
export type ShapeChoice = typeof SHAPES[number];
export function forceStats(trials: readonly ShapeChoice[]) {
  const hits = trials.filter(choice => choice === 'Circle').length;
  return { hits, misses: trials.length - hits, total: trials.length, rate: trials.length ? Math.round(hits / trials.length * 100) : null };
}

export const PREDICTION_ROUTES = { Key: 'A', Coin: 'B', Stone: 'C' } as const;
export type PredictionChoice = keyof typeof PREDICTION_ROUTES;
export const SYMBOL_NAMES = ['Circle', 'Triangle', 'Twin bars', 'Three dots', 'Wave'] as const;
export function matchingPositions(row: readonly number[]) {
  return row.reduce<number[]>((matches, symbol, position) => symbol === position ? [...matches, position] : matches, []);
}
export function swapPositions(row: readonly number[], first: number, second: number) {
  const result = [...row];
  [result[first], result[second]] = [result[second], result[first]];
  return result;
}
export const EFFECT_ACTIONS = [
  { title: 'Introduce the prediction', essential: true },
  { title: 'Repeat the empty-hand display', essential: false },
  { title: 'Accept the participant’s choice', essential: true },
  { title: 'Inspect the envelope again', essential: false },
  { title: 'Explain the rules a second time', essential: false },
  { title: 'Reveal the matching prediction', essential: true },
];

export type Classification = { statement: string; answer: number; explanation: string };
export const OBSERVATION_CASES: Classification[] = [
  { statement: 'They paused for four seconds before answering.', answer: 0, explanation: 'The pause is observable. It does not tell you why the participant paused.' },
  { statement: 'Their pause proves that they are hiding something.', answer: 1, explanation: 'A motive is being inferred, and the claim of proof is unsupported. Memory search and distraction are alternatives.' },
  { statement: 'They looked at the blue object twice.', answer: 0, explanation: 'The direction and number of looks can be recorded. Preference remains a hypothesis.' },
  { statement: 'They must prefer the blue object.', answer: 1, explanation: 'Repeated looks have several possible explanations. Preference is an interpretation to test respectfully.' },
  { statement: 'They changed the word person to friend.', answer: 0, explanation: 'The spoken correction is a fact; its personal significance is still unknown.' },
  { statement: 'The word change means the friendship is troubled.', answer: 1, explanation: 'That adds a private story that was never observed. Ask a neutral question or leave the detail alone.' },
];
export const HYPNOSIS_CASES: Classification[] = [
  { statement: 'Responses can differ between people and suggestions.', answer: 0, explanation: 'Variation belongs in a careful working model. One response is not a rating of the person.' },
  { statement: 'A hypnotised participant must obey every instruction.', answer: 1, explanation: 'Guaranteed obedience is an overclaim. Participation and consent remain essential.' },
  { statement: 'Attention and imagination can help explain the activity.', answer: 0, explanation: 'These are useful educational ideas, while theories about hypnosis still differ.' },
  { statement: 'A vivid recalled image proves that the event happened.', answer: 1, explanation: 'Vividness is not proof of memory accuracy. Do not use a demonstration to establish a private event.' },
  { statement: 'A participant can decline or ask to stop.', answer: 0, explanation: 'Agency should remain visible throughout a voluntary demonstration. Act on a stop request immediately.' },
  { statement: 'No response means the participant is unintelligent.', answer: 1, explanation: 'A response is not a measure of intelligence or personal worth. Accept honest feedback without pressure.' },
];
