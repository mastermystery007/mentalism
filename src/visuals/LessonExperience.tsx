import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import ConsentLab from './ConsentLab';
import EquivoqueLab from './EquivoqueLab';
import EquivoqueWalkthrough from './EquivoqueWalkthrough';
import MemoryPalace from './MemoryPalace';
import OneAheadLab from './OneAheadLab';

type Illustration = { source: number; title: string; alt: string };
type Clip = { source: number; title: string; transcript: string[]; chapters?: { title: string; seconds: number }[] };
type Experience = {
  title: string;
  description: string;
  Widget: React.ComponentType;
  image: number;
  video: number;
  alt: string;
  transcript: string[];
  illustrations?: Illustration[];
  clips?: Clip[];
};

const equivoque: Experience = {
  title: 'Set up and rehearse Equivoque',
  description: 'Follow six coaching frames, inspect the setup, then practise every choice branch.',
  Widget: EquivoqueInstruction,
  image: require('../../assets/lesson-media/equivoque.png'),
  video: require('../../assets/lesson-media/equivoque.mp4'),
  alt: 'Choice diagram for Key, Coin and Stone. A selected pair containing Coin is retained; a pair without Coin is discarded. From a retained pair, Coin is kept or its partner is discarded.',
  transcript: ['The target is Coin. Invite a choice of two objects.', 'If the pair includes Coin, keep that pair. If it does not, discard the pair and finish with Coin.', 'With two objects remaining, invite a choice of one. Keep Coin if selected; otherwise discard the selected other object.', 'Both routes end at Coin because the performer changes the meaning of the action. This illustrates controlled wording, not a free outcome.'],
  illustrations: [
    { source: require('../../assets/lesson-media/equivoque-setup-1.png'), title: '1 · Setup', alt: 'Participant sits opposite the performer. From the performer viewpoint, Key is left, Coin is centre and Stone is right. A clear parking area sits to the right, outside the playing area.' },
    { source: require('../../assets/lesson-media/equivoque-setup-2.png'), title: '2 · First touch', alt: 'The performer has selected Coin as the target for this rehearsal. Ask the participant to touch two objects. The target highlight is a teaching annotation.' },
    { source: require('../../assets/lesson-media/equivoque-setup-3.png'), title: '3 · Keep the pair', alt: 'In this example the participant touches Key and Coin. Keep them in play and move the untouched Stone to the parking area.' },
    { source: require('../../assets/lesson-media/equivoque-setup-4.png'), title: '4 · Final choice', alt: 'The participant chooses Key from the remaining pair. Move Key to the parking area beside Stone, leaving Coin alone in play.' },
    { source: require('../../assets/lesson-media/equivoque-setup-5.png'), title: '5 · Alternate replay', alt: 'Reset all three objects first. In this alternate first choice the participant touches Key and Stone. Set both aside, leaving Coin alone immediately; no second choice is needed.' },
    { source: require('../../assets/lesson-media/equivoque-setup-6.png'), title: '6 · Rehearse', alt: 'Five terminal paths: choose Key and Coin, then either of those; choose Coin and Stone, then either of those; or choose Key and Stone, leaving Coin immediately.' },
    { source: require('../../assets/lesson-media/equivoque.png'), title: 'Branch map', alt: 'A pair containing Coin is kept; a pair without Coin is removed. From a retained pair, keep Coin if selected or remove the selected other object.' },
  ],
  clips: [
    { source: require('../../assets/lesson-media/equivoque-walkthrough.mp4'), title: 'Setup walkthrough', chapters: [{ title: 'Setup', seconds: 0 }, { title: 'Target', seconds: 6 }, { title: 'Keep pair', seconds: 12 }, { title: 'Final choice', seconds: 18 }, { title: 'Alternate', seconds: 24 }, { title: 'Rehearse', seconds: 30 }], transcript: [
      'Set the table: Key left, Coin centre, Stone right, from the performer viewpoint. Keep a clear right-side area for objects set aside. The participant sits opposite you.',
      'Choose Coin as your target before speaking. Ask: Touch two objects. Pause for the participant to choose.',
      'Example: Key and Coin are touched. Say: We will work with those two. Set the other object aside. Move only Stone to the parking area.',
      'Ask: Slide one object toward me. If Key is chosen, say: Set that one aside. We will keep the object that remains. Park Key; Coin remains alone.',
      'Alternate first choice: reset all three objects. If Key and Stone are touched, say: Set those two aside. Let us focus on the object that remains. Park both. Coin remains; finish immediately.',
      'Rehearse all three first pairs and both second choices where a pair remains. The five terminal paths all end at Coin. Clarify confusing instructions and accept a refusal.',
    ] },
    { source: require('../../assets/lesson-media/equivoque.mp4'), title: 'Choice logic', transcript: ['Choose two of Key, Coin and Stone. Coin is the target.', 'Keep a pair containing Coin, or discard a pair without Coin.', 'When a pair remains, keep Coin if it is selected; otherwise discard the selected other object.', 'The performer interprets each selection according to a rehearsed branch.'] },
  ],
};
const oneAhead: Experience = {
  title: 'See the information move',
  description: 'Step through audience and performer views of the same sequence.',
  Widget: OneAheadLab,
  image: require('../../assets/lesson-media/one-ahead.png'),
  video: require('../../assets/lesson-media/one-ahead.mp4'),
  alt: 'Two information lanes. The performer begins knowing A, reveals A while learning B, reveals B while learning C, then reveals C and closes the routine.',
  transcript: ['Before the sequence, A is already known. B and C are unknown.', 'Reveal A while the routine creates access to B. The audience sees A; the performer knows A and B.', 'Reveal B while acquiring C. The audience has seen A and B; the performer now knows all three.', 'Reveal C without acquiring another item, then close the chain with a planned clean ending.', 'This is a conceptual information map. It does not demonstrate a particular physical acquisition method.'],
};
const memory: Experience = {
  title: 'Build a five-stop memory route',
  description: 'Place words in a room, imagine each scene, then hide the words and test your recall.',
  Widget: MemoryPalace,
  image: require('../../assets/lesson-media/memory-palace.png'),
  video: require('../../assets/lesson-media/memory-palace.mp4'),
  alt: 'A room route from Door to Sofa, Lamp, Desk and Window. Example associations are Umbrella, Tiger, Orange, Drum and Cloud in that order.',
  transcript: ['Choose five distinct locations in a stable order: Door, Sofa, Lamp, Desk, Window.', 'Place one vivid image at each location. This example uses Umbrella, Tiger, Orange, Drum and Cloud.', 'Make each image interact with its location rather than merely naming the word.', 'Walk the route in order, then hide the words and retrieve the image at each stop.', 'The illustration is one example. Your choices in the exercise can create a different arrangement.'],
};
const consent: Experience = {
  title: 'Practise the next safe decision',
  description: 'Explore fictional situations involving consent, filming, discomfort and debriefing.',
  Widget: ConsentLab,
  image: require('../../assets/lesson-media/consent.png'),
  video: require('../../assets/lesson-media/consent.mp4'),
  alt: 'Process diagram: explain the activity, ask for specific consent, agree a stop signal and check the setting. Discomfort leads immediately to stopping, cancelling temporary suggestions, reorienting and debriefing.',
  transcript: ['Explain the activity and ask for specific, voluntary consent.', 'Agree a stop signal and check the seat and surroundings before proceeding.', 'Consent to one activity does not automatically cover filming or a different exercise.', 'If the participant asks to stop or becomes uncomfortable, stop immediately.', 'Cancel temporary suggestions, restore ordinary orientation and ask how the participant feels. This is educational decision practice, not clinical screening.'],
};

