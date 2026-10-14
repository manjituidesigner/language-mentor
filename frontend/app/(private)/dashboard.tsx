import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, MessageCircle, Play, Bookmark, Star, Home, GraduationCap, Bot, BarChart2, BookOpen, ChevronRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileModal } from '../../components/ProfileModal';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 60; // 12/20
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* TopAppBar */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full flex-row items-center justify-between px-5 pb-3 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50"
      >
        <View>
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[22px] text-zinc-900 tracking-tight">
            Lumina Mentor
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
            Welcome back, Manjit
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsProfileOpen(true)}
          activeOpacity={0.8}
          style={{ width: 44, height: 44 }}
          className="rounded-full border-2 border-indigo-600 overflow-hidden bg-white shadow-sm items-center justify-center active:scale-95"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>


      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View className="flex-col gap-3.5 mb-6">
          {/* Daily Goal Card */}
          <View className="bg-white rounded-2xl p-5 flex-row items-center justify-between shadow-sm shadow-black/[0.02] border border-zinc-200/70">
            <View className="flex-col gap-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
                Daily Goal
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mb-1.5">
                Keep the streak alive!
              </Text>
              <View className="flex-row items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md self-start border border-amber-100/60">
                <Flame color="#d97706" size={15} fill="#d97706" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-amber-700">
                  12 Day Streak
                </Text>
              </View>
            </View>

            {/* Circular Progress */}
            <View className="relative items-center justify-center w-22 h-22">
              <Svg width="88" height="88" viewBox="0 0 96 96" className="-rotate-90">
                <Circle cx="48" cy="48" r={radius} stroke="#f4f4f5" strokeWidth={strokeWidth} fill="transparent" />
                <Circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#4f46e5"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </Svg>
              <View className="absolute items-center justify-center">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[19px] text-zinc-900 leading-none">
                  12
                </Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[9px] text-zinc-400 uppercase mt-0.5">
                  / 20m
                </Text>
              </View>
            </View>
          </View>

          {/* Your Mentor Card */}
          <View className="bg-white rounded-2xl p-4 border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3.5">
            <View className="relative w-12 h-12">
              <View className="w-12 h-12 rounded-full border border-zinc-200 overflow-hidden shadow-xs bg-zinc-100">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 mb-0.5">
                    Mentor Sophie
                  </Text>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-emerald-600">
                      Online & ready
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/(private)/learning-mode')}
                  activeOpacity={0.85}
                  className="h-9 px-3.5 bg-indigo-600 rounded-xl flex-row items-center gap-1.5 active:scale-[0.98] shadow-xs"
                >
                  <MessageCircle color="#ffffff" size={14} fill="#ffffff" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-white">
                    Start Chat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Current Course Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900 mb-3 px-1">
            Current Module
          </Text>
          <View className="rounded-2xl bg-indigo-600 overflow-hidden relative shadow-md shadow-indigo-600/20">
            {/* Background Image overlay */}
            <View className="absolute inset-0 opacity-25">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="relative p-5 flex-col">
              <View className="self-start bg-white/20 px-2.5 py-1 rounded-md mb-2.5">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white uppercase tracking-wider">
                  Module 4 of 12
                </Text>
              </View>

              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[24px] text-white leading-tight mb-1.5">
                Business Basics
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[20px] text-white/90 mb-4 max-w-[280px]">
                Master corporate introductions, polite inquiries, and elevator pitches.
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/(private)/learning-mode')}
                activeOpacity={0.85}
                style={{ height: 52 }}
                className="bg-white rounded-2xl flex-row items-center justify-center gap-2 shadow-sm active:scale-[0.98] mt-1"
              >
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-indigo-600">
                  Continue Lesson
                </Text>
                <Play color="#4f46e5" size={17} fill="#4f46e5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended for You */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
              Recommended Topics
            </Text>
            <TouchableOpacity onPress={() => router.push('/(private)/learning-mode')}>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-indigo-600">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5 px-5"
            contentContainerStyle={{ paddingRight: 40, gap: 14 }}
          >
            {/* Card 1 */}
            <TouchableOpacity
              onPress={() => router.push('/(private)/learning-mode')}
              activeOpacity={0.8}
              className="w-[260px] bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/80"
            >
              <View className="h-32 relative bg-zinc-100">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-black/60 px-2.5 py-1 rounded-full">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-white">
                    15 MINS
                  </Text>
                </View>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-1">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                    Mastering Tenses
                  </Text>
                  <Bookmark color="#4f46e5" size={18} fill="#4f46e5" />
                </View>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mb-3">
                  Intermediate • Grammar Focus
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Star color="#f59e0b" size={15} fill="#f59e0b" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-800">
                    4.9
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-400">
                    (1.2k learners)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity
              onPress={() => router.push('/(private)/learning-mode')}
              activeOpacity={0.8}
              className="w-[260px] bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/80"
            >
              <View className="h-32 relative bg-zinc-100">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-black/60 px-2.5 py-1 rounded-full">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-white">
                    10 MINS
                  </Text>
                </View>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-1">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-zinc-900">
                    Cafe Conversations
                  </Text>
                  <Bookmark color="#a1a1aa" size={18} />
                </View>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-zinc-500 mb-3">
                  Beginner • Speaking Drill
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Star color="#f59e0b" size={15} fill="#f59e0b" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-800">
                    4.8
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-400">
                    (850 learners)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modern iOS Bottom Nav Bar */}
      <View
        className="absolute bottom-0 w-full bg-white/95 border-t border-zinc-200/80 flex-row justify-around items-center pt-2.5 shadow-xl shadow-black/5"
        style={{ paddingBottom: Math.max(insets.bottom, 16), height: 68 + Math.max(insets.bottom, 16) }}
      >
        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-16 py-1">
          <Home color="#4f46e5" size={24} strokeWidth={2.3} />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-indigo-600">
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(private)/learning-mode')}
          activeOpacity={0.7}
          className="flex-col items-center justify-center gap-1 w-16 py-1"
        >
          <GraduationCap color="#71717a" size={24} strokeWidth={2} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-500">
            Lessons
          </Text>
        </TouchableOpacity>

        {/* Central Action Button */}
        <TouchableOpacity
          onPress={() => router.push('/(private)/learning-mode')}
          activeOpacity={0.85}
          style={{ width: 56, height: 56 }}
          className="bg-indigo-600 rounded-2xl items-center justify-center shadow-lg shadow-indigo-600/35 active:scale-95 -mt-5"
        >
          <Bot color="#ffffff" size={26} strokeWidth={2.3} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(private)/progress')}
          activeOpacity={0.7}
          className="flex-col items-center justify-center gap-1 w-16 py-1"
        >
          <BarChart2 color="#71717a" size={24} strokeWidth={2} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-500">
            Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(private)/notebook')}
          activeOpacity={0.7}
          className="flex-col items-center justify-center gap-1 w-16 py-1"
        >
          <BookOpen color="#71717a" size={24} strokeWidth={2} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-500">
            Notebook
          </Text>
        </TouchableOpacity>
      </View>

      {/* Account & Profile Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </View>
  );
}
