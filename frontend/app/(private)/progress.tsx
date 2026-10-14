import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { progressService, ProgressStats } from '../../services/progressService';
import {
  Flame,
  Award,
  Calendar,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Zap,
  BookOpen,
  Volume2,
  Users,
  ShieldCheck,
  RefreshCw,
  Home,
} from 'lucide-react-native';
import { BackButton } from '../../components';

interface DayActivity {
  day: string;
  date: string;
  minutes: number;
  completed: boolean;
  isToday: boolean;
}

const WEEK_DAYS: DayActivity[] = [
  { day: 'M', date: 'Oct 9', minutes: 20, completed: true, isToday: false },
  { day: 'T', date: 'Oct 10', minutes: 15, completed: true, isToday: false },
  { day: 'W', date: 'Oct 11', minutes: 25, completed: true, isToday: false },
  { day: 'T', date: 'Oct 12', minutes: 18, completed: true, isToday: false },
  { day: 'F', date: 'Oct 13', minutes: 22, completed: true, isToday: false },
  { day: 'S', date: 'Oct 14', minutes: 30, completed: true, isToday: false },
  { day: 'S', date: 'Oct 15', minutes: 15, completed: true, isToday: true },
];

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguageName, nativeLanguageName, assessmentResult } = useOnboardingStore();

  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';
  const currentCefr = assessmentResult?.cefrLevel || 'A2 Elementary';

  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    progressService.getStats().then((data) => {
      if (data) {
        setStats(data);
      }
    });
  }, []);

  const streakDays = stats?.streakDays ?? 12;
  const wordsMastered = stats?.wordsMasteredCount ?? 148;
  const talkTimeMinutes = stats?.totalSpeakingMinutes ?? 380;
  const weekTotal = stats?.weeklyMinutesTotal ?? 145;

  const maxMinutes = 35; // For bar chart scaling

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 I'm on a ${streakDays}-day ${targetLang} streak with my AI Language Mentor! Practice speaking daily with real-time corrections: https://lumina.mentor/join`,
      });
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // dismissed
    }
  };

  const handleUseFreeze = async () => {
    await progressService.useStreakFreeze();
    router.push('/(private)/chat-session');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 shadow-sm shadow-black/[0.02]"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <BackButton fallbackRoute="/(private)/dashboard" />
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900 leading-tight">
                Progress & History
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                {targetLang} Mastery Journey
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200/70 items-center justify-center shadow-sm"
          >
            <Share2 size={17} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* CEFR Level Milestone Hero Card */}
        <View className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center border border-indigo-100">
                <Award size={20} color="#4f46e5" />
              </View>
              <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Target Proficiency
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Moving from {currentCefr} to B1
                </Text>
              </View>
            </View>

            <View className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-emerald-700">
                On Track
              </Text>
            </View>
          </View>

          {/* Level Progress Indicator */}
          <View className="my-2">
            <View className="flex-row justify-between items-center mb-1.5">
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-zinc-600">
                Current Level: A2
              </Text>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-indigo-600">
                68% to B1 Milestone
              </Text>
            </View>
            <View className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <View className="h-full bg-indigo-600 rounded-full" style={{ width: '68%' }} />
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-zinc-100">
            <View className="flex-row items-center gap-1.5">
              <Sparkles size={14} color="#f59e0b" />
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-600">
                ~18 daily sessions remaining for B1
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(private)/learning-mode')}
              activeOpacity={0.7}
              className="flex-row items-center gap-1"
            >
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-indigo-600">
                Level Exam
              </Text>
              <ChevronRight size={13} color="#4f46e5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Activity Bar Chart */}
        <View className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                Speaking & Practice Time
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                {weekTotal} mins total this week
              </Text>
            </View>

            <View className="flex-row bg-zinc-100 p-1 rounded-xl">
              <TouchableOpacity
                onPress={() => setTimeRange('week')}
                className={`px-2.5 py-1 rounded-lg ${timeRange === 'week' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text
                  style={{ fontFamily: 'Inter_700Bold' }}
                  className={`text-[11px] ${timeRange === 'week' ? 'text-zinc-900' : 'text-zinc-500'}`}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTimeRange('month')}
                className={`px-2.5 py-1 rounded-lg ${timeRange === 'month' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text
                  style={{ fontFamily: 'Inter_700Bold' }}
                  className={`text-[11px] ${timeRange === 'month' ? 'text-zinc-900' : 'text-zinc-500'}`}
                >
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bar Chart Container */}
          <View className="flex-row items-end justify-between h-36 pt-4 pb-2 px-1">
            {WEEK_DAYS.map((d, index) => {
              const heightPercent = Math.round((d.minutes / maxMinutes) * 100);
              return (
                <View key={index} className="flex-col items-center flex-1">
                  <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-zinc-400 mb-1.5">
                    {d.minutes}m
                  </Text>
                  <View className="w-7 h-24 bg-zinc-100 rounded-t-lg justify-end overflow-hidden">
                    <View
                      className={`w-full rounded-t-lg ${
                        d.isToday
                          ? 'bg-indigo-600'
                          : d.completed
                          ? 'bg-indigo-400/80'
                          : 'bg-zinc-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </View>
                  <Text
                    style={{ fontFamily: d.isToday ? 'Inter_700Bold' : 'Inter_500Medium' }}
                    className={`text-[12px] mt-2 ${d.isToday ? 'text-indigo-600' : 'text-zinc-600'}`}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Chart Subtext Badge */}
          <View className="flex-row items-center justify-between bg-zinc-50 rounded-xl p-3 border border-zinc-200/60 mt-3">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={15} color="#059669" />
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-emerald-800">
                +24% more speaking than last week
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-500">
              Avg 20.7m/day
            </Text>
          </View>
        </View>

        {/* 3 Metric Summary Cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-zinc-200/70 shadow-sm shadow-black/[0.02] items-center">
            <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mb-2">
              <Flame size={19} color="#f59e0b" fill="#f59e0b" />
            </View>
            <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[19px] text-zinc-900">
              {streakDays}
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-500 text-center">
              Day Streak
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 border border-zinc-200/70 shadow-sm shadow-black/[0.02] items-center">
            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
              <BookOpen size={19} color="#059669" />
            </View>
            <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[19px] text-zinc-900">
              {wordsMastered}
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-500 text-center">
              Words Mastered
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 border border-zinc-200/70 shadow-sm shadow-black/[0.02] items-center">
            <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mb-2">
              <Clock size={19} color="#4f46e5" />
            </View>
            <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[19px] text-zinc-900">
              {talkTimeMinutes}m
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-500 text-center">
              Talk Time
            </Text>
          </View>
        </View>

        {/* Skills Breakdown Card */}
        <View className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-4">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-3.5">
            Skill Competency Breakdown
          </Text>

          <View className="gap-3.5">
            {/* Speaking Fluency */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-zinc-700">
                  Speaking Fluency
                </Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-indigo-600">
                  78%
                </Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-indigo-600 rounded-full" style={{ width: '78%' }} />
              </View>
            </View>

            {/* Listening Comprehension */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-zinc-700">
                  Listening Comprehension
                </Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-emerald-600">
                  84%
                </Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-emerald-600 rounded-full" style={{ width: '84%' }} />
              </View>
            </View>

            {/* Grammar Precision */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-zinc-700">
                  Grammar Precision
                </Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-amber-600">
                  72%
                </Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-amber-600 rounded-full" style={{ width: '72%' }} />
              </View>
            </View>

            {/* Pronunciation & Accent */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-zinc-700">
                  Pronunciation & Accent
                </Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-purple-600">
                  86%
                </Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-purple-600 rounded-full" style={{ width: '86%' }} />
              </View>
            </View>
          </View>
        </View>

        {/* Missed Class / Streak Freeze Recovery Card */}
        <View className="bg-white rounded-2xl p-4.5 border border-amber-200 shadow-sm shadow-amber-50 mb-4">
          <View className="flex-row items-center gap-3 mb-2.5">
            <View className="w-9 h-9 rounded-xl bg-amber-50 items-center justify-center">
              <ShieldCheck size={20} color="#d97706" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-amber-950">
                Streak Freeze Active (1 Available)
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                Missed a session? Complete a 5-minute quick debrief to protect your streak.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUseFreeze}
            activeOpacity={0.8}
            className="w-full h-11 bg-amber-600 rounded-xl items-center justify-center active:scale-[0.98]"
          >
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-white">
              Start Quick 5-Min Make-up Call
            </Text>
          </TouchableOpacity>
        </View>

        {/* Invite Friend Referral Banner */}
        <View className="bg-indigo-600 rounded-2xl p-5 mb-3 shadow-md shadow-indigo-600/20">
          <View className="flex-row items-center gap-3 mb-2.5">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
              <Users size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-white">
                Learn with Friends
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-indigo-100">
                Invite friends and unlock 7 days of unlimited AI voice conversations!
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.85}
            className="w-full h-11 bg-white rounded-xl flex-row items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            <Share2 size={16} color="#4f46e5" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-indigo-600">
              {copiedLink ? 'Link Shared!' : 'Share Invite Link'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Safe Area */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5 flex-row gap-3"
      >
        <TouchableOpacity
          onPress={() => router.push('/(private)/dashboard')}
          activeOpacity={0.85}
          className="flex-1 h-14 rounded-2xl bg-white border border-zinc-200/80 flex-row items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
        >
          <Home size={18} color="#09090b" />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(private)/learning-mode')}
          activeOpacity={0.85}
          className="flex-[1.4] h-14 rounded-2xl bg-indigo-600 flex-row items-center justify-center shadow-md shadow-indigo-600/25 active:scale-[0.98]"
        >
          <Zap color="#ffffff" size={17} className="mr-1.5" />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-white font-semibold">
            Today's Lesson
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
