import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

interface AgentState {
  messages: Message[];
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  backendUrl: string;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  setListening: (v: boolean) => void;
  setThinking: (v: boolean) => void;
  setSpeaking: (v: boolean) => void;
  setBackendUrl: (url: string) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      messages: [],
      isListening: false,
      isThinking: false,
      isSpeaking: false,
      backendUrl: 'http://localhost:8000',

      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),

      setListening: (v) => set({ isListening: v }),
      setThinking: (v) => set({ isThinking: v }),
      setSpeaking: (v) => set({ isSpeaking: v }),
      setBackendUrl: (url) => set({ backendUrl: url.replace(/\/$/, '') }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'omni-agent',
      partialize: (s) => ({ backendUrl: s.backendUrl, messages: s.messages }),
    }
  )
);
