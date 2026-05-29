import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, BookOpen, Headphones, AlertCircle, Lightbulb } from 'lucide-react';
import ToeicExercise from '@/components/ToeicExercise';

interface ToeicPart {
  id: string;
  name: string;
  section: 'listening' | 'reading';
  description: string;
  questions: number;
  duration: string;
  icon: React.ReactNode;
  audioFile?: string;
}

const TOEIC_PARTS: ToeicPart[] = [
  {
    id: 'part1',
    name: 'Part 1: Photographs',
    section: 'listening',
    description: 'Listen to a photograph and choose the best sentence.',
    questions: 6,
    duration: '~5 min',
    icon: <Volume2 className="w-5 h-5" />,
    audioFile: 'https://manus-storage.s3.amazonaws.com/media1_2299f552.mp3',
  },
  {
    id: 'part2',
    name: 'Part 2: Question-Response',
    section: 'listening',
    description: 'Listen to a question and choose the best response.',
    questions: 25,
    duration: '~10 min',
    icon: <Headphones className="w-5 h-5" />,
    audioFile: 'https://manus-storage.s3.amazonaws.com/media2_394ed3b8.mp3',
  },
  {
    id: 'part3',
    name: 'Part 3: Conversations',
    section: 'listening',
    description: 'Listen to conversations and answer questions.',
    questions: 39,
    duration: '~15 min',
    icon: <Headphones className="w-5 h-5" />,
    audioFile: 'https://manus-storage.s3.amazonaws.com/media3_f8f5f36d.mp3',
  },
  {
    id: 'part4',
    name: 'Part 4: Talks',
    section: 'listening',
    description: 'Listen to monologues and answer questions.',
    questions: 30,
    duration: '~15 min',
    icon: <Volume2 className="w-5 h-5" />,
    audioFile: 'https://manus-storage.s3.amazonaws.com/media4_6c8e1659.mp3',
  },
  {
    id: 'part5',
    name: 'Part 5: Incomplete Sentences',
    section: 'reading',
    description: 'Fill in the blank with the correct word or phrase.',
    questions: 30,
    duration: '~10 min',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'part6',
    name: 'Part 6: Text Completion',
    section: 'reading',
    description: 'Complete the text with the correct words or phrases.',
    questions: 16,
    duration: '~8 min',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'part7',
    name: 'Part 7: Reading Comprehension',
    section: 'reading',
    description: 'Read passages and answer comprehension questions.',
    questions: 54,
    duration: '~25 min',
    icon: <BookOpen className="w-5 h-5" />,
  },
];

const TRAPS_AND_TIPS = {
  part1: {
    traps: [
      'Three incorrect sentences with words that sound similar to the recording',
      'Words that sound like the recording but are used incorrectly (e.g., "meeting" vs "sitting")',
      'Sentences that use furniture or location words incorrectly',
    ],
    tips: [
      'Look at the photograph quickly before you hear the answer choices',
      'Ask yourself: Who is in the photo? What is happening? Where was it taken?',
      'Focus on the main action in the photograph',
    ],
  },
  part2: {
    traps: [
      'Words from the question repeated in the response but out of context',
      'Responses that do not directly answer the question',
      'Similar sounding words that change the meaning',
    ],
    tips: [
      'Focus on the words that are easier to hear - not the stressed words',
      'Answer the question as quickly as possible and start preparing for the next one',
      'Pay attention to the beginning of the question (who, where, why, what, can you, etc)',
    ],
  },
  part3: {
    traps: [
      'Words that sound similar in most cases',
      'Words from the question repeated in the response but used out of context',
      'Some expressions or sentences that change the meaning of the conversation',
      'The dialog may compare two or more things',
    ],
    tips: [
      'Try to guess what the conversation is about before listening to it',
      'Do not focus while attempting to answer - read the answer choices after listening',
      'Imagine the speakers and their location',
      'Listen carefully for expressions that indicate time (before, until, while, afterwards, etc)',
    ],
  },
  part4: {
    traps: [
      'Words that sound similar in most cases',
      'Words from the question repeated in the response but used out of context',
      'Some expressions or sentences that change the meaning',
      'Talks are longer than conversations (less information from the speaker)',
    ],
    tips: [
      'Try to guess what the talk is about before listening to it',
      'Do not focus while attempting to answer - read the answer choices after listening',
      'Timing is important - if you cannot answer in 8 seconds, guess and move on',
      'Do not lose focus while attempting to answer the questions',
    ],
  },
  part5: {
    traps: [
      'Many choices are attractive because they seem to complete the meaning of the sentence',
      'Be careful with extra information that may change the meaning',
      'At least one item in each passage will not have enough information alone to answer',
    ],
    tips: [
      'Use the 2-pass method: answer every question in 10 seconds, if unsure, return after reaching the end',
      'Spend no more than 20 seconds on each question',
      'Become familiar with as many key phrases and expressions as possible',
    ],
  },
  part6: {
    traps: [
      'At least one item in each passage will not have enough information alone to answer',
      'Questions are mostly about time, location, and people',
      'Questions involve the use of specific chunks',
    ],
    tips: [
      'Become familiar with as many key phrases and expressions as possible',
      'If in doubt, read the sentence before and after to get context',
      'Do not spend more than 20 seconds on each question',
    ],
  },
  part7: {
    traps: [
      'This is the longest and most important part of the test (48 questions)',
      'Many answer options repeat information from the text but in a different context',
      'Extra information may change the meaning of the exercise',
    ],
    tips: [
      'Read the questions before you read the passage',
      'Do not look at the answer options',
      'Read the passage quickly to get a general idea',
      'Do not worry about words you do not understand',
      'Answer the easier questions first to gather information',
      'Leave the negative questions to be solved last',
      'Always look for the "small print" - if there is extra information, there will be a question about it',
      'Be familiar with the type of passages that will be presented',
    ],
  },
};

