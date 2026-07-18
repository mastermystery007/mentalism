export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: number;
  title: string;
  summary: string;
  duration: string;
  level: string;
  objectives: string[];
  sections: { heading: string; body: string[] }[];
  procedure: string[];
  script: string[];
  drills: string[];
  troubleshooting: { problem: string; response: string }[];
  ethics: string[];
  assignment: string;
  quiz: QuizQuestion[];
  media: string[];
};

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "The Mentalist’s Claim",
    summary: "Choose a coherent performance identity and define exactly what your audience should believe you can do.",
    duration: "40–55 min",
    level: "Foundation",
    objectives: [
      "Separate the effect, secret method and implied explanation.",
      "Build a consistent persona around psychology, intuition, memory, influence or mystery.",
      "Set ethical limits before learning methods."
    ],
    sections: [
      { heading: "Effect, method and claim", body: ["The effect is the audience-facing event: a hidden drawing is revealed or a prediction matches. The method is the secret structure. The claim is the explanation the performance implies.", "A performer may imply observation, intuition, suggestion, coincidence, genuine memory skill or theatrical mystery. The same method feels different under each claim. Decide deliberately rather than mixing incompatible explanations at random."] },
      { heading: "Credibility through consistency", body: ["A psychological performer should use language about patterns, attention and decision-making. A mysterious performer may leave causes unresolved. Both can be theatrical, but each needs consistent costume, vocabulary, pacing and choice of effects.", "Avoid claiming scientific certainty for weak body-language ideas or supernatural certainty for methods. Ambiguity can be compelling without misleading vulnerable people."] },
      { heading: "The ethical contract", body: ["Mentalism uses secrecy and staged impossibility, but the participant should remain safe and respected. Never exploit grief, health fears, finances, romantic insecurity or confidential information.", "A useful test is whether the participant would still feel respected if the method were later understood. If not, redesign the routine."] }
    ],
    procedure: ["Write five effects you want to perform.", "For each, state the hidden method category without technical detail.", "Choose one implied explanation that fits all five.", "Write three phrases your persona would use and three it would never use.", "Define hard boundaries for private, medical, financial and spiritual claims.", "Draft a 45-second opening that establishes your premise."],
    script: ["I do not claim to read minds literally. I work with attention, memory and the patterns people reveal when they make decisions.", "Tonight I will sometimes explain what I am attempting and sometimes leave it unresolved. Either way, every participant remains free to change their mind or decline."],
    drills: ["Perform the same prediction as a psychologist, memory expert and mysterious storyteller.", "Remove every unsupported scientific claim from your introduction.", "Record a one-minute persona statement and check whether every sentence supports one identity."],
    troubleshooting: [
      { problem: "The persona changes from science to psychic certainty mid-show.", response: "Select one dominant frame and treat other explanations as playful possibilities rather than facts." },
      { problem: "The opening is mostly biography.", response: "Begin with an immediate demonstration and reveal your premise through action." },
      { problem: "The claim sounds arrogant.", response: "Frame the performance as an experiment and share uncertainty where methods are probabilistic." }
    ],
    ethics: ["Never present entertainment as diagnosis or therapy.", "Never imply contact with the dead or certainty about tragedy.", "Protect participant dignity even when a method fails."],
    assignment: "Create a 100-word persona statement, a 45-second opening and a list of five effects that all support the same claim.",
    quiz: [
      { question: "The claim is:", options: ["The secret method", "What the performance implies explains the effect", "The prop list", "The rehearsal schedule"], answer: 1, explanation: "The claim is the audience-facing explanation or premise." },
      { question: "The strongest persona is usually:", options: ["A random mix of explanations", "Consistent across language and effects", "Based on scientific certainty", "Dependent on humiliating volunteers"], answer: 1, explanation: "Consistency helps the audience understand and believe the theatrical world." }
    ],
    media: ["Three contrasting persona performances", "Persona worksheet", "Ethical-boundary checklist"]
  },
  {
    id: 2,
    title: "Observation Without Myths",
    summary: "Train accurate observation while avoiding fake lie-detection rules and overconfident body-language claims.",
    duration: "45–60 min",
    level: "Foundation",
    objectives: ["Separate observation from interpretation.", "Compare behaviour with an individual baseline.", "Use uncertainty and alternative explanations responsibly."],
    sections: [
      { heading: "Fact before interpretation", body: ["A fact might be: the participant paused for four seconds, looked at the objects twice and corrected the word home to city. An interpretation might be: the choice is emotionally important. Keep these levels separate.", "This discipline improves both performance and honesty. It prevents you from treating ordinary nervousness or eye movement as proof of deception."] },
      { heading: "Baseline and change", body: ["People differ greatly in gaze, gesture, speech rate and posture. Observe how a participant behaves during neutral conversation before drawing meaning from a later change.", "Even a change has several possible causes: uncertainty, excitement, social pressure, memory search or simple distraction. Use it as a clue for theatrical questioning, never proof."] },
      { heading: "Observation as presentation", body: ["Mentalism becomes convincing when you reveal small details the audience has also seen but not consciously organised: which object was touched first, which word was avoided or where attention repeatedly returned.", "State what you observed and offer an interpretation as a possibility. This feels intelligent without pretending certainty."] }
    ],
    procedure: ["Watch a two-minute conversation without sound and record only visible facts.", "Add three possible interpretations for each fact.", "Listen with sound and note which interpretations changed.", "During a live exercise, establish a neutral baseline.", "Observe one meaningful change.", "Use it to guide one question rather than announce a conclusion."],
    script: ["You looked at the red object twice before you answered. That may mean attraction, uncertainty or nothing at all—but let us test the first possibility.", "I noticed you changed the word from person to friend. I will treat that correction as important, but not assume why yet."],
    drills: ["Maintain a fact/hypothesis/alternative journal for seven conversations.", "Remove universal body-language rules from your notes.", "Practise describing behaviour without evaluative adjectives."],
    troubleshooting: [
      { problem: "The learner says looking left means lying.", response: "Replace universal rules with individual baseline, context and multiple hypotheses." },
      { problem: "Observation becomes invasive staring.", response: "Use ordinary social attention and review video later rather than scrutinising visibly." },
      { problem: "A hypothesis is stated as fact.", response: "Use language such as may, suggests or I am testing whether." }
    ],
    ethics: ["Do not accuse people of lying based on body language.", "Do not infer health, trauma or guilt from ambiguous cues.", "Use observation for performance, not surveillance or coercion."],
    assignment: "Complete a five-minute observation log containing at least ten facts, two hypotheses per fact and one respectful performance line.",
    quiz: [
      { question: "Which is an observation?", options: ["She is lying", "He feels guilty", "She paused and changed her answer", "He is hiding trauma"], answer: 2, explanation: "A pause and changed answer are observable; motives remain hypotheses." },
      { question: "A behavioural change should be treated as:", options: ["Proof", "A clue with alternatives", "A diagnosis", "A confession"], answer: 1, explanation: "Context and individual variation prevent certainty." }
    ],
    media: ["Annotated observation video", "Fact-versus-hypothesis worksheet", "Baseline drill"]
  },
  {
    id: 3,
    title: "Psychological Forces",
    summary: "Use category restriction, prototypes, framing and tempo to make some thoughts more likely while preparing honest outs.",
    duration: "60–80 min",
    level: "Beginner practical",
    objectives: ["Perform number, shape, colour and object forces.", "Measure actual success rather than trusting folklore.", "Build a routine that remains entertaining on a miss."],
    sections: [
      { heading: "Influence, not certainty", body: ["A psychological force increases the probability of a choice; it does not guarantee it. Language, examples, speed, cultural familiarity and context all influence outcomes.", "Track each force with real audiences. A method that works in one language or age group may fail elsewhere. Your notes are more valuable than exaggerated success claims."] },
      { heading: "Restriction without obvious restriction", body: ["Ask for a simple geometric shape, a bright primary colour or a two-digit number with distinct digits. These conditions narrow the universe while still feeling broad.", "Do not overload the instruction. Every extra restriction increases suspicion. Use only constraints that have a plausible reason, such as ease of visualisation."] },
      { heading: "Outs", body: ["Prepare an exact hit, near-hit and complete-miss path. A near hit may become influence rather than prediction. A complete miss can transition into an observation or second method.", "Never claim that a miss secretly proves the participant resisted. Acknowledge uncertainty and preserve the experience."] }
    ],
    procedure: ["Select one force and write its exact wording.", "Define the target and acceptable near hits.", "Create an exact-hit reveal.", "Create a near-hit interpretation.", "Create a clean miss transition.", "Test twenty times under similar conditions.", "Revise wording based on results."],
    script: ["Think of a simple shape—something you could draw quickly on a road sign. Do not make it too decorative; hold the first clear image.", "I was trying to push the most common answer, but you moved away from it. That is useful—let us use your choice rather than pretend I was exact."],
    drills: ["Run number, shape and colour forces twenty times each.", "Compare slow and rapid delivery.", "Practise all three outcomes until none sounds like an excuse."],
    troubleshooting: [
      { problem: "The wording contains too many restrictions.", response: "Keep one or two natural constraints and remove the rest." },
      { problem: "The performer freezes on a miss.", response: "Memorise a transition to a guaranteed method or a participant-choice effect." },
      { problem: "The sample is too small.", response: "Track at least twenty attempts before judging performance." }
    ],
    ethics: ["Do not imply that probabilistic forces prove control over a person.", "Do not pressure participants to change a genuine answer.", "Report success rates honestly in teaching materials."],
    assignment: "Test four forces in at least eighty total trials and create a table of hit rate, wording, context and recovery quality.",
    quiz: [
      { question: "A psychological force is:", options: ["Guaranteed control", "A probability-increasing structure", "A diagnosis", "A secret camera"], answer: 1, explanation: "Psychological forces influence likelihood but require outs." },
      { question: "The best evidence for a force is:", options: ["A famous claim", "Your tracked trials", "One success", "Audience pressure"], answer: 1, explanation: "Actual testing reveals whether the wording works in your context." }
    ],
    media: ["Force demonstration set", "Success-rate tracker", "Hit/near-hit/miss branching video"]
  },
  {
    id: 4,
    title: "Equivoque",
    summary: "Create an apparently free selection through consistent conversational branching and motivated elimination.",
    duration: "60–85 min",
    level: "Beginner practical",
    objectives: ["Understand selection-versus-elimination language.", "Keep branches symmetrical and natural.", "Build two-, four- and five-object routines."],
    sections: [
      { heading: "The core idea", body: ["Equivoque allows different participant choices to lead toward the same final object through flexible interpretation of keep, remove, choose or point.", "The method is strongest when the performer never appears to change the rules. Decide in advance how each phrase will be interpreted and keep the physical actions consistent."] },
      { heading: "Motivated procedure", body: ["Objects should have a reason to be compared: symbols, keys, photographs or sealed envelopes. The elimination process should advance a story rather than feel like administrative sorting.", "Keep the number of decisions low. A long maze of choices makes the method visible even when each branch is technically correct."] },
      { heading: "Language and memory", body: ["Use short phrases and act immediately after the participant responds. Avoid repeating their exact choice in a way that exposes different meanings.", "The audience remembers freedom more than grammar when the rhythm remains smooth and the final reveal is strong."] }
    ],
    procedure: ["Choose a target object.", "Map every first choice to keep or eliminate.", "Map the next branch using identical vocabulary where possible.", "Add one physical action after each decision.", "Rehearse every branch aloud.", "Test with a friend instructed to make awkward choices.", "Remove unnecessary decisions."],
    script: ["Touch two objects. Good—we will work with those for a moment. Now slide one toward me.", "Point to one group. We will remove that decision from your hands and focus on what remains."],
    drills: ["Practise a two-object force without hesitation.", "Draw a complete four-object branch tree.", "Run fifty random simulated choices and speak each branch."],
    troubleshooting: [
      { problem: "The wording changes noticeably.", response: "Rewrite branches around the same verbs and pair them with immediate physical actions." },
      { problem: "The participant asks what choose means.", response: "Clarify before they act; do not exploit confusion." },
      { problem: "The routine takes too long.", response: "Reduce objects or use a direct force for the first stage." }
    ],
    ethics: ["Use equivoque for entertainment, not consequential decisions.", "Do not claim it demonstrates irresistible influence.", "Do not pressure a participant who questions the procedure."],
    assignment: "Create and record a five-object routine with a complete branch map, no more than three decisions and a motivated final reveal.",
    quiz: [
      { question: "Equivoque depends mainly on:", options: ["Secret electronics", "Flexible but rehearsed interpretation of choices", "Body-language detection", "Hypnosis"], answer: 1, explanation: "The method uses branching language and action." },
      { question: "The best routine has:", options: ["Many decisions", "Consistent language and few decisions", "Confusing instructions", "Consequential stakes"], answer: 1, explanation: "Simplicity and consistency hide the branching." }
    ],
    media: ["Interactive branch simulator", "Five-object performance", "Printable decision tree"]
  },
  {
    id: 5,
    title: "Billets and Information Strategy",
    summary: "Control what is written, acquire only the information needed and separate acquisition from revelation.",
    duration: "65–90 min",
    level: "Intermediate",
    objectives: ["Design participant instructions that produce usable information.", "Understand orientation, handling and time separation.", "Reveal information progressively rather than blurting it out."],
    sections: [
      { heading: "Information design", body: ["A strong billet routine begins before the peek. Ask for a category that produces short, legible information: a simple drawing, first name, city or meaningful object.", "Requesting an entire private story creates handling problems and ethical risk. Obtain the minimum necessary detail for the effect."] },
      { heading: "Acquisition and time separation", body: ["Whether using a glimpse, impression or switch, the suspicious moment should be separated from the revelation by another action or routine beat.", "After information is acquired, return attention to the participant, ask an unrelated question or move the billet to a justified location. The audience should not connect writing with immediate knowledge."] },
      { heading: "Progressive revelation", body: ["Reveal category, orientation, emotional tone, sound or image before the exact answer. This creates the experience of thought reading rather than simple data access.", "Do not fish endlessly. Use a planned sequence with a limited number of statements and an exact finish."] }
    ],
    procedure: ["Choose a safe category and exact writing instruction.", "Standardise paper size and folding orientation.", "Rehearse the acquisition action separately.", "Insert a time-separation beat.", "Write a five-stage revelation.", "Prepare handling for illegible or unexpected responses.", "Destroy or return the billet consistently."],
    script: ["Write one place that matters to you—only the city or location, not the story. Fold it once and keep it secure.", "I first get distance rather than a word. This feels travelled-to, warmer than here, and connected to water… now I am hearing the beginning of the name."],
    drills: ["Practise writing instructions with ten volunteers.", "Handle billets while maintaining eye contact and conversation.", "Build progressive reveals for city, name, object and drawing."],
    troubleshooting: [
      { problem: "The writing is illegible.", response: "Use category information, ask the participant to visualise spelling or transition to an impression-based reveal without inventing certainty." },
      { problem: "The reveal begins immediately after handling.", response: "Add a meaningful question or secondary action before the first statement." },
      { problem: "The participant writes sensitive information.", response: "Do not reveal it publicly; return or destroy it and explain the boundary." }
    ],
    ethics: ["Never steal passwords, financial data or confidential information.", "Tell participants not to write anything they would not want used in an entertainment routine.", "Destroy or return private writing responsibly."],
    assignment: "Construct a meaningful-place billet routine with exact instructions, time separation, five reveal stages and a privacy-safe ending.",
    quiz: [
      { question: "The best billet instruction requests:", options: ["A password", "Minimum usable information", "A full confession", "Medical history"], answer: 1, explanation: "Short safe information improves method and ethics." },
      { question: "Time separation helps by:", options: ["Making the paper larger", "Weakening the connection between handling and knowledge", "Guaranteeing legibility", "Replacing rehearsal"], answer: 1, explanation: "Distance between acquisition and reveal reduces suspicion." }
    ],
    media: ["Overhead billet handling", "Printable templates", "Progressive-reveal examples"]
  },
  {
    id: 6,
    title: "Drawing Duplication",
    summary: "Reveal a hidden sketch through orientation, structure, category and distinctive features using original, credited methods.",
    duration: "70–95 min",
    level: "Intermediate",
    objectives: ["Compare force, peek, impression and restricted-universe approaches.", "Build a progressive sketch reveal.", "Handle abstract or unexpected drawings gracefully."],
    sections: [
      { heading: "Method families", body: ["A drawing may be known through a controlled choice, a justified glimpse, an impression system or a limited drawing universe. These are general method categories; do not copy proprietary commercial gimmicks or scripts.", "Choose the method according to conditions. A force may be nearly prop-free but probabilistic. A reliable glimpse needs handling and time separation."] },
      { heading: "Reveal hierarchy", body: ["Begin with orientation: tall, wide, central or off-centre. Then describe geometry, category and one distinguishing feature. Draw in stages and allow imperfect lines.", "A rough image that develops alongside verbal impressions often feels more like thought transmission than a perfect copy produced instantly."] },
      { heading: "Managing difficult drawings", body: ["Give clear instructions: one simple recognisable object, no words, no numbers and no complex scene. Still prepare for abstract symbols or multiple objects.", "When uncertain, reveal structural facts first and invite the participant to interpret similarity. Do not pressure them to agree with a poor match."] }
    ],
    procedure: ["Define drawing instructions.", "Choose an original information method.", "Create a five-stage reveal hierarchy.", "Practise reproducing fifty common objects quickly.", "Insert time separation after acquisition.", "Prepare a graceful partial-match line.", "End by placing the drawings side by side."],
    script: ["Keep the drawing simple enough to recognise from across the room. No letters, numbers or famous logos—just one clear object.", "I am not seeing detail first; I get the overall movement. It rises vertically, then opens near the top… there is one feature slightly to the right."],
    drills: ["Sketch fifty common objects in under fifteen seconds each.", "Practise revealing only orientation and geometry before category.", "Film back-to-back drawing posture and identify every suspicious glance."],
    troubleshooting: [
      { problem: "The participant draws a complex scene.", response: "Focus on the dominant object or ask them privately to select one component for the experiment." },
      { problem: "The performer draws too perfectly too soon.", response: "Reveal structure in stages and allow natural uncertainty." },
      { problem: "The match is weak.", response: "Do not demand agreement; acknowledge the partial similarity and move to a clean closing beat." }
    ],
    ethics: ["Develop original implementations and credit historical principles.", "Do not reproduce a commercial gimmick’s construction or handling.", "Do not manipulate participant testimony about the accuracy of a drawing."],
    assignment: "Perform three drawing duplications using three different method families and compare reliability, naturalness and audience memory.",
    quiz: [
      { question: "A convincing reveal usually begins with:", options: ["Exact copied detail", "Orientation and structure", "A claim of telepathy", "Participant pressure"], answer: 1, explanation: "Progressive structure suggests information arriving in stages." },
      { question: "A commercial method should be:", options: ["Copied into the app", "Credited and replaced by an original implementation", "Renamed", "Reverse-engineered publicly"], answer: 1, explanation: "Respect intellectual property and teach general principles through original work." }
    ],
    media: ["Back-to-back performance", "Common drawing library", "Reveal hierarchy animation"]
  },
  {
    id: 7,
    title: "Prediction Architecture",
    summary: "Make a prediction feel committed, isolated and dramatically relevant before the participant’s choices are made.",
    duration: "60–85 min",
    level: "Intermediate",
    objectives: ["Establish commitment without overemphasising the prediction.", "Layer predictions and callbacks.", "Use multiple outcomes without procedural clutter."],
    sections: [
      { heading: "Commitment and isolation", body: ["A prediction is strongest when introduced early, placed in a location the performer appears unable to access and then largely ignored until the reveal.", "Overproving can create suspicion. One clear condition—sealed envelope in view, timestamped message or object held by a spectator—is often enough."] },
      { heading: "Layered information", body: ["A prediction can reveal broad category, image, exact word and a callback to an earlier choice. Layering allows several methods to work together while creating one coherent climax.", "The layers should escalate. Do not reveal the strongest exact detail first and then continue with weaker confirmations."] },
      { heading: "Multiple outcomes", body: ["Indexes, alternate envelopes, verbal branches and choice compression can cover several possibilities. Design access so the method remains invisible and the reveal pace stays clean.", "Every physical action needs dramatic motivation. Searching through pockets for the correct outcome destroys the appearance of commitment."] }
    ],
    procedure: ["Define the final audience memory in one sentence.", "Choose the apparent commitment condition.", "Map every possible outcome.", "Select the minimum number of physical outs.", "Write the reveal order from broad to exact.", "Add one callback.", "Rehearse the retrieval path for every outcome."],
    script: ["Before anyone made a choice, I placed one photograph in this envelope and asked you to hold it. We will not touch it until the end.", "First notice the location. Then the person. Finally, read the action printed beneath it—the three decisions formed one scene."],
    drills: ["Design a three-out envelope index.", "Practise retrieving each outcome without looking.", "Rewrite an overlong prediction procedure into three audience-facing beats."],
    troubleshooting: [
      { problem: "The performer repeatedly mentions the prediction.", response: "Introduce it once and redirect attention to the decisions." },
      { problem: "Outcome retrieval looks like searching.", response: "Reduce outcomes or improve indexing and pocket choreography." },
      { problem: "The climax contains too many weak details.", response: "Keep only the strongest escalating layers." }
    ],
    ethics: ["Do not use predictions to imply certainty about death, health or financial events.", "Do not use staged outcomes to influence consequential choices.", "Present predictions as theatrical demonstrations."],
    assignment: "Build a person-place-action prediction with a visible commitment, no more than four outcomes and a three-stage reveal.",
    quiz: [
      { question: "A prediction feels most committed when it is:", options: ["Mentioned constantly", "Introduced early and isolated", "Written after the choice", "Hidden from everyone"], answer: 1, explanation: "Early isolation creates the remembered impossibility." },
      { question: "Layered reveals should generally:", options: ["Decline in strength", "Escalate toward the exact detail", "Repeat the same fact", "Expose the method"], answer: 1, explanation: "Escalation creates a satisfying climax." }
    ],
    media: ["Prediction construction worksheet", "Index choreography video", "Full layered routine"]
  },
  {
    id: 8,
    title: "One-Ahead and Multiple Minds",
    summary: "Use sequential information architecture so each revelation secretly supplies the information needed for the next.",
    duration: "65–90 min",
    level: "Intermediate",
    objectives: ["Diagram one-ahead logic clearly.", "Vary revelation texture and order.", "End cleanly with the strongest item."],
    sections: [
      { heading: "The information chain", body: ["In a basic one-ahead structure, the performer knows one item in advance. While apparently revealing it, they secretly learn the next. The final phase uses a prepared or alternative ending to close the chain.", "The method is simple logically but demanding theatrically. Audiences must not perceive that each reveal creates access to another item."] },
      { heading: "Disguising repetition", body: ["Reveal each item differently: draw one, describe another, write a third and have the participant announce the last. Vary distance, pacing and emotional tone.", "Avoid identical handling of every billet. Repetition teaches the audience where the method lives."] },
      { heading: "Finale design", body: ["The final item should be the clearest and cleanest. Use a prewritten prediction, controlled item or independent method to avoid an unfinished chain.", "A callback can make the ending feel planned rather than merely sequential."] }
    ],
    procedure: ["Choose three safe information items.", "Diagram what is known at every moment.", "Assign a different reveal form to each.", "Create the first-known information source.", "Create the final clean ending.", "Rehearse transitions rather than only revelations.", "Test whether the sequence still makes sense from the audience viewpoint."],
    script: ["Do not think of all three people at once. I will move from impression to impression, and each of you should react only when something becomes meaningful.", "The first came as an image, the second as a sound. The last is different—it was already written before we began."],
    drills: ["Draw the information-state diagram from memory.", "Perform the sequence with deliberately shuffled participant order.", "Create three distinct revelation styles."],
    troubleshooting: [
      { problem: "The performer loses track of which item is known.", response: "Use a fixed participant order and rehearse the state diagram aloud." },
      { problem: "Every phase looks identical.", response: "Change reveal modality and handling while preserving logic." },
      { problem: "The final item has no solution.", response: "Design the final out before rehearsing the middle phases." }
    ],
    ethics: ["Use participant-provided information only within the agreed routine.", "Avoid emotionally sensitive questions in public.", "Do not present one-ahead information as spiritual certainty."],
    assignment: "Create a three-person routine using a word, drawing and memory, with a written state diagram and clean final prediction.",
    quiz: [
      { question: "One-ahead works because:", options: ["Every answer is forced", "Each reveal provides information for the next", "The audience forgets everything", "A camera reads the billets"], answer: 1, explanation: "It is a sequential information chain." },
      { question: "The final phase needs:", options: ["No ending", "A clean independent resolution", "More identical handling", "Participant confusion"], answer: 1, explanation: "A planned final out closes the chain convincingly." }
    ],
    media: ["Animated information diagram", "Three-person performance", "Revelation-style planner"]
  },
  {
    id: 9,
    title: "Cold Reading Fundamentals",
    summary: "Use broad-to-specific statements, feedback and branching as transparent entertainment without exploiting vulnerability.",
    duration: "75–100 min",
    level: "Intermediate",
    objectives: ["Recognise major statement structures.", "Use feedback to refine a reading.", "Maintain explicit ethical boundaries around grief, health and dependency."],
    sections: [
      { heading: "Statement structures", body: ["Barnum statements are broadly applicable but feel personal. Rainbow statements describe both sides of a trait. Fuzzy facts offer an approximate detail that can be refined. Forking prepares two plausible branches.", "The skill lies in delivery, observation and organisation—not in pretending vague language is supernatural proof."] },
      { heading: "The feedback loop", body: ["Begin with a plausible statement, observe verbal and nonverbal response, ask a light clarifying question and narrow carefully. Information supplied by the participant may be returned later as a developed conclusion.", "Do not conceal the participant’s contribution from yourself. Keep notes during practice to understand how much information was genuinely provided."] },
      { heading: "A safe entertainment frame", body: ["Frame readings as intuitive impressions, character experiments or theatrical exercises. Avoid claims about deceased relatives, disease, pregnancy, crime, investments or imminent danger.", "Never encourage dependency, repeated payments or major life decisions. A reading should end with autonomy, not authority."] }
    ],
    procedure: ["Establish an entertainment frame.", "Open with two broad but meaningful statements.", "Observe response without staring.", "Fork into one of two prepared directions.", "Use one specific-looking detail based on safe demographic context.", "Summarise in positive but non-prescriptive language.", "Close clearly."],
    script: ["Treat this as an experiment in impression rather than a factual diagnosis. Keep what resonates and discard what does not.", "You can be highly independent in decisions, yet there are a few people whose approval matters more than you admit. I suspect one relationship has recently made that contrast stronger."],
    drills: ["Write twenty Barnum statements and remove clichés.", "Create ten rainbow statements with balanced positive and negative poles.", "Deliver a three-minute reading and annotate every piece of participant feedback used."],
    troubleshooting: [
      { problem: "The reader makes repeated guesses.", response: "Return to broader structure and stop fishing for exact facts." },
      { problem: "A participant mentions bereavement.", response: "Do not claim contact or messages; acknowledge respectfully and move away from evidential claims." },
      { problem: "The reading becomes advice.", response: "Return decision-making to the participant and avoid medical, legal or financial direction." }
    ],
    ethics: ["No grief exploitation, diagnosis, financial prediction or dependency-building.", "Never claim certainty from vague statements.", "Use disclaimers that match the actual entertainment context."],
    assignment: "Record a three-minute entertainment reading, transcribe it and label every Barnum statement, fork, participant cue and ethical risk.",
    quiz: [
      { question: "A Rainbow statement usually:", options: ["Predicts weather", "Describes contrasting sides of a trait", "Obtains a password", "Proves psychic power"], answer: 1, explanation: "It captures apparently opposite but context-dependent traits." },
      { question: "Which topic should be avoided?", options: ["General work style", "Favourite hobbies", "Messages from a dead relative", "Social preferences"], answer: 2, explanation: "Bereavement claims can exploit vulnerability and should not be used." }
    ],
    media: ["Annotated reading examples", "Technique flashcards", "Ethical red-flag worksheet"]
  },
  {
    id: 10,
    title: "Muscle Reading and Pendulums",
    summary: "Use ideomotor movement and contact cues to locate selected objects while representing the method accurately.",
    duration: "65–90 min",
    level: "Intermediate practical",
    objectives: ["Recognise broad directional contact cues.", "Begin with large-signal object-location exercises.", "Use pendulums without treating them as truth detectors."],
    sections: [
      { heading: "Contact cues", body: ["When a participant knows a location and intends to guide or resist, tiny changes in pressure, speed and body orientation can provide directional information. The performer follows rather than forcibly steers.", "Start with a large room area and a clearly hidden object. Fine distinctions come only after repeated practice."] },
      { heading: "The ideomotor pendulum", body: ["A pendulum amplifies small unconscious or semi-conscious muscle movements. Expectations about clockwise, counter-clockwise or stillness can influence motion.", "It can create a compelling demonstration, but it does not reliably reveal objective truth, guilt or medical information."] },
      { heading: "Presentation", body: ["Frame the routine as sensitivity to intention, coordination or amplified micro-movement. This is credible and still mysterious.", "Give the participant an active role and celebrate successful cooperation rather than performer dominance."] }
    ],
    procedure: ["Explain the contact and stop conditions.", "Have the participant hide a harmless object in a large area.", "Use light wrist or hand contact with consent.", "Move slowly and follow changes in ease or direction.", "Narrow from zone to location.", "Release contact immediately if requested.", "Debrief the participant’s experience."],
    script: ["Do not consciously pull me. Simply keep the location in mind and walk with me. I will follow changes in movement rather than force a direction.", "The pendulum is amplifying very small muscle movements influenced by expectation. We will use it as an attention experiment, not a truth machine."],
    drills: ["Find left-versus-right choices in twenty rounds.", "Progress to one of four room zones.", "Calibrate a pendulum using deliberately imagined directions."],
    troubleshooting: [
      { problem: "The performer pushes the participant.", response: "Reduce contact pressure and allow the participant’s movement to lead." },
      { problem: "Signals are too subtle.", response: "Return to larger zones and stronger movement before fine location work." },
      { problem: "The pendulum is used for serious decisions.", response: "Stop and restate that it reflects ideomotor movement, not objective truth." }
    ],
    ethics: ["Obtain consent for physical contact.", "Do not use pendulums for diagnosis, guilt, pregnancy or major decisions.", "Never restrain or pull a participant."],
    assignment: "Complete twenty contact-direction trials and ten pendulum trials, recording conditions, accuracy and participant feedback.",
    quiz: [
      { question: "Muscle reading relies on:", options: ["Telepathy", "Subtle contact and movement cues", "A marked object", "Hypnotic sleep"], answer: 1, explanation: "Intention can affect pressure and motion in detectable ways." },
      { question: "A pendulum is not suitable for:", options: ["An attention demonstration", "Showing ideomotor movement", "Medical diagnosis", "A theatrical yes/no exercise"], answer: 2, explanation: "Pendulum motion is not reliable diagnostic evidence." }
    ],
    media: ["Contact mind-reading demonstration", "Pendulum calibration animation", "Practice log"]
  },
  {
    id: 11,
    title: "Memory as a Real Skill",
    summary: "Build genuine demonstrations using association, link stories, pegs, the Major System and memory palaces.",
    duration: "80–110 min",
    level: "Skill intensive",
    objectives: ["Memorise audience-generated lists.", "Recall items by order and position.", "Blend authentic skill with theatrical presentation."],
    sections: [
      { heading: "Association and imagery", body: ["Memory improves when abstract information becomes vivid, unusual and connected. A linked story can hold a short sequence; a memory palace stores items at familiar locations.", "The image should be specific, active and exaggerated. Merely repeating a word internally is weaker than seeing it interact with a location."] },
      { heading: "Pegs and numbers", body: ["A peg system gives every position a permanent image. The Major System converts digits into consonant sounds and then words, allowing long numbers to become images.", "Learn a small stable set before attempting large feats. Reliability matters more than claiming photographic memory."] },
      { heading: "Performance construction", body: ["Have the audience generate varied words, repeat them once for clarity and encode as they are called. Reveal forwards, backwards and by requested position.", "Use pacing and humour while encoding, but do not let presentation interrupt concentration until the system is automatic."] }
    ],
    procedure: ["Build a ten-location memory palace.", "Assign vivid images to ten audience words.", "Recall forward.", "Walk the palace backward.", "Answer random position questions.", "Expand to twenty locations.", "Add a closing reveal such as the missing item."],
    script: ["Call out ordinary objects, but make them distinct. I will hear each once and place it somewhere in an imaginary route.", "Ask for any position, then we will reverse the entire sequence. This is not supernatural; it is a trained way of organising images."],
    drills: ["Memorise ten random words daily for one week.", "Learn twenty peg images.", "Encode six-digit numbers using the Major System."],
    troubleshooting: [
      { problem: "Images are vague.", response: "Make them active, sensory and physically interacting with the location." },
      { problem: "A location holds multiple confusing items.", response: "Use one dominant image per locus until retrieval is reliable." },
      { problem: "Performance talk disrupts encoding.", response: "Reduce commentary during input and add presentation after recall begins." }
    ],
    ethics: ["Present genuine memory skill honestly.", "Do not claim diagnosis or superhuman perception.", "Avoid memorising private information without consent."],
    assignment: "Perform a twenty-item audience list forwards, backwards and by five random positions with at least 90% accuracy.",
    quiz: [
      { question: "A strong mnemonic image is:", options: ["Vague and passive", "Specific, active and unusual", "Repeated silently only", "Hidden from the learner"], answer: 1, explanation: "Vivid interaction improves encoding and retrieval." },
      { question: "A memory palace stores items in:", options: ["Random letters", "Familiar spatial locations", "Body-language cues", "A marked deck"], answer: 1, explanation: "Stable locations provide ordered retrieval cues." }
    ],
    media: ["Guided memory palace", "Peg-system cards", "Twenty-word practice generator"]
  },
  {
    id: 12,
    title: "Book Tests and Word Revelation",
    summary: "Reveal a thought-of word through meaning, imagery, context and letters while keeping participant procedure simple.",
    duration: "65–90 min",
    level: "Intermediate",
    objectives: ["Compare forced-location, known-text and glimpse structures.", "Reveal semantic information before spelling.", "Use ordinary books without reproducing proprietary tests."],
    sections: [
      { heading: "Method structure", body: ["General approaches include controlling the page or word location, using a text whose content is known, obtaining a justified glimpse or combining two pieces of information.", "Teach and build original implementations. Commercial book tests often rely on proprietary printing or handling and should not be copied."] },
      { heading: "Participant procedure", body: ["Instructions should be easy to remember: open, look, close and concentrate. Too many page calculations or repeated confirmations make the book feel prepared.", "The book should fit the presentation. A travel book supports places; fiction supports images and characters; a dictionary supports precise words but can feel procedural."] },
      { heading: "The reveal", body: ["Begin with the emotional or visual character of the word, then category, length, sound and exact identity. Avoid asking a long sequence of letter questions.", "A final physical prediction can strengthen the effect if it does not duplicate the same information mechanically."] }
    ],
    procedure: ["Choose an ordinary text and original method.", "Write instructions in no more than three sentences.", "Rehearse book handling from the participant’s viewpoint.", "Create a five-stage semantic reveal.", "Prepare for plurals, punctuation and unexpected words.", "Add one final confirmation.", "Test with several readers."],
    script: ["Open anywhere in this section, settle on one substantial word and close the book. Do not choose a name or tiny connecting word.", "I get an image before letters—something constructed, tall, and associated with travel. The word feels six or seven letters long… bridge."],
    drills: ["Create semantic reveals for twenty common nouns.", "Reduce a complex procedure to three instructions.", "Practise revealing words without letter fishing."],
    troubleshooting: [
      { problem: "The participant chooses an unusable word.", response: "Build the instruction to request a concrete substantial word and prepare a reselection line." },
      { problem: "The reveal becomes twenty questions.", response: "Use semantic imagery and commit earlier." },
      { problem: "The book looks suspicious.", response: "Use ordinary context, minimal handling and avoid overproving fairness." }
    ],
    ethics: ["Do not copy proprietary book-test designs.", "Credit historical principles where known.", "Avoid using personal diaries or private documents."],
    assignment: "Create an original ordinary-book routine with three-sentence instructions and a five-stage semantic reveal.",
    quiz: [
      { question: "The strongest first reveal is often:", options: ["Every letter", "Meaning or imagery", "The method", "A demand for confirmation"], answer: 1, explanation: "Semantic impressions feel like thought reading and reduce tedious fishing." },
      { question: "Commercial book-test printing should be:", options: ["Copied", "Recreated under a new name", "Respected as proprietary", "Photographed into the app"], answer: 2, explanation: "Teach general principles through original implementations." }
    ],
    media: ["Ordinary-book walkthrough", "Semantic reveal library", "Procedure audit worksheet"]
  },
  {
    id: 13,
    title: "Dual Reality and Pre-Show",
    summary: "Design layered experiences in which participant and audience perspectives differ without humiliation or coercion.",
    duration: "60–85 min",
    level: "Advanced performance",
    objectives: ["Map participant and audience experience separately.", "Use prior information responsibly.", "Ensure both perspectives remain satisfying."],
    sections: [
      { heading: "Two experiences", body: ["In dual reality, the audience interprets an instruction or event differently from the participant. The method depends on wording, staging or information available to only one side.", "Draw two timelines before rehearsing. At every beat, write what the participant believes and what the audience believes."] },
      { heading: "Pre-show information", body: ["Information may be obtained before the formal performance and revealed later. The technique is powerful because the audience treats the show boundary as the beginning.", "Do not pressure participants to lie. They may be asked to follow an instruction or keep a theatrical detail private, but their experience should remain coherent and comfortable."] },
      { heading: "Participant dignity", body: ["A participant should not discover that the entire audience understood them as foolish or deceptive. Give them a genuine effect, meaningful role or positive reveal.", "Afterward, debrief if the method created confusion and obtain consent before publishing footage."] }
    ],
    procedure: ["Write the audience timeline.", "Write the participant timeline.", "Identify every wording difference.", "Remove any moment requiring humiliation or false testimony.", "Rehearse sight lines and sound.", "Add a participant-facing effect.", "Plan an optional private debrief."],
    script: ["In a moment I will ask you to follow one simple instruction. You do not need to pretend anything happened; respond exactly as the experience feels to you.", "The audience will focus on the outcome, while you focus on the image. Both parts are necessary for the experiment."],
    drills: ["Analyse three fictional dual-reality routines using two timelines.", "Role-play the participant and identify confusing moments.", "Rewrite any instruction that pressures false agreement."],
    troubleshooting: [
      { problem: "The participant is confused.", response: "Clarify privately or abandon the layered method; do not exploit confusion." },
      { problem: "The audience laughs at the participant.", response: "Stop, reframe and give the participant a strong positive role." },
      { problem: "Pre-show becomes coercive secrecy.", response: "Use simple theatrical confidentiality and allow refusal without consequence." }
    ],
    ethics: ["Never require a participant to lie about a distressing or intimate event.", "Do not humiliate someone through hidden audience knowledge.", "Obtain separate consent for filming and publication."],
    assignment: "Design a two-minute dual-reality routine with parallel timelines and a written participant-dignity audit.",
    quiz: [
      { question: "A dual-reality plan should map:", options: ["Only the method", "Audience and participant perspectives", "Only stage lighting", "Medical outcomes"], answer: 1, explanation: "Both experiences must remain coherent." },
      { question: "The participant should be asked to:", options: ["Lie under pressure", "Report their genuine experience", "Accept humiliation", "Reveal secrets"], answer: 1, explanation: "Ethical design does not depend on coerced false testimony." }
    ],
    media: ["Split-screen perspective video", "Two-timeline worksheet", "Participant dignity audit"]
  },
  {
    id: 14,
    title: "Psychometry and Question-and-Answer Performance",
    summary: "Build concise object readings and multi-person Q&A using safe categories, information management and varied revelations.",
    duration: "75–100 min",
    level: "Advanced performance",
    objectives: ["Structure short object readings.", "Manage ownership and information order.", "Avoid health, death, trauma and dependency claims."],
    sections: [
      { heading: "Psychometry structure", body: ["Participants contribute ordinary objects such as keys, pens or jewellery with no high financial or emotional risk. The performer apparently senses qualities and matches objects to owners.", "A reading can combine observation, safe general statements, known information and theatrical intuition. Keep it concise and return the object securely."] },
      { heading: "Q&A architecture", body: ["Questions can be categorised into work, relationships, decisions or aspirations, then answered through billets, one-ahead and general reading structures.", "The theatrical challenge is pacing several people while preventing the event from becoming personal counselling."] },
      { heading: "Boundaries", body: ["Decline questions about medical diagnosis, pregnancy, death, crime, legal outcomes or investments. Redirect toward general reflection or exclude the question entirely.", "Avoid predictions that encourage dependence. End with the participant’s agency and ordinary decision-making." ] }
    ],
    procedure: ["Request safe, identifiable objects.", "Create an ownership-control method.", "Prepare two-minute reading structures.", "Vary physical and verbal reveals.", "Set prohibited question categories publicly.", "Use a clean closing prediction or matching phase.", "Return every object and billet."],
    script: ["Please contribute an ordinary object with no sensitive information and no great financial value. Keep anything deeply private with you.", "I cannot answer medical, legal or financial questions. Keep the question general and use the result as entertainment, not instruction."],
    drills: ["Create ten safe object-reading openings.", "Practise matching five objects to owners using a controlled method.", "Write redirects for prohibited question categories."],
    troubleshooting: [
      { problem: "A question concerns serious illness.", response: "Decline to read it and recommend appropriate professional help." },
      { problem: "An object is highly valuable.", response: "Do not accept it; request an ordinary substitute." },
      { problem: "A reading becomes too long.", response: "Use a three-beat structure: broad quality, specific detail, ownership reveal." }
    ],
    ethics: ["No diagnosis, death messages, legal advice or financial prediction.", "Protect objects and written questions.", "Do not encourage repeat dependence on readings."],
    assignment: "Build a five-object sequence with ownership control, three-beat readings and explicit prohibited-question boundaries.",
    quiz: [
      { question: "A suitable contributed object is:", options: ["A passport", "An ordinary pen", "A bank card", "A confidential letter"], answer: 1, explanation: "Use low-risk ordinary objects." },
      { question: "A medical question should be:", options: ["Answered confidently", "Used for drama", "Declined and redirected", "Diagnosed through a pendulum"], answer: 2, explanation: "Mentalism is not medical care." }
    ],
    media: ["Five-object performance", "Q&A flowchart", "Question-boundary cards"]
  },
  {
    id: 15,
    title: "Build a Complete Mentalism Show",
    summary: "Assemble psychological influence, genuine skill, thought revelation and prediction into a coherent 12-minute act.",
    duration: "90–120 min",
    level: "Capstone",
    objectives: ["Create escalation and variety.", "Manage volunteers and recover from misses.", "Credit methods and audit ethics, clarity and pacing."],
    sections: [
      { heading: "A strong running order", body: ["Open with a quick psychological force that establishes the premise. Follow with a genuine memory feat, then a drawing duplication, a multi-person sequence and a physical prediction climax.", "Alternate methods and textures. Avoid three consecutive writing routines or repeated envelope handling."] },
      { heading: "Volunteer management", body: ["Choose willing participants, explain actions clearly and keep them facing the audience. Give applause cues and avoid making a volunteer responsible for a failed method.", "Have an early-exit path for nervousness, confusion or refusal. The show can continue without exposing the participant."] },
      { heading: "Review and credit", body: ["Record rehearsals and mark dead time, unclear choices, suspicious handling, accidental pressure and weak transitions. Ask a viewer to describe what they believe happened.", "Credit books, creators and general principles in the app’s study notes. Use original scripts, designs and combinations."] }
    ],
    procedure: ["Write your one-sentence premise.", "Choose five effects with different method families.", "Order them from immediate to impossible.", "Write volunteer instructions and outs.", "Add callbacks and applause points.", "Rehearse with props in actual pockets.", "Record, review and cut unnecessary procedure."],
    script: ["We will begin with a choice I may be able to influence, then move toward information I could not reasonably know.", "The first decision looked unimportant, but it determined the image, the word and the final photograph you have held from the beginning."],
    drills: ["Perform the act once without methods, speaking only audience-facing actions.", "Run every failure path deliberately.", "Ask three viewers to write the remembered effect after ten minutes."],
    troubleshooting: [
      { problem: "The show feels repetitive.", response: "Change method, participant count, prop type and reveal form between routines." },
      { problem: "The opener sometimes misses.", response: "Use a short out that transitions into a reliable second effect." },
      { problem: "The finale is weaker than the middle.", response: "Move the strongest physical impossibility last and build callbacks toward it." }
    ],
    ethics: ["Audit every routine for consent, privacy and participant dignity.", "Credit sources and protect proprietary methods.", "Do not use the show to claim medical, spiritual or financial authority."],
    assignment: "Record a complete 12-minute show and score premise, clarity, escalation, method variety, recovery, ethics and audience memory.",
    quiz: [
      { question: "A strong show should usually:", options: ["Repeat one method", "Escalate and vary texture", "Start with the longest routine", "Depend on one volunteer"], answer: 1, explanation: "Variety and escalation sustain attention and hide methods." },
      { question: "The best review question is:", options: ["Did you like me?", "What do you remember happened?", "Did you see the secret?", "Was I psychic?"], answer: 1, explanation: "Audience memory reveals whether the intended effect was clear." }
    ],
    media: ["Complete model show", "Performance assessment rubric", "Credits and further-study guide"]
  }
];
