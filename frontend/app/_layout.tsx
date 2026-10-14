import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
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

SplashScreen.preventAutoHideAsync().catch(() => {});

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

  const [forceReady, setForceReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError || forceReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, forceReady]);

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

  if (!fontsLoaded && !fontError && !forceReady) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(private)" />
        <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
