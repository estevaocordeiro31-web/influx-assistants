import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy, Volume2, RotateCcw, ArrowRight, Star, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  character: "lucas" | "emily" | "aiko";
  audioText?: string;
}

interface VacationQuizProps {
  lessonId: number;
  lessonTitle: string;
  onComplete: (score: number, total: number) => void;
  onClose: () => void;
}

// Quiz questions for each lesson
const QUIZ_DATA: Record<number, QuizQuestion[]> = {
  1: [ // Going on Vacation
    {
      id: 1,
      question: "How would Lucas (American) say he's excited about the trip?",
      options: ["I'm quite looking forward to it", "I'm pumped for this trip!", "No worries, it'll be great", "I'm rather excited"],
      correctAnswer: 1,
      explanation: "Americans often use 'pumped' to express excitement. It's casual and energetic!",
      character: "lucas",
      audioText: "I'm pumped for this trip! Can't wait to hit the road!"
    },
    {
      id: 2,
      question: "What does Emily (British) mean when she says 'I've sorted out my luggage'?",
      options: ["She lost her luggage", "She organized/packed her luggage", "She bought new luggage", "She's looking for her luggage"],
      correctAnswer: 1,
      explanation: "'Sorted out' is British English for organized or arranged. Very common expression!",
      character: "emily",
      audioText: "I've sorted out my luggage. Everything's packed and ready!"
    },
    {
      id: 3,
      question: "Aiko (Australian) says 'She'll be right, mate!' What does this mean?",
      options: ["She is correct", "The woman will arrive", "Everything will be fine", "Turn right"],
      correctAnswer: 2,
      explanation: "'She'll be right' is classic Australian slang meaning 'everything will be okay'!",
      character: "aiko",
      audioText: "She'll be right, mate! Don't stress about the flight delay!"
    },
    {
      id: 4,
      question: "Which is the correct American English term for 'holiday'?",
      options: ["Holiday", "Vacation", "Break", "Leave"],
      correctAnswer: 1,
      explanation: "Americans say 'vacation' while British and Australians say 'holiday'.",
      character: "lucas",
      audioText: "I'm taking a two-week vacation to visit my family."
    },
    {
      id: 5,
      question: "How would a British person typically say goodbye at the airport?",
      options: ["See ya!", "Cheers, safe travels!", "Later, dude!", "Catch ya!"],
      correctAnswer: 1,
      explanation: "'Cheers' is a versatile British word used for thanks, goodbye, and toasts!",
      character: "emily",
      audioText: "Cheers, safe travels! Do let me know when you've arrived!"
    }
  ],
  2: [ // Eating Out
    {
      id: 1,
      question: "Lucas wants to order food delivery. Which app would he likely use in NYC?",
      options: ["Deliveroo", "Menulog", "DoorDash", "Just Eat"],
      correctAnswer: 2,
      explanation: "DoorDash, Uber Eats, and Grubhub are the most popular delivery apps in the USA.",
      character: "lucas",
      audioText: "Let me check DoorDash real quick. I'm craving some pizza!"
    },
    {
      id: 2,
      question: "What does Emily mean when she asks for the 'bill' at a restaurant?",
      options: ["A dollar note", "The menu", "The check/receipt to pay", "A bird"],
      correctAnswer: 2,
      explanation: "British people say 'bill' while Americans say 'check' when asking to pay.",
      character: "emily",
      audioText: "Excuse me, could we have the bill, please?"
    },
    {
      id: 3,
      question: "Aiko says she's going to grab some 'brekkie'. What is that?",
      options: ["Lunch", "Dinner", "Breakfast", "Snack"],
      correctAnswer: 2,
      explanation: "'Brekkie' is Australian slang for breakfast. Aussies love shortening words!",
      character: "aiko",
      audioText: "I'm starving! Let's grab some brekkie at that cafe."
    },
    {
      id: 4,
      question: "What's the typical tip percentage in American restaurants?",
      options: ["No tip expected", "5-10%", "15-20%", "30-40%"],
      correctAnswer: 2,
      explanation: "In the USA, 15-20% tip is standard. In the UK and Australia, tipping is less common.",
      character: "lucas",
      audioText: "The service was great, I'll leave a 20% tip."
    },
    {
      id: 5,
      question: "Emily orders 'chips' at a British restaurant. What will she receive?",
      options: ["Potato chips/crisps", "French fries", "Tortilla chips", "Chocolate chips"],
      correctAnswer: 1,
      explanation: "British 'chips' = American 'fries'. British 'crisps' = American 'chips'!",
      character: "emily",
      audioText: "I'll have the fish and chips, please. Lovely!"
    }
  ],
  3: [ // Around Town
    {
      id: 1,
      question: "Lucas needs to take public transport. What would he call the underground train in NYC?",
      options: ["The Tube", "The Metro", "The Subway", "The Underground"],
      correctAnswer: 2,
      explanation: "New Yorkers call it 'the subway'. Londoners say 'the Tube' or 'Underground'.",
      character: "lucas",
      audioText: "I'll take the subway downtown. It's faster than a cab."
    },
    {
      id: 2,
      question: "Emily asks for directions to the 'chemist'. What is she looking for?",
      options: ["A scientist", "A pharmacy/drugstore", "A laboratory", "A chemistry teacher"],
      correctAnswer: 1,
      explanation: "'Chemist' is British English for pharmacy. Americans say 'drugstore' or 'pharmacy'.",
      character: "emily",
      audioText: "Excuse me, is there a chemist nearby? I need some paracetamol."
    },
    {
      id: 3,
      question: "Aiko mentions she's taking the 'arvo' off. What time of day is that?",
      options: ["Morning", "Afternoon", "Evening", "Night"],
      correctAnswer: 1,
      explanation: "'Arvo' is Australian slang for afternoon. Another example of Aussie word shortening!",
      character: "aiko",
      audioText: "I'm taking the arvo off to go to the beach. Heaps good weather today!"
    },
    {
      id: 4,
      question: "What do British people call the first floor of a building?",
      options: ["First floor", "Ground floor", "Lobby", "Main floor"],
      correctAnswer: 1,
      explanation: "British 'ground floor' = American 'first floor'. British 'first floor' = American 'second floor'!",
      character: "emily",
      audioText: "The shop is on the ground floor, just past the lift."
    },
    {
      id: 5,
      question: "Lucas says he's going to 'grab a cab'. What does this mean?",
      options: ["Catch a taxi", "Buy a cabinet", "Get a crab", "Take a nap"],
      correctAnswer: 0,
      explanation: "'Grab a cab' is casual American English for taking a taxi.",
      character: "lucas",
      audioText: "I'm gonna grab a cab to the airport. Traffic's crazy today!"
    }
  ],
  4: [ // Talking About Others
    {
      id: 1,
      question: "Lucas describes his friend as 'laid-back'. What does this mean?",
      options: ["Tired", "Relaxed and easy-going", "Lying down", "Lazy"],
      correctAnswer: 1,
      explanation: "'Laid-back' means relaxed, calm, and easy-going. Common in American English!",
      character: "lucas",
      audioText: "My roommate is super laid-back. Nothing ever stresses him out."
    },
    {
      id: 2,
      question: "Emily says her colleague is 'quite reserved'. What does she mean?",
      options: ["Has a reservation", "Is shy and quiet", "Is very loud", "Is booked for something"],
      correctAnswer: 1,
      explanation: "'Reserved' means quiet, shy, or not showing emotions openly. Very British description!",
      character: "emily",
      audioText: "She's quite reserved at first, but lovely once you get to know her."
    },
    {
      id: 3,
      question: "Aiko describes someone as a 'legend'. In Australian slang, this means:",
      options: ["A famous person", "An old story", "A great/awesome person", "A mythical creature"],
      correctAnswer: 2,
      explanation: "In Australian slang, calling someone a 'legend' means they're great or awesome!",
      character: "aiko",
      audioText: "My mate helped me move house. What a legend!"
    },
    {
      id: 4,
      question: "What does 'mate' mean in Australian English?",
      options: ["Partner/spouse", "Friend/buddy", "Roommate", "Soulmate"],
      correctAnswer: 1,
      explanation: "'Mate' is the Australian (and British) equivalent of 'buddy' or 'friend'.",
      character: "aiko",
      audioText: "G'day mate! How's it going?"
    },
    {
      id: 5,
      question: "Lucas says his boss is 'super chill'. This means:",
      options: ["Very cold", "Very relaxed and cool", "Very sick", "Very strict"],
      correctAnswer: 1,
      explanation: "'Chill' in American slang means relaxed, calm, and easy to be around.",
      character: "lucas",
      audioText: "My boss is super chill. She never micromanages us."
    }
  ],
  5: [ // Spending Money
    {
      id: 1,
      question: "Lucas asks 'Can I put this on my card?' What does he want to do?",
      options: ["Write on a card", "Pay with credit/debit card", "Put something in a box", "Send a postcard"],
      correctAnswer: 1,
      explanation: "'Put it on my card' means to pay using a credit or debit card.",
      character: "lucas",
      audioText: "Can I put this on my card? I don't have any cash on me."
    },
    {
      id: 2,
      question: "Emily says something is 'a bit pricey'. What does she mean?",
      options: ["Very cheap", "Somewhat expensive", "Free", "On sale"],
      correctAnswer: 1,
      explanation: "'Pricey' means expensive. 'A bit pricey' is a polite British way to say it's costly.",
      character: "emily",
      audioText: "That restaurant is a bit pricey, but the food is absolutely divine."
    },
    {
      id: 3,
      question: "Aiko says she got a 'bargain'. What happened?",
      options: ["She paid full price", "She got a good deal/discount", "She returned something", "She borrowed money"],
      correctAnswer: 1,
      explanation: "A 'bargain' means you got something at a good price or with a discount.",
      character: "aiko",
      audioText: "I got these sunnies for half price! What a bargain!"
    },
    {
      id: 4,
      question: "What's the difference between 'borrow' and 'lend'?",
      options: ["They mean the same thing", "Borrow = take, Lend = give", "Borrow = give, Lend = take", "Both mean to buy"],
      correctAnswer: 1,
      explanation: "You BORROW something FROM someone. You LEND something TO someone.",
      character: "emily",
      audioText: "Could I borrow your umbrella? I'll lend you mine tomorrow."
    },
    {
      id: 5,
      question: "Lucas says 'I'm broke'. What does this mean?",
      options: ["He's injured", "He has no money", "He's broken something", "He's tired"],
      correctAnswer: 1,
      explanation: "'Broke' is slang for having no money. Very common in American English!",
      character: "lucas",
      audioText: "I can't go out tonight. I'm totally broke until payday."
    }
  ],
  6: [ // A Piece of Advice
    {
      id: 1,
      question: "Lucas says 'You should totally check it out!' What is he doing?",
      options: ["Giving an order", "Making a suggestion/recommendation", "Asking a question", "Making a complaint"],
      correctAnswer: 1,
      explanation: "'Should' is used for giving advice or recommendations. 'Totally' adds enthusiasm!",
      character: "lucas",
      audioText: "That new coffee shop is amazing. You should totally check it out!"
    },
    {
      id: 2,
      question: "Emily says 'I'd advise against it'. What does she mean?",
      options: ["She recommends it", "She doesn't recommend it", "She's not sure", "She wants to try it"],
      correctAnswer: 1,
      explanation: "'Advise against' means to recommend NOT doing something. Polite British phrasing!",
      character: "emily",
      audioText: "I'd advise against taking that route. The traffic is dreadful."
    },
    {
      id: 3,
      question: "What's the difference between 'say' and 'tell'?",
      options: ["They're exactly the same", "Say needs an object, Tell doesn't", "Tell needs an object (person), Say doesn't", "Say is formal, Tell is informal"],
      correctAnswer: 2,
      explanation: "TELL needs a person: 'Tell me'. SAY doesn't: 'Say something'. Never 'Say me'!",
      character: "emily",
      audioText: "She told me the news. She said it was important."
    },
    {
      id: 4,
      question: "Aiko says 'No worries, just give it a go!' What is she suggesting?",
      options: ["Don't worry, just try it", "Don't go anywhere", "Stop worrying about everything", "Give it to someone"],
      correctAnswer: 0,
      explanation: "'Give it a go' is Australian/British for 'try it'. Very encouraging expression!",
      character: "aiko",
      audioText: "No worries, just give it a go! You might surprise yourself!"
    },
    {
      id: 5,
      question: "Which sentence uses 'should' correctly for advice?",
      options: ["You should to study more", "You should studying more", "You should study more", "You should studied more"],
      correctAnswer: 2,
      explanation: "'Should' is followed by the base form of the verb (infinitive without 'to').",
      character: "lucas",
      audioText: "You should study more if you want to pass the exam."
    }
  ],
  7: [ // Free Time
    {
      id: 1,
      question: "Lucas says he's 'into fitness'. What does this mean?",
      options: ["He's inside a gym", "He's interested in/enjoys fitness", "He's tired of fitness", "He's a fitness instructor"],
      correctAnswer: 1,
      explanation: "'Into something' means you're interested in or enjoy that activity.",
      character: "lucas",
      audioText: "I'm really into fitness. I hit the gym like five times a week."
    },
    {
      id: 2,
      question: "Emily says she enjoys 'having a cuppa'. What is a 'cuppa'?",
      options: ["A cupcake", "A cup of tea", "A cup of coffee", "A small cup"],
      correctAnswer: 1,
      explanation: "'Cuppa' is British slang for a cup of tea. Tea is essential in British culture!",
      character: "emily",
      audioText: "I love having a cuppa while reading a good book. So relaxing!"
    },
    {
      id: 3,
      question: "Aiko mentions she went 'surfing at Bondi'. Where is Bondi?",
      options: ["New York", "London", "Sydney", "Tokyo"],
      correctAnswer: 2,
      explanation: "Bondi Beach is one of the most famous beaches in Sydney, Australia!",
      character: "aiko",
      audioText: "The waves at Bondi were heaps good today! Best surf session ever!"
    },
    {
      id: 4,
      question: "What does 'hang out' mean in casual English?",
      options: ["Hang clothes outside", "Spend time relaxing with friends", "Exercise", "Go shopping"],
      correctAnswer: 1,
      explanation: "'Hang out' means to spend casual time with friends, doing nothing specific.",
      character: "lucas",
      audioText: "Wanna hang out this weekend? We could grab some food or something."
    },
    {
      id: 5,
      question: "Emily says she's 'keen on' photography. This means:",
      options: ["She dislikes photography", "She's interested in/enjoys photography", "She's a professional photographer", "She's looking at photos"],
      correctAnswer: 1,
      explanation: "'Keen on' is British English for being interested in or enthusiastic about something.",
      character: "emily",
      audioText: "I'm quite keen on photography. I've just bought a new camera!"
    }
  ],
  8: [ // Plans For The Future
    {
      id: 1,
      question: "Lucas says 'I'm gonna travel the world'. What tense is this?",
      options: ["Present simple", "Past simple", "Future with 'going to'", "Present continuous"],
      correctAnswer: 2,
      explanation: "'Gonna' is informal American English for 'going to', used for future plans!",
      character: "lucas",
      audioText: "I'm gonna travel the world after I graduate. Can't wait!"
    },
    {
      id: 2,
      question: "What's the difference between 'will' and 'going to' for future?",
      options: ["They're exactly the same", "Will = spontaneous decisions, Going to = planned", "Going to = spontaneous, Will = planned", "Will is formal, Going to is informal"],
      correctAnswer: 1,
      explanation: "'Will' is for spontaneous decisions. 'Going to' is for pre-planned intentions.",
      character: "emily",
      audioText: "I'm going to study abroad next year. I've already applied!"
    },
    {
      id: 3,
      question: "Aiko says 'I reckon I'll move to Melbourne'. What does 'reckon' mean?",
      options: ["I know for sure", "I think/believe", "I hope", "I doubt"],
      correctAnswer: 1,
      explanation: "'Reckon' is Australian/British slang for 'think' or 'believe'.",
      character: "aiko",
      audioText: "I reckon I'll move to Melbourne next year. Heaps of job opportunities there!"
    },
    {
      id: 4,
      question: "Which sentence expresses a spontaneous decision?",
      options: ["I'm going to call her tomorrow", "I'll help you with that!", "I'm planning to visit Paris", "I've decided to learn French"],
      correctAnswer: 1,
      explanation: "'I'll help you' is spontaneous - decided at the moment of speaking. Perfect use of 'will'!",
      character: "lucas",
      audioText: "Oh, you need help? I'll give you a hand right now!"
    },
    {
      id: 5,
      question: "Emily says 'I shall be travelling in June'. Is this correct?",
      options: ["No, 'shall' is never used", "Yes, 'shall' is formal British English for future", "No, it should be 'will be travelling'", "Yes, but only in questions"],
      correctAnswer: 1,
      explanation: "'Shall' is formal British English, often used with 'I' and 'we' for future. Less common in American English.",
      character: "emily",
      audioText: "I shall be travelling to Scotland in June. Quite looking forward to it!"
    }
  ]
};

