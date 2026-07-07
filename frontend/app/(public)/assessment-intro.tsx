import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mic, Headphones, Feather, BookOpen, Timer, Smile, MessageSquare, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssessmentIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push('/(public)/assessment-chat'); // Or the actual assessment screen
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/mentor-selection');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background relative" edges={['bottom', 'left', 'right']}>
      {/* Background Atmosphere */}
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e2dfff]/20 rounded-full -mt-24 -mr-24 blur-3xl" style={{ zIndex: -10 }} />
      <View className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#d8e2ff]/20 rounded-full -mb-24 -ml-24 blur-3xl" style={{ zIndex: -10 }} />

      {/* TopAppBar */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="w-full pb-4 flex-row items-center px-5 bg-surface/80 border-b border-outline-variant/20 z-50">
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-2 -ml-2 hit-slop-10 flex-row items-center">
          <ArrowLeft color="#3f3bbd" size={24} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[18px] text-primary ml-2">Assessment</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header Text */}
        <View className="items-center mb-8">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[28px] leading-[34px] text-on-surface mb-3 tracking-tight text-center">
            Ready to find your level?
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[15px] leading-[22px] text-on-surface-variant text-center px-4">
            Sophie will ask you a few simple questions to tailor your learning experience.
          </Text>
        </View>

        {/* Central Assessment Breakdown Card */}
        <View className="w-full bg-white rounded-[24px] p-6 shadow-sm shadow-black/5 border border-white/50 mb-10 overflow-hidden relative">
          <View className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <View className="flex-row flex-wrap justify-between">
            {/* Speaking */}
            <View className="w-[48%] items-center mb-6">
              <View className="w-12 h-12 rounded-full bg-[#e2dfff] flex items-center justify-center mb-3">
                <Mic color="#3f3bbd" size={24} />
              </View>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-on-surface">Speaking</Text>
            </View>

            {/* Listening */}
            <View className="w-[48%] items-center mb-6">
              <View className="w-12 h-12 rounded-full bg-[#d8e2ff] flex items-center justify-center mb-3">
                <Headphones color="#0058bc" size={24} />
              </View>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-on-surface">Listening</Text>
            </View>

            {/* Grammar */}
            <View className="w-[48%] items-center">
              <View className="w-12 h-12 rounded-full bg-[#ffdcc6] flex items-center justify-center mb-3">
                <Feather color="#7e3e00" size={24} />
              </View>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-on-surface">Grammar</Text>
            </View>

            {/* Vocabulary */}
            <View className="w-[48%] items-center">
              <View className="w-12 h-12 rounded-full bg-[#e4e1ec] flex items-center justify-center mb-3">
                <BookOpen color="#464554" size={24} />
              </View>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-on-surface">Vocabulary</Text>
            </View>
          </View>
        </View>

        {/* What to Expect Section */}
        <View className="w-full mb-12">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-[#777585] uppercase tracking-widest ml-2 mb-4">
            What to expect
          </Text>

          <View className="flex-col gap-3">
            {/* Expectation 1 */}
            <View className="flex-row items-center p-4 bg-white/60 rounded-2xl border border-white">
              <View className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                <Timer color="#3f3bbd" size={20} />
              </View>
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-surface mb-0.5">3-5 minutes</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant">A quick check-in for big results.</Text>
              </View>
            </View>

            {/* Expectation 2 */}
            <View className="flex-row items-center p-4 bg-white/60 rounded-2xl border border-white">
              <View className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                <Smile color="#3f3bbd" size={20} />
              </View>
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-surface mb-0.5">No stress</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant">It's okay to not know everything.</Text>
              </View>
            </View>

            {/* Expectation 3 */}
            <View className="flex-row items-center p-4 bg-white/60 rounded-2xl border border-white">
              <View className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                <MessageSquare color="#3f3bbd" size={20} />
              </View>
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-on-surface mb-0.5">Just a chat</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant">Casual conversation with your AI Mentor.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-surface/90">
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.8}
          className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center shadow-lg shadow-primary/20"
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[20px] text-on-primary mr-2">
            Start Assessment
          </Text>
          <ArrowRight color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
