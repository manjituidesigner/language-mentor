import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore, MentorTabType } from '../../store/onboardingStore';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Calendar,
  Send,
  Users,
  Bot,
  Star,
  CheckCircle2,
  Sparkles,
  X,
  Volume2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mentorService } from '../../services/mentorService';
import { groupService } from '../../services/groupService';
import { BackButton } from '../../components/ui/BackButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

// ONLINE MENTORS DATA
const ONLINE_MENTORS = [
  {
    id: 'm_online_1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    rating: 4.9,
    reviews: 340,
    languages: 'Hindi (Native) • English (Fluent)',
    specialty: 'Conversational Fluency, Accent & Job Interviews',
    rate: 'Free Demo • $12/hr',
    badge: 'Top Rated',
  },
  {
    id: 'm_online_2',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    rating: 4.8,
    reviews: 215,
    languages: 'Spanish & French • English',
    specialty: 'Everyday Dialogues, Travel Spanish, Vocabulary',
    rate: 'Free Demo • $14/hr',
    badge: 'Fast Responder',
  },
  {
    id: 'm_online_3',
    name: 'Lucas Dubois',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    rating: 4.95,
    reviews: 480,
    languages: 'French (Native) • English • German',
    specialty: 'Pronunciation, Grammar Nuances, Business',
    rate: '$15/hr',
    badge: 'Pro Tutor',
  },
];

// OFFLINE MENTORS DATA
const OFFLINE_MENTORS = [
  {
    id: 'm_offline_1',
    name: 'Dr. Vikram Sen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 4.9,
    reviews: 512,
    languages: 'Hindi • Sanskrit • English',
    specialty: 'Advanced Literature, Grammar Foundations, IELTS Prep',
    statusText: 'Offline • Usually replies in 1 hr',
    rate: '$16/hr',
  },
  {
    id: 'm_offline_2',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    rating: 4.85,
    reviews: 289,
    languages: 'English (US Native) • Spanish',
    specialty: 'American Idioms, Corporate Presentations, Casual Slang',
    statusText: 'Offline • Active 2h ago',
    rate: '$15/hr',
  },
  {
    id: 'm_offline_3',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    rating: 4.92,
    reviews: 190,
    languages: 'Japanese (Native) • English',
    specialty: 'Kanji Mastery, JLPT N5-N2, Polite Keigo',
    statusText: 'Offline • Replies tonight',
    rate: '$18/hr',
  },
];

// GROUP DISCUSSION CLUBS
const GROUPS = [
  {
    id: 'grp_1',
    title: 'Hindi & English Fluency Hub',
    members: '184 members',
    activeNow: '16 active now',
    topic: 'Today: Favorite Childhood Memories & Local Slang',
    level: 'All Levels Welcome',
    icon: '🇮🇳',
    bgTint: 'bg-emerald-50',
    borderTint: 'border-emerald-200',
  },
  {
    id: 'grp_2',
    title: 'Spanish Daily Small Talk Circle',
    members: '240 members',
    activeNow: '22 active now',
    topic: 'Today: Coffee Shop Conversations & Ordering Food',
    level: 'Beginner to Intermediate',
    icon: '🇪🇸',
    bgTint: 'bg-amber-50',
    borderTint: 'border-amber-200',
  },
  {
    id: 'grp_3',
    title: 'Global English Speakers Lounge',
    members: '620 members',
    activeNow: '45 active now',
    topic: 'Today: Tech, Career Goals & Public Speaking Tips',
    level: 'Intermediate to Advanced',
    icon: '🌍',
    bgTint: 'bg-indigo-50',
    borderTint: 'border-indigo-200',
  },
  {
    id: 'grp_4',
    title: 'French Pronunciation & Culture',
    members: '115 members',
    activeNow: '9 active now',
    topic: 'Today: Tricky Vowel Sounds & Parisian Etiquette',
    level: 'All Levels',
    icon: '🇫🇷',
    bgTint: 'bg-purple-50',
    borderTint: 'border-purple-200',
  },
];