export function VacationQuiz({ lessonId, lessonTitle, onComplete, onClose }: VacationQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = QUIZ_DATA[lessonId] || QUIZ_DATA[1];
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const speakMutation = trpc.tts.speak.useMutation();

  const playAudio = async () => {
    if (!question.audioText || isPlaying) return;
    
    setIsPlaying(true);
    try {
      const result = await speakMutation.mutateAsync({
        text: question.audioText,
        character: question.character
      });
      
      if (result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === question.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswers([...answers, isCorrect]);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      onComplete(score + (selectedAnswer === question.correctAnswer ? 1 : 0), questions.length);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getCharacterColor = (character: string) => {
    switch (character) {
      case "lucas": return "from-blue-500 to-purple-600";
      case "emily": return "from-pink-500 to-orange-500";
      case "aiko": return "from-purple-500 to-cyan-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getCharacterFlag = (character: string) => {
    switch (character) {
      case "lucas": return "🇺🇸";
      case "emily": return "🇬🇧";
      case "aiko": return "🇦🇺";
      default: return "🌍";
    }
  };

  if (quizCompleted) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassing = percentage >= 60;

    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {isPassing ? (
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-400" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <RotateCcw className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl text-white">
            {isPassing ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
              {finalScore}/{questions.length}
            </div>
            <p className="text-gray-400">
              {percentage}% correct
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {answers.map((correct, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Your Performance:</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {isPassing ? (
                <>
                  <p>✅ Great job understanding the cultural differences!</p>
                  <p>✅ You're ready to communicate with native speakers!</p>
                  <p>✅ Keep practicing to master these expressions!</p>
                </>
              ) : (
                <>
                  <p>📚 Review the lesson content again</p>
                  <p>🎧 Listen to the dialogues multiple times</p>
                  <p>💪 Try the quiz again when you're ready!</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={restartQuiz}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
              onClick={onClose}
            >
              {isPassing ? "Continue" : "Back to Lesson"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="border-cyan-500 text-cyan-400">
            {lessonTitle}
          </Badge>
          <Badge className="bg-gray-700 text-gray-300">
            Question {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Character indicator */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCharacterColor(question.character)} flex items-center justify-center text-2xl`}>
            {getCharacterFlag(question.character)}
          </div>
          <div>
            <p className="text-white font-medium capitalize">{question.character}</p>
            <p className="text-gray-400 text-sm">
              {question.character === "lucas" ? "New York, USA" : 
               question.character === "emily" ? "London, UK" : "Sydney, Australia"}
            </p>
          </div>
          {question.audioText && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              onClick={playAudio}
              disabled={isPlaying}
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
            </Button>
          )}
        </div>

        {/* Question */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg text-white font-medium">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            const showCorrectness = showResult;

            let buttonClass = "w-full p-4 text-left rounded-lg border transition-all ";
            
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-500/20 text-green-400";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-500/20 text-red-400";
              } else {
                buttonClass += "border-gray-700 bg-gray-800/50 text-gray-500";
              }
            } else {
              buttonClass += isSelected
                ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50";
            }

            return (
              <button
                key={idx}
                className={buttonClass}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                  {showCorrectness && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 ml-auto text-green-400" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 ml-auto text-red-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer 
              ? "bg-green-500/10 border border-green-500/30" 
              : "bg-orange-500/10 border border-orange-500/30"
          }`}>
            <p className={`text-sm ${
              selectedAnswer === question.correctAnswer ? "text-green-400" : "text-orange-400"
            }`}>
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
            onClick={nextQuestion}
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {/* Score indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>Current Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
