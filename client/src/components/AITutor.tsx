import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Send, Mic, Volume2, BookOpen } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  pronunciation?: PronunciationFeedback;
  connectedSpeech?: ConnectedSpeechTip;
  realEnglishNote?: RealEnglishNote;
}

interface PronunciationFeedback {
  word: string;
  ipa: string;
  audio?: string;
  tips: string[];
}

interface ConnectedSpeechTip {
  rule: string;
  example: string;
  explanation: string;
}

interface RealEnglishNote {
  formal: string;
  colloquial: string;
  explanation: string;
  level: 'B1' | 'B2' | 'C1' | 'C2';
}

export const AITutor: React.FC<{ studentId: number; studentLevel: string }> = ({
  studentId,
  studentLevel,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Scroll para mensagem mais recente
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Chamar API do tutor
      const response = await trpc.tutor.chat.useMutation().mutateAsync({
        studentId,
        message: input,
        studentLevel,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        pronunciation: response.pronunciation,
        connectedSpeech: response.connectedSpeech,
        realEnglishNote: response.realEnglishNote,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Enviar áudio para análise
        handleAudioSubmit(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Enviar áudio para análise
  const handleAudioSubmit = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const response = await trpc.tutor.analyzeAudio.useMutation().mutateAsync({
        studentId,
        audio: audioBlob,
        studentLevel,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.feedback,
        timestamp: new Date(),
        pronunciation: response.pronunciation,
        connectedSpeech: response.connectedSpeech,
        realEnglishNote: response.realEnglishNote,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">inFlux Personal Tutor</h2>
              <p className="text-sm opacity-90">Real English • Connected Speech • Pronunciation</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg">
            {studentLevel}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-slate-700 bg-slate-800">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="connectedSpeech">Connected Speech</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
          <TabsTrigger value="realEnglish">Real English</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  <p className="text-lg font-semibold mb-2">Welcome to your Personal Tutor!</p>
                  <p className="text-sm">Start a conversation to practice real English</p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-xs lg:max-w-md p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>

                    {/* Pronunciation Feedback */}
                    {msg.pronunciation && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs font-semibold">Pronunciation</span>
                        </div>
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs">
                            <strong>{msg.pronunciation.word}</strong>
                          </p>
                          <p className="text-xs font-mono text-blue-300">
                            /{msg.pronunciation.ipa}/
                          </p>
                          <ul className="text-xs mt-2 space-y-1">
                            {msg.pronunciation.tips.map((tip, idx) => (
                              <li key={idx} className="text-slate-300">
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Connected Speech Tip */}
                    {msg.connectedSpeech && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-semibold">Connected Speech</span>
                        </div>
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs font-semibold text-yellow-300">
                            {msg.connectedSpeech.rule}
                          </p>
                          <p className="text-xs mt-1">
                            <strong>Example:</strong> {msg.connectedSpeech.example}
                          </p>
                          <p className="text-xs mt-1 text-slate-300">
                            {msg.connectedSpeech.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Real English Note */}
                    {msg.realEnglishNote && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-semibold">Real English</span>
                        </div>
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs">
                            <strong className="text-green-300">Formal:</strong>{' '}
                            {msg.realEnglishNote.formal}
                          </p>
                          <p className="text-xs mt-1">
                            <strong className="text-orange-300">Colloquial:</strong>{' '}
                            {msg.realEnglishNote.colloquial}
                          </p>
                          <p className="text-xs mt-1 text-slate-300">
                            {msg.realEnglishNote.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-xs opacity-75 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4 bg-slate-800">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message or practice speaking..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Connected Speech Tab */}
        <TabsContent value="connectedSpeech" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Connected Speech Rules</h3>
            <div className="space-y-3">
              <Card className="bg-slate-700 p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Linking</h4>
                <p className="text-sm text-slate-200 mb-2">
                  When a word ends with a consonant and the next word starts with a vowel, they
                  blend together.
                </p>
                <p className="text-sm font-mono text-green-300">
                  "I want to" → "I wanna" /aɪ ˈwɑn.tə/
                </p>
              </Card>

              <Card className="bg-slate-700 p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Elision</h4>
                <p className="text-sm text-slate-200 mb-2">
                  Sounds are dropped when they're difficult to pronounce together.
                </p>
                <p className="text-sm font-mono text-green-300">
                  "next day" → "nex day" /ˈnɛkst deɪ/
                </p>
              </Card>

              <Card className="bg-slate-700 p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Assimilation</h4>
                <p className="text-sm text-slate-200 mb-2">
                  A sound changes to become more like the sound that follows it.
                </p>
                <p className="text-sm font-mono text-green-300">
                  "that girl" → "thag girl" /ðæt ɡɜːl/
                </p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Pronunciation Tab */}
        <TabsContent value="pronunciation" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Pronunciation Guide</h3>
            <div className="space-y-3">
              <Card className="bg-slate-700 p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Vowel Sounds</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-200">
                    <strong>/iː/</strong> - "see" - Long 'ee' sound
                  </p>
                  <p className="text-slate-200">
                    <strong>/ɪ/</strong> - "sit" - Short 'i' sound
                  </p>
                  <p className="text-slate-200">
                    <strong>/ɑː/</strong> - "car" - Long 'ah' sound
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-700 p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Consonant Sounds</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-200">
                    <strong>/θ/</strong> - "think" - Tongue between teeth
                  </p>
                  <p className="text-slate-200">
                    <strong>/ð/</strong> - "this" - Voiced tongue between teeth
                  </p>
                  <p className="text-slate-200">
                    <strong>/ŋ/</strong> - "sing" - Back of throat
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Real English Tab */}
        <TabsContent value="realEnglish" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Real English vs Formal</h3>
            <div className="space-y-3">
              <Card className="bg-slate-700 p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-green-300">Formal:</strong> "I am going to"
                  </p>
                  <p className="text-sm">
                    <strong className="text-orange-300">Real English:</strong> "I'm gonna"
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    Native speakers use contractions and reductions in casual speech
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-700 p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-green-300">Formal:</strong> "Do you want to"
                  </p>
                  <p className="text-sm">
                    <strong className="text-orange-300">Real English:</strong> "D'you wanna"
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    Common reductions in everyday conversation
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITutor;
