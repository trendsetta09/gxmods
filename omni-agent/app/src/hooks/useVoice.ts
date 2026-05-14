import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { transcribeAudio } from '../services/api';
import { useAgentStore } from '../store/agentStore';

export function useVoice() {
  const recording = useRef<Audio.Recording | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setListening = useAgentStore((s) => s.setListening);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      if (Platform.OS !== 'web') {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) throw new Error('Microphone permission denied');
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      }
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = rec;
      setListening(true);
    } catch (e: any) {
      setError(e.message);
    }
  }, [setListening]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    setListening(false);
    if (!recording.current) return null;
    try {
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      recording.current = null;
      if (!uri) return null;

      const response = await fetch(uri);
      const blob = await response.blob();
      const transcript = await transcribeAudio(blob);
      return transcript;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [setListening]);

  return { startRecording, stopRecording, error };
}
