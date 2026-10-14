import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import {
  Clock,
  Sparkles,
  Bookmark,
  TrendingUp,
  BrainCircuit,
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react-native';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mentorName, learningLanguageName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';

  const handleTakeQuiz = () => {
    router.push('/(private)/mini-quiz');
  };

  const handleGoToNotebook = () => {
    router.push('/(private)/notebook');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(private)/dashboard" />

        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
          Session Debrief
        </Text>

        <View className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-emerald-700 uppercase">
            Completed
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 160,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Fluency Score Hero Badge */}
        <View className="w-full bg-white rounded-3xl p-6 items-center border border-zinc-200/80 shadow-sm mb-5">
          <View className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-200 items-center justify-center mb-3.5 shadow-xs">
            <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[32px] text-indigo-600">
              86%
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Fluency
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[22px] text-zinc-900 mb-1.5">
            Solid Progress with {mentor}!
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[22px] text-zinc-500 text-center max-w-[280px]">
            You spoke with great confidence. 2 grammar points were fine-tuned for tomorrow.
          </Text>
        </View>

        {/* Tomorrow's Adaptive Lesson Card */}
        <View className="w-full bg-indigo-600 rounded-3xl p-5 mb-5 shadow-md shadow-indigo-600/20">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-xl bg-white/20 items-center justify-center">
                <Target size={18} color="#ffffff" />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-indigo-100 uppercase tracking-wider">
                Tomorrow's Tailored Lesson
              </Text>
            </View>
            <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white">
                15 MINS
              </Text>
            </View>
          </View>

          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[19px] text-white mb-1.5 leading-snug">
            Storytelling: Irregular Past Tense Mastery
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-indigo-100 leading-[20px] mb-3">
            Targeted specifically to eliminate slips like "goed" and "eated" through real conversational storytelling with {mentor}.
          </Text>

          <View className="bg-white/10 rounded-2xl p-3 border border-white/15">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-indigo-200 mb-0.5">
              Focus Formula:
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-white">
              Subject + V2 (Past Simple) → "I went to the store" • "She ate lunch"
            </Text>
          </View>
        </View>

        {/* 4 Core Metrics Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-5">
          <View className="w-[48%] bg-white p-4.5 rounded-3xl border border-zinc-200/80 shadow-sm">
            <Clock size={22} color="#4f46e5" className="mb-2" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900">
              06m 12s
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mt-0.5">
              Speaking Time
            </Text>
          </View>

          <View className="w-[48%] bg-white p-4.5 rounded-3xl border border-zinc-200/80 shadow-sm">
            <TrendingUp size={22} color="#059669" className="mb-2" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900">
              142 Words
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mt-0.5">
              Spoken Naturally
            </Text>
          </View>

          <View className="w-[48%] bg-white p-4.5 rounded-3xl border border-zinc-200/80 shadow-sm">
            <Sparkles size={22} color="#d97706" className="mb-2" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900">
              2 Slips
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mt-0.5">
              Corrected Live
            </Text>
          </View>

          <View className="w-[48%] bg-white p-4.5 rounded-3xl border border-zinc-200/80 shadow-sm">
            <BrainCircuit size={22} color="#7c3aed" className="mb-2" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900">
              3 Power Words
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mt-0.5">
              Synonyms Unlocked
            </Text>
          </View>
        </View>

        {/* Weak Points Caught & Overcome Card */}
        <View className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm mb-5">
          <View className="flex-row items-center gap-2 mb-3">
            <ShieldAlert size={19} color="#d97706" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
              Weak Points Detected & Overcome
            </Text>
          </View>

          <View className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 mb-2.5">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-amber-800 mb-0.5">
              Irregular Past Tense: "goed" → "went"
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600 leading-[18px]">
              "Go" is irregular in past simple. Always use "went" (भूतकाल में "went" का प्रयोग करें).
            </Text>
          </View>

          <View className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-amber-800 mb-0.5">
              Double Comparative: "more better" → "much better"
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600 leading-[18px]">
              "Better" is already comparative. Never pair with "more". Use "much better" for emphasis.
            </Text>
          </View>
        </View>

        {/* Mentor's Personal Observation */}
        <View className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm mb-5">
          <View className="flex-row items-center gap-3.5 mb-3">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
              className="border border-zinc-200 bg-white"
            />
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                {mentor}'s Observation
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-400">
                AI Speech & Syntax Analyzer
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-600 leading-[23px]">
            "You expressed your ideas with wonderful rhythm today! Once we polish those irregular past tense verbs in tomorrow's lesson, you'll be well on your way to B1 Intermediate fluency."
          </Text>
        </View>

        {/* Words to Lock In */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Auto-Saved to Smart Notebook
        </Text>

        <View className="flex-col gap-3 mb-6">
          <View className="p-4.5 bg-white rounded-3xl border border-zinc-200/80 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-0.5">
                Exceptional (adj.)
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500">
                Much better alternative to "very good" • असाधारण
              </Text>
            </View>
            <Bookmark size={20} color="#4f46e5" fill="#4f46e5" />
          </View>

          <View className="p-4.5 bg-white rounded-3xl border border-zinc-200/80 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-0.5">
                Went (v. past)
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500">
                Past tense of "go" (never "goed") • गया था
              </Text>
            </View>
            <Bookmark size={20} color="#4f46e5" fill="#4f46e5" />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title="Take 2-Min Mini Quiz"
          onPress={handleTakeQuiz}
          style={{ marginBottom: 8 }}
        />

        <TouchableOpacity
          onPress={handleGoToNotebook}
          activeOpacity={0.7}
          style={{ height: 44 }}
          className="w-full items-center justify-center rounded-2xl active:bg-zinc-100"
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-zinc-500">
            Skip to Smart Notebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
