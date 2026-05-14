import { useAgentStore } from '../store/agentStore';

function base() {
  return useAgentStore.getState().backendUrl;
}

export async function sendChat(message: string): Promise<string> {
  const res = await fetch(`${base()}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`Chat error ${res.status}`);
  const data = await res.json();
  return data.reply as string;
}

export async function transcribeBlob(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append('file', blob, 'recording.webm');
  const res = await fetch(`${base()}/transcribe`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Transcription error ${res.status}`);
  const data = await res.json();
  return data.transcript as string;
}

export async function speakText(text: string): Promise<string> {
  const res = await fetch(`${base()}/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TTS error ${res.status}`);
  const data = await res.json();
  return `${base()}${data.audio_url}` as string;
}

export async function healthCheck(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
