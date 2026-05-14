import { useAgentStore } from '../store/agentStore';

export function StatusIndicator() {
  const { isListening, isThinking, isSpeaking } = useAgentStore();

  const state = isListening ? 'Listening'
    : isThinking ? 'Thinking'
    : isSpeaking ? 'Speaking'
    : 'Ready';

  const color = isListening ? '#ff4757'
    : isThinking ? '#ffa502'
    : isSpeaking ? '#2ed573'
    : '#444';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#111', borderBottom: '1px solid #222' }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
        boxShadow: color !== '#444' ? `0 0 6px ${color}` : 'none',
        transition: 'all 0.3s',
      }} />
      <span style={{ fontSize: 13, color: '#999' }}>{state}</span>
    </div>
  );
}
