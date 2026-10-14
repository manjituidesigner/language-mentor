import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  BookOpen,
  UserCheck,
} from 'lucide-react-native';
import { PrimaryButton } from '../../components';

export default function SetupCompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, completeOnboarding } = useAuthStore();
  const {
    learningLanguageName,
    nativeLanguageName,
    mentorName,
    dailyStudyTime,
  } = useOnboardingStore();

  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';
  const mentor = mentorName || 'Sophie';
  const studyTime = dailyStudyTime || 20;

  const handleEnterDashboard = () => {
    login();
    completeOnboarding();
    router.replace('/(private)/dashboard');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
          flexGrow: 1,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Trophy Card */}
        <View className="w-full bg-white rounded-2xl p-6 items-center border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-5">
          <View className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200/80 items-center justify-center mb-4 relative">
            <Trophy size={40} color="#4f46e5" />
            <View className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 items-center justify-center border-2 border-white shadow-xs">
              <Sparkles size={14} color="#09090b" />
            </View>
          </View>

          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[28px] leading-[34px] text-zinc-900 text-center mb-2 tracking-tight"
          >
            You're All Set!
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500 text-center max-w-[300px]"
          >
            Your personalized learning roadmap with {mentor} is generated and ready to begin.
          </Text>
        </View>

        {/* Personalized Curriculum Blueprint Card */}
        <View className="w-full bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-5">
          <View className="flex-row items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-100">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
              Your Learning Blueprint
            </Text>
            <View className="bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 flex-row items-center gap-1">
              <CheckCircle2 size={12} color="#059669" />
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-emerald-700 uppercase">
                Ready
              </Text>
            </View>
          </View>

          <View className="flex-col gap-3">
            {/* Target Language */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <BookOpen size={17} color="#4f46e5" />
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-zinc-600">
                  Target Language
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                {targetLang}
              </Text>
            </View>

            {/* Mother Tongue */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <Sparkles size={17} color="#d97706" />
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-zinc-600">
                  Native Translation
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                {nativeLang}
              </Text>
            </View>

            {/* Assigned Mentor */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <UserCheck size={17} color="#059669" />
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-zinc-600">
                  Assigned AI Mentor
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                {mentor}
              </Text>
            </View>

            {/* Starting Level */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <Flame size={17} color="#dc2626" />
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-zinc-600">
                  Assessed Level
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-indigo-600">
                A2 Elementary
              </Text>
            </View>

            {/* Daily Commitment */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <Clock size={17} color="#7c3aed" />
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-zinc-600">
                  Daily Goal
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                {studyTime} mins / day
              </Text>
            </View>
          </View>
        </View>

        {/* Motivational Tip */}
        <View className="p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3 mb-2">
          <Text className="text-xl">🚀</Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-600 leading-[19px] flex-1">
            "Your first conversation with {mentor} is unlocked. Talk without fear, listen closely, and watch your fluency soar!"
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5"
      >
        <PrimaryButton
          title="Enter Dashboard"
          onPress={handleEnterDashboard}
        />
      </View>
    </View>
  );
}
