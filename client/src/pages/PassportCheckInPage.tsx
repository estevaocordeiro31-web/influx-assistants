import { useEffect, useState } from 'react';
import { useSearchParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { EllieFloatingAvatar } from '@/components/EllieFloatingAvatar';

type StudentBook = 'Fluxie' | 'Junior' | 'Regular' | 'Advanced';

interface FlightPlanActivity {
  day: string;
  activity: string;
  time: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface FlightPlan {
  week: string;
  activities: FlightPlanActivity[];
}

export default function PassportCheckInPage() {
  const [searchParams] = useSearchParams();
  const [checkInData, setCheckInData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [studentBook, setStudentBook] = useState<StudentBook>('Regular');

  const token = searchParams.get('token');
  const studentId = searchParams.get('studentId');

  const processCheckInMutation = trpc.passportQR.processCheckIn.useMutation();

  useEffect(() => {
    if (!token || !studentId) {
      setError('QR Code inválido: token ou studentId ausente');
      setLoading(false);
      return;
    }

    const processCheckIn = async () => {
      try {
        setLoading(true);
        const result = await processCheckInMutation.mutateAsync({
          token,
          studentId,
        });

        if (result.success) {
          setCheckInData(result);
          setError(null);
          // Determinar o livro do aluno para Ellie
          const bookMap: Record<string, StudentBook> = {
            'Fluxie': 'Fluxie',
            'Junior': 'Junior',
            'Regular': 'Regular',
            'Comunicação Avançada': 'Advanced',
          };
          const book = result.studentBook ? bookMap[result.studentBook] : undefined;
          setStudentBook(book || 'Regular');
        } else {
          setError(result.message || 'Erro ao processar check-in');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao processar QR Code');
      } finally {
        setLoading(false);
      }
    };

    processCheckIn();
  }, [token, studentId]);

  const handleConfirmPresence = () => {
    setConfirmed(true);
    // Aqui poderia enviar confirmação de presença para o backend
    setTimeout(() => {
      window.location.href = '/student/passport';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Processando seu check-in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro no Check-in</h1>
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

  if (!checkInData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com Mensagem de Boas-vindas */}
        <div className="mb-8">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">
                Bem-vindo(a), {checkInData.studentName}! 🎉
              </h1>
              <p className="text-indigo-100 text-lg">
                Sua jornada no nível <span className="font-semibold">{checkInData.studentBook}</span> começa agora
              </p>
            </div>

            {/* Mensagem de Ellie */}
            <div className="p-8">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-l-4 border-purple-500 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {checkInData.message}
                </p>
              </div>

              {/* Flight Plan */}
              {checkInData.flightPlan && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    Seu Flight Plan
                  </h2>
                  <p className="text-gray-600 mb-4 font-semibold">
                    {checkInData.flightPlan.week}
                  </p>

                  <div className="space-y-3">
                    {checkInData.flightPlan.activities.map(
                      (activity: FlightPlanActivity, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800">{activity.day}</h3>
                            <p className="text-gray-600 mt-1">{activity.activity}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              🔒 Bloqueado
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-4 italic">
                    ℹ️ As atividades serão desbloqueadas conforme você avança no programa.
                  </p>
                </div>
              )}

              {/* Confirmação de Presença */}
              {checkInData.confirmationButton && !confirmed && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirmar Presença na Dinâmica
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Clique no botão abaixo para confirmar sua presença e começar a jornada!
                  </p>
                  <Button
                    onClick={handleConfirmPresence}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105"
                  >
                    ✓ Confirmar Presença
                  </Button>
                </div>
              )}

              {/* Confirmação Realizada */}
              {confirmed && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500 flex items-start gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-800 text-lg">
                        Presença Confirmada! ✓
                      </h3>
                      <p className="text-green-700 mt-2">
                        Você será redirecionado para seu Passaporte em instantes...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Ellie Avatar Flutuante */}
        <EllieFloatingAvatar
          studentBook={studentBook}
          onRequestSupport={() => {
            // Abrir suporte com Jennifer
            window.location.href = '/support/ellie';
          }}
        />
      </div>
    </div>
  );
}
