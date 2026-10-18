import { create } from "zustand";
import { chatQueries } from "@/services/database/queries";
import type { ChatMessage, ChatSession } from "@/services/ai/types";

interface AiChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isStreaming: boolean;
  isLoaded: boolean;
  loadSessions: () => Promise<void>;
  createSession: (title?: string) => Promise<string>;
  setActiveSession: (id: string | null) => void;
  addMessage: (
    sessionId: string,
    role: "user" | "model",
    content: string
  ) => Promise<ChatMessage>;
  updateLastMessage: (sessionId: string, content: string) => void;
  setStreaming: (streaming: boolean) => void;
  deleteSession: (id: string) => Promise<void>;
  getActiveSession: () => ChatSession | null;
}

export const useAiChatStore = create<AiChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  isStreaming: false,
  isLoaded: false,

  loadSessions: async () => {
    try {
      const sessions = await chatQueries.getSessions();
      set({ sessions, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  createSession: async (title?: string) => {
    const sessionTitle = title || "New Chat";
    const id = await chatQueries.createSession(sessionTitle);
    const newSession: ChatSession = {
      id,
      title: sessionTitle,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: id,
    }));
    return id;
  },

  setActiveSession: (id) => set({ activeSessionId: id }),

  addMessage: async (sessionId, role, content) => {
    const message = await chatQueries.addMessage(sessionId, role, content);
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: Date.now(),
            }
          : session
      ),
    }));
    return message;
  },

  updateLastMessage: (sessionId, content) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId) return session;
        const messages = [...session.messages];
        if (messages.length > 0) {
          messages[messages.length - 1] = {
            ...messages[messages.length - 1],
            content,
          };
        }
        return { ...session, messages };
      }),
    }));
  },

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  deleteSession: async (id) => {
    await chatQueries.deleteSession(id);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId:
        state.activeSessionId === id ? null : state.activeSessionId,
    }));
  },

  getActiveSession: () => {
    const state = get();
    return (
      state.sessions.find((s) => s.id === state.activeSessionId) || null
    );
  },
}));
