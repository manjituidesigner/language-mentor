import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { GraduationCap, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Floating animation for the hero tutor card
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedHeroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View className="flex-1 bg-[#F2F2F7]">
      <View
        className="flex-1"
        style={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Brand Pill */}
          <View className="w-full flex-row justify-center items-center py-2">
            <View className="flex-row items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-zinc-200/80 shadow-sm shadow-black/[0.03]">
              <View className="w-6 h-6 rounded-lg bg-indigo-600 items-center justify-center">
                <GraduationCap size={14} color="#ffffff" />
              </View>
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className="text-[16px] text-zinc-900 tracking-tight"
              >
                Mentor AI
              </Text>
              <View className="bg-indigo-50 px-2 py-0.5 rounded-full">
                <Text
                  style={{ fontFamily: 'Inter_700Bold' }}
                  className="text-[10px] text-indigo-700 tracking-wide uppercase"
                >
                  2.0
                </Text>
              </View>
            </View>
          </View>

          {/* Hero Section */}
          <View className="w-full items-center justify-center my-auto py-2">
            {/* Main Visual Card */}
            <Animated.View
              style={[
                animatedHeroStyle,
                {
                  width: isSmallDevice ? 210 : 250,
                  height: isSmallDevice ? 210 : 250,
                  borderRadius: 36,
                  overflow: 'hidden',
                  borderWidth: 4,
                  borderColor: '#ffffff',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.08,
                  shadowRadius: 20,
                  elevation: 8,
                },
              ]}
              className="relative mb-6 bg-white"
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />

              {/* Online Tutor Pill */}
              <View
                className="absolute bottom-3 left-1/2 -ml-[65px] px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-zinc-200/80 shadow-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              >
                <View className="h-2 w-2 rounded-full bg-emerald-500" />
                <Text
                  style={{ fontFamily: 'Inter_700Bold' }}
                  className="text-[10px] text-zinc-900 tracking-wider uppercase"
                >
                  TUTOR ONLINE
                </Text>
              </View>

              <View className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 items-center justify-center shadow-sm">
                <Sparkles size={15} color="#4f46e5" />
              </View>
            </Animated.View>

            {/* Headlines */}
            <View className="items-center px-4">
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className={`${
                  isSmallDevice ? 'text-[24px] leading-[30px]' : 'text-[28px] leading-[34px]'
                } text-zinc-900 text-center tracking-tight mb-2.5 max-w-[320px]`}
              >
                Master a new language, naturally.
              </Text>
              <Text
                style={{ fontFamily: 'Inter_400Regular' }}
                className="text-[15px] leading-[22px] text-zinc-500 text-center max-w-[320px]"
              >
                Real-time voice and chat conversations with personal AI mentors tailored to your native language.
              </Text>
            </View>
          </View>

          {/* Action Area */}
          <View className="w-full flex-col items-center pt-2">
            {/* Social Proof Pill */}
            <View className="flex-row items-center justify-center mb-5 px-3 py-1 bg-white rounded-full border border-zinc-200/60 shadow-sm shadow-black/[0.02]">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }}
                className="w-6 h-6 rounded-full border border-white z-30"
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }}
                className="w-6 h-6 rounded-full border border-white -ml-2 z-20"
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }}
                className="w-6 h-6 rounded-full border border-white -ml-2 z-10"
              />
              <Text
                style={{ fontFamily: 'Inter_600SemiBold' }}
                className="text-[11px] text-zinc-700 ml-2"
              >
                Joined by <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-indigo-600">+1M learners</Text>
              </Text>
            </View>

            {/* Standardized iOS Primary Action Button */}
            <PrimaryButton
              title="Get Started"
              onPress={() => router.push('/(public)/native-language')}
              style={{ marginBottom: 12 }}
            />

            {/* Secondary Action */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(public)/native-language')}
              className="py-2.5 px-4"
            >
              <Text
                style={{ fontFamily: 'Inter_600SemiBold' }}
                className="text-[14px] text-zinc-500"
              >
                I already have an account
              </Text>
            </TouchableOpacity>

            {/* Flags Row */}
            <View className="mt-2 flex-row items-center justify-center gap-2.5 opacity-60">
              <Text className="text-lg">🇮🇳</Text>
              <Text className="text-lg">🇬🇧</Text>
              <Text className="text-lg">🇪🇸</Text>
              <Text className="text-lg">🇫🇷</Text>
              <Text className="text-lg">🇩🇪</Text>
              <Text className="text-lg">🇯🇵</Text>
              <Text className="text-lg">🇦🇪</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
