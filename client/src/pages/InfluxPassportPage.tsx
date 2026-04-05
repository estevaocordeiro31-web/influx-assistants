import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EllieFloatingAvatar } from '@/components/EllieFloatingAvatar';
import {
  BookOpen,
  Zap,
  Users,
  Trophy,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'completed' | 'in-progress' | 'locked';
  color: string;
  content: string;
}

export default function InfluxPassportPage() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showEllieSupport, setShowEllieSupport] = useState(false);

  const activities: Activity[] = [
    {
      id: 'welcome-quest',
      title: 'Welcome Quest & Games Arena',
      description: 'Bem-vindo à missão! Conheça Fluxie e comece sua jornada de aprendizado.',
      icon: <Sparkles className="w-6 h-6" />,
      duration: '90 min',
      difficulty: 'easy',
      status: 'in-progress',
      color: 'from-purple-500 to-pink-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Welcome Quest & Games Arena</h3>
        <p class="mb-4">A atividade de volta às aulas que combina confiança, diversão e aprendizado real.</p>
        
        <h4 class="font-bold text-lg mb-3">📋 Estrutura da Atividade (90 minutos)</h4>
        
        <div class="space-y-4">
          <div class="border-l-4 border-purple-500 pl-4">
            <h5 class="font-bold">1️⃣ Abertura (10 min)</h5>
            <p class="text-sm text-gray-600">Apresentação e jogo de movimento para quebrar o gelo</p>
            <ul class="text-sm mt-2 space-y-1">
              <li>• Boas-vindas com Fluxie</li>
              <li>• Jogo de movimento interativo</li>
              <li>• Apresentação da missão do dia</li>
            </ul>
          </div>

          <div class="border-l-4 border-pink-500 pl-4">
            <h5 class="font-bold">2️⃣ Games Arena (40 min)</h5>
            <p class="text-sm text-gray-600">Jogos cooperativos com inglês natural</p>
            <ul class="text-sm mt-2 space-y-1">
              <li>• Simon Says (com comandos em inglês)</li>
              <li>• Bingo de Cores e Números</li>
              <li>• Jogo de Memória com Vocabulário</li>
              <li>• Charadas em Inglês</li>
            </ul>
          </div>

          <div class="border-l-4 border-blue-500 pl-4">
            <h5 class="font-bold">3️⃣ Mini Challenge (20 min)</h5>
            <p class="text-sm text-gray-600">Desafios simples e opcionais</p>
            <ul class="text-sm mt-2 space-y-1">
              <li>• Diga seu nome em inglês</li>
              <li>• Fale o que você gosta</li>
              <li>• Escolha um personagem favorito</li>
            </ul>
          </div>

          <div class="border-l-4 border-green-500 pl-4">
            <h5 class="font-bold">4️⃣ Show & Tell Leve (10 min)</h5>
            <p class="text-sm text-gray-600">Participação opcional por fala, apontamento ou gesto</p>
            <ul class="text-sm mt-2 space-y-1">
              <li>• Compartilhe uma descoberta</li>
              <li>• Aponte para sua atividade favorita</li>
              <li>• Faça um gesto de celebração</li>
            </ul>
          </div>
        </div>

        <h4 class="font-bold text-lg mt-6 mb-3">✅ Checklist da Equipe</h4>
        <div class="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4" /> Música ambiente
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4" /> Cartaz "Welcome to the Mission"
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4" /> Fitas/crachás coloridos
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4" /> Jogos simples preparados
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4" /> Celular para registro (fotos/vídeos)
          </div>
        </div>

        <h4 class="font-bold text-lg mt-6 mb-3">🎯 Objetivo Principal</h4>
        <p class="text-sm">Focar na <strong>confiança</strong> e no <strong>aprendizado real</strong>. O silêncio também é considerado participação!</p>

        <h4 class="font-bold text-lg mt-6 mb-3">📸 Valor para os Pais</h4>
        <ul class="text-sm space-y-2">
          <li>✓ Fotos de crianças sorrindo e interagindo</li>
          <li>✓ Vídeo curto: "My name is ___ and I like ___."</li>
          <li>✓ Transmitir segurança, orgulho e aprendizado real</li>
        </ul>
      `,
    },
    {
      id: 'vocabulary-adventure',
      title: 'Vocabulary Adventure',
      description: 'Expanda seu vocabulário com atividades interativas e divertidas.',
      icon: <BookOpen className="w-6 h-6" />,
      duration: '60 min',
      difficulty: 'medium',
      status: 'locked',
      color: 'from-blue-500 to-cyan-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Vocabulary Adventure</h3>
        <p class="mb-4">Atividade de expansão de vocabulário com foco em temas de volta às aulas.</p>
        <p class="text-sm text-gray-600">Conteúdo em desenvolvimento...</p>
      `,
    },
    {
      id: 'speaking-challenge',
      title: 'Speaking Challenge',
      description: 'Desenvolva sua confiança ao falar inglês em situações reais.',
      icon: <Zap className="w-6 h-6" />,
      duration: '45 min',
      difficulty: 'medium',
      status: 'locked',
      color: 'from-orange-500 to-red-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Speaking Challenge</h3>
        <p class="mb-4">Desafios de fala para ganhar confiança ao se expressar em inglês.</p>
        <p class="text-sm text-gray-600">Conteúdo em desenvolvimento...</p>
      `,
    },
    {
      id: 'team-games',
      title: 'Team Games & Cooperation',
      description: 'Jogos em equipe que promovem cooperação e aprendizado coletivo.',
      icon: <Users className="w-6 h-6" />,
      duration: '75 min',
      difficulty: 'easy',
      status: 'locked',
      color: 'from-green-500 to-emerald-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Team Games & Cooperation</h3>
        <p class="mb-4">Atividades em equipe que fortalecem laços e promovem aprendizado colaborativo.</p>
        <p class="text-sm text-gray-600">Conteúdo em desenvolvimento...</p>
      `,
    },
    {
      id: 'achievement-quest',
      title: 'Achievement Quest',
      description: 'Ganhe badges e prêmios ao completar desafios especiais.',
      icon: <Trophy className="w-6 h-6" />,
      duration: '90 min',
      difficulty: 'hard',
      status: 'locked',
      color: 'from-yellow-500 to-amber-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Achievement Quest</h3>
        <p class="mb-4">Desafios especiais para ganhar badges e reconhecimento.</p>
        <p class="text-sm text-gray-600">Conteúdo em desenvolvimento...</p>
      `,
    },
    {
      id: 'wellness-break',
      title: 'Wellness Break & Mindfulness',
      description: 'Pausa para relaxamento, meditação e bem-estar durante o aprendizado.',
      icon: <Heart className="w-6 h-6" />,
      duration: '20 min',
      difficulty: 'easy',
      status: 'locked',
      color: 'from-rose-500 to-pink-500',
      content: `
        <h3 class="text-xl font-bold mb-4">Wellness Break & Mindfulness</h3>
        <p class="mb-4">Momentos de pausa para bem-estar e relaxamento.</p>
        <p class="text-sm text-gray-600">Conteúdo em desenvolvimento...</p>
      `,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'locked':
        return <Target className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <EllieFloatingAvatar
        studentBook="Regular"
        onRequestSupport={() => setShowEllieSupport(true)}
      />
      <div className="max-w-7xl mx-auto md:p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">inFlux's Passport</h1>
            <p className="text-lg text-gray-600">Sua jornada de volta às aulas começa aqui!</p>
          </div>

          {/* Welcome Card */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Bem-vindo à Missão inFlux!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                Prepare-se para uma experiência incrível de aprendizado. Neste Passport, você encontrará
                atividades especialmente preparadas para sua volta às aulas.
              </p>
              <p className="text-sm opacity-90">
                Cada atividade foi desenhada para fortalecer sua confiança, expandir seu vocabulário e
                tornar o aprendizado de inglês divertido e significativo.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={`shadow-lg border-0 cursor-pointer transition-all hover:shadow-xl ${
                activity.status === 'locked' ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedActivity(activity)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${activity.color} text-white`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(activity.difficulty)}`}>
                      {getDifficultyLabel(activity.difficulty)}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <CardDescription className="text-sm">{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.duration}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedActivity(activity);
                    }}
                  >
                    Ver Mais
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Details Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="shadow-2xl border-0 max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedActivity.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedActivity.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedActivity(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedActivity.content }}
                  className="prose prose-sm max-w-none"
                />
              </CardContent>
              <div className="border-t p-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1"
                >
                  Fechar
                </Button>
                {selectedActivity.status !== 'locked' && (
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Começar Atividade
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Dicas para Aproveitar ao Máximo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>✓ Comece com a atividade "Welcome Quest & Games Arena" para se familiarizar</p>
            <p>✓ Participe de todas as atividades para ganhar badges especiais</p>
            <p>✓ Não tenha medo de cometer erros - fazem parte do aprendizado!</p>
            <p>✓ Compartilhe suas conquistas com amigos e família</p>
          </CardContent>
        </Card>
      </div>

      {/* Ellie Support Dialog */}
      <Dialog open={showEllieSupport} onOpenChange={setShowEllieSupport}>
        <DialogContent className="bg-slate-800 border-green-400">
          <DialogHeader>
            <DialogTitle className="text-green-400">Solicitar Suporte - Ellie</DialogTitle>
            <DialogDescription>Conectando com Jennifer, nossa coordenadora...</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300">Sua solicitacao foi registrada! Jennifer entrará em contato em breve via WhatsApp ou email.</p>
            <Button onClick={() => setShowEllieSupport(false)} className="w-full bg-green-500 hover:bg-green-600">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
