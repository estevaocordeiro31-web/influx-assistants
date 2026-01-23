import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Target, TrendingUp, MessageCircle, CheckCircle2, Circle } from 'lucide-react';
import { AITutor } from './AITutor';

interface PersonalTutorProps {
  studentId: number;
  studentName: string;
  studentLevel: string;
}

// Dados de exemplo - em produção viriam do banco de dados
const camilaPlan = {
  currentWeek: 1,
  totalWeeks: 12,
  currentPhase: 'Fase 1: Construir Confiança',
  objectives: [
    'Conseguir se comunicar e entender conversas',
    'Assistir filmes sem legenda',
    'Ler livros em inglês',
  ],
  discomforts: [
    'Falar com outras pessoas (tímida)',
    'Listening (compreensão auditiva)',
    'Pronúncia',
    'Formação de frases (dificuldade em explicar detalhes)',
  ],
  interests: ['Séries', 'Viagens', 'Música', 'Instagram', 'Livros'],
  weeklyGoals: [
    { id: 1, title: 'Ler resenha de série em voz alta', completed: false },
    { id: 2, title: 'Entender 70% de vídeo de viagem com legenda', completed: false },
    { id: 3, title: 'Escrever 10 frases sobre viagem', completed: false },
  ],
  recommendations: [
    {
      type: 'Série',
      title: 'Friends',
      reason: 'Linguagem coloquial, repetição, situações cotidianas',
    },
    {
      type: 'Chunk',
      title: 'I can\'t help but...',
      reason: 'Expressão comum em séries',
    },
    {
      type: 'Exercício',
      title: 'Escrever resenha de episódio',
      reason: 'Praticar formação de frases com conforto',
    },
  ],
};

const laisPlan = {
  currentWeek: 1,
  totalWeeks: 12,
  currentPhase: 'Fase 1: Fundamentos Sólidos',
  objectives: [
    'Falar bem para reuniões de trabalho',
    'Falar bem para viagens',
    'Escrever bem para trabalho (emails, relatórios)',
  ],
  discomforts: [
    'Conectivos (linking words) - sempre confunde',
    'Tempos verbais - confunde quando precisa ser rápida',
    'Nervosismo para falar',
    'Plural/Singular - troca quando fala rápido',
  ],
  interests: ['Trabalho (emails, relatórios)', 'Séries', 'Música'],
  weeklyGoals: [
    { id: 1, title: 'Usar 10 conectivos corretamente em emails', completed: false },
    { id: 2, title: 'Identificar e usar 4 tempos verbais corretamente', completed: false },
    { id: 3, title: 'Acertar plural/singular em 90% das frases', completed: false },
  ],
  recommendations: [
    {
      type: 'Conectivo',
      title: 'However (porém, no entanto)',
      reason: 'Conectivo essencial para trabalho',
    },
    {
      type: 'Chunk',
      title: 'I am writing to inform you that...',
      reason: 'Abertura profissional de email',
    },
    {
      type: 'Exercício',
      title: 'Escrever 5 emails profissionais',
      reason: 'Praticar conectivos e tempos verbais',
    },
  ],
};

export function PersonalTutor({ studentId, studentName, studentLevel }: PersonalTutorProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Determinar qual plano usar baseado no studentId
  const plan = studentId === 390198 ? camilaPlan : laisPlan;
  const progress = (plan.currentWeek / plan.totalWeeks) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Meu Tutor Personalizado</h2>
          <p className="text-muted-foreground">
            Plano de aprendizado customizado para {studentName}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Semana {plan.currentWeek} de {plan.totalWeeks}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{plan.currentPhase}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="goals">Metas da Semana</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="chat">Chat com Tutor</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Meus Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Áreas de Desconforto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Áreas para Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.discomforts.map((dis, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Circle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{dis}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Interesses */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Interesses</CardTitle>
              <CardDescription>
                O tutor usa seus interesses para personalizar o aprendizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.interests.map((interest, idx) => (
                  <Badge key={idx} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metas da Semana {plan.currentWeek}</CardTitle>
              <CardDescription>
                Complete estas metas para avançar para a próxima semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.weeklyGoals.map((goal) => (
                  <li key={goal.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    {goal.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {goal.title}
                      </p>
                    </div>
                    {!goal.completed && (
                      <Button size="sm" variant="outline">
                        Começar
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-4">
            {plan.recommendations.map((rec, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {rec.type}
                      </Badge>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription>{rec.reason}</CardDescription>
                    </div>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <AITutor studentId={studentId} studentLevel={studentLevel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
