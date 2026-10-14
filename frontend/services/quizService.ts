import { api } from '../api/axiosConfig';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  user_id: string;
  session_id?: string;
  questions: QuizQuestion[];
  total_questions: number;
}

export interface QuizSubmitResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export const quizService = {
  generateQuiz: async (sessionId?: string): Promise<QuizData | null> => {
    try {
      const response = await api.get('/quiz/generate', {
        params: sessionId ? { sessionId } : undefined,
      });
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  submitQuiz: async (quizId: string, answers: { questionId: string; selectedIndex: number }[]): Promise<QuizSubmitResult | null> => {
    try {
      const response = await api.post('/quiz/submit', { quizId, answers });
      return response.data?.data || null;
    } catch {
      return null;
    }
  },
};
