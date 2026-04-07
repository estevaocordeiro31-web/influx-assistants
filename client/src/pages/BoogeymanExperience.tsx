import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Users, Trophy, Lightbulb, Play } from 'lucide-react';

// Chunks de vocabulário com contexto
const VOCABULARY_CHUNKS = [
  {
    expression: "Get something off your chest",
    meaning: "Confess or say something you've been hiding",
    example: "Lester came to Dr. Harper because he needed to get something off his chest.",
    context: "Lester is burdened by guilt and secrets about his children's deaths.",
    difficulty: "Intermediate",
  },
  {
    expression: "Straight as a yardstick",
    meaning: "Very stiff, rigid, or unyielding",
    example: "Billings lay straight as a yardstick on the couch, not giving it an inch of himself.",
    context: "Lester's body language shows his tension and emotional rigidity.",
    difficulty: "Intermediate",
  },
  {
    expression: "Tie a man down",
    meaning: "Restrict someone's freedom or limit their potential",
    example: "Children tie a man down, especially when the man is brighter than they.",
    context: "Lester blames his children for limiting his life opportunities.",
    difficulty: "Intermediate",
  },
  {
    expression: "It's written all over you",
    meaning: "Your face or expression clearly shows your feelings or thoughts",
    example: "You think I'm crazy, and it's written all over you.",
    context: "Lester knows Dr. Harper doesn't believe his story about the Boogeyman.",
    difficulty: "Beginner",
  },
  {
    expression: "Don't try to jerk it out of me!",
    meaning: "Don't force me to reveal something or don't rush me",
    example: "Don't try to jerk it out of me! I'll tell you, don't worry.",
    context: "Lester is defensive and wants to tell his story in his own way.",
    difficulty: "Intermediate",
  },
  {
    expression: "Just a crack",
    meaning: "A small opening or gap",
    example: "The closet door was open. Not much. Just a crack.",
    context: "The mysterious closet door is slightly open when Denny is found dead.",
    difficulty: "Beginner",
  },
  {
    expression: "Tooth and nail",
    meaning: "Fight very hard; resist with all your strength",
    example: "Rita fought it tooth and nail, but I had the last word.",
    context: "Rita resisted moving Shirl into Denny's old room after his death.",
    difficulty: "Intermediate",
  },
  {
    expression: "Lose the thread of your thought",
    meaning: "Forget what you were saying; lose your train of thought",
    example: "He seemed to have lost the thread of his thought.",
    context: "Lester's anxiety about the closet distracts him from his confession.",
    difficulty: "Advanced",
  },
  {
    expression: "Throw a jump into me",
    meaning: "Startle or scare someone",
    example: "That threw a jump into me. It was just like Denny.",
    context: "Lester is frightened when Shirl says the same thing Denny said.",
    difficulty: "Intermediate",
  },
  {
    expression: "Get lost",
    meaning: "Go away; leave (sometimes rude)",
    example: "I want to tell you and then get lost.",
    context: "Lester wants to confess and then disappear from society.",
    difficulty: "Beginner",
  },
];

// Diálogos interativos
const DIALOGUES = [
  {
    scene: "The Confession Begins",
    characters: ["Lester", "Dr. Harper"],
    dialogue: [
      { speaker: "Lester", text: "I came to you because I want to tell my story.", emotion: "desperate" },
      { speaker: "Dr. Harper", text: "I'm listening. Please, go ahead.", emotion: "professional" },
      { speaker: "Lester", text: "All I did was kill my kids. One at a time. Killed them all.", emotion: "haunted" },
      { speaker: "Dr. Harper", text: "Do you mean you actually killed them, or...?", emotion: "cautious" },
      { speaker: "Lester", text: "No. But I was responsible. Denny in 1967. Shirl in 1971. And Andy this year.", emotion: "guilty" },
    ],
  },
  {
    scene: "The Closet",
    characters: ["Lester", "Dr. Harper"],
    dialogue: [
      { speaker: "Lester", text: "What's that? That door.", emotion: "anxious" },
      { speaker: "Dr. Harper", text: "The closet. Where I hang my coat and leave my overshoes.", emotion: "calm" },
      { speaker: "Lester", text: "Open it. I want to see.", emotion: "demanding" },
      { speaker: "Dr. Harper", text: "Of course. There's nothing to fear.", emotion: "reassuring" },
      { speaker: "Lester", text: "All right. All right.", emotion: "relieved" },
    ],
  },
  {
    scene: "Denny's Death",
    characters: ["Lester", "Rita"],
    dialogue: [
      { speaker: "Lester", text: "Denny was crying again. He kept saying 'Boogeyman, Daddy.'", emotion: "troubled" },
      { speaker: "Rita", text: "He's just having nightmares. Children do that.", emotion: "concerned" },
      { speaker: "Lester", text: "I won't put a nightlight. If he doesn't get over being afraid now, he never will.", emotion: "stubborn" },
      { speaker: "Rita", text: "But what if—", emotion: "worried" },
      { speaker: "Lester", text: "He's fine. Stop coddling him.", emotion: "dismissive" },
    ],
  },
];

