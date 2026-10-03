import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import ConsentLab from './ConsentLab';
import EquivoqueLab from './EquivoqueLab';
import MemoryPalace from './MemoryPalace';
import OneAheadLab from './OneAheadLab';

type Experience = {
  title: string;
  description: string;
  Widget: React.ComponentType;
  image: number;
  video: number;
  alt: string;
  transcript: string[];
};

const equivoque: Experience = {
  title: 'Follow the choice branches',
  description: 'Choose objects and watch how the wording changes while the target stays fixed.',
  Widget: EquivoqueLab,
  image: require('../../assets/lesson-media/equivoque.png'),
  video: require('../../assets/lesson-media/equivoque.mp4'),
  alt: 'Choice diagram for Key, Coin and Stone. A selected pair containing Coin is retained; a pair without Coin is discarded. From a retained pair, Coin is kept or its partner is discarded.',
  transcript: ['The target is Coin. Invite a choice of two objects.', 'If the pair includes Coin, keep that pair. If it does not, discard the pair and finish with Coin.', 'With two objects remaining, invite a choice of one. Keep Coin if selected; otherwise discard the selected other object.', 'Both routes end at Coin because the performer changes the meaning of the action. This illustrates controlled wording, not a free outcome.'],
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
  const { width } = useWindowDimensions();
  if (!experience) return null;
  const Widget = experience.Widget;
  return <View style={styles.card}>
    <Text style={styles.eyebrow}>VISUAL LESSON · AVAILABLE OFFLINE</Text>
    <Text style={styles.title}>{experience.title}</Text>
    <Text style={styles.body}>{experience.description}</Text>
    <View style={styles.tabs}>
      {(['Explore', 'Image', 'Video'] as const).map((label) => <TouchableOpacity key={label} accessibilityRole="tab" accessibilityState={{ selected: tab === label }} accessibilityLabel={`${label} for ${experience.title}`} style={[styles.tab, tab === label && styles.selectedTab]} onPress={() => { Keyboard.dismiss(); setTab(label); }}><Text style={[styles.tabText, tab === label && styles.selectedTabText]}>{label}</Text></TouchableOpacity>)}
    </View>
    <View style={tab !== 'Explore' && styles.hidden} accessibilityElementsHidden={tab !== 'Explore'} importantForAccessibility={tab !== 'Explore' ? 'no-hide-descendants' : 'auto'}><Widget /></View>
    {tab === 'Image' && <View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open illustration at a larger size" onPress={() => setExpandedImage(true)}>
        <Image source={experience.image} style={styles.image} resizeMode="contain" accessible accessibilityLabel={experience.alt} />
        <Text style={styles.imageHint}>Tap to enlarge · scroll to inspect</Text>
      </TouchableOpacity>
      <Text style={styles.body}>{experience.alt}</Text>
    </View>}
    {tab === 'Video' && <LessonVideo experience={experience} />}
    <Modal visible={expandedImage} animationType="fade" onRequestClose={() => setExpandedImage(false)}>
      <SafeAreaView style={styles.modal}>
        <TouchableOpacity accessibilityRole="button" style={styles.close} onPress={() => setExpandedImage(false)}><Text style={styles.tabText}>‹ Close illustration</Text></TouchableOpacity>
        <Text style={styles.modalHint}>Scroll across and down to inspect the diagram.</Text>
        <ScrollView style={{ flex: 1 }}>
          <ScrollView horizontal><Image accessible accessibilityLabel={experience.alt} source={experience.image} resizeMode="contain" style={{ width: Math.max(width, 800), height: Math.max(width, 800) * (Image.resolveAssetSource(experience.image).height / Image.resolveAssetSource(experience.image).width) }} /></ScrollView>
          <Text style={[styles.body, { padding: 20, maxWidth: width }]}>{experience.alt}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  </View>;
}

