/**
 * ElieVoiceSession — Real-time voice with ElevenLabs Conversational AI
 *
 * Connects via WebSocket to ElevenLabs, streams student mic audio,
 * receives Elie's voice + lipsync visemes + transcripts.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface LipSyncFrame {
  time: number;
  viseme: string;
  amplitude: number;
}

export interface VoiceSessionOptions {
  studentName: string;
  currentBook: string;
  currentLesson: number;
  presenceState: string;
  level?: string;
  streak?: number;
  sessionFocus?: "pronunciation" | "vocabulary" | "dialogue" | "free_chat";
  voiceParams: {
    stability: number;
    similarity_boost: number;
    style: number;
  };
}

type SpeakingCallback = (audioChunk: ArrayBuffer, lipSyncData: LipSyncFrame[]) => void;
type TranscriptCallback = (text: string, isFinal: boolean) => void;
type PresenceCallback = (state: string) => void;
type StatusCallback = (status: "connected" | "disconnected" | "error" | "speaking" | "listening") => void;

const ELIE_VOICE_ID = "mmhTWXIU9zlmbfIMh4y0";
const ELEVENLABS_CONVAI_URL = "wss://api.elevenlabs.io/v1/convai/conversation";

// ── ElieVoiceSession ─────────────────────────────────────────────────────────

export class ElieVoiceSession {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isRecording = false;
  private sessionId: string | null = null;
  private options: VoiceSessionOptions | null = null;

  // Playback
  private playbackQueue: ArrayBuffer[] = [];
  private isPlaying = false;

  // Callbacks
  private onSpeakingCb: SpeakingCallback | null = null;
  private onElieTranscriptCb: TranscriptCallback | null = null;
  private onStudentTranscriptCb: TranscriptCallback | null = null;
  private onPresenceChangeCb: PresenceCallback | null = null;
  private onStatusChangeCb: StatusCallback | null = null;
  private onErrorCb: ((error: string) => void) | null = null;

  // ── Public API ───────────────────────────────────────────────────────────

  async connect(options: VoiceSessionOptions): Promise<void> {
    this.options = options;

    // Get API key from BRAiN backend
    const BRAIN_API = "https://brain.imaind.tech";
    const keyRes = await fetch(`${BRAIN_API}/api/presence/elevenlabs-key`);
    const { apiKey } = await keyRes.json();

    if (!apiKey) {
      throw new Error("ElevenLabs API key not available");
    }

    // Create AudioContext for mic capture + playback
    this.audioContext = new AudioContext({ sampleRate: 16000 });

    // Open WebSocket to ElevenLabs Conversational AI
    const url = `${ELEVENLABS_CONVAI_URL}?xi-api-key=${apiKey}`;
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    return new Promise((resolve, reject) => {
      if (!this.ws) return reject("No WebSocket");

      this.ws.onopen = () => {
        // Send conversation init
        this.ws!.send(JSON.stringify({
          type: "conversation_initiation_client_data",
          conversation_config_override: {
            agent: {
              prompt: {
                prompt: this.buildSystemPrompt(options),
              },
              first_message: `Hi ${options.studentName}! Ready to practice?`,
              language: "en",
            },
            tts: {
              voice_id: ELIE_VOICE_ID,
              model_id: "eleven_turbo_v2_5",
              stability: options.voiceParams.stability,
              similarity_boost: options.voiceParams.similarity_boost,
              style: options.voiceParams.style,
            },
          },
        }));

        this.sessionId = crypto.randomUUID();
        this.onStatusChangeCb?.("connected");
        resolve();
      };

      this.ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          // Binary: audio chunk from Elie
          this.handleAudioChunk(event.data);
        } else {
          // JSON message
          try {
            const msg = JSON.parse(event.data);
            this.handleMessage(msg);
          } catch {
            // ignore parse errors
          }
        }
      };

      this.ws.onerror = (err) => {
        this.onStatusChangeCb?.("error");
        this.onErrorCb?.("WebSocket error");
        reject(err);
      };

      this.ws.onclose = () => {
        this.onStatusChangeCb?.("disconnected");
        this.cleanup();
      };
    });
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!this.audioContext) {
        this.audioContext = new AudioContext({ sampleRate: 16000 });
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Send as base64 encoded audio
        this.ws.send(JSON.stringify({
          type: "audio",
          audio: {
            chunk: this.arrayBufferToBase64(pcm16.buffer),
          },
        }));
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isRecording = true;
      this.onStatusChangeCb?.("listening");
      this.onPresenceChangeCb?.("listening");
    } catch (err) {
      this.onErrorCb?.("Microphone access denied");
      throw err;
    }
  }

  async stopRecording(): Promise<void> {
    this.isRecording = false;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  async sendText(text: string): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      type: "user_message",
      text,
    }));
  }

  async disconnect(): Promise<void> {
    await this.stopRecording();

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    this.cleanup();
    this.onStatusChangeCb?.("disconnected");
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isActive(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // ── Callback Registration ────────────────────────────────────────────────

  onElieSpeaking(cb: SpeakingCallback) { this.onSpeakingCb = cb; }
  onElieTranscript(cb: TranscriptCallback) { this.onElieTranscriptCb = cb; }
  onStudentTranscript(cb: TranscriptCallback) { this.onStudentTranscriptCb = cb; }
  onPresenceChange(cb: PresenceCallback) { this.onPresenceChangeCb = cb; }
  onStatusChange(cb: StatusCallback) { this.onStatusChangeCb = cb; }
  onError(cb: (error: string) => void) { this.onErrorCb = cb; }

  // ── Private ──────────────────────────────────────────────────────────────

  private handleMessage(msg: any) {
    switch (msg.type) {
      case "agent_response":
      case "agent_response_correction":
        // Elie's text response
        this.onElieTranscriptCb?.(
          msg.text || msg.agent_response?.text || "",
          msg.type === "agent_response",
        );
        this.onPresenceChangeCb?.("speaking");
        break;

      case "user_transcript":
        // Student's transcribed speech
        this.onStudentTranscriptCb?.(
          msg.text || msg.user_transcript?.text || "",
          msg.is_final ?? msg.user_transcript?.is_final ?? false,
        );
        break;

      case "viseme":
      case "audio_viseme":
        // Lipsync data
        if (this.onSpeakingCb && msg.viseme_id !== undefined) {
          const frame: LipSyncFrame = {
            time: msg.audio_base_time || Date.now(),
            viseme: this.visemeIdToName(msg.viseme_id),
            amplitude: msg.amplitude ?? 0.5,
          };
          this.onSpeakingCb(new ArrayBuffer(0), [frame]);
        }
        break;

      case "interruption":
        // Student interrupted Elie
        this.playbackQueue = [];
        this.isPlaying = false;
        this.onPresenceChangeCb?.("listening");
        break;

      case "conversation_initiation_metadata":
        // Session established
        if (msg.conversation_id) {
          this.sessionId = msg.conversation_id;
        }
        break;

      case "ping":
        this.ws?.send(JSON.stringify({ type: "pong" }));
        break;
    }
  }

  private handleAudioChunk(data: ArrayBuffer) {
    this.onPresenceChangeCb?.("speaking");
    this.onStatusChangeCb?.("speaking");
    this.onSpeakingCb?.(data, []);

    // Queue for playback
    this.playbackQueue.push(data);
    if (!this.isPlaying) {
      this.playNextChunk();
    }
  }

  private async playNextChunk() {
    if (this.playbackQueue.length === 0) {
      this.isPlaying = false;
      this.onPresenceChangeCb?.("idle");
      this.onStatusChangeCb?.("listening");
      return;
    }

    this.isPlaying = true;
    const chunk = this.playbackQueue.shift()!;

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext({ sampleRate: 16000 });
      }

      // Try decoding as audio
      const audioBuffer = await this.audioContext.decodeAudioData(chunk.slice(0));
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => this.playNextChunk();
      source.start();
    } catch {
      // If decoding fails (PCM), try raw playback
      this.playNextChunk();
    }
  }

  private buildSystemPrompt(opts: VoiceSessionOptions): string {
    const focus = opts.sessionFocus || "free_chat";
    const focusMap: Record<string, string> = {
      pronunciation: "Help the student practice pronunciation. Correct errors gently, model correct pronunciation clearly, and give specific tips for Brazilian Portuguese speakers.",
      vocabulary: "Focus on vocabulary from the current lesson. Introduce words in context, ask the student to use them in sentences.",
      dialogue: "Practice dialogue scenarios from the current lesson. Take turns role-playing. Give feedback on naturalness.",
      free_chat: "Have a natural conversation in English. Adjust complexity to the student's level. Gently correct errors when they occur.",
    };

    return `You are Miss Elie, an AI English tutor at inFlux English School.

STUDENT CONTEXT:
- Name: ${opts.studentName}
- Current Book: ${opts.currentBook}
- Current Lesson: ${opts.currentLesson}
- Level: ${opts.level || "Pre-Intermediate"}
- Streak: ${opts.streak || 0} days

SESSION FOCUS: ${focus}
${focusMap[focus]}

PERSONALITY & TONE:
- Warm, encouraging, patient
- Use simple English matching the student's level
- Mix in occasional Portuguese encouragement ("Muito bem!", "Excelente!")
- Keep responses concise (2-3 sentences max in conversation)
- Celebrate small wins enthusiastically
- When correcting pronunciation, say the word slowly and clearly
- Always maintain a positive, motivating atmosphere

RULES:
- Never break character
- Keep the conversation flowing naturally
- If the student is silent for too long, gently prompt them
- Track what vocabulary they've practiced in this session
- End responses with a question or prompt to keep the student engaged`;
  }

  private visemeIdToName(id: number): string {
    const VISEME_MAP: Record<number, string> = {
      0: "sil", 1: "PP", 2: "FF", 3: "TH", 4: "DD",
      5: "kk", 6: "CH", 7: "SS", 8: "nn", 9: "RR",
      10: "AA", 11: "EE", 12: "IH", 13: "OH", 14: "OU",
      15: "sil",
    };
    return VISEME_MAP[id] ?? "sil";
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private cleanup() {
    this.ws = null;
    this.playbackQueue = [];
    this.isPlaying = false;

    if (this.audioContext?.state !== "closed") {
      this.audioContext?.close().catch(() => {});
    }
    this.audioContext = null;
  }
}

// ── Singleton ────────────────────────────────────────────────────────────────

let _instance: ElieVoiceSession | null = null;

export function getElieVoiceSession(): ElieVoiceSession {
  if (!_instance) {
    _instance = new ElieVoiceSession();
  }
  return _instance;
}
