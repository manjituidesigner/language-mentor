import { api } from '../api/axiosConfig';

export interface AssessmentScores {
  speaking: number;
  listening: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  confidence: number;
}

export interface AssessmentData {
  id?: string;
  overallScore: number;
  cefrLevel: string;
  scores: AssessmentScores;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const assessmentService = {
  submitAssessment: async (answers: { questionId: string; text: string }[]): Promise<AssessmentData | null> => {
    try {
      const response = await api.post('/assessment/submit', { answers });
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  getLatestAssessment: async (): Promise<AssessmentData | null> => {
    try {
      const response = await api.get('/assessment/latest');
      return response.data?.data || null;
    } catch {
      return null;
    }
  },
};
