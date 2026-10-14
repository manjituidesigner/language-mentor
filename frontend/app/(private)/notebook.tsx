import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { notebookService } from '../../services/notebookService';
import { speechService } from '../../services/speechService';
import { BackButton } from '../../components/ui/BackButton';
import { SearchInput } from '../../components/ui/SearchInput';
import {
  ArrowLeft,
  Search,
  Volume2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  X,
  RotateCcw,
  Star,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'words' | 'grammar' | 'bookmarks' | 'missed';

interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  mastery: 'Mastered' | 'Learning' | 'Review';
  bookmarked: boolean;
  category: string;
}

interface GrammarItem {
  id: string;
  title: string;
  level: string;
  rule: string;
  correct: string;
  incorrect: string;
  mentorTip: string;
  bookmarked: boolean;
}

interface MissedItem {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  session: string;
  date: string;
}

const INITIAL_VOCAB: VocabItem[] = [
  {
    id: 'v1',
    word: 'Accomplish',
    phonetic: '/əˈkʌm.plɪʃ/',
    partOfSpeech: 'verb',
    translation: 'पूरा करना / हासिल करना (to complete successfully)',
    example: 'I managed to accomplish all my goals this week.',
    exampleTranslation: 'मैंने इस हफ्ते अपने सभी लक्ष्य हासिल कर लिए।',
    mastery: 'Mastered',
    bookmarked: true,
    category: 'Verbs',
  },
  {
    id: 'v2',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    partOfSpeech: 'adjective',
    translation: 'दृढ़ / लचीला (able to recover quickly)',
    example: 'She stayed resilient despite repeated hurdles.',
    exampleTranslation: 'बार-बार आने वाली बाधाओं के बावजूद वह दृढ़ रही।',
    mastery: 'Learning',
    bookmarked: true,
    category: 'Adjectives',
  },
  {
    id: 'v3',
    word: 'Take for granted',
    phonetic: '/teɪk fər ˈɡrɑːn.tɪd/',
    partOfSpeech: 'idiom',
    translation: 'महत्व न समझना / हल्के में लेना',
    example: 'Never take genuine friendships for granted.',
    exampleTranslation: 'सच्ची दोस्ती को कभी हल्के में न लें।',
    mastery: 'Review',
    bookmarked: false,
    category: 'Idioms',
  },
  {
    id: 'v4',
    word: 'Elaborate',
    phonetic: '/ɪˈlæb.ər.ət/',
    partOfSpeech: 'verb',
    translation: 'विस्तार से बताना (to explain in detail)',
    example: 'Could you elaborate on the second proposal?',
    exampleTranslation: 'क्या आप दूसरे प्रस्ताव पर विस्तार से बता सकते हैं?',
    mastery: 'Learning',
    bookmarked: false,
    category: 'Verbs',
  },
  {
    id: 'v5',
    word: 'Spontaneous',
    phonetic: '/spɒnˈteɪ.ni.əs/',
    partOfSpeech: 'adjective',
    translation: 'सहज / स्वाभाविक (natural and unplanned)',
    example: 'We made a spontaneous decision to travel.',
    exampleTranslation: 'हमने यात्रा करने का एक सहज निर्णय लिया।',
    mastery: 'Mastered',
    bookmarked: true,
    category: 'Adjectives',
  },
];

const INITIAL_GRAMMAR: GrammarItem[] = [
  {
    id: 'g1',
    title: 'Past Simple: Irregular Verbs',
    level: 'A2 Essential',
    rule: 'Do not append "-ed" to irregular verbs (go → went, buy → bought).',
    correct: 'I went to the store yesterday.',
    incorrect: 'I goed to the store yesterday.',
    mentorTip: 'Mentor Sophie flagged this in your last voice call.',
    bookmarked: true,
  },
  {
    id: 'g2',
    title: 'Third-Person Singular (-s / -es)',
    level: 'A2 Core',
    rule: 'In simple present tense, add "-s" or "-es" for he, she, it.',
    correct: 'She speaks three languages fluently.',
    incorrect: 'She speak three languages fluently.',
    mentorTip: 'Remember: "He/She/It" always takes the singular -s marker.',
    bookmarked: false,
  },
  {
    id: 'g3',
    title: 'Prepositions of Time: In, On, At',
    level: 'B1 Intermediate',
    rule: 'Use "at" for clock times, "on" for days/dates, and "in" for months/years/centuries.',
    correct: 'The flight departs at 9:00 AM on Monday in July.',
    incorrect: 'The flight departs in 9:00 AM at Monday on July.',
    mentorTip: 'Think from specific to general: At (point) → On (surface/day) → In (container/period).',
    bookmarked: true,
  },
];

