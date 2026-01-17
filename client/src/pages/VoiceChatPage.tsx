import { useAuth } from '@/_core/hooks/useAuth';
import VoiceChat from '@/components/VoiceChat';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function VoiceChatPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user && typeof window !== 'undefined' && !window.location.pathname.includes('/demo')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fluxie Voice Chat</h1>
            <p className="text-sm opacity-90">Converse em inglês com seu tutor pessoal</p>
          </div>
          <Button
            onClick={() => navigate('/demo')}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-green-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="h-[600px]">
          <VoiceChat />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-green-400 font-bold mb-2">🎯 Objetivo</h3>
            <p className="text-gray-300 text-sm">
              Praticar inglês conversacional com feedback personalizado baseado em chunks e equivalências.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-blue-400 font-bold mb-2">🗣️ Como Funciona</h3>
            <p className="text-gray-300 text-sm">
              Fale em inglês, o Fluxie entenderá sua fala e responderá com feedback e sugestões de melhoria.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-orange-400 font-bold mb-2">📊 Progresso</h3>
            <p className="text-gray-300 text-sm">
              Seu desempenho é rastreado para oferecer exercícios cada vez mais desafiadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