function LessonVideo({ experience }: { experience: Experience }) {
  const player = useVideoPlayer(experience.video, (instance) => {
    instance.loop = false;
    instance.muted = true;
    instance.staysActiveInBackground = false;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  return <View>
    <Text style={styles.caption}>Original captioned animation · silent · tap Play when ready</Text>
    <VideoView player={player} style={styles.video} contentFit="contain" nativeControls allowsFullscreen accessibilityLabel={`Animated explanation: ${experience.title}`} />
    {status === 'loading' && <ActivityIndicator color="#f0d18d" accessibilityLabel="Loading offline video" style={styles.loading} />}
    {status === 'error' && <Text accessibilityLiveRegion="polite" style={styles.error}>The video could not load. Use the illustration or transcript below.</Text>}
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" disabled={status !== 'readyToPlay'} accessibilityState={{ disabled: status !== 'readyToPlay' }} style={[styles.control, styles.playButton, status !== 'readyToPlay' && styles.disabled]} onPress={() => { if (isPlaying) player.pause(); else { if (player.currentTime >= player.duration - 0.25) player.currentTime = 0; player.play(); } }}><Text style={styles.selectedTabText}>{isPlaying ? 'Pause' : 'Play animation'}</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" disabled={status !== 'readyToPlay'} accessibilityState={{ disabled: status !== 'readyToPlay' }} style={styles.control} onPress={() => { player.currentTime = 0; player.pause(); }}><Text style={styles.tabText}>Restart</Text></TouchableOpacity>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: transcriptOpen }} style={styles.transcriptToggle} onPress={() => setTranscriptOpen(!transcriptOpen)}><Text style={styles.tabText}>{transcriptOpen ? 'Hide' : 'Read'} animation transcript {transcriptOpen ? '−' : '+'}</Text></TouchableOpacity>
    {transcriptOpen && experience.transcript.map((line, i) => <Text key={line} style={styles.transcript}>{i + 1}. {line}</Text>)}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101419', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#675432', marginTop: 20, marginBottom: 5 }, eyebrow: { color: '#f0d18d', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: '#fff', fontWeight: '800', fontSize: 23, lineHeight: 30, marginTop: 9, marginBottom: 8 }, body: { color: '#c6c9cd', fontSize: 15, lineHeight: 23, marginBottom: 10 }, tabs: { flexDirection: 'row', gap: 8, marginVertical: 12 }, tab: { flex: 1, minHeight: 48, padding: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#44505a', borderRadius: 12 }, selectedTab: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, tabText: { color: '#e2e5e8', fontWeight: '700', fontSize: 14 }, selectedTabText: { color: '#101419', fontWeight: '800', fontSize: 14 }, hidden: { display: 'none' }, image: { width: '100%', aspectRatio: 1.5, backgroundColor: '#101419', borderRadius: 12 }, imageHint: { color: '#f0d18d', textAlign: 'center', padding: 12, fontSize: 13 }, caption: { color: '#aeb9c3', fontSize: 13, lineHeight: 20, marginBottom: 10 }, video: { width: '100%', aspectRatio: 1.5, backgroundColor: '#080b0f', borderRadius: 10 }, controls: { flexDirection: 'row', gap: 10, marginTop: 12 }, control: { flex: 1, minHeight: 48, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderColor: '#44505a', borderWidth: 1 }, playButton: { backgroundColor: '#f0d18d', borderColor: '#f0d18d' }, disabled: { opacity: 0.4 }, loading: { padding: 12 }, error: { color: '#e0a5a5', lineHeight: 22, marginTop: 10 }, transcriptToggle: { minHeight: 48, justifyContent: 'center', marginTop: 8 }, transcript: { color: '#c6c9cd', lineHeight: 22, fontSize: 14, marginBottom: 10 }, modal: { flex: 1, backgroundColor: '#101419' }, close: { minHeight: 52, justifyContent: 'center', paddingHorizontal: 20 }, modalHint: { color: '#aeb9c3', padding: 20, paddingTop: 0 },
});
