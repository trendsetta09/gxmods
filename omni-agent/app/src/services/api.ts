import { useAgentStore } from '../store/agentStore';

function getBase(): string {
  return useAgentStore.getState().backendUrl;
}

export interface ChatResponse {
  reply: string;
  memory_updated: boolean;
  audio_url?: string;
}

export async function sendChat(text: string): Promise<ChatResponse> {
  const res = await fetch(`${getBase()}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append('file', audioBlob, 'recording.wav');
  const res = await fetch(`${getBase()}/transcribe`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
  const data = await res.json();
  return data.transcript;
}

export async function synthesizeSpeech(text: string): Promise<string> {
  const res = await fetch(`${getBase()}/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
  const data = await res.json();
  return data.audio_url;
}

export async function runAutomation(task: string): Promise<string> {
  const res = await fetch(`${getBase()}/automate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error(`Automation failed: ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function healthCheck(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
