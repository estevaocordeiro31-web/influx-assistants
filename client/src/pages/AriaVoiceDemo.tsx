import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useEffect, useRef, useState } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

type ConnState = 'idle' | 'connecting' | 'connected' | 'error';

interface Turn {
  role: 'user' | 'aria';
  text: string;
  latencyMs?: number;
}

// Avatar stock "talking head" (visual neutro, sem treino custom) + voz pt-BR.
const AVATAR_CHARACTER = 'meg';
const AVATAR_STYLE = 'formal';
const VOICE_NAME = 'pt-BR-FranciscaNeural';

export default function AriaVoiceDemo() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const synthesizerRef = useRef<SpeechSDK.AvatarSynthesizer | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string>('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const iceTokenQuery = trpc.ariaVoice.getIceToken.useQuery(undefined, { enabled: false });
  const sendMessage = trpc.chat.sendMessage.useMutation();

  const connect = async () => {
    setState('connecting');
    setError('');
    try {
      const { data: ice } = await iceTokenQuery.refetch();
      if (!ice) throw new Error('Sem token ICE do Azure');

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
      setState('connected');
      setTurns([{ role: 'aria', text: 'Oi! Sou a ARIA. Pode escrever algo que eu falo em voz alta pra você.' }]);
    } catch (e: any) {
      console.error('[AriaVoiceDemo] connect falhou:', e);
      setError(e.message || String(e));
      setState('error');
    }
  };

  const disconnect = () => {
    synthesizerRef.current?.close();
    peerConnectionRef.current?.close();
    synthesizerRef.current = null;
    peerConnectionRef.current = null;
    setState('idle');
  };

  useEffect(() => () => disconnect(), []);

  const send = async () => {
    const text = input.trim();
    if (!text || !synthesizerRef.current) return;
    setInput('');
    setBusy(true);
    const t0 = performance.now();
    setTurns((prev) => [...prev, { role: 'user', text }]);
    try {
      const result = await sendMessage.mutateAsync({ message: text, objective: 'free_chat' });
      const responseText = result?.message || 'Desculpe, não consegui responder agora.';
      const claudeMs = Math.round(performance.now() - t0);

      await synthesizerRef.current.speakTextAsync(responseText);
      const totalMs = Math.round(performance.now() - t0);

      setTurns((prev) => [...prev, { role: 'aria', text: responseText, latencyMs: totalMs }]);
      console.log(`[AriaVoiceDemo] latencia Claude=${claudeMs}ms total(com fala)=${totalMs}ms`);
    } catch (e: any) {
      console.error('[AriaVoiceDemo] turno falhou:', e);
      setTurns((prev) => [...prev, { role: 'aria', text: `Erro: ${e.message}` }]);
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return <div style={{ padding: 40, color: '#fff', background: '#0c1222', minHeight: '100vh' }}>Faça login para acessar a demo da ARIA.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c1222', color: '#fff', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: 16 }}>ARIA — voz + avatar (prova de conceito)</h1>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: 360, height: 360, background: '#000', borderRadius: 12 }} />
          <audio ref={audioRef} autoPlay />
          <div style={{ marginTop: 12 }}>
            {state !== 'connected' ? (
              <button onClick={connect} disabled={state === 'connecting'} style={{ padding: '10px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none' }}>
                {state === 'connecting' ? 'Conectando...' : 'Conectar avatar'}
              </button>
            ) : (
              <button onClick={disconnect} style={{ padding: '10px 20px', borderRadius: 8, background: '#dc2626', color: '#fff', border: 'none' }}>
                Desconectar
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
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={state !== 'connected' || busy}
              placeholder="Escreva algo pra ARIA falar..."
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #374151', background: '#0c1222', color: '#fff' }}
            />
            <button onClick={send} disabled={state !== 'connected' || busy} style={{ padding: '10px 20px', borderRadius: 8, background: '#059669', color: '#fff', border: 'none' }}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