const EXPERIENCES: Record<string, Experience> = {
  'mentalism:4': equivoque,
  'mentalism:8': oneAhead,
  'mentalism:11': memory,
  'magic:6': oneAhead,
  'hypnosis:2': consent,
};

export const hasLessonExperience = (track: string, id: number) => Boolean(EXPERIENCES[`${track}:${id}`]);

export default function LessonExperience({ track, lessonId }: { track: string; lessonId: number }) {
  const experience = EXPERIENCES[`${track}:${lessonId}`];
  const [tab, setTab] = useState<'Explore' | 'Image' | 'Video'>('Explore');
  const [expandedImage, setExpandedImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { width } = useWindowDimensions();
  if (!experience) return null;
  const Widget = experience.Widget;
  const illustrations = experience.illustrations ?? [{ source: experience.image, title: 'Illustration', alt: experience.alt }];
  const currentImage = illustrations[imageIndex];
  return <View style={styles.card}>
    <Text style={styles.eyebrow}>VISUAL LESSON · AVAILABLE OFFLINE</Text>
    <Text style={styles.title}>{experience.title}</Text>
    <Text style={styles.body}>{experience.description}</Text>
    <View style={styles.tabs}>
      {(['Explore', 'Image', 'Video'] as const).map((label) => <TouchableOpacity key={label} accessibilityRole="tab" accessibilityState={{ selected: tab === label }} accessibilityLabel={`${label} for ${experience.title}`} style={[styles.tab, tab === label && styles.selectedTab]} onPress={() => { Keyboard.dismiss(); setTab(label); }}><Text style={[styles.tabText, tab === label && styles.selectedTabText]}>{label}</Text></TouchableOpacity>)}
    </View>
    <View style={tab !== 'Explore' && styles.hidden} accessibilityElementsHidden={tab !== 'Explore'} importantForAccessibility={tab !== 'Explore' ? 'no-hide-descendants' : 'auto'}><Widget /></View>
    {tab === 'Image' && <View>
      {illustrations.length > 1 && <>
        <Text style={styles.caption}>Performer coaching view · choose a frame below</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery} contentContainerStyle={styles.galleryContent}>
          {illustrations.map((illustration, i) => <TouchableOpacity key={illustration.title} accessibilityRole="button" accessibilityLabel={`Show illustration ${illustration.title}`} accessibilityState={{ selected: imageIndex === i }} style={[styles.thumbnail, imageIndex === i && styles.activeThumbnail]} onPress={() => setImageIndex(i)}><Image source={illustration.source} style={styles.thumbnailImage} resizeMode="contain" /><Text style={styles.thumbnailText}>{illustration.title}</Text></TouchableOpacity>)}
        </ScrollView>
      </>}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open illustration at a larger size" onPress={() => setExpandedImage(true)}>
        <Image source={currentImage.source} style={styles.image} resizeMode="contain" accessible accessibilityLabel={currentImage.alt} />
        <Text style={styles.imageHint}>Tap to enlarge · scroll to inspect</Text>
      </TouchableOpacity>
      <Text style={styles.body}>{currentImage.alt}</Text>
    </View>}
    {tab === 'Video' && <VideoLibrary experience={experience} />}
    <Modal visible={expandedImage} animationType="fade" onRequestClose={() => setExpandedImage(false)}>
      <SafeAreaView style={styles.modal}>
        <TouchableOpacity accessibilityRole="button" style={styles.close} onPress={() => setExpandedImage(false)}><Text style={styles.tabText}>‹ Close illustration</Text></TouchableOpacity>
        <Text style={styles.modalHint}>Scroll across and down to inspect the diagram.</Text>
        <ScrollView style={{ flex: 1 }}>
          <ScrollView horizontal><Image accessible accessibilityLabel={currentImage.alt} source={currentImage.source} resizeMode="contain" style={{ width: Math.max(width, 800), height: Math.max(width, 800) * (Image.resolveAssetSource(currentImage.source).height / Image.resolveAssetSource(currentImage.source).width) }} /></ScrollView>
          <Text style={[styles.body, { padding: 20, maxWidth: width }]}>{currentImage.alt}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  </View>;
}