// VIA AI MENTORS
const AI_MENTORS = [
  {
    id: 'sophie',
    name: 'Sophie (AI)',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    role: 'Kind & Patient Tutor',
    tags: ['Zero Stress', 'Beginner Friendly', 'Instant Replies'],
    description: 'Sophie gently corrects grammar, encourages mistakes, and speaks at a relaxed, easy-to-understand pace.',
    voice: 'Warm & Natural',
  },
  {
    id: 'alex',
    name: 'Alex (AI)',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop',
    role: 'Structured Academic Mentor',
    tags: ['Grammar Precision', 'Detailed Feedback', 'Exam Prep'],
    description: 'Alex focuses on CEFR benchmarks, syntax rules, and logical fluency for career & academic goals.',
    voice: 'Articulate & Clear',
  },
  {
    id: 'liam',
    name: 'Liam (AI)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    role: 'Casual & Cultural Guide',
    tags: ['Street Slang', 'Idioms', 'Natural Flow'],
    description: 'Liam teaches you how natives talk in real life, with humor, cultural anecdotes, and informal vocabulary.',
    voice: 'Casual & Energetic',
  },
  {
    id: 'elara',
    name: 'Elara (AI)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    role: 'Storyteller & Culturalist',
    tags: ['Storytelling', 'Literature', 'Deep Dives'],
    description: 'Elara uses storytelling, poetic imagery, and historical context to deeply immerse you in your chosen language.',
    voice: 'Expressive & Melodic',
  },
];