export default function ToeicClass() {
  const [, navigate] = useLocation();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exercise'>('overview');

  const listeningParts = TOEIC_PARTS.filter(p => p.section === 'listening');
  const readingParts = TOEIC_PARTS.filter(p => p.section === 'reading');

  const handleStartExercise = (partId: string) => {
    setSelectedPart(partId);
    setActiveTab('exercise');
  };

  const currentPart = TOEIC_PARTS.find(p => p.id === selectedPart);
  const currentTrapsAndTips = selectedPart ? TRAPS_AND_TIPS[selectedPart as keyof typeof TRAPS_AND_TIPS] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TOEIC Class</h1>
          <p className="text-slate-300">Master TOEIC test strategies with interactive exercises and expert tips</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'exercise')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">📚 Overview</TabsTrigger>
            <TabsTrigger value="exercise" disabled={!selectedPart}>
              🎯 Exercise
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Listening Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Headphones className="w-6 h-6 text-pink-500" />
                Listening (45 minutes - 100 questions)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listeningParts.map(part => (
                  <Card
                    key={part.id}
                    className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-all cursor-pointer p-4"
                    onClick={() => handleStartExercise(part.id)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-pink-500">{part.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{part.name}</h3>
                        <p className="text-sm text-slate-400">{part.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400 mb-3">
                      <span>{part.questions} questions</span>
                      <span>{part.duration}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExercise(part.id);
                      }}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      Start Exercise
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reading Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Reading (75 minutes - 100 questions)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readingParts.map(part => (
                  <Card
                    key={part.id}
                    className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all cursor-pointer p-4"
                    onClick={() => handleStartExercise(part.id)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-blue-500">{part.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{part.name}</h3>
                        <p className="text-sm text-slate-400">{part.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400 mb-3">
                      <span>{part.questions} questions</span>
                      <span>{part.duration}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExercise(part.id);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Start Exercise
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Total Test Info */}
            <Card className="bg-gradient-to-r from-pink-900/30 to-blue-900/30 border-slate-700 p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-slate-400 text-sm">Total Duration</p>
                  <p className="text-2xl font-bold text-white">2 hours</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Questions</p>
                  <p className="text-2xl font-bold text-white">200</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Score Range</p>
                  <p className="text-2xl font-bold text-white">10-990</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Exercise Tab */}
          <TabsContent value="exercise" className="space-y-6">
            {currentPart && currentTrapsAndTips && (
              <ToeicExercise
                partId={selectedPart || ''}
                questions={[]}
                onComplete={(score, results) => {
                  console.log(`Quiz completed! Score: ${score}%`, results);
                  alert(`Quiz completed! Your score: ${Math.round(score)}%`);
                }}
              />
            )}
            {currentPart && currentTrapsAndTips && (
              <>
                {/* Part Header */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentPart.name}</h2>
                  <p className="text-slate-300 mb-4">{currentPart.description}</p>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>📊 {currentPart.questions} questions</span>
                    <span>⏱️ {currentPart.duration}</span>
                  </div>
                </Card>

                {/* Audio Player */}
                {currentPart.audioFile && (
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-pink-500" />
                      Listen to Example
                    </h3>
                    <audio
                      controls
                      className="w-full"
                      controlsList="nodownload"
                    >
                      <source src={currentPart.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Card>
                )}

                {/* Traps Section */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Common Traps
                  </h3>
                  <ul className="space-y-3">
                    {currentTrapsAndTips.traps.map((trap, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Tips Section */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Expert Tips
                  </h3>
                  <ul className="space-y-3">
                    {currentTrapsAndTips.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-yellow-500 font-bold">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setActiveTab('overview')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Overview
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Start Practice Quiz
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
