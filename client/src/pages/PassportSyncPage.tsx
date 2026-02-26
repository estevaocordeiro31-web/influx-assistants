import { useEffect, useState } from 'react';
import { useSearchParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { EllieFloatingAvatar } from '@/components/EllieFloatingAvatar';

type StudentBook = 'Fluxie' | 'Junior' | 'Regular' | 'Advanced';

const AVAILABLE_OBJECTIVES = [
  'Participar mais em aulas',
  'Praticar fora da aula',
  'Não render ante desafios',
  'Melhorar pronuncia',
  'Expandir vocabulário',
  'Ganhar confiança ao falar',
];

export default function PassportSyncPage() {
  const [searchParams] = useSearchParams();
  const [syncData, setSyncData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [synced, setSynced] = useState(false);
  const [studentBook, setStudentBook] = useState<StudentBook>('Regular');

  const token = searchParams.get('token');
  const studentId = searchParams.get('studentId');

  const processObjectivesMutation = trpc.passportQR.processObjectives.useMutation();

  useEffect(() => {
    if (!token || !studentId) {
      setError('QR Code inválido: token ou studentId ausente');
      setLoading(false);
      return;
    }

    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [token, studentId]);

  const handleObjectiveToggle = (objective: string) => {
    setSelectedObjectives(prev =>
      prev.includes(objective)
        ? prev.filter(o => o !== objective)
        : [...prev, objective]
    );
  };

  const handleSyncObjectives = async () => {
    if (selectedObjectives.length === 0) {
      setError('Selecione pelo menos um objetivo para sincronizar');
      return;
    }

    try {
      setLoading(true);
      const result = await processObjectivesMutation.mutateAsync({
        token: token || '',
        studentId: studentId || '',
        objectives: selectedObjectives,
      });

      if (result.success) {
        setSyncData(result);
        setSynced(true);
        setError(null);
      } else {
        setError(result.message || 'Erro ao sincronizar objetivos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar sincronização');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !synced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Carregando seus objetivos...</p>
        </div>
      </div>
    );
  }

  if (error && !synced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro na Sincronização</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => (window.location.href = '/student/passport')}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Voltar ao Passaporte
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (synced && syncData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl border-0 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">Objetivos Sincronizados! 🎯</h1>
              <p className="text-emerald-100 text-lg">
                Ellie está preparando sugestões personalizadas para você
              </p>
            </div>

            <div className="p-8">
              {/* Objetivos Confirmados */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-600" />
                  Seus Objetivos
                </h2>
                <div className="space-y-2">
                  {syncData.objectives.map((objective: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sugestões de Atividades */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Sugestões Personalizadas de Atividades
                </h2>
                <div className="space-y-3">
                  {syncData.suggestions.map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 font-medium">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensagem de Sucesso */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border-l-4 border-emerald-500">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {syncData.message}
                </p>
              </div>

              {/* Botão de Ação */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Button
                  onClick={() => (window.location.href = '/student/passport')}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105"
                >
                  ✓ Voltar ao Passaporte
                </Button>
              </div>
            </div>
          </Card>

          {/* Ellie Avatar */}
          <EllieFloatingAvatar
            studentBook={studentBook}
            onRequestSupport={() => {
              window.location.href = '/support/ellie';
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Sincronize Seus Objetivos 🎯</h1>
            <p className="text-emerald-100 text-lg">
              Selecione seus objetivos de aprendizado para receber sugestões personalizadas
            </p>
          </div>

          <div className="p-8">
            {/* Instruções */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 mb-8">
              <p className="text-gray-700 text-lg">
                Escolha os objetivos que mais fazem sentido para sua jornada de aprendizado. Ellie usará essas informações para sugerir atividades personalizadas que te ajudem a alcançar suas metas! 🚀
              </p>
            </div>

            {/* Seleção de Objetivos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                Meus Objetivos
              </h2>
              <div className="space-y-3">
                {AVAILABLE_OBJECTIVES.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
                    onClick={() => handleObjectiveToggle(objective)}
                  >
                    <Checkbox
                      checked={selectedObjectives.includes(objective)}
                      onCheckedChange={() => handleObjectiveToggle(objective)}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium flex-1">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contador de Objetivos */}
            <div className="mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-gray-700 text-center">
                <span className="font-bold text-emerald-600 text-lg">{selectedObjectives.length}</span>
                {' '}
                objetivo{selectedObjectives.length !== 1 ? 's' : ''} selecionado{selectedObjectives.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Botão de Sincronização */}
            <div className="flex gap-4">
              <Button
                onClick={handleSyncObjectives}
                disabled={selectedObjectives.length === 0 || loading}
                className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sincronizando...
                  </>
                ) : (
                  '✓ Sincronizar Objetivos'
                )}
              </Button>
              <Button
                onClick={() => (window.location.href = '/student/passport')}
                variant="outline"
                className="flex-1 h-12 text-lg font-semibold rounded-lg"
              >
                Pular por Enquanto
              </Button>
            </div>
          </div>
        </Card>

        {/* Ellie Avatar */}
        <EllieFloatingAvatar
          studentBook={studentBook}
          onRequestSupport={() => {
            window.location.href = '/support/ellie';
          }}
        />
      </div>
    </div>
  );
}
