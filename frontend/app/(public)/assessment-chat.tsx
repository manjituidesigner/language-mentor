import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ArrowLeft, Mic, Send, Square } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssessmentChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguage } = useOnboardingStore();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/assessment-intro');
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Navigate to results screen after user "answers" the assessment question
      router.push('/(public)/assessment-result');
      setInputText('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const quickReplies = ['For travel', 'For work', 'For fun', 'Improve grades'];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Background Overlay */}
      <View className="absolute inset-0 bg-[#fcf8ff]" style={{ zIndex: -10 }}>
        <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e2dfff]/20 rounded-full -mt-24 -mr-24 blur-3xl" />
      </View>

      {/* TopAppBar */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="w-full pb-4 flex-row items-center justify-between px-5 bg-surface/80 border-b border-outline-variant/20 z-50">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-2 -ml-2 hit-slop-10 flex-row items-center">
            <ArrowLeft color="#3f3bbd" size={22} />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[18px] text-primary ml-1">Assessment</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-col items-end gap-1.5">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-on-surface-variant uppercase tracking-wider">
            Question 1 of 10
          </Text>
          <View className="w-24 h-1.5 bg-[#eae6f2] rounded-full overflow-hidden">
            <View className="w-[10%] h-full bg-primary rounded-full" />
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Mentor Welcome Message Group */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)} className="flex-col max-w-[85%] mb-6">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-full border-2 border-primary-container p-[2px]">
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }} 
                className="w-full h-full rounded-full" 
              />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-primary uppercase tracking-wider">
              Sophie • Mentor
            </Text>
          </View>
          
          <View className="bg-[#f5f2fd] p-4 rounded-2xl rounded-tl-sm border border-outline-variant/20 shadow-sm shadow-black/5">
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[16px] leading-[24px] text-on-surface">
              Hi! I'm Sophie. To get started, I'd love to hear a bit about why you want to learn <Text style={{ fontFamily: 'Inter_700Bold', color: '#3f3bbd' }}>{learningLanguage || 'Spanish'}</Text>. You can type your answer or tap the microphone to speak!
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-on-surface-variant/60 ml-2 mt-2">
            Delivered • Just now
          </Text>
        </Animated.View>

        {/* System Prompt */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} className="items-center my-4">
          <View className="px-4 py-2 bg-[#eae6f2]/50 rounded-full">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-on-surface-variant">
              Choose an option or start speaking
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="w-full bg-[#fcf8ff]/90 border-t border-outline-variant/20 pb-8 pt-3 z-40">
        {/* Quick Replies */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 16 }}>
            {quickReplies.map((reply, idx) => (
              <TouchableOpacity 
                key={idx} 
                activeOpacity={0.7}
                onPress={() => setInputText(reply)}
                className="px-5 py-2.5 bg-white border border-outline-variant/40 rounded-full shadow-sm shadow-black/5"
              >
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[14px] text-on-surface">{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Input Bar */}
        <View className="px-5">
          <View className="flex-row items-center gap-3 bg-[#f5f2fd] rounded-full p-1.5 border border-outline-variant/30">
            <TouchableOpacity 
              onPress={toggleRecording}
              activeOpacity={0.8}
              className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${isRecording ? 'bg-error' : 'bg-primary'}`}
            >
              {isRecording ? <Square color="#ffffff" size={18} fill="#ffffff" /> : <Mic color="#ffffff" size={20} />}
            </TouchableOpacity>

            <TextInput 
              className="flex-1 h-11 text-[16px] text-on-surface"
              placeholder="Tell Sophie your goals..."
              placeholderTextColor="#777585"
              value={inputText}
              onChangeText={setInputText}
              style={{ fontFamily: 'Inter_400Regular' }}
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity 
              onPress={handleSend}
              activeOpacity={0.7}
              className="w-11 h-11 items-center justify-center"
              disabled={!inputText.trim()}
            >
              <Send color={inputText.trim() ? "#3f3bbd" : "#c7c4d6"} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
