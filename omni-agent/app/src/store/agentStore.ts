import { create } from 'zustand';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  audioUri?: string;
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

export const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  isListening: false,
  isThinking: false,
  isSpeaking: false,
  backendUrl: 'http://localhost:8000',

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: Date.now().toString(), timestamp: Date.now() },
      ],
    })),

  setListening: (v) => set({ isListening: v }),
  setThinking: (v) => set({ isThinking: v }),
  setSpeaking: (v) => set({ isSpeaking: v }),
  setBackendUrl: (url) => set({ backendUrl: url }),
  clearMessages: () => set({ messages: [] }),
}));