function EquivoqueInstruction() {
  const [mode, setMode] = useState<'setup' | 'practice'>('setup');
  return <View>
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show setup walkthrough" accessibilityState={{ selected: mode === 'setup' }} style={[styles.control, mode === 'setup' && styles.selectedTab]} onPress={() => setMode('setup')}><Text style={mode === 'setup' ? styles.selectedTabText : styles.tabText}>Setup walkthrough</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show Choice practice" accessibilityState={{ selected: mode === 'practice' }} style={[styles.control, mode === 'practice' && styles.selectedTab]} onPress={() => setMode('practice')}><Text style={mode === 'practice' ? styles.selectedTabText : styles.tabText}>Choice practice</Text></TouchableOpacity>
    </View>
    <View style={[styles.modeContent, mode !== 'setup' && styles.hidden]} accessibilityElementsHidden={mode !== 'setup'} importantForAccessibility={mode !== 'setup' ? 'no-hide-descendants' : 'auto'}><EquivoqueWalkthrough /></View>
    <View style={[styles.modeContent, mode !== 'practice' && styles.hidden]} accessibilityElementsHidden={mode !== 'practice'} importantForAccessibility={mode !== 'practice' ? 'no-hide-descendants' : 'auto'}><EquivoqueLab /></View>
  </View>;
}

