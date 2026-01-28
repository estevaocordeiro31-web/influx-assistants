import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lightbulb,
  TrendingUp,
  Users,
  BarChart3,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

type SuggestionStatus = 'pending' | 'approved' | 'rejected' | 'implemented';
type SuggestionCategory = 'ux' | 'pedagogy' | 'gamification' | 'data_analysis' | 'strategy';
type SuggestionPriority = 'low' | 'medium' | 'high' | 'critical';

const categoryIcons = {
  ux: Users,
  pedagogy: Lightbulb,
  gamification: Target,
  data_analysis: BarChart3,
  strategy: TrendingUp,
};

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const statusColors = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  implemented: 'bg-purple-500',
};

export default function GeminiSuggestions() {
  const [activeTab, setActiveTab] = useState<SuggestionStatus>('pending');
  
  const { data: suggestions, isLoading, refetch } = trpc.gemini.getSuggestions.useQuery({
    status: activeTab,
  });

  const { data: stats } = trpc.gemini.getStatistics.useQuery();

  const updateStatusMutation = trpc.gemini.updateSuggestionStatus.useMutation({
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
  });

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected' | 'implemented') => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-3xl font-bold">Sugestões do Gemini AI</h1>
          <p className="text-muted-foreground">
            Análises e recomendações estratégicas para o inFlux Personal Tutor
          </p>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pendentes</div>
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Aprovadas</div>
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Implementadas</div>
            <div className="text-2xl font-bold text-purple-500">{stats.implemented}</div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SuggestionStatus)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Aprovadas
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rejeitadas
          </TabsTrigger>
          <TabsTrigger value="implemented" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Implementadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando sugestões...</p>
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            suggestions.map((suggestion: any) => {
              const CategoryIcon = categoryIcons[suggestion.category as SuggestionCategory];
              
              return (
                <Card key={suggestion.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <CategoryIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{suggestion.title}</h3>
                          <Badge className={`${priorityColors[suggestion.priority as SuggestionPriority]} text-white`}>
                            {suggestion.priority}
                          </Badge>
                          <Badge variant="outline">{suggestion.category}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground">{suggestion.description}</p>
                        
                        {suggestion.implementation_notes && (
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Notas de Implementação:</p>
                            <p className="text-sm text-muted-foreground">{suggestion.implementation_notes}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Criado em: {new Date(suggestion.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(suggestion.id, 'approved')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(suggestion.id, 'rejected')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}

                    {activeTab === 'approved' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-purple-500 hover:bg-purple-600"
                        onClick={() => handleUpdateStatus(suggestion.id, 'implemented')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Marcar como Implementada
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Nenhuma sugestão {activeTab}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
