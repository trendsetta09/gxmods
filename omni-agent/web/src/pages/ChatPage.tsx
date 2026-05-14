import { useState, useRef, useCallback, useEffect } from 'react';
import { useAgentStore } from '../store/agentStore';
import { MessageBubble } from '../components/MessageBubble';
import { VoiceButton } from '../components/VoiceButton';
import { StatusIndicator } from '../components/StatusIndicator';
import { sendChat, speakText } from '../services/api';
import { useVoice } from '../hooks/useVoice';

export function ChatPage() {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, setThinking, setSpeaking } = useAgentStore();
  const { start, stop } = useVoice();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');
    addMessage({ role: 'user', content: trimmed });
    setThinking(true);

    try {
      const reply = await sendChat(trimmed);
      addMessage({ role: 'assistant', content: reply });

      setSpeaking(true);
      try {
        const audioUrl = await speakText(reply);
        const audio = new Audio(audioUrl);
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        await audio.play();
      } catch {
        setSpeaking(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addMessage({ role: 'assistant', content: `Error: ${msg}` });
    } finally {
      setThinking(false);
    }
  }, [addMessage, setThinking, setSpeaking]);

  const handleVoiceDown = useCallback(() => { start(); }, [start]);
  const handleVoiceUp = useCallback(async () => {
    const transcript = await stop();
    if (transcript) handleSend(transcript);
  }, [stop, handleSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusIndicator />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#444', marginTop: 60, fontSize: 15 }}>
            OmniAgent is ready. Type or hold 🎙️ to speak.
          </div>
        )}
        {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        padding: '10px 14px',
        background: '#111',
        borderTop: '1px solid #222',
        alignItems: 'flex-end',
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command... (Enter to send, Shift+Enter for newline)"
          rows={1}
          style={{
            flex: 1,
            background: '#1e1e2e',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 15,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        />
        <VoiceButton onMouseDown={handleVoiceDown} onMouseUp={handleVoiceUp} />
        <button
          onClick={() => handleSend(input)}
          style={{
            background: '#6c47ff',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            height: 44,
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
