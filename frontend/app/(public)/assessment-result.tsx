import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Timer } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';

export default function AssessmentResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, completeOnboarding } = useAuthStore();

  const handleStartLearning = () => {
    login();
    completeOnboarding();
    router.replace('/(private)/dashboard');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/assessment-chat');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]" edges={['left', 'right', 'bottom']}>
      {/* Top AppBar */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="w-full pb-3 flex-row items-center justify-between px-5 bg-[#fcf8ff] z-50">
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-2 -ml-2">
          <ArrowLeft color="#3f3bbd" size={24} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-primary tracking-tight">Mentor AI</Text>
        <View className="w-8 h-8 rounded-full border border-outline-variant/30 overflow-hidden">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Results Hero Section */}
        <View className="items-center mb-8">
          <View className="relative items-center justify-center mb-5">
            <View className="w-36 h-36 rounded-full bg-white border border-[#c2c1ff] items-center justify-center shadow-sm shadow-black/5">
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-primary uppercase tracking-widest mb-1">Your Level</Text>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[44px] text-primary leading-none mb-1">A2</Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-on-surface-variant">Elementary</Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[22px] text-on-surface-variant text-center max-w-[300px]">
            Great job! You can communicate in simple and routine tasks and understand common expressions. We're ready to take you to B1.
          </Text>
        </View>

        {/* Mentor Feedback (Overlapping Avatar) */}
        <View className="mt-10 mb-6 pt-12 px-6 pb-6 bg-white rounded-[24px] items-center shadow-sm shadow-black/5 border border-white relative">
          <View className="absolute -top-10 w-20 h-20 rounded-full border-[5px] border-[#fcf8ff] bg-white overflow-hidden shadow-sm">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-background mb-3">Sophie says...</Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[22px] text-on-surface-variant text-center">
            "Your grammar is surprisingly strong! I've noticed you're a bit hesitant when speaking, so our next few lessons will focus on conversational flow to boost your confidence."
          </Text>
        </View>

        {/* Score Breakdown Card */}
        <View className="bg-white rounded-[24px] p-6 border border-white shadow-sm shadow-black/5 mb-10">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-on-background mb-5">Assessment Breakdown</Text>
          
          <View className="flex-col gap-4">
            {/* Speaking */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-on-background">Speaking</Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-primary">64%</Text>
              </View>
              <View className="h-[6px] w-full bg-[#eae6f2] rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: '64%' }} />
              </View>
            </View>

            {/* Listening */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-on-background">Listening</Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-primary">78%</Text>
              </View>
              <View className="h-[6px] w-full bg-[#eae6f2] rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
              </View>
            </View>

            {/* Grammar */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-on-background">Grammar</Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-primary">92%</Text>
              </View>
              <View className="h-[6px] w-full bg-[#eae6f2] rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
              </View>
            </View>

            {/* Vocabulary */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-on-background">Vocabulary</Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-primary">71%</Text>
              </View>
              <View className="h-[6px] w-full bg-[#eae6f2] rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: '71%' }} />
              </View>
            </View>
          </View>
        </View>

        {/* Personalized Plan Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-background">Personalized Plan</Text>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-primary uppercase tracking-wider">3 LESSONS READY</Text>
          </View>

          <View className="flex-col gap-4">
            {/* Lesson Card 1 */}
            <View className="bg-[#f5f2fd] rounded-2xl overflow-hidden shadow-sm shadow-black/5">
              <View className="h-28 bg-surface-variant relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-full flex-row items-center gap-1">
                  <Timer color="#777585" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">12 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-background mb-1">Coffee House Talk</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-on-surface-variant mb-4">Master casual ordering and small talk in high-frequency social settings.</Text>
                <View className="flex-row items-center">
                  <View className="bg-[#e2dfff] px-2.5 py-1 rounded-full">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[9px] text-primary uppercase tracking-wider">SPEAKING</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lesson Card 2 */}
            <View className="bg-[#f5f2fd] rounded-2xl overflow-hidden shadow-sm shadow-black/5">
              <View className="h-28 bg-surface-variant relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-full flex-row items-center gap-1">
                  <Timer color="#777585" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">8 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-background mb-1">Past Tense Mastery</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-on-surface-variant mb-4">Quick refresher on irregular verbs and narrative storytelling structures.</Text>
                <View className="flex-row items-center">
                  <View className="bg-[#ffdcc6] px-2.5 py-1 rounded-full">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[9px] text-[#7e3e00] uppercase tracking-wider">GRAMMAR</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lesson Card 3 */}
            <View className="bg-[#f5f2fd] rounded-2xl overflow-hidden shadow-sm shadow-black/5">
              <View className="h-28 bg-surface-variant relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-full flex-row items-center gap-1">
                  <Timer color="#777585" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">15 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-background mb-1">The Modern Nomad</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-on-surface-variant mb-4">Expand your travel vocabulary with terms for digital workspaces and transit.</Text>
                <View className="flex-row items-center">
                  <View className="bg-[#d8e2ff] px-2.5 py-1 rounded-full">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[9px] text-[#0058bc] uppercase tracking-wider">VOCABULARY</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action CTA */}
      <View className="absolute bottom-0 w-full px-5 py-6 bg-[#fcf8ff]/90 border-t border-outline-variant/10">
        <TouchableOpacity 
          onPress={handleStartLearning}
          activeOpacity={0.8}
          className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center shadow-lg shadow-primary/20"
        >
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-primary mr-2">Start Learning</Text>
          <ArrowRight color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
