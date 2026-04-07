import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  Plane, Utensils, MapPin, Users, ShoppingBag, Lightbulb, 
  Gamepad2, Rocket, Play, BookOpen, Globe, Volume2,
  Lock, CheckCircle2, Loader2, Pause, Trophy, GraduationCap
} from "lucide-react";
import { VacationQuiz } from "./VacationQuiz";
import { VacationCertificate } from "./VacationCertificate";
import { LessonExpandedContent } from "./vacation-plus-2/LessonExpandedContent";
import { BadgeDisplay } from "./vacation-plus-2/BadgeDisplay";
import { RealEnglishTab } from "./vacation-plus-2/RealEnglishTab";
import { AnimationScriptsTab } from "./vacation-plus-2/AnimationScriptsTab";
import { toast } from "sonner";

// Dados das licoes do Vacation Plus 2
const LESSONS = [
  {
    id: 1,
    title: "Going on Vacation",
    subtitle: "Preparacao para viagem",
    icon: Plane,
    color: "from-cyan-500 to-blue-600",
    shadowColor: "shadow-cyan-500/50",
    topics: ["Preparacao de viagem", "Aeroporto"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "vacation", us: "vacation", uk: "holiday", au: "holiday" },
      { word: "airplane", us: "airplane", uk: "aeroplane", au: "plane" },
      { word: "luggage", us: "luggage/baggage", uk: "luggage", au: "bags" },
      { word: "round-trip", us: "round-trip", uk: "return ticket", au: "return" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "Hey! I'm so pumped for this trip! I've got my bags packed and ready to go. Let's hit the road!", situation: "excited" as const },
      { character: "emily" as const, text: "Oh, how lovely! I've sorted out all my documents and booked a rather nice hotel near the city centre.", situation: "casual" as const },
      { character: "aiko" as const, text: "No worries, mate! I've chucked everything in my backpack. Reckon we'll have a ripper time!", situation: "excited" as const },
    ],
  },
  {
    id: 2,
    title: "Eating Out",
    subtitle: "Restaurantes e delivery",
    icon: Utensils,
    color: "from-orange-500 to-red-600",
    shadowColor: "shadow-orange-500/50",
    topics: ["Restaurantes", "Delivery apps"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "check", us: "check", uk: "bill", au: "bill" },
      { word: "appetizer", us: "appetizer", uk: "starter", au: "entree" },
      { word: "fries", us: "fries", uk: "chips", au: "chips" },
      { word: "takeout", us: "takeout", uk: "takeaway", au: "takeaway" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "I'm starving! Let's grab some pizza. There's this awesome place that does the best New York style slices!", situation: "casual" as const },
      { character: "emily" as const, text: "Shall we pop into that lovely gastropub? They do a brilliant Sunday roast with all the trimmings.", situation: "casual" as const },
      { character: "aiko" as const, text: "How about some brekkie at that cafe near the beach? They've got heaps good smashed avo on toast!", situation: "casual" as const },
    ],
  },
  {
    id: 3,
    title: "Around Town",
    subtitle: "Transporte e direcoes",
    icon: MapPin,
    color: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/50",
    topics: ["Transporte publico", "Direcoes"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "subway", us: "subway", uk: "tube/underground", au: "train" },
      { word: "sidewalk", us: "sidewalk", uk: "pavement", au: "footpath" },
      { word: "downtown", us: "downtown", uk: "city centre", au: "CBD" },
      { word: "crosswalk", us: "crosswalk", uk: "zebra crossing", au: "pedestrian crossing" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "Take the subway to Times Square, then walk two blocks north. You can't miss it!", situation: "explaining" as const },
      { character: "emily" as const, text: "You'll want to take the Tube to Westminster, then it's just a short walk along the Thames.", situation: "explaining" as const },
      { character: "aiko" as const, text: "Just catch the ferry from Circular Quay, mate. It's the best way to see the Harbour Bridge!", situation: "explaining" as const },
    ],
  },
  {
    id: 4,
    title: "Talking About Others",
    subtitle: "Personalidade e relacionamentos",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/50",
    topics: ["Adjetivos de personalidade", "Relacionamentos"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "friendly", us: "friendly/outgoing", uk: "friendly/sociable", au: "friendly/easy-going" },
      { word: "smart", us: "smart", uk: "clever/bright", au: "smart/brainy" },
      { word: "annoying", us: "annoying", uk: "annoying/tiresome", au: "annoying/dodgy" },
      { word: "cool", us: "cool/awesome", uk: "brilliant/lovely", au: "sick/legend" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "My roommate is super chill. He's always down to hang out and grab some food.", situation: "casual" as const },
      { character: "emily" as const, text: "My flatmate is absolutely lovely. She's ever so kind and always makes a proper cup of tea.", situation: "casual" as const },
      { character: "aiko" as const, text: "My housemate's a legend! She's heaps fun and always up for a barbie on the weekend.", situation: "casual" as const },
    ],
  },
  {
    id: 5,
    title: "Spending Money",
    subtitle: "Compras e pagamento",
    icon: ShoppingBag,
    color: "from-yellow-500 to-amber-600",
    shadowColor: "shadow-yellow-500/50",
    topics: ["Compras", "Borrow vs Lend"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "store", us: "store", uk: "shop", au: "shop" },
      { word: "shopping cart", us: "shopping cart", uk: "trolley", au: "trolley" },
      { word: "cash register", us: "cash register", uk: "till", au: "checkout" },
      { word: "sale", us: "sale/discount", uk: "sale/reduced", au: "sale/special" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "Can I borrow twenty bucks? I'll pay you back tomorrow, I swear!", situation: "casual" as const },
      { character: "emily" as const, text: "Would you mind lending me a tenner? I seem to have left my wallet at home.", situation: "formal" as const },
      { character: "aiko" as const, text: "Hey, can you spot me fifty? I'll shout you a coffee next time, no worries!", situation: "casual" as const },
    ],
  },
  {
    id: 6,
    title: "A Piece of Advice",
    subtitle: "Conselhos e sugestoes",
    icon: Lightbulb,
    color: "from-purple-500 to-violet-600",
    shadowColor: "shadow-purple-500/50",
    topics: ["Say vs Tell", "Should"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "should", us: "should/ought to", uk: "should/ought to", au: "should/reckon you should" },
      { word: "advice", us: "advice/tip", uk: "advice/suggestion", au: "advice/heads up" },
      { word: "recommend", us: "recommend", uk: "recommend/suggest", au: "reckon" },
      { word: "careful", us: "be careful", uk: "mind/be careful", au: "watch out" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "You should definitely check out Central Park. Trust me, it's totally worth it!", situation: "explaining" as const },
      { character: "emily" as const, text: "I'd suggest visiting the British Museum. It's free and absolutely fascinating.", situation: "explaining" as const },
      { character: "aiko" as const, text: "Reckon you should hit up Bondi Beach early morning. Way less crowded, mate!", situation: "explaining" as const },
    ],
  },
  {
    id: 7,
    title: "Free Time",
    subtitle: "Hobbies e entretenimento",
    icon: Gamepad2,
    color: "from-indigo-500 to-blue-600",
    shadowColor: "shadow-indigo-500/50",
    topics: ["Hobbies", "Esportes"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "soccer", us: "soccer", uk: "football", au: "soccer/footy" },
      { word: "movie", us: "movie", uk: "film", au: "movie/flick" },
      { word: "hang out", us: "hang out", uk: "meet up", au: "catch up" },
      { word: "weekend", us: "weekend", uk: "weekend", au: "the weekend/arvo" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "On weekends I usually hit the gym, then catch a game with my buddies. Go Yankees!", situation: "casual" as const },
      { character: "emily" as const, text: "I rather enjoy a good book in the park, or perhaps catching a West End show.", situation: "casual" as const },
      { character: "aiko" as const, text: "I'm usually at the beach surfing or having a barbie with mates. Living the dream!", situation: "excited" as const },
    ],
  },
  {
    id: 8,
    title: "Plans For The Future",
    subtitle: "Planos e objetivos",
    icon: Rocket,
    color: "from-teal-500 to-cyan-600",
    shadowColor: "shadow-teal-500/50",
    topics: ["Will vs Going to", "Planos de vida"],
    progress: 0,
    locked: false,
    vocabulary: [
      { word: "gonna", us: "gonna/going to", uk: "going to", au: "gonna/gunna" },
      { word: "will", us: "will/'ll", uk: "will/shall", au: "will/'ll" },
      { word: "plan", us: "plan/goal", uk: "plan/aim", au: "plan/reckon" },
      { word: "dream", us: "dream/goal", uk: "dream/aspiration", au: "dream/bucket list" },
    ],
    dialogues: [
      { character: "lucas" as const, text: "I'm gonna start my own tech company someday. Silicon Valley, here I come!", situation: "excited" as const },
      { character: "emily" as const, text: "I shall be pursuing my Master's at Oxford next year. Quite exciting, really!", situation: "formal" as const },
      { character: "aiko" as const, text: "Reckon I'll travel around Southeast Asia next year. Gonna be epic, mate!", situation: "excited" as const },
    ],
  },
];

