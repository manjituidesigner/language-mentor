import { api } from '../api/axiosConfig';

export interface MessageCorrection {
  original: string;
  corrected: string;
  explanation: string;
  category?: string;
}

export interface PowerWordSuggestion {
  simple: string;
  advanced: string;
  tip: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'mentor';
  content: string;
  translation?: string;
  corrections?: MessageCorrection | null;
  audio_url?: string;
  fluencyScore?: number;
  weakPoint?: string | null;
  powerWords?: PowerWordSuggestion[];
}

export interface AdaptiveDailyLesson {
  lessonTitle: string;
  focusArea: string;
  description: string;
  targetRule: string;
  recommendedRoleplay: string;
  vocabularyToUnlock: string[];
  estimatedMinutes: number;
}

export interface SessionDebrief {
  sessionId: string;
  fluencyScore: number;
  speakingTimeMinutes: number;
  durationSeconds: number;
  wordsSpoken: number;
  grammarErrorsCaught: number;
  mentorObservations: string;
  vocabularySavedCount: number;
  adaptiveLesson?: AdaptiveDailyLesson;
  weaknessesCaught?: string[];
}

export interface SendMessageResponse {
  userMessage: SessionMessage;
  mentorMessage: SessionMessage;
  fluencyScore: number;
  grammarScore?: number;
  vocabScore?: number;
  weakPoint?: string | null;
  suggestedPowerWords?: PowerWordSuggestion[];
  fillerWords?: string[];
}

export const sessionService = {
  startSession: async (data: {
    mentorId?: string;
    mentorName?: string;
    sessionType: 'chat' | 'voice';
    topic?: string;
  }) => {
    try {
      const response = await api.post('/sessions/start', data);
      return response.data?.data;
    } catch {
      return null;
    }
  },

  sendMessage: async (
    sessionId: string,
    data: {
      content: string;
      mentorName?: string;
      targetLang?: string;
      nativeLang?: string;
      topic?: string;
      audioUrl?: string;
    }
  ): Promise<SendMessageResponse | null> => {
    try {
      const response = await api.post(`/sessions/${sessionId}/message`, data);
      return response.data?.data;
    } catch {
      return null;
    }
  },

  endSession: async (sessionId: string, durationSeconds: number): Promise<SessionDebrief | null> => {
    try {
      const response = await api.post(`/sessions/${sessionId}/end`, { durationSeconds });
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  getSession: async (sessionId: string) => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      return response.data?.data;
    } catch {
      return null;
    }
  },
};
