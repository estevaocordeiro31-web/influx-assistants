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

// A resposta do Claude vem formatada em markdown + emoji (pro chat de texto)
// — falado literalmente, o avatar lia simbolo por simbolo, sem pausa nenhuma.
// Limpa tudo isso e monta um SSML com pausas reais entre frases + estilo
// "calm" (unico que a voz Francisca suporta) pra soar mais natural. O texto
// original (com formatacao) continua no historico visual, so o audio muda.
const EMOJI_REGEX = new RegExp('[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{2190}-\\u{21FF}\\u{2B00}-\\u{2BFF}\\uFE0F]', 'gu');

function cleanTextForSpeech(text: string): string {
  return text
    .replace(EMOJI_REGEX, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/(^|\n)\s*[-*]\s+/g, '$1')
    .replace(/\s+-\s+/g, '. ')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function escapeSsml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Quebra em frases e insere pausa real entre elas — sem isso o Azure fala
// tudo "em cima", sem intonacao (era exatamente a reclamacao).
function toSpeechSsml(text: string, voiceName: string): string {
  const clean = cleanTextForSpeech(text);
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const body = sentences.map((s) => escapeSsml(s)).join(' <break time="380ms"/> ');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="pt-BR">
    <voice name="${voiceName}">
      <mstts:express-as style="calm" styledegree="1">${body}</mstts:express-as>
    </voice>
  </speak>`;
}

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
      // So reage a fala se estivermos no modo "ouvindo" — enquanto ela fala
      // ou pensa, ignora qualquer coisa detectada (evita reagir a eco do
      // proprio audio dela, e evita reiniciar o reconhecimento a cada turno).
      if (modeRef.current !== 'listening') return;
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
    // O reconhecimento fica ligado o tempo TODO da conversa (nao para/reinicia
    // a cada turno — isso e' o que disparava o som de "iniciando gravacao" do
    // sistema toda vez). Se o browser encerrar sozinho (limite de silencio),
    // reinicia uma unica vez em segundo plano, sem trocar de modo.
    recognition.onend = () => {
      if (!stoppedByUserRef.current) {
        try { recognition.start(); } catch { /* ja rodando, ignora */ }
      }
    };

    recognitionRef.current = recognition;
    return () => {
      stoppedByUserRef.current = true;
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // So' liga o modo "ouvindo" — o reconhecimento em si ja esta rodando
  // continuamente desde o connect() (ver comentario no recognition.onend).
  const startListening = () => setMode('listening');

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
      await synthesizer.speakSsmlAsync(toSpeechSsml(greeting, VOICE_NAME));

      // Unico lugar que de fato "aperta o botao" de gravar — o resto da
      // conversa so alterna o modo (ver onresult), sem novo start/stop.
      stoppedByUserRef.current = false;
      try { recognitionRef.current?.start(); } catch { /* já rodando, ignora */ }
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
  // e faz a Elie falar a resposta. O reconhecimento continua ligado o
  // tempo todo (nao para/reinicia) — so ignoramos o que ele capta
  // enquanto o modo nao e' "listening" (ver recognition.onresult).
  const handleUserSpeech = async (text: string) => {
    if (!text || !synthesizerRef.current) return;
    setMode('thinking');
    const t0 = performance.now();
    setTurns((prev) => [...prev, { role: 'user', text }]);
    try {
      const result = await sendMessage.mutateAsync({ message: text, objective: 'free_chat' });
      const responseText = result?.message || 'Desculpe, não consegui responder agora.';
      const claudeMs = Math.round(performance.now() - t0);

      setMode('speaking');
      await synthesizerRef.current.speakSsmlAsync(toSpeechSsml(responseText, VOICE_NAME));
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
