import { useRef, useCallback } from 'react';
import { transcribeBlob } from '../services/api';
import { useAgentStore } from '../store/agentStore';

export function useVoice() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const setListening = useAgentStore((s) => s.setListening);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunks.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
    recorder.start();
    mediaRecorder.current = recorder;
    setListening(true);
  }, [setListening]);

  const stop = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorder.current;
      if (!recorder) { setListening(false); resolve(null); return; }

      recorder.onstop = async () => {
        setListening(false);
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
        mediaRecorder.current = null;
        try {
          const transcript = await transcribeBlob(blob);
          resolve(transcript || null);
        } catch {
          resolve(null);
        }
      };

      recorder.stop();
    });
  }, [setListening]);

  return { start, stop };
}
