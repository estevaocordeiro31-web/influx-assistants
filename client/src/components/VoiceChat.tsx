import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function VoiceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      text: 'Olá! Sou seu tutor pessoal de inglês. Vou te ajudar a aprender usando chunks e equivalências! Clique no microfone para começar a conversar.',
      timestamp: new Date(),
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Web Speech API not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.language = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          handleUserMessage(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const handleUserMessage = async (userText: string) => {
    if (!userText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch('/api/trpc/chat.sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            studentId: 1,
            message: userText,
            conversationId: 'demo-voice-chat',
            bookId: 5,
          },
        }),
      });

      const data = await response.json();
      const assistantText = data.result?.data?.response || 'Desculpe, não consegui processar sua mensagem.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: assistantText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak response
      speakText(assistantText);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🎤 Bate-papo por Voz com Fluxie
        </h2>
        <p className="text-sm opacity-90">Converse em inglês e receba feedback personalizado</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.type === 'assistant' ? (
                <Streamdown>{msg.text}</Streamdown>
              ) : (
                <p>{msg.text}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {transcript && (
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg rounded-br-none italic opacity-75">
              {transcript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="bg-slate-800 border-t border-slate-700 p-4 space-y-3">
        {/* Status indicators */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-gray-400">{isListening ? 'Ouvindo...' : 'Pronto'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-gray-400">{isSpeaking ? 'Falando...' : 'Silencioso'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={toggleListening}
            disabled={isSpeaking || isLoading}
            className={`flex-1 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Parar Gravação
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Iniciar Gravação
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="outline"
              className="flex-1"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Parar Áudio
            </Button>
          )}
        </div>

        {/* Instructions com Fluxie Thinking */}
        <div className="bg-slate-800 rounded-lg p-3 text-sm text-gray-300 border border-purple-500/30">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/OwIgQozQmgnqPMOm.png" 
                alt="Fluxie Thinking" 
                className="w-10 h-10 object-contain"
              />
              <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10" />
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1 text-purple-400 flex items-center gap-2">
                💡 Dica do Fluxie
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                <li>Clique em "Iniciar Gravação" para começar a falar</li>
                <li>Fale em inglês e o Fluxie responderá</li>
                <li>Você receberá feedback sobre <strong className="text-cyan-400">chunks</strong> e equivalências</li>
                <li>O Fluxie falará a resposta automaticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