// Atividades realizadas
const ACTIVITIES = [
  {
    title: "Reading Club Launch Event",
    date: "January 23, 2026",
    type: "Presencial",
    location: "inFlux Jundiaí",
    description: "Apresentação oficial do Reading Club com tema 'The Boogeyman'",
    participants: 15,
    influxcoin: 10,
    highlights: [
      "Apresentação do conceito do Reading Club",
      "Discussão sobre Stephen King e horror literature",
      "Dramatização de cenas do livro",
      "Distribuição de material de divulgação",
    ],
  },
  {
    title: "Vocabulary Workshop",
    date: "January 30, 2026",
    type: "Virtual",
    location: "Plataforma inFlux",
    description: "Workshop de expressões e vocabulário de 'The Boogeyman'",
    participants: 12,
    influxcoin: 7,
    highlights: [
      "Aprendizado de 10 expressões principais",
      "Contexto e uso prático de cada expressão",
      "Quiz interativo com prêmios",
      "Discussão em grupo",
    ],
  },
  {
    title: "Character Analysis Discussion",
    date: "February 6, 2026",
    type: "Presencial",
    location: "inFlux Jundiaí",
    description: "Análise profunda dos personagens e suas motivações",
    participants: 18,
    influxcoin: 8,
    highlights: [
      "Análise de Lester Billings e sua psicologia",
      "Papel de Rita e o impacto emocional",
      "Dr. Harper como observador",
      "Debate sobre culpa e responsabilidade",
    ],
  },
];

