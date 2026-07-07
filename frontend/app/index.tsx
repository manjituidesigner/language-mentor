import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '../theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Start smooth fade + scale animation
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });

    // Check auth state and navigate after 2.5 seconds
    const timeout = setTimeout(() => {
      if (isAuthenticated && hasCompletedOnboarding) {
        router.replace('/(private)/dashboard');
      } else {
        router.replace('/(public)/welcome');
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, hasCompletedOnboarding]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      alignItems: 'center',
      justifyContent: 'center'
    };
  });

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[theme.colors.background, theme.colors.divider]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-1 items-center justify-center">
          <Animated.View style={animatedStyle}>
            {/* Animated App Logo Placeholder */}
            <View className="w-24 h-24 bg-primary rounded-3xl shadow-floating items-center justify-center mb-6">
              <Text className="text-white text-4xl font-extrabold">AL</Text>
            </View>
            
            {/* App Name */}
            <Text className="text-textPrimary text-3xl font-bold mb-2">
              AI Language Mentor
            </Text>
            
            {/* Tagline */}
            <Text className="text-textSecondary text-base font-medium">
              Talk Daily. Speak Fluently.
            </Text>
          </Animated.View>
        </View>

        {/* Loading Indicator and Version */}
        <View className="items-center pb-12">
          <ActivityIndicator size="small" color={theme.colors.primary} className="mb-4" />
          <Text className="text-textLight text-xs font-medium">v1.0.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
