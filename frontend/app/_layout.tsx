import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useAuthStore } from '../store/authStore';
import '../styles/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const inPublicGroup = segments[0] === '(public)';
    const inPrivateGroup = segments[0] === '(private)';

    if (!isAuthenticated && inPrivateGroup) {
      router.replace('/(public)/welcome');
    } else if (isAuthenticated && inPublicGroup) {
      if (hasCompletedOnboarding) {
        router.replace('/(private)/dashboard');
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(private)" />
        <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
