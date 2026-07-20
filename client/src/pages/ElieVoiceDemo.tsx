import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useEffect, useRef, useState } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

type Mode = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

interface Turn {
  role: 'user' | 'elie';
  text: string;
  latencyMs?: number;
}

// Avatar stock "talking head" (visual neutro, sem treino custom da Elie ainda) + voz pt-BR.
const AVATAR_CHARACTER = 'meg';
const AVATAR_STYLE = 'formal';
const VOICE_NAME = 'pt-BR-FranciscaNeural';

const MODE_LABEL: Record<Mode, string> = {
  idle: 'Desconectado',
  connecting: 'Conectando...',
  listening: 'Ouvindo...',
  thinking: 'Pensando...',
  speaking: 'Falando...',
  error: 'Erro',
};

export default function ElieVoiceDemo() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const synthesizerRef = useRef<SpeechSDK.AvatarSynthesizer | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const recognitionRef = useRef<any>(null);
  // Guarda o modo atual num ref pra callbacks de eventos do browser (recognition.onend etc)
  // sempre lerem o valor mais recente, sem depender de closure de render antigo.
  const modeRef = useRef<Mode>('idle');
  const stoppedByUserRef = useRef(false);

  const [mode, setModeState] = useState<Mode>('idle');
  const [error, setError] = useState<string>('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interimText, setInterimText] = useState('');
  const [typedInput, setTypedInput] = useState('');

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };

  const iceTokenQuery = trpc.elieVoice.getIceToken.useQuery(undefined, { enabled: false });
  const sendMessage = trpc.chat.sendMessage.useMutation();

  // Reconhecimento de voz nativo do navegador (Web Speech API) — pt-BR.
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += text;
        else interim += text;
      }
      setInterimText(interim);
      if (finalText.trim()) {
        setInterimText('');
        handleUserSpeech(finalText.trim());
      }
    };
    recognition.onerror = (event: any) => {
      console.error('[ElieVoiceDemo] reconhecimento de voz erro:', event.error);
    };
    // Reconhecimento contínuo se encerra sozinho de tempos em tempos (limite do
    // browser) — reinicia automaticamente enquanto a conversa estiver ativa,
    // pra manter o "modo fluido" sem exigir clique do usuário a cada turno.
    recognition.onend = () => {
      if (!stoppedByUserRef.current && modeRef.current === 'listening') {
        try { recognition.start(); } catch { /* já rodando, ignora */ }
      }
    };

    recognitionRef.current = recognition;
    return () => {
      stoppedByUserRef.current = true;
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    stoppedByUserRef.current = false;
    setMode('listening');
    try { recognitionRef.current?.start(); } catch { /* já rodando, ignora */ }
  };

  const connect = async () => {
    setMode('connecting');
    setError('');
    try {
      const { data: ice, error: iceError } = await iceTokenQuery.refetch();
      if (!ice) throw new Error(iceError?.message || 'Sem token ICE do Azure (motivo desconhecido)');

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(ice.authToken, ice.region);
      speechConfig.speechSynthesisVoiceName = VOICE_NAME;
      const avatarConfig = new SpeechSDK.AvatarConfig(AVATAR_CHARACTER, AVATAR_STYLE, new SpeechSDK.AvatarVideoFormat());

      const pc = new RTCPeerConnection({ iceServers: ice.iceServers as RTCIceServer[] });
      peerConnectionRef.current = pc;
      pc.ontrack = (evt) => {
        if (evt.track.kind === 'video' && videoRef.current) {
          videoRef.current.srcObject = evt.streams[0];
        } else if (evt.track.kind === 'audio' && audioRef.current) {
          audioRef.current.srcObject = evt.streams[0];
        }
      };
      pc.addTransceiver('video', { direction: 'sendrecv' });
      pc.addTransceiver('audio', { direction: 'sendrecv' });

      const synthesizer = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);
      synthesizerRef.current = synthesizer;

      await synthesizer.startAvatarAsync(pc);
      const greeting = 'Oi! Sou a Elie. Pode falar comigo, estou ouvindo.';
      setTurns([{ role: 'elie', text: greeting }]);

      setMode('speaking');
      await synthesizer.speakTextAsync(greeting);
      startListening();
    } catch (e: any) {
      console.error('[ElieVoiceDemo] connect falhou:', e);
      setError(e.message || String(e));
      setMode('error');
    }
  };

  const disconnect = () => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    synthesizerRef.current?.close();
    peerConnectionRef.current?.close();
    synthesizerRef.current = null;
    peerConnectionRef.current = null;
    setMode('idle');
  };

  useEffect(() => () => disconnect(), []);

  // Turno completo: recebe texto (falado ou digitado), consulta Claude,
  // e faz a Elie falar a resposta. Pausa o reconhecimento enquanto ela
  // fala, pra nao se ouvir e entrar em loop.
  const handleUserSpeech = async (text: string) => {
    if (!text || !synthesizerRef.current) return;
    recognitionRef.current?.stop();
    setMode('thinking');
    const t0 = performance.now();
    setTurns((prev) => [...prev, { role: 'user', text }]);
    try {
      const result = await sendMessage.mutateAsync({ message: text, objective: 'free_chat' });
      const responseText = result?.message || 'Desculpe, não consegui responder agora.';
      const claudeMs = Math.round(performance.now() - t0);

      setMode('speaking');
      await synthesizerRef.current.speakTextAsync(responseText);
      const totalMs = Math.round(performance.now() - t0);

      setTurns((prev) => [...prev, { role: 'elie', text: responseText, latencyMs: totalMs }]);
      console.log(`[ElieVoiceDemo] latencia Claude=${claudeMs}ms total(com fala)=${totalMs}ms`);
    } catch (e: any) {
      console.error('[ElieVoiceDemo] turno falhou:', e);
      setTurns((prev) => [...prev, { role: 'elie', text: `Erro: ${e.message}` }]);
    } finally {
      if (!stoppedByUserRef.current) startListening();
    }
  };

  const sendTyped = () => {
    const text = typedInput.trim();
    if (!text) return;
    setTypedInput('');
    handleUserSpeech(text);
  };

  if (!user) {
    return <div style={{ padding: 40, color: '#fff', background: '#0c1222', minHeight: '100vh' }}>Faça login para acessar a demo da Elie.</div>;
  }

  const connected = mode !== 'idle' && mode !== 'connecting' && mode !== 'error';

  return (
    <div style={{ minHeight: '100vh', background: '#0c1222', color: '#fff', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: 16 }}>Elie — modo conversacional por voz (prova de conceito)</h1>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ position: 'relative', width: 360, height: 360 }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: 360, height: 360, background: '#000', borderRadius: 12 }} />
            {connected && (
              <div style={{
                position: 'absolute', bottom: 10, left: 10, padding: '4px 10px', borderRadius: 999,
                background: mode === 'listening' ? '#059669' : mode === 'speaking' ? '#2563eb' : mode === 'thinking' ? '#a16207' : '#374151',
                fontSize: 12, fontWeight: 600,
              }}>
                {MODE_LABEL[mode]}
              </div>
            )}
          </div>
          <audio ref={audioRef} autoPlay />
          <div style={{ marginTop: 12 }}>
            {!connected ? (
              <button onClick={connect} disabled={mode === 'connecting'} style={{ padding: '10px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none' }}>
                {mode === 'connecting' ? 'Conectando...' : 'Iniciar conversa'}
              </button>
            ) : (
              <button onClick={disconnect} style={{ padding: '10px 20px', borderRadius: 8, background: '#dc2626', color: '#fff', border: 'none' }}>
                Encerrar conversa
              </button>
            )}
            {error && <p style={{ color: '#f87171', marginTop: 8, fontSize: 13 }}>{error}</p>}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#111827', borderRadius: 12, padding: 16, minHeight: 300, marginBottom: 12 }}>
            {turns.map((t, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: t.role === 'user' ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 8, background: t.role === 'user' ? '#2563eb' : '#1f2937', maxWidth: '80%' }}>
                  {t.text}
                </div>
                {t.latencyMs != null && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>latência total: {t.latencyMs}ms</div>}
              </div>
            ))}
            {interimText && (
              <div style={{ textAlign: 'right', opacity: 0.6, fontStyle: 'italic' }}>{interimText}...</div>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            Fale naturalmente — a Elie ouve, responde e volta a ouvir sozinha. Ou digite abaixo, se preferir.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendTyped()}
              disabled={!connected}
              placeholder="Ou escreva aqui..."
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #374151', background: '#0c1222', color: '#fff' }}
            />
            <button onClick={sendTyped} disabled={!connected} style={{ padding: '10px 20px', borderRadius: 8, background: '#059669', color: '#fff', border: 'none' }}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
