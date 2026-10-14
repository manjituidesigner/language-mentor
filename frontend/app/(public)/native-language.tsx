import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BackButton } from '../../components/ui/BackButton';
import { SearchInput } from '../../components/ui/SearchInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Check, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface LanguageItem {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

export const ALL_NATIVE_LANGUAGES: LanguageItem[] = [
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', popular: true },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', popular: true },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popular: true },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popular: true },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popular: true },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', popular: true },
  { id: 'zh', name: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳', popular: true },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', popular: true },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', popular: true },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { id: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { id: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { id: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
];

export default function NativeLanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { nativeLanguage, setNativeLanguage } = useOnboardingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>(nativeLanguage || 'hi');

  // Instant prefix priority search: typing "hi" shows Hindi on top
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_NATIVE_LANGUAGES;

    return [...ALL_NATIVE_LANGUAGES].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aNative = a.nativeName.toLowerCase();
      const bNative = b.nativeName.toLowerCase();
      const aId = a.id.toLowerCase();
      const bId = b.id.toLowerCase();

      const aStarts = aName.startsWith(q) || aNative.startsWith(q) || aId.startsWith(q);
      const bStarts = bName.startsWith(q) || bNative.startsWith(q) || bId.startsWith(q);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aContains = aName.includes(q) || aNative.includes(q);
      const bContains = bName.includes(q) || bNative.includes(q);

      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;

      return 0;
    }).filter(item => {
      const name = item.name.toLowerCase();
      const native = item.nativeName.toLowerCase();
      const id = item.id.toLowerCase();
      return name.includes(q) || native.includes(q) || id.includes(q);
    });
  }, [searchQuery]);

  const selectedItem = ALL_NATIVE_LANGUAGES.find(l => l.id === selectedLang);

  const handleContinue = () => {
    if (selectedItem) {
      setNativeLanguage(selectedItem.id, selectedItem.name);
      router.push('/(public)/learning-language');
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header Bar with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/welcome" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Step 1 of 3
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
            Your Mother Tongue
          </Text>
        </View>

        <View style={{ width: 44, height: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Info */}
        <View className="mb-5">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 mb-2 tracking-tight"
          >
            What is your native language?
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500"
          >
            Your AI Mentor will speak and explain grammar rules in this language.
          </Text>
        </View>

        {/* AI Language Guarantee Card */}
        <View className="mb-5 p-4.5 bg-white rounded-3xl border border-zinc-200/80 shadow-sm flex-row items-center gap-3.5">
          <View className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center">
            <Sparkles size={20} color="#4f46e5" />
          </View>
          <View className="flex-1">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
              AI Native Bilingual Tutor
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 leading-snug">
              {selectedItem
                ? `Mentor will converse & assist in ${selectedItem.name} (${selectedItem.nativeName}).`
                : 'Select your native tongue below.'}
            </Text>
          </View>
        </View>

        {/* Standardized iOS Spotlight Search Input */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search language (e.g., Hindi, Spanish)..."
          containerStyle={{ marginBottom: 18 }}
        />

        {/* Language Grid / List */}
        <View className="flex-col gap-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelectedLang(lang.id)}
                activeOpacity={0.7}
                className={`w-full p-4.5 rounded-3xl flex-row items-center justify-between border-2 transition-all ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md shadow-indigo-600/10'
                    : 'bg-white border-zinc-200/80 shadow-xs'
                }`}
              >
                <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                  <View className="w-12 h-12 rounded-2xl bg-zinc-100 items-center justify-center">
                    <Text className="text-[26px]">{lang.flag}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        style={{ fontFamily: isSelected ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
                        className={`text-[17px] ${isSelected ? 'text-indigo-600' : 'text-zinc-900'}`}
                      >
                        {lang.name}
                      </Text>
                      {lang.popular && (
                        <View className="bg-zinc-100 px-2.5 py-0.5 rounded-full">
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-zinc-500 uppercase">
                            Popular
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-400 mt-0.5">
                      {lang.nativeName}
                    </Text>
                  </View>
                </View>

                {isSelected ? (
                  <View className="w-7 h-7 rounded-full bg-indigo-600 items-center justify-center shadow-xs">
                    <Check color="#ffffff" size={16} strokeWidth={3} />
                  </View>
                ) : (
                  <View className="w-7 h-7 rounded-full border-2 border-zinc-200" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Standard iOS Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title={`Continue with ${selectedItem?.name || 'Selected'}`}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