export function BoogeymanExperience() {
  const [selectedChunk, setSelectedChunk] = useState(0);
  const [selectedDialogue, setSelectedDialogue] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);

  const handleCompleteActivity = (index: number) => {
    if (!completedActivities.includes(index)) {
      setCompletedActivities([...completedActivities, index]);
      setTotalCoins(totalCoins + ACTIVITIES[index].influxcoin);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-lg p-8 border border-green-500/30 shadow-lg shadow-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">📖 THE BOOGEYMAN</h1>
            <p className="text-gray-300">by Stephen King | Reading Club Experience</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">{totalCoins}</div>
            <div className="text-sm text-gray-400">influxcoin earned</div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="chunks" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-green-500/30">
          <TabsTrigger value="chunks" className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900">
            <BookOpen className="w-4 h-4 mr-2" />
            Chunks
          </TabsTrigger>
          <TabsTrigger value="dialogues" className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900">
            <Users className="w-4 h-4 mr-2" />
            Dialogues
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900">
            <Trophy className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="story" className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900">
            <Play className="w-4 h-4 mr-2" />
            Story
          </TabsTrigger>
        </TabsList>

        {/* Chunks Tab */}
        <TabsContent value="chunks" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chunk List */}
            <div className="lg:col-span-1 space-y-2">
              {VOCABULARY_CHUNKS.map((chunk, idx) => (
                <Button
                  key={idx}
                  variant={selectedChunk === idx ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    selectedChunk === idx
                      ? "bg-green-500 text-slate-900 border-green-400"
                      : "bg-slate-800 border-green-500/30 text-gray-300 hover:bg-slate-700"
                  }`}
                  onClick={() => setSelectedChunk(idx)}
                >
                  <div className="text-sm font-semibold">{chunk.expression}</div>
                </Button>
              ))}
            </div>

            {/* Chunk Details */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-green-500/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-green-400 text-2xl">
                        {VOCABULARY_CHUNKS[selectedChunk].expression}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-2">
                        {VOCABULARY_CHUNKS[selectedChunk].meaning}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-600 text-white">
                      {VOCABULARY_CHUNKS[selectedChunk].difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Example from the text:</h4>
                    <p className="text-gray-300 italic border-l-4 border-green-500 pl-4">
                      "{VOCABULARY_CHUNKS[selectedChunk].example}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Context:</h4>
                    <p className="text-gray-300">
                      {VOCABULARY_CHUNKS[selectedChunk].context}
                    </p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded border border-green-500/20">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">💡 Usage Tip:</h4>
                    <p className="text-gray-300 text-sm">
                      This expression is commonly used in emotional or confessional contexts. Think of moments when someone needs to share a burden or reveal something important.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Dialogues Tab */}
        <TabsContent value="dialogues" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Dialogue List */}
            <div className="lg:col-span-1 space-y-2">
              {DIALOGUES.map((dialogue, idx) => (
                <Button
                  key={idx}
                  variant={selectedDialogue === idx ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    selectedDialogue === idx
                      ? "bg-green-500 text-slate-900 border-green-400"
                      : "bg-slate-800 border-green-500/30 text-gray-300 hover:bg-slate-700"
                  }`}
                  onClick={() => setSelectedDialogue(idx)}
                >
                  <div className="text-sm font-semibold">{dialogue.scene}</div>
                </Button>
              ))}
            </div>

            {/* Dialogue Display */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-slate-800 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Scene: {DIALOGUES[selectedDialogue].scene}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Characters: {DIALOGUES[selectedDialogue].characters.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {DIALOGUES[selectedDialogue].dialogue.map((line, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded border-l-4 ${
                        line.speaker === "Lester"
                          ? "bg-red-900/20 border-red-500 text-red-100"
                          : line.speaker === "Dr. Harper"
                            ? "bg-blue-900/20 border-blue-500 text-blue-100"
                            : "bg-purple-900/20 border-purple-500 text-purple-100"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1">{line.speaker}</div>
                      <div className="text-sm italic">{line.text}</div>
                      <div className="text-xs mt-2 opacity-70">Emotion: {line.emotion}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 text-sm">📝 Discussion Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <p>1. What does Lester's tone reveal about his emotional state?</p>
                  <p>2. How does Dr. Harper's calm demeanor contrast with Lester's anxiety?</p>
                  <p>3. What is the significance of the closet in this dialogue?</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.map((activity, idx) => (
              <Card
                key={idx}
                className={`border-2 transition-all ${
                  completedActivities.includes(idx)
                    ? "bg-green-900/20 border-green-500"
                    : "bg-slate-800 border-green-500/30 hover:border-green-500"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-green-400 text-lg">{activity.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs mt-1">
                        {activity.date}
                      </CardDescription>
                    </div>
                    {completedActivities.includes(idx) && (
                      <Badge className="bg-green-500 text-white">✓ Done</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-green-400">{activity.type}</span> • {activity.location}
                    </p>
                    <p className="text-sm text-gray-300 mt-2">{activity.description}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded text-sm">
                    <p className="text-gray-400 mb-2">
                      👥 {activity.participants} participants
                    </p>
                    <ul className="space-y-1 text-gray-300 text-xs">
                      {activity.highlights.map((highlight, i) => (
                        <li key={i}>✓ {highlight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-green-500/20">
                    <div className="text-yellow-400 font-semibold">
                      +{activity.influxcoin} coins
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteActivity(idx)}
                      disabled={completedActivities.includes(idx)}
                      className={
                        completedActivities.includes(idx)
                          ? "bg-green-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-slate-900"
                      }
                    >
                      {completedActivities.includes(idx) ? "Completed" : "Mark Done"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Story Tab */}
        <TabsContent value="story" className="space-y-4 mt-6">
          <Card className="bg-slate-800 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 text-2xl">🎬 The Boogeyman Story</CardTitle>
              <CardDescription className="text-gray-400">
                An immersive narrative experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900 p-6 rounded border border-green-500/20 space-y-4">
                <div className="text-sm text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    <span className="text-green-400 font-semibold">Lester Billings</span> enters Dr. Harper's office on a cold afternoon. His face is haggard, his eyes hollow with the weight of secrets. He lies on the couch, stiff as a yardstick, unable to relax even for a moment.
                  </p>

                  <p className="mb-4">
                    <span className="text-green-400">"I came to you because I want to tell my story,"</span> he says, his voice barely above a whisper. <span className="text-green-400">"All I did was kill my kids. One at a time. Killed them all."</span>
                  </p>

                  <p className="mb-4">
                    Dr. Harper's pen hovers above his notepad. This is not an ordinary confession. Lester doesn't claim to have murdered his children with his own hands. Instead, he speaks of a darker force—something that emerged from the closet in the dead of night.
                  </p>

                  <p className="mb-4">
                    <span className="text-green-400">"The boogeyman killed them,"</span> Lester insists, his eyes darting toward the doctor's closet door. <span className="text-green-400">"Just came out of the closet and killed them."</span>
                  </p>

                  <p className="mb-4">
                    But is it madness? Or is there something more sinister lurking in the shadows? As Lester recounts the deaths of Denny, Shirl, and Andy, a pattern emerges—each child crying out about the boogeyman before dying under mysterious circumstances. Each time, the closet door is found slightly ajar.
                  </p>

                  <p>
                    The question that haunts us: Did Lester's disbelief and negligence allow something terrible to happen? Or is the boogeyman simply a manifestation of his own guilt and responsibility?
                  </p>
                </div>

                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded mt-6">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-100">
                      <p className="font-semibold mb-1">⚠️ Content Warning</p>
                      <p>This story contains themes of child death, guilt, and psychological horror. Reader discretion is advised.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900 font-semibold py-6">
                <Play className="w-4 h-4 mr-2" />
                Read Full Story
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
