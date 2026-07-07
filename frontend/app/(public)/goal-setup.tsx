import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { theme } from '../../theme';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Check, Target, Briefcase, Clock, ChevronRight, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const GOALS = [
  { id: 'g1', title: 'Daily Conversation', icon: '💬' },
  { id: 'g2', title: 'Job Interview', icon: '👔' },
  { id: 'g3', title: 'IELTS/TOEFL', icon: '📝' },
  { id: 'g4', title: 'Business English', icon: '💼' },
  { id: 'g5', title: 'Travel', icon: '✈️' },
  { id: 'g6', title: 'Study Abroad', icon: '🎓' },
  { id: 'g7', title: 'Office Comm.', icon: '🏢' },
  { id: 'g8', title: 'Public Speaking', icon: '🎤' },
  { id: 'g9', title: 'Grammar Mastery', icon: '📚' },
  { id: 'g10', title: 'Custom Goal', icon: '✨' },
];

const PROFESSIONS = ['Student', 'Professional', 'Business', 'Freelancer', 'Other'];
const TIMES = [15, 30, 45, 60, 90, 120];

export default function GoalSetupScreen() {
  const router = useRouter();
  const { setGoals, setProfession, setDailyStudyTime, goals: savedGoals, profession: savedProf, dailyStudyTime: savedTime } = useOnboardingStore();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>(savedGoals || []);
  const [profession, setLocalProfession] = useState<string | null>(savedProf);
  const [studyTime, setLocalStudyTime] = useState<number | null>(savedTime);
  
  const [showProfSheet, setShowProfSheet] = useState(false);
  const [showTimeSheet, setShowTimeSheet] = useState(false);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
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
    <SafeAreaView className="flex-1 bg-background dark:bg-gray-950">
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full bg-surface dark:bg-gray-800 shadow-sm">
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-row space-x-2">
          <View className="w-8 h-2 rounded-full bg-primary" />
          <View className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
        </View>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6">
          <Text className="text-3xl font-bold text-textPrimary dark:text-white mb-2 leading-tight">
            What are your goals?
          </Text>
          <Text className="text-textSecondary text-base mb-8">
            Select one or more goals to customize your learning path.
          </Text>

          {/* Goal Grid */}
          <View className="flex-row flex-wrap justify-between mb-8">
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.8}
                  className={`w-[48%] p-4 mb-4 rounded-3xl border-2 items-center justify-center ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-surface dark:bg-gray-900 dark:border-gray-800'}`}
                >
                  <Text className="text-3xl mb-3">{goal.icon}</Text>
                  <Text className={`text-sm text-center font-bold ${isSelected ? 'text-primary' : 'text-textPrimary dark:text-white'}`}>
                    {goal.title}
                  </Text>
                  {isSelected && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute top-2 right-2">
                      <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                        <Check size={12} color="white" />
                      </View>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Details Section */}
          <Text className="text-xl font-bold text-textPrimary dark:text-white mb-4">Tell us more</Text>

          {/* Profession Selector */}
          <TouchableOpacity 
            onPress={() => setShowProfSheet(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between bg-surface dark:bg-gray-900 border border-border dark:border-gray-800 rounded-2xl p-4 mb-4"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
                <Briefcase size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text className="text-textSecondary text-xs font-medium mb-1">Your Profession</Text>
                <Text className="text-textPrimary dark:text-white font-bold text-base">
                  {profession || 'Select Profession'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>

          {/* Daily Time Selector */}
          <TouchableOpacity 
            onPress={() => setShowTimeSheet(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between bg-surface dark:bg-gray-900 border border-border dark:border-gray-800 rounded-2xl p-4 mb-4"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
                <Clock size={20} color={theme.colors.success} />
              </View>
              <View>
                <Text className="text-textSecondary text-xs font-medium mb-1">Daily Study Goal</Text>
                <Text className="text-textPrimary dark:text-white font-bold text-base">
                  {studyTime ? `${studyTime} mins / day` : 'Select Time'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 w-full p-6 bg-surface dark:bg-gray-900 border-t border-divider dark:border-gray-800 shadow-bottomSheet">
        <Button
          title="Continue"
          disabled={!isFormComplete}
          onPress={handleContinue}
        />
      </View>

      {/* Profession Bottom Sheet Modal */}
      <Modal visible={showProfSheet} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <Pressable className="flex-1" onPress={() => setShowProfSheet(false)} />
          <View className="bg-surface dark:bg-gray-900 rounded-t-3xl p-6 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-textPrimary dark:text-white">Your Profession</Text>
              <TouchableOpacity onPress={() => setShowProfSheet(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {PROFESSIONS.map(prof => (
              <TouchableOpacity 
                key={prof} 
                onPress={() => { setLocalProfession(prof); setShowProfSheet(false); }}
                className={`py-4 border-b border-border dark:border-gray-800 flex-row items-center justify-between`}
              >
                <Text className={`text-lg ${profession === prof ? 'text-primary font-bold' : 'text-textPrimary dark:text-white'}`}>{prof}</Text>
                {profession === prof && <Check size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Time Bottom Sheet Modal */}
      <Modal visible={showTimeSheet} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <Pressable className="flex-1" onPress={() => setShowTimeSheet(false)} />
          <View className="bg-surface dark:bg-gray-900 rounded-t-3xl p-6 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-textPrimary dark:text-white">Daily Study Goal</Text>
              <TouchableOpacity onPress={() => setShowTimeSheet(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {TIMES.map(time => (
              <TouchableOpacity 
                key={time} 
                onPress={() => { setLocalStudyTime(time); setShowTimeSheet(false); }}
                className={`py-4 border-b border-border dark:border-gray-800 flex-row items-center justify-between`}
              >
                <Text className={`text-lg ${studyTime === time ? 'text-primary font-bold' : 'text-textPrimary dark:text-white'}`}>{time} mins</Text>
                {studyTime === time && <Check size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
