import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { sessionService } from '../../services/sessionService';
import { speechService } from '../../services/speechService';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MessageSquare,
  Turtle,
  RotateCcw,
  Languages,
  Sparkles,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

export default function VoiceCallScreen() {
  const router = useRouter();
  const { topic: queryTopic } = useLocalSearchParams<{ topic?: string }>();
  const activeTopic = queryTopic || 'Conversational Fluency';
  const insets = useSafeAreaInsets();
  const { mentorName, learningLanguageName, nativeLanguageName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';

  const [sessionId] = useState(() => 'call-session-' + Date.now());
  const [callState, setCallState] = useState<'connecting' | 'mentor_speaking' | 'listening' | 'ai_thinking'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const [lastMentorText, setLastMentorText] = useState(`Hello! I'm ${mentor}. I'm so excited to practice speaking ${targetLang} with you today! How has your day been going?`);
  const [lastMentorTranslation, setLastMentorTranslation] = useState(`नमस्ते! मैं ${mentor} हूँ। आज आपके साथ ${targetLang} बोलने का अभ्यास करने के लिए बहुत उत्साहित हूँ! आपका दिन कैसा चल रहा है?`);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [detectedCorrection, setDetectedCorrection] = useState<string | null>(null);

  // Audio wave pulse animation
  const waveScale = useSharedValue(1);

  useEffect(() => {
    waveScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);

  const animatedWaveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: callState === 'mentor_speaking' || callState === 'listening' ? waveScale.value : 1 }],
  }));

  // Call timer counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Call & Mentor Greeting
  useEffect(() => {
    sessionService.startSession({
      mentorName: mentor,
      sessionType: 'voice',
      topic: activeTopic,
    });

    // 1. Simulate fast connection chime and start mentor greeting
    const startTimer = setTimeout(() => {
      speakMentorGreeting(lastMentorText);
    }, 1200);

    return () => {
      clearTimeout(startTimer);
      speechService.stopSpeaking();
      speechService.stopSpeechRecognition();
    };
  }, [mentor]);

  const speakMentorGreeting = (text: string) => {
    setCallState('mentor_speaking');
    const rateModifier = isSlowMode ? 0.75 : 1.0;

    speechService.speakMentorResponse(text, mentor, {
      rateModifier,
      onDone: () => {
        startListeningToUser();
      },
      onError: () => {
        startListeningToUser();
      },
    });
  };

  const startListeningToUser = () => {
    if (isMuted) return;
    setCallState('listening');
    setUserSpokenText('');

    const started = speechService.startSpeechRecognition({
      onResult: (transcript, isFinal) => {
        setUserSpokenText(transcript);
        if (isFinal || transcript.split(' ').length >= 6) {
          // Send user turn
          handleUserSpeechFinished(transcript);
        }
      },
      onError: () => {
        // Fallback simulation if Speech Recognition is not available on device
        setTimeout(() => {
          if (callState === 'listening') {
            const fallbackTranscript = 'I had a really busy morning, but I am happy to speak now';
            setUserSpokenText(fallbackTranscript);
            handleUserSpeechFinished(fallbackTranscript);
          }
        }, 3500);
      },
      onEnd: () => {
        // Speech ended
      },
    });

    if (!started) {
      // Fallback timer for demo testing
      setTimeout(() => {
        const fallbackTranscript = 'I had a great morning at work and walked in the park';
        setUserSpokenText(fallbackTranscript);
        handleUserSpeechFinished(fallbackTranscript);
      }, 4000);
    }
  };

  const handleUserSpeechFinished = async (spokenText: string) => {
    if (!spokenText.trim() || callState === 'ai_thinking') return;
    speechService.stopSpeechRecognition();
    setCallState('ai_thinking');

    try {
      const data = await sessionService.sendMessage(sessionId, {
        content: spokenText,
        mentorName: mentor,
        targetLang,
        nativeLang,
        topic: activeTopic,
      });

      if (data) {
        const reply = data.mentorMessage?.content || `That sounds great! Tell me more about that.`;
        const translation = data.mentorMessage?.translation || '';
        setLastMentorText(reply);
        setLastMentorTranslation(translation);

        if (data.mentorMessage?.corrections) {
          const c = data.mentorMessage.corrections;
          setDetectedCorrection(`Quick tip: Say "${c.corrected}" instead of "${c.original}"`);
          setTimeout(() => setDetectedCorrection(null), 5000);
        }

        // Mentor speaks reply
        speakMentorGreeting(reply);
      } else {
        const fallback = `I love that! When you think about your daily goals, what inspires you most?`;
        setLastMentorText(fallback);
        speakMentorGreeting(fallback);
      }
    } catch {
      const fallback = `That's wonderful! Tell me more about what you want to do next.`;
      setLastMentorText(fallback);
      speakMentorGreeting(fallback);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const showQuickNudge = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleToggleSlow = () => {
    const newSlow = !isSlowMode;
    setIsSlowMode(newSlow);
    showQuickNudge(newSlow ? 'Speaking 25% slower' : 'Standard speech speed');
  };

  const handleRepeat = () => {
    showQuickNudge(`"${mentor} is repeating"`);
    speakMentorGreeting(lastMentorText);
  };

  const handleTranslate = () => {
    showQuickNudge(`Explaining in ${nativeLang}`);
    speechService.speakMentorResponse(lastMentorTranslation, mentor, {
      language: 'hi-IN',
      onDone: () => startListeningToUser(),
      onError: () => startListeningToUser(),
    });
  };

  const handleEndCall = async () => {
    await speechService.stopSpeaking();
    await speechService.stopSpeechRecognition();
    await sessionService.endSession(sessionId, Math.max(callSeconds, 60));
    router.push('/(private)/session-summary');
  };

  const handleSwitchToChat = async () => {
    await speechService.stopSpeaking();
    await speechService.stopSpeechRecognition();
    router.push('/(private)/chat-session');
  };

  return (
    <View className="flex-1 bg-zinc-950 relative justify-between">
      {/* Top Header */}
      <View
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="w-full px-6 flex-row items-center justify-between z-20"
      >
        <TouchableOpacity
          onPress={handleSwitchToChat}
          className="px-3.5 py-1.5 rounded-full bg-white/10 flex-row items-center gap-1.5 border border-white/10"
        >
          <MessageSquare size={14} color="#ffffff" />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-white">
            Switch to Chat
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
          <View className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-emerald-300">
            {formatTimer(callSeconds)}
          </Text>
        </View>
      </View>

      {/* Center Caller & Waveform Section */}
      <View className="items-center justify-center my-auto px-6">
        {/* Pulsing Ripple Rings */}
        <View className="relative items-center justify-center mb-6">
          <Animated.View
            style={[
              animatedWaveStyle,
              {
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: callState === 'mentor_speaking' ? 'rgba(79, 70, 229, 0.35)' : 'rgba(16, 185, 129, 0.25)',
              },
            ]}
          />
          <View
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: callState === 'mentor_speaking' ? 'rgba(79, 70, 229, 0.45)' : 'rgba(16, 185, 129, 0.35)',
            }}
          />

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
            }}
            className="w-36 h-36 rounded-full border-4 border-indigo-400/80 shadow-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Name & Active State */}
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[28px] text-white mb-1 tracking-tight">
          {mentor}
        </Text>

        <View className="flex-row items-center gap-2 mb-3">
          <View
            className={`w-2 h-2 rounded-full ${
              callState === 'mentor_speaking'
                ? 'bg-indigo-400 animate-pulse'
                : callState === 'listening'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-indigo-300">
            {callState === 'mentor_speaking'
              ? `${mentor} is speaking...`
              : callState === 'listening'
              ? 'Listening to you... Speak now'
              : 'Thinking & evaluating...'}
          </Text>
        </View>

        {/* Live Spoken Subtitle Box */}
        <View className="w-full max-w-[340px] p-3.5 bg-white/10 rounded-2xl border border-white/15 my-2">
          {callState === 'listening' ? (
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-emerald-300 text-center leading-snug">
              🎙️ {userSpokenText ? `"${userSpokenText}"` : 'Listening... Speak in English'}
            </Text>
          ) : (
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] text-zinc-200 text-center leading-snug">
              "{lastMentorText}"
            </Text>
          )}
        </View>

        {/* Real-time Inline Slip Nudge */}
        {detectedCorrection && (
          <Animated.View entering={FadeIn} className="mt-2 px-3.5 py-1.5 bg-amber-500/20 border border-amber-400/50 rounded-full flex-row items-center gap-1.5">
            <Sparkles size={13} color="#f59e0b" />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-amber-300">
              {detectedCorrection}
            </Text>
          </Animated.View>
        )}

        {/* Live Feedback Toast */}
        {feedbackToast && (
          <View className="mt-3 px-4 py-2 bg-indigo-600 rounded-full shadow-lg flex-row items-center gap-1.5">
            <Sparkles size={14} color="#ffffff" />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-white">
              {feedbackToast}
            </Text>
          </View>
        )}
      </View>

      {/* Floating Call Action Modifiers */}
      <View className="px-6 mb-8 flex-col gap-5 z-20">
        <View className="flex-row items-center justify-center gap-3">
          <TouchableOpacity
            onPress={handleToggleSlow}
            activeOpacity={0.8}
            className={`px-3.5 py-2 rounded-full flex-row items-center gap-1.5 border ${
              isSlowMode ? 'bg-amber-500/30 border-amber-400' : 'bg-white/10 border-white/10'
            }`}
          >
            <Turtle size={15} color={isSlowMode ? '#f59e0b' : '#ffffff'} />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-white">
              Slower
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRepeat}
            activeOpacity={0.8}
            className="px-3.5 py-2 rounded-full bg-white/10 flex-row items-center gap-1.5 border border-white/10"
          >
            <RotateCcw size={15} color="#ffffff" />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-white">
              Repeat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTranslate}
            activeOpacity={0.8}
            className="px-3.5 py-2 rounded-full bg-white/10 flex-row items-center gap-1.5 border border-white/10"
          >
            <Languages size={15} color="#ffffff" />
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-white">
              {nativeLang}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Call Hardware Controls */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          className="flex-row items-center justify-around"
        >
          {/* Mute Button */}
          <TouchableOpacity
            onPress={() => setIsMuted(!isMuted)}
            activeOpacity={0.8}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            className={`items-center justify-center ${
              isMuted ? 'bg-zinc-700' : 'bg-white/15'
            }`}
          >
            {isMuted ? <MicOff size={24} color="#ef4444" /> : <Mic size={24} color="#ffffff" />}
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity
            onPress={handleEndCall}
            activeOpacity={0.85}
            style={{ width: 72, height: 72, borderRadius: 36 }}
            className="bg-rose-600 items-center justify-center shadow-2xl shadow-rose-600/50 active:scale-95"
          >
            <PhoneOff size={32} color="#ffffff" />
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            activeOpacity={0.8}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            className={`items-center justify-center ${
              isSpeakerOn ? 'bg-indigo-600' : 'bg-white/15'
            }`}
          >
            {isSpeakerOn ? <Volume2 size={24} color="#ffffff" /> : <VolumeX size={24} color="#ffffff" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
