import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  avatar?: string;
}

export default function ElliesSupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou a Ellie, sua coordenadora virtual. Estou aqui para ajudar com dúvidas sobre coordenação, atendimento a alunos e gestão de turmas. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      avatar: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/udcTuSkPDZbVRBpT.png',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.elliesSupport.sendMessage.useMutation({
    onSuccess: (data: any) => {
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        avatar: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/udcTuSkPDZbVRBpT.png',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: (error: any) => {
      setError(`Erro ao enviar mensagem: ${error.message}`);
      setIsLoading(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    sendMessageMutation.mutate({
      message: inputValue,
      context: 'coordination',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-600 shadow-lg">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/udcTuSkPDZbVRBpT.png"
                alt="Ellie"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ellie's Support</h1>
              <p className="text-gray-600">Coordenadora Virtual de Atendimento</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Bem-vindo ao suporte de coordenação! Ellie está aqui para ajudar com dúvidas sobre gestão de alunos, atendimento, turmas e muito mais. Você também pode contar com a Jennifer para suporte adicional.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat de Atendimento
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Converse com Ellie sobre coordenação e gestão de alunos
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && message.avatar && (
                    <img
                      src={message.avatar}
                      alt="Ellie"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <Streamdown>{message.content}</Streamdown>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/udcTuSkPDZbVRBpT.png"
                    alt="Ellie"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-200 rounded-bl-none">
                    <div className="flex gap-2 items-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ellie está digitando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Digite sua pergunta ou dúvida..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                Tópicos que Ellie Pode Ajudar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-sm text-gray-700">
              <p>✓ Gestão de alunos e turmas</p>
              <p>✓ Atendimento e suporte pedagógico</p>
              <p>✓ Dúvidas sobre plataforma</p>
              <p>✓ Relatórios e análises</p>
              <p>✓ Coordenação de atividades</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MessageCircle className="w-5 h-5" />
                Suporte Adicional
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-sm text-gray-700">
              <p>📞 Jennifer: Suporte direto</p>
              <p>💬 Ellie: Coordenadora Virtual</p>
              <p>⏰ Disponível 24/7</p>
              <p>🚀 Respostas rápidas e precisas</p>
              <p>🎯 Focado em resultados</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
