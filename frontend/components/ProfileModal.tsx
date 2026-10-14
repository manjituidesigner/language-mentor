import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  X,
  User,
  LogOut,
  Globe,
  Bot,
  Target,
  Bell,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react-native';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const {
    nativeLanguageName,
    learningLanguageName,
    mentorName,
    resetOnboarding,
  } = useOnboardingStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [slowAudioEnabled, setSlowAudioEnabled] = useState(false);

  const displayName = user?.name || 'Manjit Singh';
  const displayEmail = user?.email || 'manjit.learner@lumina.ai';
  const nativeLang = nativeLanguageName || 'Hindi (हिन्दी)';
  const learningLang = learningLanguageName || 'English (UK)';
  const mentor = mentorName || 'Sophie (AI)';

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      logout();
      resetOnboarding();
      router.replace('/(public)/welcome');
    }, 150);
  };

  const navigateTo = (path: any) => {
    onClose();
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        {/* Backdrop dismiss */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Apple Style Sheet Content */}
        <View
          style={{
            maxHeight: '90%',
            paddingBottom: Math.max(insets.bottom, 20),
          }}
          className="bg-[#F2F2F7] rounded-t-[32px] overflow-hidden shadow-2xl border-t border-zinc-200/80"
        >
          {/* Drag Handle & Header */}
          <View className="pt-3 px-5 pb-2 bg-white border-b border-zinc-200/70 items-center relative">
            <View className="w-12 h-1.5 rounded-full bg-zinc-300 mb-3" />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className="text-[17px] text-zinc-900"
            >
              Account & Profile
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-zinc-100 items-center justify-center"
            >
              <X size={18} color="#71717a" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-grow-0"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* User Profile Card */}
            <View className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm mb-4">
              <View className="flex-row items-center gap-4">
                <View className="relative">
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
                    }}
                    style={{ width: 68, height: 68, borderRadius: 34 }}
                    className="border-2 border-indigo-600"
                  />
                  <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 items-center justify-center border-2 border-white shadow-xs">
                    <Sparkles size={11} color="#ffffff" />
                  </View>
                </View>

                <View className="flex-1">
                  <Text
                    style={{ fontFamily: 'Inter_700Bold' }}
                    className="text-[19px] text-zinc-900 mb-0.5"
                  >
                    {displayName}
                  </Text>
                  <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-[13px] text-zinc-500 mb-2"
                  >
                    {displayEmail}
                  </Text>

                  <View className="flex-row items-center gap-1.5 self-start bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    <Award size={12} color="#4f46e5" />
                    <Text
                      style={{ fontFamily: 'Inter_700Bold' }}
                      className="text-[11px] text-indigo-700 uppercase"
                    >
                      B1 Intermediate Learner
                    </Text>
                  </View>
                </View>
              </View>

              {/* Quick Stats Grid */}
              <View className="mt-4 pt-4 border-t border-zinc-100 flex-row justify-around">
                <View className="items-center">
                  <View className="flex-row items-center gap-1">
                    <Flame size={15} color="#ea580c" fill="#ea580c" />
                    <Text
                      style={{ fontFamily: 'Inter_700Bold' }}
                      className="text-[16px] text-zinc-900"
                    >
                      12
                    </Text>
                  </View>
                  <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-[11px] text-zinc-500 mt-0.5"
                  >
                    Day Streak
                  </Text>
                </View>

                <View className="w-[1px] h-8 bg-zinc-200 self-center" />

                <View className="items-center">
                  <Text
                    style={{ fontFamily: 'Inter_700Bold' }}
                    className="text-[16px] text-zinc-900"
                  >
                    88%
                  </Text>
                  <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-[11px] text-zinc-500 mt-0.5"
                  >
                    Avg Fluency
                  </Text>
                </View>

                <View className="w-[1px] h-8 bg-zinc-200 self-center" />

                <View className="items-center">
                  <Text
                    style={{ fontFamily: 'Inter_700Bold' }}
                    className="text-[16px] text-zinc-900"
                  >
                    184
                  </Text>
                  <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-[11px] text-zinc-500 mt-0.5"
                  >
                    Words Learned
                  </Text>
                </View>
              </View>
            </View>

            {/* Language & Mentor Section */}
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className="text-[13px] text-zinc-400 uppercase tracking-wider ml-1 mb-2"
            >
              Learning Profile
            </Text>
            <View className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden mb-5">
              {/* Native Language Item */}
              <TouchableOpacity
                onPress={() => navigateTo('/(public)/native-language')}
                activeOpacity={0.7}
                className="p-4 flex-row items-center justify-between border-b border-zinc-100"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center">
                    <Globe size={20} color="#d97706" />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                      className="text-[15px] text-zinc-900"
                    >
                      Native Language
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular' }}
                      className="text-[13px] text-zinc-500"
                    >
                      {nativeLang}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#a1a1aa" />
              </TouchableOpacity>

              {/* Target Language Item */}
              <TouchableOpacity
                onPress={() => navigateTo('/(public)/learning-language')}
                activeOpacity={0.7}
                className="p-4 flex-row items-center justify-between border-b border-zinc-100"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
                    <Target size={20} color="#4f46e5" />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                      className="text-[15px] text-zinc-900"
                    >
                      Learning Language
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular' }}
                      className="text-[13px] text-zinc-500"
                    >
                      {learningLang}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#a1a1aa" />
              </TouchableOpacity>

              {/* Mentor Item */}
              <TouchableOpacity
                onPress={() => navigateTo('/(public)/mentor-selection')}
                activeOpacity={0.7}
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center">
                    <Bot size={20} color="#059669" />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                      className="text-[15px] text-zinc-900"
                    >
                      Assigned Mentor
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular' }}
                      className="text-[13px] text-zinc-500"
                    >
                      {mentor}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Quick Preferences */}
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className="text-[13px] text-zinc-400 uppercase tracking-wider ml-1 mb-2"
            >
              Session Settings
            </Text>
            <View className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden mb-6">
              <View className="p-4 flex-row items-center justify-between border-b border-zinc-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center">
                    <Bell size={20} color="#2563eb" />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                      className="text-[15px] text-zinc-900"
                    >
                      Daily Practice Reminders
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular' }}
                      className="text-[12px] text-zinc-500"
                    >
                      8:00 PM evening prompt
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="p-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center">
                    <Volume2 size={20} color="#7c3aed" />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                      className="text-[15px] text-zinc-900"
                    >
                      Slow Speech Mode
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular' }}
                      className="text-[12px] text-zinc-500"
                    >
                      Mentor speaks 20% slower
                    </Text>
                  </View>
                </View>
                <Switch
                  value={slowAudioEnabled}
                  onValueChange={setSlowAudioEnabled}
                  trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            {/* Logout Action Button */}
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              style={{ height: 56 }}
              className="w-full bg-rose-50 border border-rose-200/90 rounded-2xl flex-row items-center justify-center active:bg-rose-100 mb-2 shadow-xs"
            >
              <LogOut size={20} color="#dc2626" className="mr-2" />
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className="text-[16px] text-rose-600 font-bold"
              >
                Log Out of Account
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
