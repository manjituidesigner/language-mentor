import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Check, Briefcase, Clock, ChevronRight, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BackButton, PrimaryButton } from '../../components';

const GOALS = [
  { id: 'g1', title: 'Daily Conversation', icon: '💬' },
  { id: 'g2', title: 'Job Interview', icon: '👔' },
  { id: 'g3', title: 'IELTS / TOEFL', icon: '📝' },
  { id: 'g4', title: 'Business English', icon: '💼' },
  { id: 'g5', title: 'Travel & Living', icon: '✈️' },
  { id: 'g6', title: 'Study Abroad', icon: '🎓' },
  { id: 'g7', title: 'Office Work', icon: '🏢' },
  { id: 'g8', title: 'Public Speaking', icon: '🎤' },
  { id: 'g9', title: 'Grammar Mastery', icon: '📚' },
  { id: 'g10', title: 'General Growth', icon: '✨' },
];

const PROFESSIONS = ['Student', 'Working Professional', 'Business Owner', 'Freelancer', 'Homemaker', 'Other'];
const TIMES = [15, 30, 45, 60, 90];

export default function GoalSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setGoals, setProfession, setDailyStudyTime, goals: savedGoals, profession: savedProf, dailyStudyTime: savedTime } = useOnboardingStore();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>(savedGoals && savedGoals.length > 0 ? savedGoals : ['g1']);
  const [profession, setLocalProfession] = useState<string | null>(savedProf || 'Student');
  const [studyTime, setLocalStudyTime] = useState<number | null>(savedTime || 15);
  
  const [showProfSheet, setShowProfSheet] = useState(false);
  const [showTimeSheet, setShowTimeSheet] = useState(false);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? (prev.length > 1 ? prev.filter(g => g !== id) : prev) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0 && profession && studyTime) {
      setGoals(selectedGoals);
      setProfession(profession);
      setDailyStudyTime(studyTime);
      router.push('/(public)/schedule');
    }
  };

  const isFormComplete = selectedGoals.length > 0 && profession && studyTime;

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header Bar with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/assessment-result" />

        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
          Target & Schedule
        </Text>

        <View className="flex-col items-end gap-1">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-600 uppercase">
            Step 2 of 5
          </Text>
          <View className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <View className="w-[40%] h-full bg-indigo-600 rounded-full" />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
      >
        {/* Title */}
        <View className="items-center mb-6">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 mb-2 tracking-tight text-center"
          >
            What is your priority?
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500 text-center px-3"
          >
            Select what you want to achieve most to fine-tune your conversation prompts.
          </Text>
        </View>

        {/* Goal Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.75}
                className={`w-[48%] p-4 mb-3 rounded-2xl border items-center justify-center relative shadow-sm shadow-black/[0.02] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-zinc-200/70 bg-white'
                }`}
              >
                <Text className="text-3xl mb-2.5">{goal.icon}</Text>
                <Text
                  style={{ fontFamily: isSelected ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
                  className={`text-[13px] text-center ${isSelected ? 'text-indigo-600' : 'text-zinc-800'}`}
                >
                  {goal.title}
                </Text>
                {isSelected && (
                  <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute top-2.5 right-2.5">
                    <View className="w-5 h-5 rounded-full bg-indigo-600 items-center justify-center shadow-xs">
                      <Check size={12} color="#ffffff" strokeWidth={3} />
                    </View>
                  </Animated.View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Additional Details Section */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Preferences
        </Text>

        {/* Profession Selector */}
        <TouchableOpacity
          onPress={() => setShowProfSheet(true)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between bg-white border border-zinc-200/70 rounded-2xl p-4 mb-3 shadow-sm shadow-black/[0.02]"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center mr-3.5">
              <Briefcase size={19} color="#4f46e5" />
            </View>
            <View>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-zinc-400 text-[11px] mb-0.5">
                Current Background
              </Text>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-zinc-900 text-[15px]">
                {profession || 'Select Background'}
              </Text>
            </View>
          </View>
          <ChevronRight size={19} color="#a1a1aa" />
        </TouchableOpacity>

        {/* Daily Time Selector */}
        <TouchableOpacity
          onPress={() => setShowTimeSheet(true)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between bg-white border border-zinc-200/70 rounded-2xl p-4 mb-4 shadow-sm shadow-black/[0.02]"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center mr-3.5">
              <Clock size={19} color="#059669" />
            </View>
            <View>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-zinc-400 text-[11px] mb-0.5">
                Daily Commitment
              </Text>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-zinc-900 text-[15px]">
                {studyTime ? `${studyTime} mins / day` : 'Select Daily Time'}
              </Text>
            </View>
          </View>
          <ChevronRight size={19} color="#a1a1aa" />
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5"
      >
        <PrimaryButton
          title="Continue"
          disabled={!isFormComplete}
          onPress={handleContinue}
        />
      </View>

      {/* Profession Bottom Sheet Modal */}
      <Modal visible={showProfSheet} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setShowProfSheet(false)} />
          <View className="bg-white rounded-t-3xl p-6 pb-10 border-t border-zinc-200/70">
            <View className="flex-row items-center justify-between mb-4">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-zinc-900">
                Your Background
              </Text>
              <TouchableOpacity
                onPress={() => setShowProfSheet(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
              >
                <X size={18} color="#71717a" />
              </TouchableOpacity>
            </View>
            {PROFESSIONS.map(prof => (
              <TouchableOpacity
                key={prof}
                onPress={() => { setLocalProfession(prof); setShowProfSheet(false); }}
                className="py-3.5 border-b border-zinc-100 flex-row items-center justify-between"
              >
                <Text
                  style={{ fontFamily: profession === prof ? 'Inter_700Bold' : 'Inter_500Medium' }}
                  className={`text-[16px] ${profession === prof ? 'text-indigo-600' : 'text-zinc-800'}`}
                >
                  {prof}
                </Text>
                {profession === prof && <Check size={19} color="#4f46e5" strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Time Bottom Sheet Modal */}
      <Modal visible={showTimeSheet} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setShowTimeSheet(false)} />
          <View className="bg-white rounded-t-3xl p-6 pb-10 border-t border-zinc-200/70">
            <View className="flex-row items-center justify-between mb-4">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-zinc-900">
                Daily Study Goal
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimeSheet(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
              >
                <X size={18} color="#71717a" />
              </TouchableOpacity>
            </View>
            {TIMES.map(time => (
              <TouchableOpacity
                key={time}
                onPress={() => { setLocalStudyTime(time); setShowTimeSheet(false); }}
                className="py-3.5 border-b border-zinc-100 flex-row items-center justify-between"
              >
                <Text
                  style={{ fontFamily: studyTime === time ? 'Inter_700Bold' : 'Inter_500Medium' }}
                  className={`text-[16px] ${studyTime === time ? 'text-indigo-600' : 'text-zinc-800'}`}
                >
                  {time} minutes / day
                </Text>
                {studyTime === time && <Check size={19} color="#4f46e5" strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
