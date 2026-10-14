import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MentorTabType = 'online' | 'offline' | 'group' | 'ai';

export interface AssessmentResult {
  overallScore: number;
  cefrLevel: string;
  scores: {
    speaking: number;
    listening: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  estimatedFluencyTime: string;
  recommendedDailyTime: string;
}

export interface OnboardingState {
  nativeLanguage: string | null;
  nativeLanguageName: string | null;
  learningLanguage: string | null;
  learningLanguageName: string | null;
  mentorId: string | null;
  mentorName: string | null;
  mentorType: MentorTabType;
  selectedGroup: string | null;
  skippedAssessment: boolean | null;
  assessmentAnswers: { questionId: string; text: string }[];
  assessmentResult: AssessmentResult | null;
  goals: string[];
  profession: string | null;
  dailyStudyTime: number | null;

  setNativeLanguage: (langId: string, langName?: string) => void;
  setLearningLanguage: (langId: string, langName?: string) => void;
  setMentorSelection: (id: string, name: string, type: MentorTabType) => void;
  setMentorType: (type: MentorTabType) => void;
  setSelectedGroup: (groupName: string) => void;
  setMentorId: (id: string) => void;
  setSkippedAssessment: (skipped: boolean) => void;
  addAssessmentAnswer: (questionId: string, text: string) => void;
  clearAssessmentAnswers: () => void;
  setAssessmentResult: (result: AssessmentResult) => void;
  setGoals: (goals: string[]) => void;
  setProfession: (prof: string) => void;
  setDailyStudyTime: (time: number) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      nativeLanguage: null,
      nativeLanguageName: null,
      learningLanguage: null,
      learningLanguageName: null,
      mentorId: null,
      mentorName: null,
      mentorType: 'online',
      selectedGroup: null,
      skippedAssessment: null,
      assessmentAnswers: [],
      assessmentResult: null,
      goals: [],
      profession: null,
      dailyStudyTime: null,

      setNativeLanguage: (langId, langName) =>
        set({ nativeLanguage: langId, nativeLanguageName: langName || langId }),
      setLearningLanguage: (langId, langName) =>
        set({ learningLanguage: langId, learningLanguageName: langName || langId }),
      setMentorSelection: (id, name, type) =>
        set({ mentorId: id, mentorName: name, mentorType: type }),
      setMentorType: (type) => set({ mentorType: type }),
      setSelectedGroup: (groupName) => set({ selectedGroup: groupName }),
      setMentorId: (id) => set({ mentorId: id }),
      setSkippedAssessment: (skipped) => set({ skippedAssessment: skipped }),
      addAssessmentAnswer: (questionId, text) =>
        set((state) => ({
          assessmentAnswers: [...state.assessmentAnswers, { questionId, text }],
        })),
      clearAssessmentAnswers: () => set({ assessmentAnswers: [] }),
      setAssessmentResult: (result) => set({ assessmentResult: result }),
      setGoals: (goals) => set({ goals }),
      setProfession: (profession) => set({ profession }),
      setDailyStudyTime: (dailyStudyTime) => set({ dailyStudyTime }),
      resetOnboarding: () =>
        set({
          nativeLanguage: null,
          nativeLanguageName: null,
          learningLanguage: null,
          learningLanguageName: null,
          mentorId: null,
          mentorName: null,
          mentorType: 'online',
          selectedGroup: null,
          skippedAssessment: null,
          assessmentAnswers: [],
          assessmentResult: null,
          goals: [],
          profession: null,
          dailyStudyTime: null,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
