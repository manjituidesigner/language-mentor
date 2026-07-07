import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, MessageCircle, Play, Bookmark, Star, Home, GraduationCap, Bot, BarChart2, User, ChevronRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 60; // 12/20
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]" edges={['top', 'left', 'right']}>
      {/* TopAppBar */}
      <View className="w-full flex-row items-center justify-between px-5 pb-4 pt-2 border-b border-outline-variant/20 bg-[#fcf8ff]">
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[22px] text-primary tracking-tight">Lumina Mentor</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden active:scale-95 transition-transform">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* Top Section */}
        <View className="flex-col gap-4 mb-8">
          {/* Daily Goal Card */}
          <View className="bg-white rounded-2xl p-5 flex-row items-center justify-between shadow-sm shadow-black/5 border border-white">
            <View className="flex-col gap-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] text-on-surface">Daily Goal</Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant mb-1">Keep the streak alive!</Text>
              <View className="flex-row items-center gap-1.5">
                <Flame color="#3f3bbd" size={16} fill="#3f3bbd" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-primary">12 Day Streak</Text>
              </View>
            </View>
            
            {/* Circular Progress */}
            <View className="relative items-center justify-center w-24 h-24">
              <Svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                <Circle cx="48" cy="48" r={radius} stroke="#e4e1ec" strokeWidth={strokeWidth} fill="transparent" />
                <Circle 
                  cx="48" cy="48" r={radius} 
                  stroke="#3f3bbd" strokeWidth={strokeWidth} 
                  fill="transparent" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </Svg>
              <View className="absolute items-center justify-center">
                <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[20px] text-on-surface leading-none">12</Text>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-on-surface-variant uppercase mt-0.5">/ 20m</Text>
              </View>
            </View>
          </View>

          {/* Your Mentor Section */}
          <View className="bg-[#e7e4ff]/50 rounded-2xl p-4 border border-[#5856d6]/20 flex-row items-center gap-4">
            <View className="relative w-14 h-14">
              <View className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-sm shadow-black/10">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2px] border-white" />
            </View>
            
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-on-surface mb-0.5">Mentor Sophie</Text>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-green-600">Ready to chat</Text>
                  </View>
                </View>
                
                <TouchableOpacity className="bg-primary px-3 py-1.5 rounded-full flex-row items-center gap-1.5 active:scale-95 shadow-sm shadow-primary/20">
                  <MessageCircle color="#ffffff" size={14} fill="#ffffff" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white">START CHAT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Current Course Section */}
        <View className="mb-8">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-on-surface mb-4">Current Course</Text>
          <View className="rounded-[24px] bg-primary overflow-hidden relative shadow-lg shadow-primary/20">
            {/* Background Image overlay */}
            <View className="absolute inset-0 opacity-40">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop' }} 
                className="w-full h-full"
                resizeMode="cover"
                style={{ opacity: 0.6 }}
              />
              <View className="absolute inset-0 bg-[#3f3bbd]/40" />
            </View>
            
            <View className="relative p-6 flex-col">
              <View className="self-start bg-white/20 px-3 py-1.5 rounded-full mb-3">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white uppercase tracking-widest">Module 4 of 12</Text>
              </View>
              
              <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[28px] text-white leading-tight mb-2">Business Basics</Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[15px] leading-[22px] text-white/90 mb-5 max-w-[260px]">
                Master the essentials of corporate introductions and elevator pitches.
              </Text>
              
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                  <View className="flex-row">
                    <Image source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }} className="w-8 h-8 rounded-full border-2 border-[#3f3bbd] -mr-3" />
                    <Image source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }} className="w-8 h-8 rounded-full border-2 border-[#3f3bbd] z-10" />
                    <View className="w-8 h-8 rounded-full bg-primary-container border-2 border-[#3f3bbd] items-center justify-center -ml-3 z-20">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-white">+12k</Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-white/80 ml-3">learning this week</Text>
                </View>
              </View>

              <TouchableOpacity className="bg-white px-6 py-3.5 rounded-full flex-row items-center justify-center gap-1.5 mt-6 shadow-md shadow-black/10 active:scale-95">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-primary">Continue Lesson</Text>
                <Play color="#3f3bbd" size={16} fill="#3f3bbd" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended for You */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[20px] text-on-surface">Recommended for You</Text>
            <TouchableOpacity>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5" contentContainerStyle={{ paddingRight: 40, gap: 16 }}>
            {/* Card 1 */}
            <View className="w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5 border border-white">
              <View className="h-32 relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white">15 MINS</Text>
                </View>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-1">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-on-surface">Mastering Tenses</Text>
                  <Bookmark color="#3f3bbd" size={18} fill="#3f3bbd" />
                </View>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant mb-3">Intermediate • Grammar Focus</Text>
                <View className="flex-row items-center gap-1.5">
                  <Star color="#f59e0b" size={14} fill="#f59e0b" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-on-surface">4.9</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-on-surface-variant">(1.2k reviews)</Text>
                </View>
              </View>
            </View>

            {/* Card 2 */}
            <View className="w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5 border border-white">
              <View className="h-32 relative">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop' }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white">10 MINS</Text>
                </View>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-1">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[16px] text-on-surface">Cafe Conversations</Text>
                  <Bookmark color="#c7c4d6" size={18} />
                </View>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-on-surface-variant mb-3">Beginner • Real-world Speaking</Text>
                <View className="flex-row items-center gap-1.5">
                  <Star color="#f59e0b" size={14} fill="#f59e0b" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-on-surface">4.8</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-on-surface-variant">(850 reviews)</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View 
        className="absolute bottom-0 w-full bg-[#fcf8ff]/95 border-t border-outline-variant/10 flex-row justify-around items-end pt-3 shadow-[0px_-10px_20px_rgba(0,0,0,0.03)]"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-16">
          <Home color="#3f3bbd" size={24} fill="#3f3bbd" />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-primary">Home</Text>
          <View className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-16">
          <GraduationCap color="#777585" size={24} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">Lessons</Text>
        </TouchableOpacity>

        {/* Central Floating Action Button */}
        <View className="relative items-center justify-center -mt-8 w-16">
          <TouchableOpacity className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30">
            <Bot color="#ffffff" size={28} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-[9px] text-primary mt-2">AI MENTOR</Text>
        </View>

        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-16">
          <BarChart2 color="#777585" size={24} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center justify-center gap-1 w-16">
          <User color="#777585" size={24} />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-[#777585]">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
