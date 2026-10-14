import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GraduationCap, Sparkles } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) });

    const timeout = setTimeout(() => {
      if (isAuthenticated && hasCompletedOnboarding) {
        router.replace('/(private)/dashboard');
      } else {
        router.replace('/(public)/welcome');
      }
    }, 2400);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, hasCompletedOnboarding]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  return (
    <View className="flex-1 bg-[#F2F2F7]">
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View style={animatedStyle}>
          {/* iOS Card Logo Container */}
          <View className="w-24 h-24 bg-white rounded-3xl border border-zinc-200/60 shadow-lg shadow-black/[0.06] items-center justify-center mb-6 relative">
            <View className="w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-600/30">
              <GraduationCap size={30} color="#ffffff" />
            </View>
            <View className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 items-center justify-center border-2 border-white shadow-sm">
              <Sparkles size={12} color="#ffffff" />
            </View>
          </View>

          {/* App Typography */}
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[28px] text-zinc-900 tracking-tight mb-2 text-center"
          >
            AI Language Mentor
          </Text>

          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] text-zinc-500 text-center leading-relaxed"
          >
            Daily Voice & Chat with Personalized AI Tutors
          </Text>
        </Animated.View>
      </View>

      {/* Footer Spinner and Version */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        className="items-center"
      >
        <ActivityIndicator size="small" color="#4f46e5" className="mb-3" />
        <Text
          style={{ fontFamily: 'Inter_500Medium' }}
          className="text-zinc-400 text-[12px]"
        >
          v1.0.0 • iOS Edition
        </Text>
      </View>
    </View>
  );
}
