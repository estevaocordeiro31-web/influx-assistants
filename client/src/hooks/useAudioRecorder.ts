import { useState, useRef, useCallback } from 'react';

export interface AudioRecorderState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  error: string | null;
  duration: number;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    recordedBlob: null,
    recordedUrl: null,
    error: null,
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setState(prev => ({
          ...prev,
          recordedBlob: audioBlob,
          recordedUrl: url,
          isRecording: false,
        }));
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      startTimeRef.current = Date.now();
      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Update duration every 100ms
      durationIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setState(prev => ({ ...prev, duration: elapsed }));
        }
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setState(prev => ({ ...prev, error: errorMessage }));
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Clear duration interval
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    if (state.recordedUrl) {
      URL.revokeObjectURL(state.recordedUrl);
    }
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedUrl: null,
      error: null,
      duration: 0,
    });
    audioChunksRef.current = [];
  }, [state.recordedUrl]);

  const getRecordedAudioFile = useCallback((): File | null => {
    if (!state.recordedBlob) return null;
    return new File([state.recordedBlob], `karaoke-${Date.now()}.webm`, {
      type: 'audio/webm',
    });
  }, [state.recordedBlob]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    getRecordedAudioFile,
  };
}
