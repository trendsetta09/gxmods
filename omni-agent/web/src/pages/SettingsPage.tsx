import { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { healthCheck } from '../services/api';

export function SettingsPage() {
  const { backendUrl, setBackendUrl, clearMessages } = useAgentStore();
  const [draft, setDraft] = useState(backendUrl);
  const [status, setStatus] = useState<string | null>(null);

  async function test() {
    setStatus('Testing...');
    const ok = await healthCheck(draft);
    setStatus(ok ? '✅ Connected' : '❌ Failed — check URL and backend');
  }

  function save() {
    setBackendUrl(draft);
    setStatus('Saved');
  }

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h2 style={{ color: '#fff', marginBottom: 20, fontWeight: 600 }}>Settings</h2>

      <label style={{ color: '#aaa', fontSize: 13, display: 'block', marginBottom: 6 }}>
        Backend URL
      </label>
      <p style={{ color: '#555', fontSize: 12, marginBottom: 10 }}>
        Your PC's local IP or Tailscale IP. Example: http://100.x.x.x:8000
      </p>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        style={{
          width: '100%',
          background: '#1e1e2e',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 15,
          outline: 'none',
          marginBottom: 12,
          fontFamily: 'inherit',
        }}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        <button onClick={test} style={btnStyle('#1e1e2e')}>Test Connection</button>
        <button onClick={save} style={btnStyle('#6c47ff')}>Save</button>
      </div>
      {status && <p style={{ color: '#aaa', fontSize: 13 }}>{status}</p>}

      <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '28px 0' }} />

      <h3 style={{ color: '#fff', fontSize: 15, marginBottom: 12 }}>Session</h3>
      <button
        onClick={() => { clearMessages(); setStatus('Chat history cleared.'); }}
        style={btnStyle('#c0392b')}
      >
        Clear Chat History
      </button>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };
}
