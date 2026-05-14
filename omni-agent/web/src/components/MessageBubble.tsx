import { Message } from '../store/agentStore';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin: '6px 0',
    }}>
      <div style={{
        maxWidth: '72%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#6c47ff' : '#1e1e2e',
        color: '#fff',
        fontSize: 15,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {message.content}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
