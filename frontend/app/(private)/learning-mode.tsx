import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import {
  MessageSquare,
  PhoneCall,
  Check,
} from 'lucide-react-native';

const PRACTICE_TOPICS = [
  {
    id: 'free_talk',
    title: 'Daily Conversational Small Talk',
    desc: 'Unstructured, natural conversation about your day, hobbies, and thoughts.',
    icon: '💬',
    badge: 'Recommended',
    badgeColor: 'bg-indigo-50 text-indigo-700',
  },
  {
    id: 'scenario_cafe',
    title: 'Ordering at a Cafe & Restaurant',
    desc: 'Master polite requests, asking for recommendations, and bill payment.',
    icon: '☕',
    badge: 'Everyday Practical',
    badgeColor: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'career_interview',
    title: 'Job Interview & Elevator Pitch',
    desc: 'Practice professional responses, confidence drills, and formal grammar.',
    icon: '💼',
    badge: 'Career Boost',
    badgeColor: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'grammar_clinic',
    title: 'Past Tense & Irregular Verbs Clinic',
    desc: 'Targeted correction on tricky tenses, structure, and prepositions.',
    icon: '📚',
    badge: 'Grammar Focus',
    badgeColor: 'bg-purple-50 text-purple-700',
  },
];

export default function LearningModeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mentorName, learningLanguageName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';

  const [selectedTopic, setSelectedTopic] = useState('free_talk');
  const [sessionType, setSessionType] = useState<'call' | 'chat'>('call');

  const handleStartSession = () => {
    const topicObj = PRACTICE_TOPICS.find((t) => t.id === selectedTopic);
    const topicTitle = topicObj ? topicObj.title : 'Daily Conversational Small Talk';
    if (sessionType === 'chat') {
      router.push({ pathname: '/(private)/chat-session', params: { topic: topicTitle } });
    } else {
      router.push({ pathname: '/(private)/voice-call', params: { topic: topicTitle } });
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(private)/dashboard" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Learning Mode
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
            {targetLang} with {mentor}
          </Text>
        </View>

        <View style={{ width: 44, height: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Type Selector (Call vs Chat) */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Choose Interaction Style
        </Text>

        <View className="flex-row gap-3 mb-6">
          {/* Voice Call Option */}
          <TouchableOpacity
            onPress={() => setSessionType('call')}
            activeOpacity={0.8}
            className={`flex-1 p-4.5 rounded-3xl border-2 transition-all ${
              sessionType === 'call'
                ? 'bg-indigo-50/70 border-indigo-600 shadow-md shadow-indigo-100'
                : 'bg-white border-zinc-200/80 shadow-xs'
            }`}
          >
            <View className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center mb-3 shadow-sm">
              <PhoneCall size={22} color="#ffffff" strokeWidth={2.2} />
            </View>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-1">
              Voice Call
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[19px]">
              Realistic hands-free call UI with speech speed controls.
            </Text>
          </TouchableOpacity>

          {/* Interactive Chat Option */}
          <TouchableOpacity
            onPress={() => setSessionType('chat')}
            activeOpacity={0.8}
            className={`flex-1 p-4.5 rounded-3xl border-2 transition-all ${
              sessionType === 'chat'
                ? 'bg-indigo-50/70 border-indigo-600 shadow-md shadow-indigo-100'
                : 'bg-white border-zinc-200/80 shadow-xs'
            }`}
          >
            <View className="w-12 h-12 rounded-2xl bg-emerald-600 items-center justify-center mb-3 shadow-sm">
              <MessageSquare size={22} color="#ffffff" strokeWidth={2.2} />
            </View>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-1">
              Smart Chat
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[19px]">
              Text + audio with visual grammar & typo corrections.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Practice Topics Section */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Select Topic or Scenario
        </Text>

        <View className="flex-col gap-3">
          {PRACTICE_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <TouchableOpacity
                key={topic.id}
                onPress={() => setSelectedTopic(topic.id)}
                activeOpacity={0.8}
                className={`p-4.5 rounded-3xl border-2 transition-all ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100'
                    : 'bg-white border-zinc-200/80 shadow-xs'
                }`}
              >
                <View className="flex-row items-start justify-between mb-2.5">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-2xl bg-zinc-100 items-center justify-center">
                      <Text className="text-2xl">{topic.icon}</Text>
                    </View>
                    <View className="px-3 py-1 rounded-full bg-zinc-100">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-zinc-600 uppercase">
                        {topic.badge}
                      </Text>
                    </View>
                  </View>

                  {isSelected ? (
                    <View className="w-7 h-7 rounded-full bg-indigo-600 items-center justify-center shadow-xs">
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  ) : (
                    <View className="w-7 h-7 rounded-full border-2 border-zinc-300" />
                  )}
                </View>

                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-1">
                  {topic.title}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-[20px]">
                  {topic.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title={`Start ${sessionType === 'call' ? 'Voice Call' : 'Smart Chat'}`}
          icon={sessionType === 'call' ? PhoneCall : MessageSquare}
          onPress={handleStartSession}
        />
      </View>
    </View>
  );
}