const INITIAL_MISSED: MissedItem[] = [
  {
    id: 'm1',
    original: 'Yesterday I goed to market.',
    corrected: 'Yesterday I went to the market.',
    explanation: '"Go" is an irregular verb. Past form is "went", and articles like "the" are needed.',
    session: 'Daily Coffee Chat with Sophie',
    date: 'Today, 10:24 AM',
  },
  {
    id: 'm2',
    original: 'This design is more better than old one.',
    corrected: 'This design is much better than the old one.',
    explanation: '"Better" is already comparative. Never use "more better". Use "much better" for emphasis.',
    session: 'Job Interview Simulation',
    date: 'Yesterday, 4:15 PM',
  },
  {
    id: 'm3',
    original: 'I am agree with your opinion.',
    corrected: 'I agree with your opinion.',
    explanation: '"Agree" is an action verb in English, not an adjective. Do not say "I am agree".',
    session: 'Group Practice: Daily Routines',
    date: 'Oct 12, 6:00 PM',
  },
];

export default function NotebookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguageName, nativeLanguageName, mentorName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';

  const [activeTab, setActiveTab] = useState<TabType>('words');
  const [searchQuery, setSearchQuery] = useState('');
  const [vocabList, setVocabList] = useState<VocabItem[]>(INITIAL_VOCAB);
  const [grammarList, setGrammarList] = useState<GrammarItem[]>(INITIAL_GRAMMAR);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Verbs', 'Adjectives', 'Idioms'];

  useEffect(() => {
    // Fetch live saved items from backend
    notebookService.getItems().then((items) => {
      if (items && items.length > 0) {
        const words = items
          .filter((i) => i.item_type === 'word')
          .map((i) => ({
            id: i.id,
            word: i.title_or_word,
            phonetic: i.phonetic || '/əˈkʌm.plɪʃ/',
            partOfSpeech: i.part_of_speech || 'noun',
            translation: i.translation,
            example: i.example_sentence || '',
            exampleTranslation: i.example_translation || '',
            mastery: (i.mastery_level || 'Learning') as VocabItem['mastery'],
            bookmarked: !!i.is_bookmarked,
            category: 'Verbs',
          }));
        if (words.length > 0) {
          setVocabList((prev) => {
            const map = new Map(prev.map((w) => [w.id, w]));
            words.forEach((w) => map.set(w.id, w));
            return Array.from(map.values());
          });
        }
      }
    });
  }, []);

  const handleTabChange = (tab: TabType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const toggleVocabBookmark = (id: string) => {
    setVocabList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.bookmarked;
          notebookService.updateItem(id, { isBookmarked: nextVal });
          return { ...item, bookmarked: nextVal };
        }
        return item;
      })
    );
  };

  const toggleGrammarBookmark = (id: string) => {
    setGrammarList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.bookmarked;
          notebookService.updateItem(id, { isBookmarked: nextVal });
          return { ...item, bookmarked: nextVal };
        }
        return item;
      })
    );
  };

  const handlePlayAudio = (id: string, textToSpeak?: string) => {
    const word = textToSpeak || vocabList.find((v) => v.id === id)?.word;
    if (word) {
      setPlayingId(id);
      speechService.speakMentorResponse(word, mentor, {
        onDone: () => setPlayingId(null),
        onError: () => setPlayingId(null),
      });
    }
  };

  // Filtered lists
  const filteredVocab = vocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bookmarkedVocab = vocabList.filter((item) => item.bookmarked);
  const bookmarkedGrammar = grammarList.filter((item) => item.bookmarked);

  const getMasteryBadge = (status: VocabItem['mastery']) => {
    switch (status) {
      case 'Mastered':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'Learning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-700',
          dot: 'bg-amber-500',
        };
      case 'Review':
        return {
          bg: 'bg-indigo-50 border-indigo-200',
          text: 'text-indigo-700',
          dot: 'bg-indigo-500',
        };
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 shadow-sm shadow-black/[0.02]"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2.5">
            <BackButton fallbackRoute="/(private)/dashboard" />
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-zinc-900 leading-tight">
                My Notebook
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                {targetLang} • Guided in {nativeLang}
              </Text>
            </View>
          </View>

          <View className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 flex-row items-center gap-1.5">
            <Sparkles size={14} color="#4f46e5" />
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-indigo-700">
              48 Saved
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${targetLang} words or meanings...`}
        />


        {/* Segmented Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 -mx-1"
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
        >
          <TouchableOpacity
            onPress={() => handleTabChange('words')}
            activeOpacity={0.75}
            className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 shadow-sm shadow-black/[0.02] ${
              activeTab === 'words'
                ? 'bg-indigo-600 border-indigo-600 shadow-indigo-600/20'
                : 'bg-white border-zinc-200/70'
            }`}
          >
            <BookOpen size={14} color={activeTab === 'words' ? '#ffffff' : '#52525b'} />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className={`text-[12px] ${activeTab === 'words' ? 'text-white' : 'text-zinc-700'}`}
            >
              All Words ({vocabList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('grammar')}
            activeOpacity={0.75}
            className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 shadow-sm shadow-black/[0.02] ${
              activeTab === 'grammar'
                ? 'bg-indigo-600 border-indigo-600 shadow-indigo-600/20'
                : 'bg-white border-zinc-200/70'
            }`}
          >
            <Sparkles size={14} color={activeTab === 'grammar' ? '#ffffff' : '#52525b'} />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className={`text-[12px] ${activeTab === 'grammar' ? 'text-white' : 'text-zinc-700'}`}
            >
              Grammar ({grammarList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('bookmarks')}
            activeOpacity={0.75}
            className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 shadow-sm shadow-black/[0.02] ${
              activeTab === 'bookmarks'
                ? 'bg-indigo-600 border-indigo-600 shadow-indigo-600/20'
                : 'bg-white border-zinc-200/70'
            }`}
          >
            <Bookmark size={14} color={activeTab === 'bookmarks' ? '#ffffff' : '#52525b'} />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className={`text-[12px] ${activeTab === 'bookmarks' ? 'text-white' : 'text-zinc-700'}`}
            >
              Bookmarks ({bookmarkedVocab.length + bookmarkedGrammar.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('missed')}
            activeOpacity={0.75}
            className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 shadow-sm shadow-black/[0.02] ${
              activeTab === 'missed'
                ? 'bg-indigo-600 border-indigo-600 shadow-indigo-600/20'
                : 'bg-white border-zinc-200/70'
            }`}
          >
            <RotateCcw size={14} color={activeTab === 'missed' ? '#ffffff' : '#52525b'} />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className={`text-[12px] ${activeTab === 'missed' ? 'text-white' : 'text-zinc-700'}`}
            >
              Missed in Chat ({INITIAL_MISSED.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Pills for Words Tab */}
        {activeTab === 'words' && (
          <View className="flex-row items-center gap-2 mb-4">
            <Filter size={13} color="#71717a" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                  className={`px-3 py-1 rounded-full border ${
                    selectedCategory === cat
                      ? 'bg-zinc-900 border-zinc-900'
                      : 'bg-white border-zinc-200'
                  }`}
                >
                  <Text
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                    className={`text-[11px] ${selectedCategory === cat ? 'text-white' : 'text-zinc-600'}`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* TAB 1: ALL WORDS */}
        {activeTab === 'words' && (
          <View className="flex-col gap-3.5">
            {filteredVocab.map((item) => {
              const badge = getMasteryBadge(item.mastery);
              const isPlaying = playingId === item.id;
              return (
                <View
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm shadow-black/5"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <View className="flex-row items-center gap-2 flex-wrap mb-1">
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-zinc-900">
                          {item.word}
                        </Text>
                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                          {item.phonetic}
                        </Text>
                        <View className="bg-zinc-100 px-2 py-0.5 rounded-md">
                          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-zinc-600 uppercase">
                            {item.partOfSpeech}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-indigo-700 leading-snug">
                        {item.translation}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <TouchableOpacity
                        onPress={() => handlePlayAudio(item.id)}
                        activeOpacity={0.7}
                        className={`w-8 h-8 rounded-full items-center justify-center transition-all ${
                          isPlaying ? 'bg-indigo-600' : 'bg-indigo-50'
                        }`}
                      >
                        <Volume2 size={16} color={isPlaying ? '#ffffff' : '#4f46e5'} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => toggleVocabBookmark(item.id)}
                        activeOpacity={0.7}
                        className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                      >
                        <Bookmark
                          size={15}
                          color={item.bookmarked ? '#f59e0b' : '#71717a'}
                          fill={item.bookmarked ? '#f59e0b' : 'transparent'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Example Sentence Container */}
                  <View className="bg-zinc-50/90 rounded-xl p-3 border border-zinc-200/60 mt-1">
                    <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-800 italic mb-1">
                      "{item.example}"
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
                      {item.exampleTranslation}
                    </Text>
                  </View>

                  {/* Footer status */}
                  <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
                    <View className={`px-2.5 py-0.5 rounded-full border flex-row items-center gap-1.5 ${badge.bg}`}>
                      <View className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className={`text-[10px] uppercase ${badge.text}`}>
                        {item.mastery}
                      </Text>
                    </View>

                    <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-400">
                      Auto-synced with Mentor
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: GRAMMAR RULES */}
        {activeTab === 'grammar' && (
          <View className="flex-col gap-3.5">
            {grammarList.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                        {item.title}
                      </Text>
                    </View>
                    <View className="self-start bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-indigo-700">
                        {item.level}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleGrammarBookmark(item.id)}
                    activeOpacity={0.7}
                    className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                  >
                    <Bookmark
                      size={15}
                      color={item.bookmarked ? '#f59e0b' : '#71717a'}
                      fill={item.bookmarked ? '#f59e0b' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Rule explanation */}
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-700 mb-3 leading-relaxed">
                  {item.rule}
                </Text>

                {/* Comparison Card */}
                <View className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/70 gap-2 mb-2.5">
                  <View className="flex-row items-center gap-2">
                    <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center">
                      <Check size={12} color="#059669" />
                    </View>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-emerald-900 flex-1">
                      {item.correct}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="w-5 h-5 rounded-full bg-rose-100 items-center justify-center">
                      <X size={12} color="#e11d48" />
                    </View>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500 line-through flex-1">
                      {item.incorrect}
                    </Text>
                  </View>
                </View>

                {/* Mentor Tip */}
                <View className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/60 flex-row items-start gap-2">
                  <Sparkles size={14} color="#d97706" className="mt-0.5" />
                  <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-amber-900 flex-1 leading-snug">
                    {item.mentorTip}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <View className="flex-col gap-3.5">
            <View className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/60 flex-row items-center gap-2.5 mb-1">
              <Star size={18} color="#d97706" fill="#d97706" />
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-amber-900 flex-1">
                Starred concepts are prioritized for spaced repetition in your daily AI calls.
              </Text>
            </View>

            {bookmarkedVocab.length === 0 && bookmarkedGrammar.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center justify-center border border-zinc-200/80">
                <Bookmark size={36} color="#d4d4d8" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-800 mt-3 mb-1">
                  No bookmarks yet
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500 text-center">
                  Tap the bookmark icon on any word or grammar card to pin it here.
                </Text>
              </View>
            ) : (
              <>
                {bookmarkedVocab.map((item) => (
                  <View
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm shadow-black/5"
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                          {item.word}
                        </Text>
                        <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-indigo-700">
                          {item.translation}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => toggleVocabBookmark(item.id)}
                        activeOpacity={0.7}
                        className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                      >
                        <Bookmark size={15} color="#f59e0b" fill="#f59e0b" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {bookmarkedGrammar.map((item) => (
                  <View
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm shadow-black/5"
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => toggleGrammarBookmark(item.id)}
                        activeOpacity={0.7}
                        className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
                      >
                        <Bookmark size={15} color="#f59e0b" fill="#f59e0b" />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600">
                      {item.correct}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* TAB 4: MISSED IN CHAT */}
        {activeTab === 'missed' && (
          <View className="flex-col gap-3.5">
            {INITIAL_MISSED.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-rose-700 uppercase">
                      Live Error Correction
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                    {item.date}
                  </Text>
                </View>

                {/* Side-by-side or block correction */}
                <View className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/60 gap-1.5 mb-2.5">
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-rose-600 line-through">
                    "{item.original}"
                  </Text>
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-emerald-700">
                    "{item.corrected}"
                  </Text>
                </View>

                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600 mb-2 leading-relaxed">
                  {item.explanation}
                </Text>

                <View className="pt-2 border-t border-zinc-100 flex-row items-center justify-between">
                  <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-zinc-400">
                    From: {item.session}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(private)/chat-session')}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1"
                  >
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-indigo-600">
                      Re-practice
                    </Text>
                    <ArrowRight size={11} color="#4f46e5" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Bar with Safe Area */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5 flex-row gap-3"
      >
        <TouchableOpacity
          onPress={() => router.push('/(private)/mini-quiz')}
          activeOpacity={0.85}
          className="flex-1 h-14 rounded-2xl bg-white border border-zinc-200/80 items-center justify-center shadow-sm active:scale-[0.98]"
        >
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-800">
            Practice Cards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(private)/progress')}
          activeOpacity={0.85}
          className="flex-[1.4] h-14 rounded-2xl bg-indigo-600 flex-row items-center justify-center shadow-md shadow-indigo-600/25 active:scale-[0.98]"
        >
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-white font-semibold mr-1.5">
            View Progress
          </Text>
          <ArrowRight color="#ffffff" size={17} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
