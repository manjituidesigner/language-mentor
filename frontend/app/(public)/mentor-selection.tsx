import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ArrowLeft, Check, Volume2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MENTORS = [
  {
    id: 'sophie',
    name: 'Sophie',
    tags: ['Kind & Patient', 'Beginner Friendly'],
    description: 'Sophie uses encouragement and gentle pacing. Perfect if you want to learn without feeling pressured.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  {
    id: 'alex',
    name: 'Alex',
    tags: ['Academic & Structured', 'Detailed Feedback'],
    description: 'Alex focuses on grammar, precision, and logical progression. Ideal for serious learners and professionals.',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop'
  },
  {
    id: 'liam',
    name: 'Liam',
    tags: ['Casual & Friendly', 'Slang & Culture'],
    description: "Liam teaches language as it's spoken on the streets. Focuses on conversation, idioms, and natural flow.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
  },
  {
    id: 'elara',
    name: 'Elara',
    tags: ['Philosophical & Deep', 'Storyteller'],
    description: 'Elara uses storytelling and cultural history to immerse you. Best for learners who love literature and context.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
  }
];

export default function MentorSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMentor, setSelectedMentor] = useState<string | null>('sophie');

  const handleContinue = () => {
    if (selectedMentor) {
      // In a real app we might store the mentor choice in Zustand
      router.push('/(public)/assessment-intro'); // Or whichever is the next step
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/learning-language');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background relative" edges={['bottom', 'left', 'right']}>
      {/* Background Atmosphere */}
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e2dfff]/30 rounded-full -mt-24 -mr-24 blur-3xl" style={{ zIndex: -10 }} />
      <View className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#d8e2ff]/30 rounded-full -mb-24 -ml-24 blur-3xl" style={{ zIndex: -10 }} />

      {/* TopAppBar */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="w-full pb-4 flex-row items-center justify-between px-5 bg-surface/80 border-b border-outline-variant/20 z-50">
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-2 -ml-2 hit-slop-10 w-10 h-10 items-center justify-center rounded-full">
          <ArrowLeft color="#3f3bbd" size={24} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-surface">Onboarding</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Headline Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[24px] leading-[30px] text-on-surface mb-2 tracking-tight">
            Choose your AI Mentor
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[15px] leading-[20px] text-on-surface-variant opacity-80">
            Your personal guide will help you reach your goals.
          </Text>
        </View>

        {/* Mentor List */}
        <View className="flex-col gap-3">
          {MENTORS.map((mentor) => {
            const isSelected = selectedMentor === mentor.id;
            return (
              <TouchableOpacity
                key={mentor.id}
                onPress={() => setSelectedMentor(mentor.id)}
                activeOpacity={0.8}
                className={`flex-row p-4 rounded-xl border transition-all ${
                  isSelected ? 'bg-surface-container-low border-primary shadow-sm shadow-primary/10' : 'bg-white border-transparent shadow-sm shadow-black/5'
                }`}
                style={isSelected ? { borderWidth: 2 } : { borderWidth: 1 }}
              >
                {/* Avatar */}
                <View className="mr-3 relative">
                  <Image source={{ uri: mentor.image }} className="w-14 h-14 rounded-full" resizeMode="cover" />
                  {isSelected && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full items-center justify-center border-2 border-white">
                      <Check color="#ffffff" size={12} strokeWidth={3} />
                    </Animated.View>
                  )}
                </View>

                {/* Content */}
                <View className="flex-1 flex-col justify-center">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-surface">{mentor.name}</Text>
                    <TouchableOpacity className="w-7 h-7 rounded-full bg-surface-container items-center justify-center">
                      <Volume2 color="#464554" size={14} />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {mentor.tags.map((tag, idx) => (
                      <View key={idx} className={`px-2 py-[2px] rounded-full ${idx === 0 ? 'bg-[#d8e2ff]' : 'bg-[#e4e1ec]'}`}>
                        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[10px] uppercase tracking-wider ${idx === 0 ? 'text-[#001a41]' : 'text-[#464554]'}`}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-on-surface-variant">
                    {mentor.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-surface/90">
        <TouchableOpacity
          disabled={!selectedMentor}
          onPress={handleContinue}
          activeOpacity={0.8}
          className={`w-full h-14 rounded-full flex-row items-center justify-center transition-colors ${
            selectedMentor ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-outline-variant/30'
          }`}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[20px] ${selectedMentor ? 'text-on-primary' : 'text-on-surface/40'}`}>
            Choose Mentor
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
