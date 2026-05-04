import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Send,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o Gemini AI, seu assistente estratégico para o inFlux Personal Tutor. Posso ajudá-lo com análises pedagógicas, sugestões de funcionalidades, estratégias de engajamento e muito mais. Como posso ajudar?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendUpdateMutation = trpc.gemini.sendUpdate.useMutation({
    onSuccess: (data) => {
      setIsTyping(false);
      
      // Adicionar resposta do Gemini
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.raw_response || 'Análise concluída! Verifique a página de Sugestões para ver as recomendações.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.suggestions_count && data.suggestions_count > 0) {
        toast.success(`${data.suggestions_count} novas sugestões geradas!`);
      }
    },
    onError: (error) => {
      setIsTyping(false);
      toast.error(`Erro ao enviar mensagem: ${error.message}`);
      
      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Enviar para Gemini
    sendUpdateMutation.mutate({
      type: 'improvement',
      title: 'Pergunta do Administrador',
      description: inputMessage,
      version: 'current',
      metadata: {
        source: 'chat',
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Como aumentar o engajamento dos alunos?',
    'Quais métricas devo acompanhar?',
    'Sugestões para gamificação?',
    'Como melhorar a personalização?',
  ];

  return (
    <div className="container mx-auto py-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-3xl font-bold">Chat com Gemini AI</h1>
          <p className="text-muted-foreground">
            Converse diretamente com o Gemini para obter insights estratégicos
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 p-6 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Perguntas rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua pergunta ou solicitação..."
          disabled={isTyping}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isTyping || !inputMessage.trim()}
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
