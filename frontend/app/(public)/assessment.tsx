import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { theme } from '../../theme';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Mic, Ear, Book, SpellCheck, Star, ShieldCheck, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AssessmentIntroScreen() {
  const router = useRouter();
  const { setSkippedAssessment } = useOnboardingStore();

  const handleStart = () => {
    setSkippedAssessment(false);
    router.push('/(public)/goal-setup'); 
  };

  const handleSkip = () => {
    setSkippedAssessment(true);
    router.push('/(public)/goal-setup');
  };

  const AnalysisItem = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <View className="flex-row items-center w-1/2 mb-4">
      <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
        <Icon size={20} color={theme.colors.primary} />
      </View>
      <Text className="text-textPrimary dark:text-white font-medium text-sm flex-1">{title}</Text>
    </View>
  );

  const StepItem = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <View className="flex-row mb-4">
      <View className="w-8 h-8 rounded-full bg-surface dark:bg-gray-800 border border-border dark:border-gray-700 items-center justify-center mr-4">
        <Text className="text-primary font-bold text-sm">{number}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary dark:text-white font-bold text-base mb-1">{title}</Text>
        <Text className="text-textSecondary text-sm">{desc}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-gray-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header & Progress */}
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full bg-surface dark:bg-gray-800">
              <ArrowLeft size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            
            {/* Progress Indicator: Step 4 of 4 */}
            <View className="flex-row space-x-2">
              <View className="w-8 h-2 rounded-full bg-primary opacity-30" />
              <View className="w-8 h-2 rounded-full bg-primary opacity-30" />
              <View className="w-8 h-2 rounded-full bg-primary opacity-30" />
              <View className="w-8 h-2 rounded-full bg-primary" />
            </View>
            <View className="w-10" /> 
          </View>
        </View>

        <View className="px-6 pb-32">
          {/* Illustration Placeholder */}
          <LinearGradient
            colors={[theme.colors.primary + '20', theme.colors.accent + '20']}
            className="w-full h-48 rounded-3xl items-center justify-center mb-8 border border-primary/10"
          >
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-floating mb-4">
              <Mic size={40} color="white" />
            </View>
            <Text className="text-primary font-bold text-lg tracking-wide">AI Level Assessment</Text>
          </LinearGradient>

          <Text className="text-3xl font-bold text-textPrimary dark:text-white mb-3">
            Find your starting point
          </Text>
          <Text className="text-textSecondary text-base leading-relaxed mb-8">
            Have a natural, stress-free conversation with your AI mentor to get a personalized learning plan.
          </Text>

          {/* Time & Privacy Tags */}
          <View className="flex-row items-center mb-8">
            <View className="flex-row items-center bg-surface dark:bg-gray-900 border border-border dark:border-gray-800 px-3 py-2 rounded-xl mr-3">
              <Clock size={16} color={theme.colors.primary} />
              <Text className="text-textPrimary dark:text-white font-medium ml-2 text-sm">5-10 mins</Text>
            </View>
            <View className="flex-row items-center bg-surface dark:bg-gray-900 border border-border dark:border-gray-800 px-3 py-2 rounded-xl">
              <ShieldCheck size={16} color={theme.colors.success} />
              <Text className="text-textPrimary dark:text-white font-medium ml-2 text-sm">100% Private</Text>
            </View>
          </View>

          {/* What AI Analyzes */}
          <Text className="text-xl font-bold text-textPrimary dark:text-white mb-4">AI Analyzes</Text>
          <View className="bg-surface dark:bg-gray-900 rounded-3xl p-5 border border-border dark:border-gray-800 mb-8">
            <View className="flex-row flex-wrap">
              <AnalysisItem icon={Mic} title="Speaking" />
              <AnalysisItem icon={Ear} title="Listening" />
              <AnalysisItem icon={SpellCheck} title="Grammar" />
              <AnalysisItem icon={Book} title="Vocabulary" />
              <AnalysisItem icon={Mic} title="Accent" />
              <AnalysisItem icon={Star} title="Confidence" />
            </View>
          </View>

          {/* Steps */}
          <Text className="text-xl font-bold text-textPrimary dark:text-white mb-4">How it works</Text>
          <View className="mb-4">
            <StepItem number="1" title="Short Chat" desc="Your mentor will ask you a few simple questions." />
            <StepItem number="2" title="Instant Analysis" desc="The AI evaluates your fluency in real-time." />
            <StepItem number="3" title="Custom Plan" desc="Get a tailored curriculum based on your exact level." />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 w-full p-6 pt-4 bg-surface dark:bg-gray-900 border-t border-divider dark:border-gray-800 shadow-bottomSheet">
        <Button
          title="Start Assessment"
          onPress={handleStart}
          className="mb-3"
        />
        <Button
          title="Skip for Now"
          variant="ghost"
          onPress={handleSkip}
        />
      </View>
    </SafeAreaView>
  );
}
