import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, Headphones, Feather, BookOpen, Timer, Smile, MessageSquare } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export default function AssessmentIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mentorName, learningLanguageName, nativeLanguageName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'your target language';

  const handleContinue = () => {
    router.push('/(public)/assessment-chat');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/meet-mentor" />

        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
          Level Assessment
        </Text>

        <View style={{ width: 44, height: 44 }} />
      </View>


      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Text */}
        <View className="items-center mb-6">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 mb-2 tracking-tight text-center"
          >
            Find your starting level
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500 text-center px-2"
          >
            {mentor} will chat with you for 3-5 minutes in {targetLang} to tailor your lessons perfectly.
          </Text>
        </View>

        {/* Central Assessment Breakdown Card */}
        <View className="w-full bg-white rounded-2xl p-5 shadow-sm shadow-black/[0.02] border border-zinc-200/70 mb-6">
          <View className="flex-row flex-wrap justify-between">
            {/* Speaking */}
            <View className="w-[48%] items-center mb-5">
              <View className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-2">
                <Mic color="#4f46e5" size={20} />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                Speaking
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                Fluency & Pronunciation
              </Text>
            </View>

            {/* Listening */}
            <View className="w-[48%] items-center mb-5">
              <View className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">
                <Headphones color="#059669" size={20} />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                Listening
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                Comprehension
              </Text>
            </View>

            {/* Grammar */}
            <View className="w-[48%] items-center">
              <View className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-2">
                <Feather color="#d97706" size={20} />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                Grammar
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                Tenses & Structure
              </Text>
            </View>

            {/* Vocabulary */}
            <View className="w-[48%] items-center">
              <View className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center mb-2">
                <BookOpen color="#7c3aed" size={20} />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900">
                Vocabulary
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                Word Range & Idioms
              </Text>
            </View>
          </View>
        </View>

        {/* What to Expect Section */}
        <View className="w-full mb-6">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[12px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
          >
            What to expect
          </Text>

          <View className="flex-col gap-2.5">
            <View className="flex-row items-center p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-3.5">
                <Timer color="#4f46e5" size={19} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                  3-5 Minutes
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500">
                  Quick conversation to calibrate your skill level.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mr-3.5">
                <Smile color="#059669" size={19} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                  100% Stress-Free
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500">
                  It's totally okay to make mistakes. No grades, no judgment.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mr-3.5">
                <MessageSquare color="#7c3aed" size={19} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                  Natural AI Chat
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500">
                  Speak or type naturally like talking to a friend.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Area */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title="Start Assessment"
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