// Dados dos personagens - Interface Cinematográfica
const CHARACTERS = [
  {
    id: "lucas" as const,
    name: "Lucas",
    country: "Estados Unidos",
    city: "Nova York",
    flag: "US",
    flagEmoji: "\uD83C\uDDFA\uD83C\uDDF8",
    color: "from-blue-600 to-purple-600",
    avatar: "/images/characters/lucas-nyc.png",
    avatarFront: "/images/characters/lucas-front.png",
    style: "American English",
    expression: "What's up?",
    voiceId: "pNinz6obpgDQGcFmaJgB", // Adam - ElevenLabs
  },
  {
    id: "emily" as const,
    name: "Emily",
    country: "Inglaterra",
    city: "Londres",
    flag: "GB",
    flagEmoji: "\uD83C\uDDEC\uD83C\uDDE7",
    color: "from-amber-500 to-red-600",
    avatar: "/images/characters/emily-london.jpg",
    avatarFront: "/images/characters/emily-front.jpg",
    style: "British English",
    expression: "Lovely!",
    voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte - ElevenLabs
  },
  {
    id: "aiko" as const,
    name: "Aiko",
    country: "Australia",
    city: "Sydney",
    flag: "AU",
    flagEmoji: "\uD83C\uDDE6\uD83C\uDDFA",
    color: "from-blue-500 to-cyan-400",
    avatar: "/images/characters/aiko-sydney.png",
    avatarFront: "/images/characters/aiko-sydney.png",
    style: "Australian English",
    expression: "G'day, mate!",
    voiceId: "cgSgspJ2msm6clMCkdW9", // Jessica - ElevenLabs
  },
];

