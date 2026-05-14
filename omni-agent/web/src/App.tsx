import { useState } from 'react';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';

type Tab = 'chat' | 'settings';

export function App() {
  const [tab, setTab] = useState<Tab>('chat');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 800, margin: '0 auto' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: 52,
        background: '#111',
        borderBottom: '1px solid #222',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>
          OmniAgent
        </span>
        <nav style={{ display: 'flex', gap: 4 }}>
          {(['chat', 'settings'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#6c47ff' : 'transparent',
                color: tab === t ? '#fff' : '#888',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: tab === t ? 600 : 400,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'chat' ? <ChatPage /> : <SettingsPage />}
      </main>
    </div>
  );
}
