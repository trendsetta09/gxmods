import { useEffect, useRef } from 'react';
import { useAgentStore } from '../store/agentStore';

interface Props {
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export function VoiceButton({ onMouseDown, onMouseUp }: Props) {
  const isListening = useAgentStore((s) => s.isListening);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const handleUp = () => onMouseUp();
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [onMouseUp]);

  return (
    <button
      ref={btnRef}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      title="Hold to talk"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: isListening ? '#ff4757' : '#6c47ff',
        boxShadow: isListening ? '0 0 0 8px rgba(255,71,87,0.2)' : 'none',
        fontSize: 18,
        transition: 'all 0.2s',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      🎙️
    </button>
  );
}