export function VacationPlus2Content() {
  const [selectedLesson, setSelectedLesson] = useState<typeof LESSONS[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<number, { score: number; total: number }>>({});
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Carregar progresso salvo do banco de dados
  const { data: savedProgress } = trpc.vacationPlus2.getProgress.useQuery();
  const { data: savedQuizResults } = trpc.vacationPlus2.getQuizResults.useQuery();
  
  // Mutation para salvar resultado do quiz
  const saveQuizMutation = trpc.vacationPlus2.saveQuizResult.useMutation({
    onSuccess: (data) => {
      if (data.passed) {
        toast.success("Progresso salvo! Licao concluida!");
      }
    },
    onError: (error) => {
      console.error("Erro ao salvar progresso:", error);
    },
  });

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    if (savedQuizResults) {
      setQuizScores(savedQuizResults);
      const completed = Object.entries(savedQuizResults)
        .filter(([_, result]) => result.passed)
        .map(([lessonId]) => parseInt(lessonId));
      setCompletedLessons(completed);
    }
  }, [savedQuizResults]);

  const speakMutation = trpc.tts.speak.useMutation({
    onError: (error) => {
      toast.error("Erro ao gerar audio: " + error.message);
      setLoadingAudio(null);
    },
  });

  const dialogueMutation = trpc.tts.dialogue.useMutation({
    onError: (error) => {
      toast.error("Erro ao gerar dialogos: " + error.message);
      setLoadingAudio(null);
    },
  });

  const handleLessonClick = (lesson: typeof LESSONS[0]) => {
    if (!lesson.locked) {
      setSelectedLesson(lesson);
      setDialogOpen(true);
    }
  };

  const playCharacterAudio = async (character: "lucas" | "emily" | "aiko", text: string, situation?: "greeting" | "explaining" | "excited" | "casual" | "formal") => {
    const cacheKey = `${character}-${text}`;
    const audioId = character + "-" + text.substring(0, 20);
    
    // Toggle pause if already playing
    if (playingAudio === audioId && audioRef.current) {
      audioRef.current.pause();
      setPlayingAudio(null);
      return;
    }

    setLoadingAudio(audioId);
    toast.info(`Gerando audio de ${character}...`);

    try {
      let audioUrl = audioCache[cacheKey];
      
      // Check cache first to save ElevenLabs characters
      if (!audioUrl) {
        const result = await speakMutation.mutateAsync({
          text,
          character,
          situation,
        });
        audioUrl = result.audioUrl;
        
        // Cache the audio URL
        setAudioCache(prev => ({ ...prev, [cacheKey]: audioUrl }));
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Set up event handlers before loading
      audio.onended = () => {
        setPlayingAudio(null);
      };

      audio.onerror = () => {
        toast.error("Erro ao carregar audio");
        setPlayingAudio(null);
        setLoadingAudio(null);
      };

      // Try to play directly - modern browsers handle buffering
      audio.onloadeddata = () => {
        audio.play().then(() => {
          setPlayingAudio(audioId);
          setLoadingAudio(null);
          toast.success(`Tocando ${character}!`);
        }).catch((err) => {
          // If autoplay is blocked, show a message
          if (err.name === 'NotAllowedError') {
            toast.error("Clique novamente para ouvir (autoplay bloqueado)");
          } else {
            toast.error("Erro ao reproduzir audio");
          }
          setPlayingAudio(null);
          setLoadingAudio(null);
        });
      };

      // Start loading the audio
      audio.load();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro: ${errorMessage}`);
      setLoadingAudio(null);
    }
  };

  const playAllDialogues = async (dialogues: typeof LESSONS[0]["dialogues"]) => {
    if (!dialogues || dialogues.length === 0) return;

    setLoadingAudio("all-dialogues");

    try {
      const result = await dialogueMutation.mutateAsync({
        lines: dialogues.map(d => ({
          character: d.character,
          text: d.text,
          situation: d.situation,
        })),
      });

      setLoadingAudio(null);

      for (let i = 0; i < result.dialogue.length; i++) {
        const line = result.dialogue[i];
        
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(line.audioUrl);
          audioRef.current = audio;
          
          setPlayingAudio("dialogue-" + i);
          
          audio.onended = () => {
            setPlayingAudio(null);
            setTimeout(resolve, 500);
          };

          audio.onerror = () => {
            setPlayingAudio(null);
            reject(new Error("Erro ao reproduzir audio"));
          };

          audio.play().catch(reject);
        });
      }

      toast.success("Dialogos reproduzidos com sucesso!");
    } catch (error) {
      setLoadingAudio(null);
      setPlayingAudio(null);
    }
  };

  const playVocabularyComparison = async (word: string, variants: { us: string; uk: string; au: string }) => {
    const characters: Array<{ id: "lucas" | "emily" | "aiko"; variant: string }> = [
      { id: "lucas", variant: variants.us },
      { id: "emily", variant: variants.uk },
      { id: "aiko", variant: variants.au },
    ];

    for (const char of characters) {
      setLoadingAudio("vocab-" + char.id);
      
      try {
        const result = await speakMutation.mutateAsync({
          text: char.variant,
          character: char.id,
        });

        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(result.audioUrl);
          audioRef.current = audio;
          
          setPlayingAudio("vocab-" + char.id);
          setLoadingAudio(null);
          
          audio.onended = () => {
            setPlayingAudio(null);
            setTimeout(resolve, 300);
          };

          audio.onerror = reject;
          audio.play().catch(reject);
        });
      } catch (error) {
        setLoadingAudio(null);
        setPlayingAudio(null);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-600 via-green-500 to-purple-600 p-1">
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 
              className="text-3xl md:text-4xl font-black tracking-wider text-white"
              style={{
                textShadow: "0 0 10px rgba(0,255,136,0.8), 0 0 20px rgba(0,212,255,0.6), 0 0 30px rgba(255,0,255,0.4)",
              }}
            >
              VACATION PLUS 2
            </h2>
            <Badge className="bg-gradient-to-r from-cyan-500 to-green-500 text-white border-0">
              Material Expandido
            </Badge>
          </div>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Aprenda ingles com Lucas {CHARACTERS[0].flagEmoji}, Emily {CHARACTERS[1].flagEmoji} e Aiko {CHARACTERS[2].flagEmoji}! 
            Descubra costumes, vocabulario e expressoes de Nova York, Londres e Sydney.
          </p>
        </div>
      </div>

      {/* Characters Section - Cinematic Vertical Panels */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Seus Guias Culturais</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Clique nos personagens para ouvir suas vozes autênticas!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHARACTERS.map((char) => {
            const audioId = char.id + "-" + char.expression.substring(0, 20);
            const isLoading = loadingAudio === audioId;
            const isPlaying = playingAudio === audioId;
            
            return (
              <div 
                key={char.name}
                className="relative group cursor-pointer"
                onClick={() => playCharacterAudio(char.id, char.expression, "greeting")}
              >
                {/* Cinematic Card with Full Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-cyan-500/20">
                  {/* Background Image */}
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={char.avatar} 
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Playing Indicator */}
                    {isPlaying && (
                      <div className="absolute top-4 right-4 bg-cyan-500 rounded-full p-2 animate-pulse">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="absolute top-4 right-4 bg-slate-800/80 rounded-full p-2">
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      </div>
                    )}
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Name */}
                      <h4 className="text-3xl font-bold text-white mb-1 tracking-wide">
                        {char.name}
                      </h4>
                      
                      {/* Flag */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{char.flagEmoji}</span>
                        <span className="text-white/80 text-sm font-medium">{char.style}</span>
                      </div>
                      
                      {/* Expression */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                        <p className="text-cyan-300 font-medium italic">
                          "{char.expression}"
                        </p>
                      </div>
                      
                      {/* Play Button */}
                      <div className="mt-4 flex items-center gap-2 text-white/70 text-sm group-hover:text-cyan-400 transition-colors">
                        {isPlaying ? (
                          <><Pause className="w-4 h-4" /> Pausar</>
                        ) : isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</>
                        ) : (
                          <><Play className="w-4 h-4" /> Clique para ouvir</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <BadgeDisplay completedLessons={completedLessons} />

      {/* Animation Stories Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <AnimationScriptsTab />
      </div>

      {/* Lessons Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          8 Licoes Interativas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LESSONS.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <Card 
                key={lesson.id}
                className={
                  "relative overflow-hidden cursor-pointer transition-all duration-300 " +
                  (lesson.locked 
                    ? "bg-slate-800/30 border-slate-700/50 opacity-60" 
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:scale-[1.02] hover:shadow-xl")
                }
                onClick={() => handleLessonClick(lesson)}
              >
                {/* Lesson Number Badge */}
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={"w-10 h-10 rounded-full bg-gradient-to-br " + lesson.color + " flex items-center justify-center shadow-lg " + lesson.shadowColor}>
                      <span className="text-white font-bold">{lesson.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm">{lesson.title}</h4>
                      <p className="text-xs text-slate-400">{lesson.subtitle}</p>
                    </div>
                    {lesson.locked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : lesson.progress === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : null}
                  </div>

                  <div className={"p-2 rounded-lg bg-gradient-to-br " + lesson.color + " mb-3"}>
                    <Icon className="w-6 h-6 text-white mx-auto" />
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {lesson.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 border-slate-600 text-slate-400">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {!lesson.locked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Progresso</span>
                        <span className="text-slate-300">{lesson.progress}%</span>
                      </div>
                      <Progress value={lesson.progress} className="h-1.5 bg-slate-700" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lesson Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          {selectedLesson && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={"p-3 rounded-xl bg-gradient-to-br " + selectedLesson.color}>
                    <selectedLesson.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">
                      Lesson {selectedLesson.id}: {selectedLesson.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {selectedLesson.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                    Visao Geral
                  </TabsTrigger>
                  <TabsTrigger value="chunks" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                    Chunks
                  </TabsTrigger>
                  <TabsTrigger value="vocabulary" className="data-[state=active]:bg-slate-700">
                    Vocabulario
                  </TabsTrigger>
                  <TabsTrigger value="dialogues" className="data-[state=active]:bg-slate-700">
                    Dialogos
                  </TabsTrigger>
                  <TabsTrigger value="real-english" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                    Real English
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {CHARACTERS.map((char) => (
                      <Card key={char.name} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={char.avatar} 
                              alt={char.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-white flex items-center gap-1">
                                {char.name} {char.flagEmoji}
                              </h4>
                              <p className="text-xs text-slate-400">{char.style}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300">
                            Aprenda como {char.name} de {char.city} aborda o tema "{selectedLesson.title}"
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className={"flex-1 bg-gradient-to-r " + selectedLesson.color + " hover:opacity-90"}
                      onClick={() => setShowQuiz(true)}
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Fazer Quiz
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      onClick={() => playAllDialogues(selectedLesson.dialogues)}
                      disabled={loadingAudio === "all-dialogues" || dialogueMutation.isPending}
                    >
                      {loadingAudio === "all-dialogues" || dialogueMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Volume2 className="w-4 h-4 mr-2" />
                      )}
                      Ouvir Dialogos
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="chunks" className="mt-4">
                  <LessonExpandedContent 
                    lessonId={selectedLesson.id} 
                    lessonTitle={selectedLesson.title} 
                  />
                </TabsContent>

                <TabsContent value="vocabulary" className="mt-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Vocabulario Regional</CardTitle>
                      <CardDescription className="text-slate-400">
                        Clique no icone de som para ouvir a pronuncia de cada variante
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedLesson.vocabulary?.map((vocab, idx) => (
                          <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-white capitalize">{vocab.word}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cyan-400 hover:text-cyan-300"
                                onClick={() => playVocabularyComparison(vocab.word, vocab)}
                                disabled={loadingAudio?.startsWith("vocab-")}
                              >
                                {loadingAudio?.startsWith("vocab-") ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                                <span className="ml-1 text-xs">Comparar</span>
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{CHARACTERS[0].flagEmoji}</span>
                                <span className={"text-slate-300 " + (playingAudio === "vocab-lucas" ? "text-cyan-400 font-bold" : "")}>
                                  {vocab.us}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{CHARACTERS[1].flagEmoji}</span>
                                <span className={"text-slate-300 " + (playingAudio === "vocab-emily" ? "text-cyan-400 font-bold" : "")}>
                                  {vocab.uk}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{CHARACTERS[2].flagEmoji}</span>
                                <span className={"text-slate-300 " + (playingAudio === "vocab-aiko" ? "text-cyan-400 font-bold" : "")}>
                                  {vocab.au}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dialogues" className="mt-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Dialogos Situacionais</CardTitle>
                      <CardDescription className="text-slate-400">
                        Ouca como cada personagem se expressa sobre o tema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedLesson.dialogues?.map((dialogue, idx) => {
                        const char = CHARACTERS.find(c => c.id === dialogue.character);
                        const audioId = dialogue.character + "-" + dialogue.text.substring(0, 20);
                        const isPlaying = playingAudio === audioId || playingAudio === ("dialogue-" + idx);
                        const isLoading = loadingAudio === audioId;
                        
                        return (
                          <div 
                            key={idx} 
                            className={"flex gap-3 p-3 rounded-lg transition-all " + (isPlaying ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-slate-700/30")}
                          >
                            <img 
                              src={char?.avatar} 
                              alt={char?.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white">{char?.name}</span>
                                <span>{char?.flagEmoji}</span>
                              </div>
                              <p className={"text-sm " + (isPlaying ? "text-cyan-300" : "text-slate-300")}>
                                "{dialogue.text}"
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={"flex-shrink-0 " + (isPlaying ? "text-cyan-400" : "text-slate-400") + " hover:text-cyan-300"}
                              onClick={() => playCharacterAudio(dialogue.character, dialogue.text, dialogue.situation)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : isPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        );
                      })}

                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90"
                        onClick={() => playAllDialogues(selectedLesson.dialogues)}
                        disabled={loadingAudio === "all-dialogues" || dialogueMutation.isPending}
                      >
                        {loadingAudio === "all-dialogues" || dialogueMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Ouvir Todos os Dialogos
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="real-english" className="mt-4">
                  <RealEnglishTab lessonId={`lesson0${selectedLesson.id}`} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      {showQuiz && selectedLesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <VacationQuiz
            lessonId={selectedLesson.id}
            lessonTitle={selectedLesson.title}
            onComplete={(score, total) => {
              const passed = score / total >= 0.6;
              setQuizScores(prev => ({ ...prev, [selectedLesson.id]: { score, total } }));
              
              // Salvar resultado no banco de dados
              saveQuizMutation.mutate({
                lessonNumber: selectedLesson.id,
                score,
                totalQuestions: total,
                passed,
              });
              
              if (passed && !completedLessons.includes(selectedLesson.id)) {
                setCompletedLessons(prev => [...prev, selectedLesson.id]);
                toast.success(`Licao ${selectedLesson.id} concluida!`);
                
                // Check if all lessons completed
                if (completedLessons.length + 1 >= 8) {
                  setTimeout(() => {
                    setShowCertificate(true);
                  }, 2000);
                }
              }
            }}
            onClose={() => {
              setShowQuiz(false);
            }}
          />
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <VacationCertificate
          studentName="Estevao Cordeiro"
          completionDate={new Date()}
          lessonsCompleted={completedLessons.length}
          totalLessons={8}
          averageScore={Math.round(
            Object.values(quizScores).reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / 
            Math.max(Object.keys(quizScores).length, 1)
          )}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Certificate Button - Show when all lessons completed */}
      {completedLessons.length >= 8 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/30"
            onClick={() => setShowCertificate(true)}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Ver Certificado
          </Button>
        </div>
      )}
    </div>
  );
}

export default VacationPlus2Content;