function VideoLibrary({ experience }: { experience: Experience }) {
  const [clipIndex, setClipIndex] = useState(0);
  const clips = experience.clips ?? [{ source: experience.video, title: experience.title, transcript: experience.transcript }];
  return <View>
    {clips.length > 1 && <View style={styles.controls}>{clips.map((clip, i) => <TouchableOpacity key={clip.title} accessibilityRole="button" accessibilityLabel={`Watch ${clip.title}`} accessibilityState={{ selected: clipIndex === i }} style={[styles.control, clipIndex === i && styles.selectedTab]} onPress={() => setClipIndex(i)}><Text style={clipIndex === i ? styles.selectedTabText : styles.tabText}>{clip.title}</Text></TouchableOpacity>)}</View>}
    <LessonVideo key={clips[clipIndex].source} clip={clips[clipIndex]} />
  </View>;
}

function LessonVideo({ clip }: { clip: Clip }) {
  const player = useVideoPlayer(clip.source, (instance) => {
    instance.loop = false;
    instance.muted = true;
    instance.staysActiveInBackground = false;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const { playbackRate } = useEvent(player, 'playbackRateChange', { playbackRate: player.playbackRate });
  const slowPlayback = playbackRate === 0.5;
  // Android reports a successfully finished clip as idle; its loaded duration remains available.
  const canControl = status === 'readyToPlay' || (status === 'idle' && player.duration > 0);
  return <View>
    <Text style={styles.caption}>Original captioned animation · silent · tap Play when ready</Text>
    <VideoView player={player} style={styles.video} contentFit="contain" nativeControls allowsFullscreen accessibilityLabel={`Animated explanation: ${clip.title}`} />
    {status === 'loading' && <ActivityIndicator color="#f0d18d" accessibilityLabel="Loading offline video" style={styles.loading} />}
    {status === 'error' && <Text accessibilityLiveRegion="polite" style={styles.error}>The video could not load. Use the illustration or transcript below.</Text>}
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" disabled={!canControl} accessibilityState={{ disabled: !canControl }} style={[styles.control, styles.playButton, !canControl && styles.disabled]} onPress={() => { if (isPlaying) player.pause(); else { if (player.currentTime >= player.duration - 0.25) player.currentTime = 0; player.play(); } }}><Text style={styles.selectedTabText}>{isPlaying ? 'Pause' : 'Play animation'}</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" disabled={!canControl} accessibilityState={{ disabled: !canControl }} style={styles.control} onPress={() => { player.currentTime = 0; player.pause(); }}><Text style={styles.tabText}>Restart</Text></TouchableOpacity>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={slowPlayback ? 'Use normal video speed' : 'Use half-speed video playback'} accessibilityState={{ selected: slowPlayback, disabled: !canControl }} disabled={!canControl} style={styles.transcriptToggle} onPress={() => { player.playbackRate = slowPlayback ? 1 : 0.5; }}><Text style={styles.tabText}>Speed: {playbackRate}× · {playbackRate < 1 ? 'slow motion' : playbackRate === 1 ? 'normal' : 'faster'} · tap to change</Text></TouchableOpacity>
    {clip.chapters && <View style={styles.chapters}>{clip.chapters.map((chapter, i) => <TouchableOpacity key={chapter.title} accessibilityRole="button" accessibilityLabel={`Jump to video step ${i + 1}: ${chapter.title}`} accessibilityState={{ disabled: !canControl }} disabled={!canControl} style={styles.chapter} onPress={() => { player.pause(); player.currentTime = chapter.seconds; }}><Text style={styles.tabText}>{i + 1} · {chapter.title}</Text></TouchableOpacity>)}</View>}
    <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: transcriptOpen }} style={styles.transcriptToggle} onPress={() => setTranscriptOpen(!transcriptOpen)}><Text style={styles.tabText}>{transcriptOpen ? 'Hide' : 'Read'} animation transcript {transcriptOpen ? '−' : '+'}</Text></TouchableOpacity>
    {transcriptOpen && clip.transcript.map((line, i) => <Text key={line} style={styles.transcript}>{i + 1}. {line}</Text>)}
  </View>;
}

