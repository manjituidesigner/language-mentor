import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AssessmentResult {
  overallScore: number;
  cefrLevel: string;
  scores: { speaking: number; listening: number; grammar: number; vocabulary: number; pronunciation: number; confidence: number };
  strengths: string[];
  weaknesses: string[];
  estimatedFluencyTime: string;
  recommendedDailyTime: string;
}

interface AssessmentResult {
  overallScore: number;
  cefrLevel: string;
  scores: { speaking: number; listening: number; grammar: number; vocabulary: number; pronunciation: number; confidence: number };
  strengths: string[];
  weaknesses: string[];
  estimatedFluencyTime: string;
  recommendedDailyTime: string;
}

interface OnboardingState {
  nativeLanguage: string | null;
  learningLanguage: string | null;
  mentorId: string | null;
  skippedAssessment: boolean | null;
  assessmentAnswers: { questionId: string; text: string }[];
  assessmentResult: AssessmentResult | null;
  goals: string[];
  profession: string | null;
  dailyStudyTime: number | null;
  setNativeLanguage: (lang: string) => void;
  setLearningLanguage: (lang: string) => void;
  setMentorId: (id: string) => void;
  setSkippedAssessment: (skipped: boolean) => void;
  addAssessmentAnswer: (questionId: string, text: string) => void;
  clearAssessmentAnswers: () => void;
  setAssessmentResult: (result: AssessmentResult) => void;
  setGoals: (goals: string[]) => void;
  setProfession: (prof: string) => void;
  setDailyStudyTime: (time: number) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      nativeLanguage: null,
      learningLanguage: null,
      mentorId: null,
      skippedAssessment: null,
      assessmentAnswers: [],
      assessmentResult: null,
      goals: [],
      profession: null,
      dailyStudyTime: null,
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setLearningLanguage: (lang) => set({ learningLanguage: lang }),
      setMentorId: (id) => set({ mentorId: id }),
      setSkippedAssessment: (skipped) => set({ skippedAssessment: skipped }),
      addAssessmentAnswer: (questionId, text) => set((state) => ({ assessmentAnswers: [...state.assessmentAnswers, { questionId, text }] })),
      clearAssessmentAnswers: () => set({ assessmentAnswers: [] }),
      setAssessmentResult: (result) => set({ assessmentResult: result }),
      setGoals: (goals) => set({ goals }),
      setProfession: (profession) => set({ profession }),
      setDailyStudyTime: (dailyStudyTime) => set({ dailyStudyTime }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
