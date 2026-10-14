import { api } from '../api/axiosConfig';

export interface DayProgress {
  day: string;
  date: string;
  minutes: number;
  completed: boolean;
  isToday: boolean;
}

export interface ProgressStats {
  streakDays: number;
  streakFreezeCount: number;
  currentCefrLevel: string;
  nextCefrLevel: string;
  levelProgressPercent: number;
  sessionsRemainingForNextLevel: number;
  totalSpeakingMinutes: number;
  weeklyMinutesTotal: number;
  wordsMasteredCount: number;
  weeklyGrowthPercent: number;
  dailyAverageMinutes: number;
  weeklyActivity: DayProgress[];
  skillCompetency: {
    speakingFluency: number;
    listeningComprehension: number;
    grammarPrecision: number;
    pronunciationClarity: number;
  };
}

export const progressService = {
  getStats: async (): Promise<ProgressStats | null> => {
    try {
      const response = await api.get('/progress/stats');
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  useStreakFreeze: async () => {
    try {
      const response = await api.post('/progress/streak-freeze');
      return response.data?.data;
    } catch {
      return null;
    }
  },
};
