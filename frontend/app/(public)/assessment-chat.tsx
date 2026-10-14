import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { assessmentService } from '../../services/assessmentService';
import { speechService } from '../../services/speechService';
import { ArrowLeft, Mic, Send, Square, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../../components/ui/BackButton';

export default function AssessmentChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguageName, nativeLanguageName, mentorName, setAssessmentResult } = useOnboardingStore();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';
  const mentor = mentorName || 'Sophie';

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(public)/mentor-selection');
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (text) {
      if (isRecording) {
        speechService.stopSpeechRecognition();
        setIsRecording(false);
      }
      // Submit assessment answer to backend
      assessmentService.submitAssessment([{ questionId: 'q1', text }]).then((res) => {
        if (res) {
          setAssessmentResult({
            overallScore: res.overallScore,
            cefrLevel: res.cefrLevel,
            scores: res.scores,
            strengths: res.strengths,
            weaknesses: res.weaknesses,
            estimatedFluencyTime: '3-4 Months',
            recommendedDailyTime: '15 mins/day',
          });
        }
      });
      router.push('/(public)/assessment-result');
      setInputText('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      speechService.stopSpeechRecognition();
      setIsRecording(false);
    } else {
      const started = speechService.startSpeechRecognition({
        onResult: (transcript) => {
          setInputText(transcript);
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
      if (started) {
        setIsRecording(true);
      } else {
        setIsRecording(true);
        setTimeout(() => {
          setInputText('I want to improve my daily speaking for job interviews and travel');
          setIsRecording(false);
        }, 2000);
      }
    }
  };

  const quickReplies = [
    'For travel & exploration',
    'For job & business career',
    'Daily conversations & friends',
    'To crack exams & IELTS',
  ];

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header Bar with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/assessment-intro" />


        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            AI Level Assessment
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
            {targetLang} • Guided in {nativeLang}
          </Text>
        </View>

        <View className="flex-col items-end gap-1">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-600 uppercase">
            Step 1 of 5
          </Text>
          <View className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <View className="w-[20%] h-full bg-indigo-600 rounded-full" />
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mentor Welcome Bubble */}
        <Animated.View entering={FadeInUp.duration(500).delay(100)} className="flex-col max-w-[88%] mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden bg-white shadow-sm">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
                }}
                className="w-full h-full"
              />
            </View>
            <View className="flex-row items-center gap-1.5">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-900">
                {mentor}
              </Text>
              <View className="bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/60">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-indigo-700">
                  AI TUTOR
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-4.5 rounded-2xl rounded-tl-sm border border-zinc-200/70 shadow-sm shadow-black/[0.02]">
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[15px] leading-[23px] text-zinc-800">
              Namaste & Hello! I'm <Text style={{ fontFamily: 'Inter_700Bold', color: '#4f46e5' }}>{mentor}</Text>.
              {'\n\n'}
              I'm excited to help you master <Text style={{ fontFamily: 'Inter_700Bold' }}>{targetLang}</Text>! Whenever you get stuck, I will explain concepts and grammar in <Text style={{ fontFamily: 'Inter_700Bold', color: '#059669' }}>{nativeLang}</Text>.
              {'\n\n'}
              To kick off our short check-in, tell me: <Text style={{ fontFamily: 'Inter_600SemiBold' }}>What is your main goal for learning {targetLang}?</Text>
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400 ml-2 mt-1.5">
            Delivered • Just now
          </Text>
        </Animated.View>

        {/* Suggestion pill */}
        <Animated.View entering={FadeInUp.duration(500).delay(300)} className="items-center my-3">
          <View className="px-3.5 py-1.5 bg-white rounded-full flex-row items-center gap-1.5 border border-zinc-200/80 shadow-sm shadow-black/[0.02]">
            <Sparkles size={13} color="#4f46e5" />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-zinc-600">
              Choose a quick answer or speak into the mic
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Input Area with Keyboard Avoidance & Safe Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="w-full bg-[#F2F2F7]/95 border-t border-zinc-200/80 pt-3 z-40"
      >
        {/* Quick Replies Carousel */}
        <View className="mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {quickReplies.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setInputText(reply)}
                className="px-4 py-2 bg-white border border-zinc-200/70 rounded-full shadow-sm shadow-black/[0.02]"
              >
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-zinc-800">
                  {reply}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Input Bar */}
        <View className="px-5">
          <View
            style={{ minHeight: 56 }}
            className="flex-row items-center gap-2.5 bg-white rounded-2xl p-2 px-3.5 border border-zinc-200/80 shadow-sm"
          >
            <TouchableOpacity
              onPress={toggleRecording}
              activeOpacity={0.8}
              style={{ width: 42, height: 42 }}
              className={`rounded-xl items-center justify-center shadow-xs ${
                isRecording ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
            >
              {isRecording ? (
                <Square color="#ffffff" size={18} fill="#ffffff" />
              ) : (
                <Mic color="#ffffff" size={20} />
              )}
            </TouchableOpacity>

            <TextInput
              className="flex-1 h-12 text-[16px] text-zinc-900"
              placeholder={`Answer in ${targetLang} or ${nativeLang}...`}
              placeholderTextColor="#8e8e93"
              value={inputText}
              onChangeText={setInputText}
              style={{ fontFamily: 'Inter_400Regular' }}
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.7}
              style={{ width: 42, height: 42 }}
              className={`rounded-xl items-center justify-center ${
                inputText.trim() ? 'bg-indigo-600' : 'bg-zinc-100'
              }`}
              disabled={!inputText.trim()}
            >
              <Send color={inputText.trim() ? '#ffffff' : '#a1a1aa'} size={19} />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}