export default function MentorSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    learningLanguageName,
    nativeLanguageName,
    mentorType,
    setMentorType,
    setMentorSelection,
    setSelectedGroup,
  } = useOnboardingStore();

  const [activeTab, setActiveTab] = useState<MentorTabType>(mentorType || 'online');
  const [selectedAI, setSelectedAI] = useState<string>('sophie');

  // Modal interaction states
  const [activeModal, setActiveModal] = useState<{
    type: 'chat' | 'call' | 'book' | 'request' | 'group' | null;
    targetName: string;
    targetMeta?: string;
  }>({ type: null, targetName: '' });

  const [requestMessage, setRequestMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleTabChange = (tab: MentorTabType) => {
    setActiveTab(tab);
    setMentorType(tab);
  };

  const handleOpenActionModal = (
    type: 'chat' | 'call' | 'book' | 'request' | 'group',
    name: string,
    meta?: string
  ) => {
    setModalSuccess(false);
    setRequestMessage('');
    setActiveModal({ type, targetName: name, targetMeta: meta });
  };

  const handleConfirmAction = () => {
    setModalSuccess(true);

    // Call backend API in background
    if (activeModal.type === 'group') {
      groupService.joinGroup('88888888-8888-8888-8888-888888888881');
    } else if (activeModal.type === 'book' || activeModal.type === 'request' || activeModal.type === 'call') {
      mentorService.bookSession({
        mentorId: '55555555-5555-5555-5555-555555555555',
        bookingType: activeModal.type === 'book' ? 'session' : activeModal.type === 'call' ? 'call' : 'request',
        notes: requestMessage,
      });
    }

    setTimeout(() => {
      setActiveModal({ type: null, targetName: '' });
      setModalSuccess(false);
      // If user joined a group, save to store
      if (activeModal.type === 'group') {
        setSelectedGroup(activeModal.targetName);
      }
      // Navigate to Meet Your Mentor (Screen 6)
      router.push('/(public)/meet-mentor');
    }, 1200);
  };

  const handleSelectAIMentor = (aiId: string, aiName: string) => {
    setSelectedAI(aiId);
    setMentorSelection(aiId, aiName, 'ai');
    router.push('/(public)/meet-mentor');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/learning-language');
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header Bar with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/learning-language" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Step 3 of 3
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
            Mentors & Practice
          </Text>
        </View>

        <View style={{ width: 44, height: 44 }} />
      </View>


      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View className="mb-4">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 mb-1.5 tracking-tight"
          >
            How do you want to learn?
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[14px] leading-[20px] text-zinc-500"
          >
            Connect 1-on-1 with live tutors, join group discussions, or practice 24/7 with an AI Mentor.
          </Text>
        </View>

        {/* iOS-Style Segmented Control Tabs */}
        <View className="w-full p-1 bg-zinc-200/70 rounded-2xl flex-row items-center mb-6 shadow-inner">
          <TouchableOpacity
            onPress={() => handleTabChange('online')}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center transition-all ${
              activeTab === 'online'
                ? 'bg-white shadow-sm shadow-black/10'
                : 'bg-transparent'
            }`}
          >
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text
                style={{ fontFamily: activeTab === 'online' ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
                className={`text-[13px] ${activeTab === 'online' ? 'text-zinc-900' : 'text-zinc-600'}`}
              >
                Online
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('offline')}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center transition-all ${
              activeTab === 'offline'
                ? 'bg-white shadow-sm shadow-black/10'
                : 'bg-transparent'
            }`}
          >
            <Text
              style={{ fontFamily: activeTab === 'offline' ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
              className={`text-[13px] ${activeTab === 'offline' ? 'text-zinc-900' : 'text-zinc-600'}`}
            >
              Offline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('group')}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center transition-all ${
              activeTab === 'group'
                ? 'bg-white shadow-sm shadow-black/10'
                : 'bg-transparent'
            }`}
          >
            <View className="flex-row items-center gap-1">
              <Users size={13} color={activeTab === 'group' ? '#0f172a' : '#52525b'} />
              <Text
                style={{ fontFamily: activeTab === 'group' ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
                className={`text-[13px] ${activeTab === 'group' ? 'text-zinc-900' : 'text-zinc-600'}`}
              >
                Group
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('ai')}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center transition-all ${
              activeTab === 'ai'
                ? 'bg-indigo-600 shadow-sm shadow-indigo-600/30'
                : 'bg-transparent'
            }`}
          >
            <View className="flex-row items-center gap-1">
              <Bot size={13} color={activeTab === 'ai' ? '#ffffff' : '#4f46e5'} />
              <Text
                style={{ fontFamily: activeTab === 'ai' ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
                className={`text-[13px] ${activeTab === 'ai' ? 'text-white' : 'text-indigo-700'}`}
              >
                Via AI
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* TAB 1: ONLINE MENTORS */}
        {activeTab === 'online' && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <View className="flex-row items-center justify-between mb-3 px-1">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Available Right Now
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-emerald-600">
                Live tutors online
              </Text>
            </View>

            <View className="flex-col gap-4">
              {ONLINE_MENTORS.map((mentor) => (
                <View
                  key={mentor.id}
                  className="bg-white rounded-3xl p-4.5 border border-zinc-200/80 shadow-sm shadow-black/[0.03]"
                >
                  {/* Top Mentor Profile Row */}
                  <View className="flex-row items-center gap-3.5 mb-3">
                    <View className="relative">
                      <Image
                        source={{ uri: mentor.avatar }}
                        className="w-14 h-14 rounded-full border border-zinc-200"
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
                          {mentor.name}
                        </Text>
                        <View className="bg-indigo-50 px-2 py-0.5 rounded-md">
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-indigo-700">
                            {mentor.badge}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Star size={13} color="#f59e0b" fill="#f59e0b" />
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-800">
                          {mentor.rating}
                        </Text>
                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-400">
                          ({mentor.reviews} reviews)
                        </Text>
                        <Text className="text-zinc-300">•</Text>
                        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-emerald-600">
                          {mentor.rate}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Languages & Specialty */}
                  <View className="mb-3.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-zinc-800 mb-0.5">
                      🗣️ {mentor.languages}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                      🎯 {mentor.specialty}
                    </Text>
                  </View>

                  {/* 3 iOS Action Buttons */}
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => handleOpenActionModal('chat', mentor.name, mentor.languages)}
                      activeOpacity={0.8}
                      className="flex-1 h-10 bg-indigo-50 rounded-xl flex-row items-center justify-center gap-1.5 border border-indigo-100 active:bg-indigo-100"
                    >
                      <MessageCircle size={15} color="#4f46e5" />
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-indigo-700">
                        Chat
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleOpenActionModal('call', mentor.name, mentor.languages)}
                      activeOpacity={0.8}
                      className="flex-1 h-10 bg-emerald-50 rounded-xl flex-row items-center justify-center gap-1.5 border border-emerald-100 active:bg-emerald-100"
                    >
                      <Phone size={15} color="#059669" />
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-emerald-700">
                        Call
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleOpenActionModal('book', mentor.name, mentor.rate)}
                      activeOpacity={0.8}
                      className="flex-1 h-10 bg-zinc-900 rounded-xl flex-row items-center justify-center gap-1.5 active:bg-zinc-800"
                    >
                      <Calendar size={15} color="#ffffff" />
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-white">
                        Book
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* TAB 2: OFFLINE MENTORS */}
        {activeTab === 'offline' && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                Scheduled Tutors
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                Send a lesson request
              </Text>
            </View>

            <View className="flex-col gap-4">
              {OFFLINE_MENTORS.map((mentor) => (
                <View
                  key={mentor.id}
                  className="bg-white rounded-3xl p-4.5 border border-zinc-200/80 shadow-sm shadow-black/[0.03]"
                >
                  <View className="flex-row items-center gap-3.5 mb-3">
                    <View className="relative">
                      <Image
                        source={{ uri: mentor.avatar }}
                        className="w-14 h-14 rounded-full border border-zinc-200 opacity-90"
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-zinc-400 border-2 border-white" />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
                          {mentor.name}
                        </Text>
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-zinc-700">
                          {mentor.rate}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Star size={13} color="#f59e0b" fill="#f59e0b" />
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-800">
                          {mentor.rating}
                        </Text>
                        <Text className="text-zinc-300">•</Text>
                        <Clock size={12} color="#94a3b8" />
                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
                          {mentor.statusText}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mb-3.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-zinc-800 mb-0.5">
                      🗣️ {mentor.languages}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                      🎯 {mentor.specialty}
                    </Text>
                  </View>

                  {/* Send Request Button */}
                  <TouchableOpacity
                    onPress={() => handleOpenActionModal('request', mentor.name, mentor.statusText)}
                    activeOpacity={0.8}
                    className="w-full h-11 bg-indigo-50 border border-indigo-200 rounded-xl flex-row items-center justify-center gap-2 active:bg-indigo-100"
                  >
                    <Send size={15} color="#4f46e5" />
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-indigo-700">
                      Send Learning Request
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* TAB 3: GROUP LEARNING & DISCUSSIONS */}
        {activeTab === 'group' && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                Community Discussion Groups
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-indigo-600">
                Peer Practice
              </Text>
            </View>

            <View className="flex-col gap-4">
              {GROUPS.map((group) => (
                <View
                  key={group.id}
                  className="bg-white rounded-3xl p-4.5 border border-zinc-200/80 shadow-sm shadow-black/[0.03]"
                >
                  <View className="flex-row items-start gap-3.5 mb-3">
                    <View
                      className={`w-13 h-13 p-3 rounded-2xl ${group.bgTint} border ${group.borderTint} items-center justify-center`}
                    >
                      <Text className="text-2xl">{group.icon}</Text>
                    </View>

                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900 mb-1">
                        {group.title}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center gap-1">
                          <Users size={12} color="#64748b" />
                          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-zinc-500">
                            {group.members}
                          </Text>
                        </View>
                        <Text className="text-zinc-300">•</Text>
                        <View className="flex-row items-center gap-1">
                          <View className="w-2 h-2 rounded-full bg-emerald-500" />
                          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-emerald-600">
                            {group.activeNow}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Topic Box */}
                  <View className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-3.5">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-indigo-900 mb-0.5">
                      {group.topic}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
                      Level: {group.level}
                    </Text>
                  </View>

                  {/* Join Group Button */}
                  <TouchableOpacity
                    onPress={() => handleOpenActionModal('group', group.title, group.topic)}
                    activeOpacity={0.8}
                    className="w-full h-11 bg-indigo-600 rounded-xl flex-row items-center justify-center gap-2 active:bg-indigo-700 shadow-sm shadow-indigo-600/20"
                  >
                    <Users size={16} color="#ffffff" />
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-white">
                      Join Discussion Group
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* TAB 4: VIA AI (24/7 INSTANT AI MENTORS) */}
        {activeTab === 'ai' && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            {/* AI Highlight Banner */}
            <View className="mb-4 p-4 bg-gradient-to-r bg-indigo-600 rounded-3xl shadow-md shadow-indigo-600/20">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Sparkles size={18} color="#ffffff" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white text-[16px]">
                  24/7 Instant AI Mentorship
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-indigo-100 text-[13px] leading-[18px]">
                Zero wait time. Unlimited natural speaking & listening practice. Explanations available in {nativeLanguageName || 'Hindi'}.
              </Text>
            </View>

            <View className="flex-col gap-3.5">
              {AI_MENTORS.map((mentor) => {
                const isSelected = selectedAI === mentor.id;
                return (
                  <TouchableOpacity
                    key={mentor.id}
                    onPress={() => setSelectedAI(mentor.id)}
                    activeOpacity={0.85}
                    className={`bg-white rounded-3xl p-4.5 border transition-all ${
                      isSelected
                        ? 'border-indigo-600 shadow-md shadow-indigo-100 bg-indigo-50/30'
                        : 'border-zinc-200/80 shadow-sm shadow-black/[0.02]'
                    }`}
                  >
                    <View className="flex-row items-center gap-3.5 mb-2.5">
                      <Image
                        source={{ uri: mentor.avatar }}
                        className="w-14 h-14 rounded-full border-2 border-indigo-200"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
                            {mentor.name}
                          </Text>
                          <View className="w-6 h-6 rounded-full bg-indigo-100 items-center justify-center">
                            <Volume2 size={13} color="#4f46e5" />
                          </View>
                        </View>
                        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-indigo-700">
                          {mentor.role}
                        </Text>
                      </View>
                    </View>

                    {/* Tags */}
                    <View className="flex-row flex-wrap gap-1.5 mb-2.5">
                      {mentor.tags.map((tag, idx) => (
                        <View key={idx} className="bg-zinc-100 px-2.5 py-0.5 rounded-full">
                          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-zinc-600">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] leading-[19px] text-zinc-600 mb-3.5">
                      {mentor.description}
                    </Text>

                    {/* Action CTA for this AI mentor */}
                    <TouchableOpacity
                      onPress={() => handleSelectAIMentor(mentor.id, mentor.name)}
                      activeOpacity={0.85}
                      className="w-full h-14 bg-indigo-600 rounded-2xl flex-row items-center justify-center gap-2 shadow-md shadow-indigo-600/25 active:scale-[0.98]"
                    >
                      <Sparkles size={18} color="#ffffff" />
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-white">
                        Practice with {mentor.name.split(' ')[0]}
                      </Text>
                      <ArrowRight size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* INTERACTIVE ACTION MODAL (iOS Sheet Style) */}
      <Modal
        visible={activeModal.type !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal({ type: null, targetName: '' })}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            className="bg-white rounded-t-[32px] p-6 pt-5"
          >
            {/* Grabber Bar */}
            <View className="w-12 h-1 bg-zinc-300 rounded-full self-center mb-5" />

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2.5">
                <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
                  {activeModal.type === 'chat' && <MessageCircle size={20} color="#4f46e5" />}
                  {activeModal.type === 'call' && <Phone size={20} color="#059669" />}
                  {activeModal.type === 'book' && <Calendar size={20} color="#0f172a" />}
                  {activeModal.type === 'request' && <Send size={20} color="#4f46e5" />}
                  {activeModal.type === 'group' && <Users size={20} color="#4f46e5" />}
                </View>
                <View>
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-zinc-900">
                    {activeModal.type === 'chat' && `Direct Chat with ${activeModal.targetName}`}
                    {activeModal.type === 'call' && `Audio/Video Call with ${activeModal.targetName}`}
                    {activeModal.type === 'book' && `Book Session with ${activeModal.targetName}`}
                    {activeModal.type === 'request' && `Lesson Request to ${activeModal.targetName}`}
                    {activeModal.type === 'group' && `Join ${activeModal.targetName}`}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                    {activeModal.targetMeta || 'AI Language Mentor Learning Network'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setActiveModal({ type: null, targetName: '' })}
                className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {modalSuccess ? (
              <View className="py-8 items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-3">
                  <CheckCircle2 size={36} color="#059669" />
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[19px] text-zinc-900 mb-1">
                  Connected Successfully!
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-500 text-center">
                  Setting up your learning environment...
                </Text>
              </View>
            ) : (
              <View>
                {/* Modal Body */}
                {activeModal.type === 'chat' && (
                  <View className="mb-5">
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-600 mb-3">
                      Start a direct messaging thread to practice phrases, ask quick grammar questions, or arrange homework review.
                    </Text>
                    <TextInput
                      className="w-full h-24 p-4 bg-zinc-100/90 rounded-2xl border border-zinc-200/80 text-[15px] text-zinc-900"
                      placeholder="Type your opening message in Hindi, English, or your target language..."
                      placeholderTextColor="#8e8e93"
                      multiline
                      value={requestMessage}
                      onChangeText={setRequestMessage}
                    />
                  </View>
                )}

                {activeModal.type === 'call' && (
                  <View className="mb-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex-row items-center gap-3">
                    <ShieldCheck size={24} color="#059669" />
                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-emerald-950">
                        HD Voice & Video Ready
                      </Text>
                      <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-emerald-800">
                        {activeModal.targetName} is ready to receive your live speaking practice call.
                      </Text>
                    </View>
                  </View>
                )}

                {activeModal.type === 'book' && (
                  <View className="mb-5">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-zinc-700 mb-2">
                      Available Time Slots Today:
                    </Text>
                    <View className="flex-row gap-2">
                      <View className="px-3.5 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-indigo-700">
                          5:30 PM (30m)
                        </Text>
                      </View>
                      <View className="px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl">
                        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-zinc-700">
                          7:00 PM (45m)
                        </Text>
                      </View>
                      <View className="px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl">
                        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-zinc-700">
                          9:15 PM (1h)
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {activeModal.type === 'request' && (
                  <View className="mb-5">
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-600 mb-3">
                      Leave a note for {activeModal.targetName}. You'll receive a push notification as soon as they reply.
                    </Text>
                    <TextInput
                      className="w-full h-24 p-4 bg-zinc-100/90 rounded-2xl border border-zinc-200/80 text-[15px] text-zinc-900"
                      placeholder="Hi, I'd like to practice conversational fluency with you..."
                      placeholderTextColor="#8e8e93"
                      multiline
                      value={requestMessage}
                      onChangeText={setRequestMessage}
                    />
                  </View>
                )}

                {activeModal.type === 'group' && (
                  <View className="mb-5 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-indigo-950 mb-1">
                      Group Etiquette:
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-indigo-900 leading-[18px]">
                      • Respect all learners and language skill levels{'\n'}
                      • Native speakers actively help beginners{'\n'}
                      • Daily topic voice huddles open every evening
                    </Text>
                  </View>
                )}

                {/* Confirm Action Button */}
                <PrimaryButton
                  title={
                    activeModal.type === 'chat' ? 'Start Chat Now' :
                    activeModal.type === 'call' ? 'Connect Call' :
                    activeModal.type === 'book' ? 'Confirm Booking' :
                    activeModal.type === 'request' ? 'Send Request' :
                    'Confirm & Enter Group'
                  }
                  onPress={handleConfirmAction}
                />

              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
