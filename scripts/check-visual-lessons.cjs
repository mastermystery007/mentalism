// Curriculum/media integrity and behavior checks, using existing dependencies only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function readModule(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports });
  return exports;
}
const courses = { mentalism: readModule('src/course.ts').lessons, magic: readModule('src/magic.ts').magicLessons, hypnosis: readModule('src/hypnosis.ts').hypnosisLessons };
const definitions = JSON.parse(fs.readFileSync(path.join(root, 'src/visuals/expanded-lessons.json'), 'utf8'));
const occupied = new Set(['mentalism:4', 'mentalism:8', 'mentalism:11', 'magic:6', 'hypnosis:2']);
const registry = fs.readFileSync(path.join(root, 'src/visuals/expandedAssets.ts'), 'utf8');
assert.equal(definitions.length, 10);
for (const lesson of definitions) {
  assert(['observation','forces','drawing','prediction','book','effect','attention','symbols','hypnosis-model','pretalk'].includes(lesson.kind), `Missing practice activity: ${lesson.kind}`);
  assert.equal(lesson.steps.length, 5, lesson.slug);
  for (const link of lesson.links) {
    assert(courses[link.track]?.some(item => item.id === link.id), `Missing written lesson: ${JSON.stringify(link)}`);
    const key = `${link.track}:${link.id}`;
    assert(!occupied.has(key), `Duplicate visual mapping: ${key}`); occupied.add(key);
  }
  for (const [index, step] of lesson.steps.entries()) {
    for (const field of ['title', 'caption', 'coach', 'alt']) assert(step[field]?.trim(), `${lesson.slug}: missing ${field}`);
    const asset = `${lesson.slug}-${index + 1}.png`;
    assert(registry.includes(asset), `Missing static Metro require: ${asset}`);
    const png = fs.readFileSync(path.join(root, 'assets/lesson-media', asset));
    assert.equal(png.readUInt32BE(16), 960); assert.equal(png.readUInt32BE(20), 720);
  }
  const video = fs.readFileSync(path.join(root, 'assets/lesson-media', `${lesson.slug}.mp4`));
  assert(video.length > 10000 && video.subarray(4, 8).toString() === 'ftyp', `Invalid MP4: ${lesson.slug}`);
}
assert.equal(occupied.size, 18);
const logic = readModule('src/visuals/learningLogic.ts');
assert.equal(logic.forceStats([]).rate, null, 'An empty batch must not claim 0% success.');
const choices = [...Array(12).fill('Circle'), ...Array(8).fill('Triangle')];
const stats = logic.forceStats(choices);
assert.equal(stats.hits, 12); assert.equal(stats.misses, 8); assert.equal(stats.rate, 60);
assert.equal(logic.forceStats(['Triangle', 'Square']).hits, 0, 'Non-target choices must not become near-hit successes.');
assert.equal(new Set(Object.values(logic.PREDICTION_ROUTES)).size, 3, 'Every choice needs its own fixed route.');
function permutations(items) { return items.length ? items.flatMap((item, i) => permutations(items.filter((_, j) => i !== j)).map(rest => [item, ...rest])) : [[]]; }
for (const row of permutations([0, 1, 2, 3, 4])) {
  const matches = logic.matchingPositions(row);
  assert.equal(matches.length, row.filter((id, position) => id === position).length);
  for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) {
    const original = [...row];
    const swapped = logic.swapPositions(row, a, b);
    assert.equal(new Set(swapped).size, 5, 'Swapping must preserve five unique symbols.');
    assert.equal(swapped[a], row[b]); assert.equal(swapped[b], row[a]);
    assert.deepEqual(row, original, 'Swapping must not mutate the source arrangement.');
  }
}
assert.equal(logic.EFFECT_ACTIONS.filter(action => action.essential).length, 3);
for (const cases of [logic.OBSERVATION_CASES, logic.HYPNOSIS_CASES]) {
  assert.equal(cases.length, 6); assert(cases.some(item => item.answer === 0) && cases.some(item => item.answer === 1));
  for (const item of cases) assert(item.explanation.length > 30 && [0, 1].includes(item.answer));
}
console.log('Passed: 18 lesson mappings, 50 new PNGs, 10 MP4s, force accounting, prediction routes and 120 symbol arrangements.');
