import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export default function AssessmentResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinueToGoals = () => {
    router.push('/(public)/goal-setup');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top AppBar */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/assessment-chat" />
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900 tracking-tight">
          Assessment Result
        </Text>
        <View style={{ width: 44, height: 44 }} />
      </View>


      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Results Hero Card */}
        <View className="w-full bg-white rounded-2xl p-6 items-center border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-5">
          <View className="w-28 h-28 rounded-full bg-indigo-50 border-2 border-indigo-200/80 items-center justify-center mb-4">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-indigo-600 uppercase tracking-widest mb-0.5">
              CEFR Level
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[40px] text-indigo-600 leading-none mb-0.5">
              A2
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-500">
              Elementary
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900 text-center mb-1.5">
            Great Foundation!
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[22px] text-zinc-500 text-center px-2">
            You can communicate routine tasks and understand common daily expressions. We've crafted a pathway to get you to B1!
          </Text>
        </View>

        {/* Mentor Feedback */}
        <View className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-5">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-12 h-12 rounded-full border border-zinc-200 overflow-hidden bg-white shadow-sm">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                Sophie's Observation
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-400">
                AI Senior Tutor
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[22px] text-zinc-600">
            "Your grammar and vocabulary recall are strong! You hesitated slightly when replying, so we'll prioritize high-frequency conversation practice to boost your natural speaking cadence."
          </Text>
        </View>

        {/* Score Breakdown Card */}
        <View className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] mb-6">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-4">
            Skill Breakdown
          </Text>

          <View className="flex-col gap-4">
            {/* Speaking */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-700">Speaking</Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-indigo-600">64%</Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-indigo-600 rounded-full" style={{ width: '64%' }} />
              </View>
            </View>

            {/* Listening */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-700">Listening</Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-emerald-600">78%</Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }} />
              </View>
            </View>

            {/* Grammar */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-700">Grammar</Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-amber-600">92%</Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-amber-600 rounded-full" style={{ width: '92%' }} />
              </View>
            </View>

            {/* Vocabulary */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-700">Vocabulary</Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-purple-600">71%</Text>
              </View>
              <View className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <View className="h-full bg-purple-600 rounded-full" style={{ width: '71%' }} />
              </View>
            </View>
          </View>
        </View>

        {/* Personalized Plan Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
              Target Curriculum
            </Text>
            <View className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-indigo-700 uppercase">
                3 Lessons Ready
              </Text>
            </View>
          </View>

          <View className="flex-col gap-3">
            {/* Lesson Card 1 */}
            <View className="bg-white rounded-2xl overflow-hidden border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="h-28 bg-zinc-100 relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-lg flex-row items-center gap-1 shadow-sm">
                  <Timer color="#4f46e5" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-800">12 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-1">Coffee House Talk</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-zinc-500 mb-3">Master casual ordering and small talk in high-frequency social settings.</Text>
                <View className="flex-row items-center">
                  <View className="bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/60">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-700 uppercase tracking-wider">SPEAKING</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lesson Card 2 */}
            <View className="bg-white rounded-2xl overflow-hidden border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="h-28 bg-zinc-100 relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-lg flex-row items-center gap-1 shadow-sm">
                  <Timer color="#d97706" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-800">8 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-1">Past Tense Mastery</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-zinc-500 mb-3">Quick refresher on irregular verbs and narrative storytelling structures.</Text>
                <View className="flex-row items-center">
                  <View className="bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/60">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-amber-700 uppercase tracking-wider">GRAMMAR</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lesson Card 3 */}
            <View className="bg-white rounded-2xl overflow-hidden border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
              <View className="h-28 bg-zinc-100 relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-lg flex-row items-center gap-1 shadow-sm">
                  <Timer color="#7c3aed" size={12} />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-800">15 MIN</Text>
                </View>
              </View>
              <View className="p-4">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-1">The Modern Nomad</Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[18px] text-zinc-500 mb-3">Expand your travel vocabulary with terms for digital workspaces and transit.</Text>
                <View className="flex-row items-center">
                  <View className="bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/60">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-purple-700 uppercase tracking-wider">VOCABULARY</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action CTA */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title="Save Level & Set Goals"
          onPress={handleContinueToGoals}
        />
      </View>
    </View>
  );
}

