import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BackButton } from '../../components/ui/BackButton';
import { SearchInput } from '../../components/ui/SearchInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Check, Flame } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TargetLanguageItem {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  learners: string;
  isPopular?: boolean;
}

export const ALL_TARGET_LANGUAGES: TargetLanguageItem[] = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', learners: '1.5B learners', isPopular: true },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', learners: '500M learners', isPopular: true },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', learners: '300M learners', isPopular: true },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', learners: '130M learners', isPopular: true },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', learners: '125M learners', isPopular: true },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', learners: '600M learners', isPopular: true },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', learners: '80M learners', isPopular: true },
  { id: 'zh', name: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳', learners: '1.1B learners', isPopular: true },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', learners: '310M learners', isPopular: true },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', learners: '85M learners' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', learners: '260M learners' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', learners: '260M learners' },
  { id: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', learners: '85M learners' },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', learners: '25M learners' },
  { id: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', learners: '10M learners' },
  { id: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', learners: '85M learners' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', learners: '200M learners' },
  { id: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', learners: '50M learners' },
  { id: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', learners: '70M learners' },
];

export default function LearningLanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguage, setLearningLanguage } = useOnboardingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>(learningLanguage || 'en');

  // Priority search filter: "hi" brings Hindi right on top
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_TARGET_LANGUAGES;

    return [...ALL_TARGET_LANGUAGES].sort((a, b) => {
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

  const selectedItem = ALL_TARGET_LANGUAGES.find(l => l.id === selectedLang);

  const handleContinue = () => {
    if (selectedItem) {
      setLearningLanguage(selectedItem.id, selectedItem.name);
      router.push('/(public)/mentor-selection');
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header Bar with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/native-language" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Step 2 of 3
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
            Target Language
          </Text>
        </View>

        <View style={{ width: 44, height: 44 }} />
      </View>


      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
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
            Which language do you want to learn?
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500"
          >
            We will calibrate your mentor's accent and lessons for this language.
          </Text>
        </View>

        {/* Standardized iOS Spotlight Search Input */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search language to learn..."
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
                      {lang.isPopular && (
                        <View className="bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex-row items-center gap-1">
                          <Flame size={12} color="#d97706" />
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-amber-700 uppercase">
                            Popular
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-400 mt-0.5">
                      {lang.learners}
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
