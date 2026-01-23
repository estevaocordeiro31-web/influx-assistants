import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface StudentProfileFormProps {
  studentId: number;
  onSuccess?: () => void;
}

export function StudentProfileForm({ studentId, onSuccess }: StudentProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studyDurationYears: '',
    studyDurationMonths: '',
    specificGoals: '',
    discomfortAreas: '',
    comfortAreas: '',
    englishConsumptionSources: {
      music: false,
      series: false,
      movies: false,
      socialMedia: false,
      podcasts: false,
      books: false,
      news: false,
      other: false,
    },
    improvementAreas: '',
  });

  const updateProfileMutation = trpc.studentProfile.updateDetailedProfile.useMutation({
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!');
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const consumptionSources = Object.entries(formData.englishConsumptionSources)
        .filter(([, value]) => value)
        .map(([key]) => key);

      await updateProfileMutation.mutateAsync({
        studentId,
        studyDurationYears: formData.studyDurationYears ? parseFloat(formData.studyDurationYears) : undefined,
        studyDurationMonths: formData.studyDurationMonths ? parseInt(formData.studyDurationMonths) : undefined,
        specificGoals: formData.specificGoals || undefined,
        discomfortAreas: formData.discomfortAreas || undefined,
        comfortAreas: formData.comfortAreas || undefined,
        englishConsumptionSources: consumptionSources,
        improvementAreas: formData.improvementAreas || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Perfil atualizado com sucesso!</h3>
              <p className="text-sm text-green-700">As informações foram salvas no sistema.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil Detalhado do Aluno</CardTitle>
        <CardDescription>
          Colete informações cirúrgicas sobre as necessidades e objetivos do aluno
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tempo de Estudo */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Quanto tempo você já estuda inglês?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Anos</label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 2.5"
                  value={formData.studyDurationYears}
                  onChange={(e) =>
                    setFormData({ ...formData, studyDurationYears: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Meses adicionais</label>
                <Input
                  type="number"
                  placeholder="Ex: 6"
                  value={formData.studyDurationMonths}
                  onChange={(e) =>
                    setFormData({ ...formData, studyDurationMonths: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Objetivos Específicos */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Quais são seus objetivos específicos?
            </label>
            <Textarea
              placeholder="Ex: Atingir fluência em conversas de dia a dia, melhorar listening em séries, conseguir falar com confiança em reuniões de trabalho..."
              value={formData.specificGoals}
              onChange={(e) => setFormData({ ...formData, specificGoals: e.target.value })}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Áreas de Desconforto e Conforto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Onde você sente mais desconforto?
              </label>
              <Textarea
                placeholder="Ex: Listening, speaking, pronúncia, compreensão de gírias..."
                value={formData.discomfortAreas}
                onChange={(e) => setFormData({ ...formData, discomfortAreas: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Onde você se sente confortável?
              </label>
              <Textarea
                placeholder="Ex: Leitura, escrita, gramática, vocabulário..."
                value={formData.comfortAreas}
                onChange={(e) => setFormData({ ...formData, comfortAreas: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          {/* Fontes de Consumo de Inglês */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Onde você consome inglês? (Selecione todas que se aplicam)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'music', label: '🎵 Músicas' },
                { key: 'series', label: '📺 Séries' },
                { key: 'movies', label: '🎬 Filmes' },
                { key: 'socialMedia', label: '📱 Redes Sociais' },
                { key: 'podcasts', label: '🎙️ Podcasts' },
                { key: 'books', label: '📚 Livros' },
                { key: 'news', label: '📰 Notícias' },
                { key: 'other', label: '✨ Outro' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={
                      formData.englishConsumptionSources[
                        key as keyof typeof formData.englishConsumptionSources
                      ]
                    }
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        englishConsumptionSources: {
                          ...formData.englishConsumptionSources,
                          [key]: checked,
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Áreas de Melhoria */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              O que você gostaria de melhorar?
            </label>
            <Textarea
              placeholder="Ex: Melhorar listening em conversas rápidas, aprender gírias e expressões idiomáticas, desenvolver confiança para falar em público..."
              value={formData.improvementAreas}
              onChange={(e) => setFormData({ ...formData, improvementAreas: e.target.value })}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Perfil'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
