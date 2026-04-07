import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function GeminiStrategicAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const sendContextMutation = trpc.gemini.sendProjectContext.useMutation({
    onSuccess: () => {
      toast.success('Análise estratégica solicitada ao Gemini!');
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast.error(`Erro ao solicitar análise: ${error.message}`);
      setIsAnalyzing(false);
    },
  });

  const { data: suggestions } = trpc.gemini.getSuggestions.useQuery({
    category: 'strategy',
  });

  const { data: stats } = trpc.gemini.getStatistics.useQuery();

  const handleRequestAnalysis = () => {
    setIsAnalyzing(true);
    sendContextMutation.mutate({
      version: 'current',
      features: [
        'Sistema de login',
        'Dashboard personalizado',
        'Chat IA',
        'Exercícios',
        'Blog',
        'Reading Club',
        'Badges',
        'Tutorial',
        'Integração Gemini',
      ],
      metrics: {
        active_students: 99,
        users_with_access: 99,
        engagement_rate: 0.75,
      },
      challenges: [
        'Aumentar engajamento',
        'Melhorar personalização',
        'Implementar gamificação',
      ],
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold">Análise Estratégica Gemini AI</h1>
            <p className="text-muted-foreground">
              Insights pedagógicos e recomendações baseadas em dados
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleRequestAnalysis}
          disabled={isAnalyzing}
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Solicitar Nova Análise
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
              <div className="text-2xl font-bold">99</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">Taxa de Engajamento</div>
              <div className="text-2xl font-bold">75%</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-sm text-muted-foreground">Sugestões Estratégicas</div>
              <div className="text-2xl font-bold">{suggestions?.length || 0}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-sm text-muted-foreground">Implementadas</div>
              <div className="text-2xl font-bold">{stats?.implemented || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="pedagogy">
            <Lightbulb className="w-4 h-4 mr-2" />
            Pedagogia
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <TrendingUp className="w-4 h-4 mr-2" />
            Engajamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise Geral do Sistema</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Pontos Fortes</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sistema de login funcionando para 99 alunos ativos</li>
                  <li>Integração completa com Gemini AI para análises</li>
                  <li>Dashboard personalizado por nível de cada aluno</li>
                  <li>Sincronização automática diária com banco central</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Áreas de Melhoria</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Implementar sistema de gamificação com badges e recompensas</li>
                  <li>Adicionar repetição espaçada (spaced repetition) para reforço</li>
                  <li>Desenvolver app mobile nativo para melhor experiência</li>
                  <li>Criar painel pedagógico para professores acompanharem progresso</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Strategic Suggestions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sugestões Estratégicas do Gemini</h3>
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion: any) => (
                <Card key={suggestion.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                      {suggestion.implementation_notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          {suggestion.implementation_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Nenhuma sugestão estratégica disponível ainda.
                  <br />
                  Clique em "Solicitar Nova Análise" para gerar insights.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pedagogy" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise Pedagógica</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Personalização por Nível</h4>
                <p className="text-sm text-muted-foreground">
                  O sistema está configurado para adaptar conteúdo baseado no nível atual de cada aluno,
                  evitando introduzir vocabulário ou gramática mais avançados que o material didático.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Revisitação (Revisiting)</h4>
                <p className="text-sm text-muted-foreground">
                  Implementar sistema de repetição espaçada para reforçar conteúdo já visto,
                  aumentando retenção de longo prazo.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Foco em Inglês Real</h4>
                <p className="text-sm text-muted-foreground">
                  Priorizar connected speech, pronúncia e expressões do dia a dia em todos os exercícios.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Métricas de Engajamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="font-medium">Taxa de Login Semanal</span>
                <span className="text-2xl font-bold text-green-500">75%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="font-medium">Tempo Médio por Sessão</span>
                <span className="text-2xl font-bold text-blue-500">12min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="font-medium">Exercícios Completados/Dia</span>
                <span className="text-2xl font-bold text-purple-500">3.2</span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Recomendações para Aumentar Engajamento</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Adicionar notificações push personalizadas</li>
                  <li>Criar sistema de streaks (dias consecutivos de uso)</li>
                  <li>Implementar leaderboard semanal entre alunos</li>
                  <li>Oferecer badges por conquistas específicas</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