const styles = StyleSheet.create({
  chapters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }, chapter: { minHeight: 48, padding: 12, borderWidth: 1, borderColor: '#44505a', borderRadius: 10, justifyContent: 'center' },
  modeContent: { marginTop: 14 }, gallery: { height: 140, flexGrow: 0, marginBottom: 14 }, galleryContent: { alignItems: 'flex-start' }, thumbnail: { width: 112, minHeight: 128, padding: 7, marginRight: 8, borderWidth: 1, borderColor: '#44505a', borderRadius: 10 }, activeThumbnail: { borderColor: '#f0d18d', backgroundColor: '#282418' }, thumbnailImage: { width: 96, height: 72 }, thumbnailText: { color: '#e2e5e8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  card: { backgroundColor: '#101419', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#675432', marginTop: 20, marginBottom: 5 }, eyebrow: { color: '#f0d18d', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: '#fff', fontWeight: '800', fontSize: 23, lineHeight: 30, marginTop: 9, marginBottom: 8 }, body: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, marginBottom: 10 }, tabs: { flexDirection: 'row', gap: 8, marginVertical: 12 }, tab: { flex: 1, minHeight: 48, padding: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#44505a', borderRadius: 12 }, selectedTab: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, tabText: { color: '#e2e5e8', fontWeight: '700', fontSize: 14 }, selectedTabText: { color: '#101419', fontWeight: '800', fontSize: 14 }, hidden: { display: 'none' }, image: { width: '100%', height: undefined, aspectRatio: 4 / 3, backgroundColor: '#101419', borderRadius: 12 }, imageHint: { color: '#f0d18d', textAlign: 'center', padding: 12, fontSize: 13 }, caption: { color: '#aeb9c3', fontSize: 13, lineHeight: 20, marginBottom: 10 }, video: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#080b0f', borderRadius: 10 }, controls: { flexDirection: 'row', gap: 10, marginTop: 12 }, control: { flex: 1, minHeight: 48, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderColor: '#44505a', borderWidth: 1 }, playButton: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, disabled: { opacity: 0.4 }, loading: { padding: 12 }, error: { color: '#e0a5a5', lineHeight: 22, marginTop: 10 }, transcriptToggle: { minHeight: 48, justifyContent: 'center', marginTop: 8 }, transcript: { color: '#c6c9cd', lineHeight: 22, fontSize: 14, marginBottom: 10 }, modal: { flex: 1, backgroundColor: '#101419' }, close: { minHeight: 52, justifyContent: 'center', paddingHorizontal: 20 }, modalHint: { color: '#aeb9c3', padding: 20, paddingTop: 0 },
});
