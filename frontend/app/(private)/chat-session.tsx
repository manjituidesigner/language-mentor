import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { sessionService, PowerWordSuggestion } from '../../services/sessionService';
import { speechService } from '../../services/speechService';
import {
  Mic,
  Send,
  Square,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  PhoneCall,
  Clock,
  Lightbulb,
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { BackButton } from '../../components';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  translation?: string;
  correction?: {
    original: string;
    improved: string;
    explanation: string;
  };
  powerWords?: PowerWordSuggestion[];
  audioAvailable?: boolean;
}

export default function ChatSessionScreen() {
  const router = useRouter();
  const { topic: queryTopic } = useLocalSearchParams<{ topic?: string }>();
  const activeTopic = queryTopic || 'Daily Conversation';
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { mentorName, learningLanguageName, nativeLanguageName } = useOnboardingStore();

  const mentor = mentorName || 'Sophie';
  const targetLang = learningLanguageName || 'English';
  const nativeLang = nativeLanguageName || 'Hindi';

  const [sessionId] = useState(() => 'session-' + Date.now());
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [latestFluency, setLatestFluency] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I'm ${mentor}. Welcome to our practice on "${activeTopic}"! How was your day today? Did you do anything interesting?`,
      translation: `नमस्ते! मैं ${mentor} हूँ। "${activeTopic}" पर हमारे अभ्यास में आपका स्वागत है! आपका दिन कैसा रहा?`,
      audioAvailable: true,
    },
  ]);

  useEffect(() => {
    // Start session in backend
    sessionService.startSession({
      mentorName: mentor,
      sessionType: 'chat',
      topic: activeTopic,
    });

    return () => {
      speechService.stopSpeaking();
      speechService.stopSpeechRecognition();
    };
  }, [mentor]);

  const toggleTranslation = (id: string) => {
    setShowTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleVoiceDictation = () => {
    if (isListening) {
      speechService.stopSpeechRecognition();
      setIsListening(false);
    } else {
      const started = speechService.startSpeechRecognition({
        onResult: (transcript) => {
          setInputText(transcript);
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });

      if (started) {
        setIsListening(true);
      } else {
        // Fallback simulation for environments without Web Speech API
        setIsListening(true);
        setTimeout(() => {
          setInputText('I goed to the market yesterday and bought some fruits');
          setIsListening(false);
        }, 2200);
      }
    }
  };

  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      await speechService.stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msgId);
    await speechService.speakMentorResponse(text, mentor, {
      onDone: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null),
    });
  };

  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || isLoading) return;

    if (isListening) {
      speechService.stopSpeechRecognition();
      setIsListening(false);
    }

    const userMsgId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const data = await sessionService.sendMessage(sessionId, {
        content: textToSend,
        mentorName: mentor,
        targetLang,
        nativeLang,
        topic: activeTopic,
      });

      if (data) {
        if (data.fluencyScore) {
          setLatestFluency(data.fluencyScore);
        }

        // If there was a correction, attach it to the user's message
        if (data.mentorMessage?.corrections) {
          const c = data.mentorMessage.corrections;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === userMsgId
                ? {
                    ...m,
                    correction: {
                      original: c.original,
                      improved: c.corrected,
                      explanation: c.explanation,
                    },
                  }
                : m
            )
          );
        }

        // Add AI Mentor Reply
        const aiMsgContent = data.mentorMessage?.content || `That sounds wonderful! Let's continue practicing ${targetLang}.`;
        const aiReplyId = data.mentorMessage?.id || (Date.now() + 1).toString();
        const aiReply: ChatMessage = {
          id: aiReplyId,
          sender: 'ai',
          text: aiMsgContent,
          translation: data.mentorMessage?.translation,
          powerWords: data.suggestedPowerWords,
          audioAvailable: true,
        };
        setMessages((prev) => [...prev, aiReply]);

        // Auto-play mentor speech response
        handlePlayAudio(aiReplyId, aiMsgContent);
      } else {
        // Fallback response if offline
        const fallbackText = `That sounds wonderful! Conversing in ${targetLang} about daily routines is the quickest way to build natural fluency. What is your favorite part of the day?`;
        const aiReplyId = (Date.now() + 1).toString();
        const aiReply: ChatMessage = {
          id: aiReplyId,
          sender: 'ai',
          text: fallbackText,
          translation: `यह बहुत बढ़िया लगता है! दैनिक दिनचर्या पर बात करना प्रवाह बनाने का सबसे तेज़ तरीका है। आपके दिन का सबसे पसंदीदा हिस्सा कौन सा है?`,
          audioAvailable: true,
        };
        setMessages((prev) => [...prev, aiReply]);
        handlePlayAudio(aiReplyId, fallbackText);
      }
    } catch {
      const fallbackText = `Great thought! You expressed yourself clearly. What else happened today?`;
      const aiReplyId = (Date.now() + 1).toString();
      const aiReply: ChatMessage = {
        id: aiReplyId,
        sender: 'ai',
        text: fallbackText,
        translation: `बहुत बढ़िया विचार! आपने अपनी बात स्पष्ट रूप से व्यक्त की। आज और क्या हुआ?`,
        audioAvailable: true,
      };
      setMessages((prev) => [...prev, aiReply]);
      handlePlayAudio(aiReplyId, fallbackText);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handleEndSession = async () => {
    await speechService.stopSpeaking();
    await speechService.stopSpeechRecognition();
    await sessionService.endSession(sessionId, 240);
    router.push('/(private)/session-summary');
  };

  const handleSwitchToCall = () => {
    speechService.stopSpeaking();
    speechService.stopSpeechRecognition();
    router.push('/(private)/voice-call');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton onPress={handleEndSession} />

        {/* Mentor Info */}
        <View className="flex-row items-center gap-2.5">
          <View className="relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }}
              className="w-9 h-9 rounded-full border border-zinc-200 bg-white"
            />
            <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </View>
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900 leading-tight">
                {mentor}
              </Text>
              {latestFluency && (
                <View className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-emerald-700">
                    {latestFluency}%
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={10} color="#71717a" />
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
                Live AI Conversation
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleSwitchToCall}
            activeOpacity={0.8}
            className="w-9 h-9 rounded-full bg-white items-center justify-center border border-zinc-200/70 shadow-sm"
          >
            <PhoneCall size={16} color="#059669" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEndSession}
            activeOpacity={0.8}
            className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80"
          >
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-rose-600 uppercase">
              End
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          const isTranslated = !!showTranslations[msg.id];
          const isPlayingThis = playingMessageId === msg.id;

          return (
            <Animated.View
              key={msg.id}
              entering={FadeInUp.duration(400)}
              className={`mb-4 flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              {/* Message Bubble */}
              <View
                className={`max-w-[85%] p-4 rounded-2xl ${
                  isAI
                    ? 'bg-white rounded-tl-sm border border-zinc-200/70 shadow-sm shadow-black/[0.02]'
                    : 'bg-indigo-600 rounded-tr-sm shadow-sm shadow-indigo-600/20'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Inter_400Regular' }}
                  className={`text-[15px] leading-[22px] ${isAI ? 'text-zinc-800' : 'text-white'}`}
                >
                  {msg.text}
                </Text>

                {/* Subtitle Translation */}
                {isAI && isTranslated && msg.translation && (
                  <View className="mt-2.5 pt-2 border-t border-zinc-100">
                    <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-indigo-700 leading-snug">
                      {msg.translation}
                    </Text>
                  </View>
                )}

                {/* AI Audio & Tools Bar */}
                {isAI && (
                  <View className="flex-row items-center gap-3 pt-2.5 mt-2 border-t border-zinc-100">
                    <TouchableOpacity
                      onPress={() => handlePlayAudio(msg.id, msg.text)}
                      activeOpacity={0.7}
                      className="flex-row items-center gap-1.5"
                    >
                      {isPlayingThis ? (
                        <>
                          <VolumeX size={14} color="#dc2626" />
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-rose-600">
                            Stop
                          </Text>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} color="#4f46e5" />
                          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[11px] text-indigo-700">
                            Listen
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {msg.translation && (
                      <TouchableOpacity
                        onPress={() => toggleTranslation(msg.id)}
                        activeOpacity={0.7}
                        className="flex-row items-center gap-1"
                      >
                        <Languages size={14} color={isTranslated ? '#4f46e5' : '#71717a'} />
                        <Text
                          style={{ fontFamily: 'Inter_500Medium' }}
                          className={`text-[11px] ${isTranslated ? 'text-indigo-600' : 'text-zinc-500'}`}
                        >
                          {isTranslated ? 'Hide' : nativeLang}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Inline Grammar Correction Card */}
              {msg.correction && (
                <View className="max-w-[88%] mt-2 p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm shadow-amber-50">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Sparkles size={14} color="#d97706" />
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-amber-700 uppercase">
                      Smart Correction
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[13px] text-emerald-700 mb-1">
                    ✨ "{msg.correction.improved}"
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600 leading-[17px]">
                    {msg.correction.explanation}
                  </Text>
                </View>
              )}

              {/* Suggested Power Words Card */}
              {isAI && msg.powerWords && msg.powerWords.length > 0 && (
                <View className="max-w-[88%] mt-2 p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 shadow-xs">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Lightbulb size={13} color="#4f46e5" />
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-indigo-700 uppercase">
                      Level-Up Synonym
                    </Text>
                  </View>
                  {msg.powerWords.map((pw, i) => (
                    <Text key={i} style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-700 leading-snug">
                      Instead of "{pw.simple}", try <Text style={{ fontFamily: 'Inter_700Bold', color: '#4f46e5' }}>"{pw.advanced}"</Text> ({pw.tip})
                    </Text>
                  ))}
                </View>
              )}
            </Animated.View>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <View className="items-start mb-4">
            <View className="bg-white p-3 rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-zinc-500">
                {mentor} is typing & speaking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area with Safe Insets */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="w-full bg-[#F2F2F7]/95 border-t border-zinc-200/80 pt-3 px-4 z-40"
      >
        {/* Real-time Listening Banner */}
        {isListening && (
          <Animated.View entering={FadeIn} className="mb-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[12px] text-rose-700">
                Listening... Speak naturally in {targetLang}
              </Text>
            </View>
            <TouchableOpacity onPress={handleToggleVoiceDictation}>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[11px] text-rose-600 uppercase">
                Stop
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View className="flex-row items-center gap-2.5 bg-white rounded-2xl min-h-[56px] px-3.5 py-1.5 border border-zinc-200/80 shadow-sm shadow-black/[0.03]">
          <TouchableOpacity
            onPress={handleToggleVoiceDictation}
            activeOpacity={0.8}
            className={`w-[42px] h-[42px] rounded-xl items-center justify-center shadow-sm ${
              isListening ? 'bg-rose-500' : 'bg-indigo-600'
            }`}
          >
            {isListening ? (
              <Square size={16} color="#ffffff" fill="#ffffff" />
            ) : (
              <Mic size={20} color="#ffffff" />
            )}
          </TouchableOpacity>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={isListening ? `Speaking in ${targetLang}...` : `Reply to ${mentor} in ${targetLang}...`}
            placeholderTextColor="#94a3b8"
            style={{ fontFamily: 'Inter_400Regular' }}
            className="flex-1 text-[16px] text-zinc-900 px-1 py-2"
            multiline={false}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.8}
            className={`w-[42px] h-[42px] rounded-xl items-center justify-center transition-opacity ${
              inputText.trim() && !isLoading ? 'bg-indigo-600 shadow-sm' : 'bg-zinc-100'
            }`}
          >
            <Send size={18} color={inputText.trim() && !isLoading ? '#ffffff' : '#94a3b8'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
