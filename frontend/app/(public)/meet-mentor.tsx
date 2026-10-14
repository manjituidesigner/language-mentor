import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  ArrowLeft,
  Volume2,
  ShieldCheck,
  Languages,
  Zap,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export default function MeetMentorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    mentorName,
    learningLanguageName,
    nativeLanguageName,
  } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleVoiceSample = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleStart = () => {
    router.push('/(public)/assessment-intro');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/mentor-selection');
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/mentor-selection" />

        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
          Meet Your Mentor
        </Text>

        <View style={{ width: 44, height: 44 }} />
      </View>


      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Mentor Card */}
        <View className="w-full bg-white rounded-3xl overflow-hidden border border-zinc-200/70 shadow-sm shadow-black/[0.03] mb-6">
          <View className="h-72 w-full relative">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Top Badge */}
            <View className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full flex-row items-center gap-1.5 shadow-sm">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-zinc-900 uppercase">
                Active & Ready
              </Text>
            </View>

            {/* Mentor Info Bottom Overlay */}
            <View className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 rounded-2xl backdrop-blur-md">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white text-[24px] mb-0.5">
                {mentor}
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-indigo-200 text-[14px]">
                Your 24/7 Personal {targetLang} AI Coach
              </Text>
            </View>
          </View>

          {/* Voice Preview Bar */}
          <View className="p-4 bg-white border-t border-zinc-100 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={toggleVoiceSample}
                activeOpacity={0.8}
                className="w-11 h-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-600/25 active:scale-95"
              >
                {isPlayingAudio ? (
                  <Pause size={18} color="#ffffff" />
                ) : (
                  <Play size={18} color="#ffffff" className="ml-0.5" />
                )}
              </TouchableOpacity>
              <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                  {isPlayingAudio ? 'Playing Voice Sample...' : 'Hear Mentor Voice'}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Warm, natural pronunciation • 0:15
                </Text>
              </View>
            </View>

            <Volume2 size={20} color="#4f46e5" />
          </View>
        </View>

        {/* What to Expect Section Title */}
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-zinc-900 mb-3 px-1">
          How {mentor} will help you learn
        </Text>

        <View className="flex-col gap-3 mb-6">
          <View className="p-4.5 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3.5">
            <View className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center">
              <Languages size={22} color="#4f46e5" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                Bilingual Translations
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[19px]">
                Whenever you get stuck, {mentor} explains phrases in {nativeLang}.
              </Text>
            </View>
          </View>

          <View className="p-4.5 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3.5">
            <View className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 items-center justify-center">
              <ShieldCheck size={22} color="#059669" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                Zero Stress, 100% Patience
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[19px]">
                Never feel judged. Make mistakes freely—that's how true fluency happens.
              </Text>
            </View>
          </View>

          <View className="p-4.5 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3.5">
            <View className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 items-center justify-center">
              <Zap size={22} color="#d97706" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                Instant Smart Corrections
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[19px]">
                Gentle corrections on grammar, prepositions, and natural phrasing as you speak.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Standard iOS Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title="Nice to meet you! Let's Start"
          onPress={handleStart}
        />
      </View>
    </View>
  );
}

