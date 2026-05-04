import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play, Square, Trash2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, transcript?: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  placeholder?: string;
  showTranscript?: boolean;
}

export function AudioRecorder({
  onAudioReady,
  onCancel,
  disabled = false,
  placeholder = "Pressione para gravar sua resposta em inglês",
  showTranscript = true,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [audioUrl]);

  // Iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Parar todas as tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript(null);
      
      // Timer para mostrar tempo de gravação
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Iniciar reconhecimento de voz para transcrição em tempo real
      if (showTranscript && 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(prev => (prev || '') + finalTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognitionRef.current = recognition;
        recognition.start();
      }
      
      toast.success("🎤 Gravação iniciada! Fale em inglês...");
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      toast.success("✅ Gravação concluída!");
    }
  };

  // Reproduzir áudio gravado
  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Parar reprodução
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Descartar gravação
  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTranscript(null);
    onCancel?.();
  };

  // Enviar áudio
  const sendAudio = () => {
    if (audioBlob) {
      onAudioReady(audioBlob, transcript || undefined);
      // Limpar após envio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      setTranscript(null);
    }
  };

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {/* Estado inicial - botão de gravar */}
      {!isRecording && !audioBlob && (
        <div className="flex items-center gap-3">
          <Button
            onClick={startRecording}
            disabled={disabled}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            <Mic className="w-5 h-5 mr-2" />
            {placeholder}
          </Button>
        </div>
      )}

      {/* Gravando */}
      {isRecording && (
        <div className="bg-slate-800/80 rounded-lg p-4 border border-red-500/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium">Gravando...</span>
              <span className="text-slate-400 font-mono">{formatTime(recordingTime)}</span>
            </div>
            <Button
              onClick={stopRecording}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/20"
            >
              <Square className="w-4 h-4 mr-2" />
              Parar
            </Button>
          </div>
          
          {/* Transcrição em tempo real */}
          {showTranscript && transcript && (
            <div className="bg-slate-700/50 rounded p-3 mt-2">
              <p className="text-xs text-slate-400 mb-1">Transcrição:</p>
              <p className="text-sm text-white">{transcript}</p>
            </div>
          )}
          
          {/* Visualização de áudio (barra animada) */}
          <div className="flex items-center gap-1 h-8 justify-center mt-3">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Áudio gravado - preview e ações */}
      {audioBlob && !isRecording && (
        <div className="bg-slate-800/80 rounded-lg p-4 border border-green-500/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-green-400 font-medium">Gravação pronta</span>
              <span className="text-slate-400 font-mono">{formatTime(recordingTime)}</span>
            </div>
          </div>
          
          {/* Transcrição final */}
          {showTranscript && transcript && (
            <div className="bg-slate-700/50 rounded p-3 mb-3">
              <p className="text-xs text-slate-400 mb-1">Sua resposta:</p>
              <p className="text-sm text-white">{transcript}</p>
            </div>
          )}
          
          {/* Player de áudio oculto */}
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          
          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isPlaying ? stopAudio : playAudio}
              variant="outline"
              size="sm"
              className="border-slate-600"
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ouvir
                </>
              )}
            </Button>
            
            <Button
              onClick={discardRecording}
              variant="outline"
              size="sm"
              className="border-slate-600 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Descartar
            </Button>
            
            <Button
              onClick={sendAudio}
              size="sm"
              className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
