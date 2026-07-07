import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ArrowLeft, Search, CheckCircle, ArrowRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { id: 'en', name: 'English', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvO6Hx2rOLasWaFTciV1JPZ8YqEH8A-oq1sNSfOYeVam4vLkxCFxwP17NqCUrOpGOnKFmBFdSNpTCbL2NpDs7RFi996cq0107JVnwgaomF4RimwTDsPZXgfFzPa_soypBYsF90lvmwR4k-mPFuklQrgyfqpGYqgW0U8Ve3JP9pXNWBk32CypknZ2Q-rp6jLlA4sscMkivWhvmxKhUKvXsL_qWSyUXuWYKrgz_6Yu-pAMISvWaJWnFRsElXUcL_3EHucy-4Xu_BA0I' },
  { id: 'es', name: 'Español', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzjnbVkVflvt-wQroJ6QkiLScGhdDp0ym266JGOEl9ZMVjmhnjwP-Y8j7hXxvDwfjZeQt8-rCPWwyAB5elqIRbRWZ9t-QtwAFWdYd2zroCULZA8IqbI-Z9tMZHGCzqh1QKfh2JdbyRoS9ifEup7ysGsNzB00rrmJnIQQL4rdmCM3IXdPsQcpbBkvHnZz8-7LPGZlNTSfgsiB_uBWPMw6S2BBQ2UwQcTn8b2K6VUxGNBac-BFwzLpLVGtXt_cgz5zR4tMoRwO2MpX8' },
  { id: 'fr', name: 'Français', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw8O0eXPngkzHFMw9mgksbJ2Ox2SWsZj8kvZiLN0er8Cus88fX82F5pt3mjybngqX0x67FNPzpVEWOwovws_5nK1DIOBFjucCZVOULxUGypK-ewCVIRFeiZIK-T7S8eUtS-2SBWir1HyVm1C-wGf0-Jl_bfn7H4mmVCmSW2RKyriagzb_qd5t8a6qfWZhing7Wgsbs5wB7gubU2gPIlDlCnGzEq-WEcX6FJ9Qiu5iMcmGoEE2hxaIdc6JMk7je-0hEYxfr3salKfk' },
  { id: 'de', name: 'Deutsch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa2TKCibvQhvqSMn-Sr_wd2YeUnGR6nLUXrT_pLlDIgVksh0Czm6-NhXku1i18jNnEZHtkpl7fEBk25DdTobXjSZqV-rRvaPkRhBMRTV8RhVIthbWdqmSwK_36cSbGtxYNVJkEJfv9qZHfMySFxf7ndeFIlIOLMJf1cGH_Wx3umGBWckSKp4MTWwk7r3OY0hN9sTwTZttBfEW6G8JyjT4QOKOm8_VlGk6DOx5CCDmTHGjL7s_2Y2Lmln-Yzfu1L8hJ88EJH2P90tE' },
  { id: 'ja', name: '日本語', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwy_TQKIOK-1C5plyx7H0s6yKmrWKz9qswDF5cNQFi4CkN2LDN8Um4lrlMls2pR-RgTE2KH-PVZznHpUpAJ_fFwORS-zzypcAIe9vsLue_gIgQR3qNEcvsesMthXptYrjVkDKHVq4klvcCkntu0JoUBE5UQ0eEIWKCTTJ5coQVPX2OxarKxx5SRQ2giJkAYN-wb_PvTENcb1yinVEyGFPUSa2saoJbt4QOIayhS0Pm3-UPxao3NiK4c6RhJw6Of2hkuyNIqqF6W9M' },
  { id: 'zh', name: '中文', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRfjpK3bEGmq8AOjgEl4LaNPgcMahRKmQAtD3hetdJ05dFUWekxmQr0rixIm_FQDu-kcuQZTo6zcLfVLRftPsQluw58swkTWW9HH25wFfciBKI4N8m-LyZbMH9p4YYbVfFohbXAKSQGpDBYE7Y7on7x1lZatdInhj9udMR52A-lPnAN2frfrVK7X6jzDMyleg7VJ6fiK0hfCFJgoAJhUQqXy3m26hFLH2OCEYwTlVAEFyFS44Om41eOnuGk2S-a5yOTxuzzzcxSvk' },
  { id: 'pt', name: 'Português', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZv7XaKqvA8Jidx6YwJhdUAiyWv_qMEc0u1omILzAA1QAcjiM4JX97p2N3WiFGEbrG3BoOtWpiyVhVtusExslnuFGlYCQXIXHJKU0sAUxN8ituaCWGFBbtOoY_W5JZQouA1KGblihrJpHkU1J97cBo9kA_Uxm_0tS4urjb8hNRihc1aoSC4B07KLpkXQ2rDqq9nCJhJOxHmc5rSgCIdrSMvHs0XY4gvml5S77Z8ivMSD1UN83Tb7lWJc87_5MQpe6pjIxxKyxQ9SI' },
];

export default function NativeLanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { nativeLanguage, setNativeLanguage } = useOnboardingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(nativeLanguage);

  const filteredLanguages = LANGUAGES.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleContinue = () => {
    if (selectedLang) {
      setNativeLanguage(selectedLang);
      router.push('/(public)/learning-language');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/welcome');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background relative" edges={['bottom', 'left', 'right']}>
      {/* Decorative Atmospheric Elements */}
      <View className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mt-48 -mr-48 blur-[100px]" style={{ zIndex: -10 }} />
      <View className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full -mb-24 -ml-24 blur-[80px]" style={{ zIndex: -10 }} />

      {/* TopAppBar */}
      <View style={{ paddingTop: Math.max(insets.top, 20) }} className="w-full pb-4 flex-row items-center justify-between px-5 bg-surface/80 border-b border-outline-variant/20 z-50">
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-2 -ml-2 hit-slop-10">
          <ArrowLeft color="#3f3bbd" size={24} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[24px] text-primary">Mentor AI</Text>
        <View className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden bg-white">
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdKFaoFlSJ4C2A-bvhnrOJSHJwYJX_qTYYeYFp9U-VNO5s6puMIuMNu1LUxJgPCVbT2zTncC9yO1XktRHxzAgpRYKK3d3GLw7btbzIn87MFfkCrHoYEuymTXzXXnJMAUe3jlxWQAwsGaJYxFf-r3QTA0FaJA5WkTyIsOCQ9ApiFRlLfVlJDq4uBY5wspnTG_lZIr5QN3iD2YtsMJQN9ujkSgqzvh7wAEAJaG5ytAC1L8-uqwg9WIzECMc47RUUosxxLxGdIy9uRvA" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Headline Section */}
        <View className="mb-8">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[24px] leading-[30px] text-on-surface mb-2 tracking-tight">
            What is your native language?
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[17px] leading-[24px] text-on-surface-variant opacity-80">
            Select the language you speak most fluently.
          </Text>
        </View>

        {/* Search Bar */}
        <View className="relative mb-8 shadow-sm shadow-black/5">
          <View className="absolute inset-y-0 left-4 justify-center z-10">
            <Search color="#464554" size={20} opacity={0.6} />
          </View>
          <TextInput
            className="w-full h-12 pl-12 pr-4 bg-[#f0ecf8] rounded-full text-[17px] text-on-surface border-none"
            placeholderTextColor="rgba(70, 69, 84, 0.5)"
            placeholder="Search languages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontFamily: 'Inter_400Regular' }}
          />
        </View>

        {/* Language List */}
        <View className="flex-col gap-3">
          {filteredLanguages.map((item) => {
            const isSelected = selectedLang === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedLang(item.id)}
                activeOpacity={0.8}
                className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
                  isSelected ? 'bg-primary-fixed border-primary shadow-sm' : 'bg-white border-transparent shadow-sm shadow-black/5'
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden items-center justify-center border border-outline-variant/10">
                    <Image source={{ uri: item.image }} className="w-full h-full" />
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[16px] text-on-surface">
                    {item.name}
                  </Text>
                </View>

                {isSelected && (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <CheckCircle color="#ffffff" fill="#3f3bbd" size={20} />
                  </Animated.View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-surface/90">
        <TouchableOpacity
          disabled={!selectedLang}
          onPress={handleContinue}
          activeOpacity={0.8}
          className={`w-full h-14 rounded-full flex-row items-center justify-center transition-colors ${
            selectedLang ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-outline-variant/30'
          }`}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[20px] ${selectedLang ? 'text-on-primary' : 'text-on-surface/40'}`}>
            Continue
          </Text>
          {selectedLang && (
            <Animated.View entering={FadeIn} className="ml-2">
              <ArrowRight color="#ffffff" size={20} />
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
