import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';
import { quizService, QuizQuestion } from '../../services/quizService';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import {
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
} from 'lucide-react-native';

const FALLBACK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Choose the correct past tense for this sentence:\n"Yesterday, I ___ to the coffee shop with my friend."',
    options: ['goed', 'went', 'gone', 'going'],
    correctIndex: 1,
    explanation: '"Go" is an irregular verb. Its simple past tense form is "went", not "goed". (भूतकाल में "went" का प्रयोग करें।)',
  },
  {
    id: 'q2',
    question: 'Which word best means "to reach agreement through mutual discussion"?',
    options: ['Argue', 'Negotiate', 'Ignore', 'Compete'],
    correctIndex: 1,
    explanation: '"Negotiate" (बातचीत करना) means to discuss and arrange the terms of an agreement.',
  },
  {
    id: 'q3',
    question: 'Complete the sentence:\n"We reached a general ___ after two hours of debate."',
    options: ['consensus', 'conflict', 'confusion', 'silence'],
    correctIndex: 0,
    explanation: '"Consensus" (आम सहमति) refers to a general agreement achieved by a group.',
  },
];

export default function MiniQuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { learningLanguageName } = useOnboardingStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>(FALLBACK_QUIZ_QUESTIONS);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    quizService.generateQuiz().then((data) => {
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setQuizId(data.id);
      }
    });
  }, []);

  const currentQ = questions[currentIndex] || FALLBACK_QUIZ_QUESTIONS[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, { questionId: currentQ.id, selectedIndex: index }]);
  };

  const handleNext = async () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      setIsSubmitting(true);
      if (quizId) {
        await quizService.submitQuiz(quizId, answers);
      }
      setIsSubmitting(false);
      router.push('/(private)/notebook');
    }
  };

  const handleClose = () => {
    router.push('/(private)/notebook');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <TouchableOpacity
          onPress={handleClose}
          activeOpacity={0.7}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: 'rgba(228, 228, 231, 0.85)',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={22} color="#09090b" strokeWidth={2.5} />
        </TouchableOpacity>

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            2-Min Mini Quiz
          </Text>
          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[12px] text-zinc-400">
            Question {currentIndex + 1} of {questions.length}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
          <Award size={14} color="#4f46e5" />
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[12px] text-indigo-700">
            {score}/{questions.length}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Math.max(insets.bottom, 20) + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden mb-6">
          <View
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            className="h-full bg-indigo-600 rounded-full"
          />
        </View>

        {/* Question Card */}
        <View className="p-6 bg-white rounded-3xl border border-zinc-200/80 shadow-sm mb-6">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[18px] leading-[26px] text-zinc-900">
            {currentQ.question}
          </Text>
        </View>

        {/* Options List */}
        <View className="flex-col gap-3 mb-6">
          {currentQ.options.map((opt, index) => {
            const isChosen = selectedIndex === index;
            const isCorrect = index === currentQ.correctIndex;

            let cardBg = 'bg-white border-zinc-200/80';
            let badgeBg = 'bg-zinc-100 text-zinc-700';
            let textColor = 'text-zinc-900';

            if (isAnswered) {
              if (isCorrect) {
                cardBg = 'bg-emerald-50/80 border-emerald-500 shadow-emerald-100';
                badgeBg = 'bg-emerald-600 text-white';
                textColor = 'text-emerald-950';
              } else if (isChosen && !isCorrect) {
                cardBg = 'bg-rose-50/80 border-rose-500 shadow-rose-100';
                badgeBg = 'bg-rose-600 text-white';
                textColor = 'text-rose-950';
              }
            } else if (isChosen) {
              cardBg = 'bg-indigo-50 border-indigo-600 shadow-sm';
              badgeBg = 'bg-indigo-600 text-white';
              textColor = 'text-indigo-950';
            }

            const letter = String.fromCharCode(65 + index);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectOption(index)}
                disabled={isAnswered}
                activeOpacity={0.8}
                style={{ minHeight: 64 }}
                className={`p-4 rounded-3xl border flex-row items-center justify-between shadow-sm ${cardBg}`}
              >
                <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${badgeBg}`}>
                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px]">
                      {letter}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[16px] flex-1 ${textColor}`}>
                    {opt}
                  </Text>
                </View>

                {isAnswered && isCorrect && <CheckCircle2 size={22} color="#059669" />}
                {isAnswered && isChosen && !isCorrect && <XCircle size={22} color="#dc2626" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Answer Explanation Banner */}
        {isAnswered && (
          <View className="p-5 bg-white rounded-3xl border border-zinc-200/80 shadow-sm flex-row items-start gap-3.5">
            <Sparkles size={20} color="#4f46e5" className="mt-0.5" />
            <View className="flex-1">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[14px] text-zinc-900 mb-1">
                Explanation
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[14px] leading-[21px] text-zinc-600">
                {currentQ.explanation}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-white/95 border-t border-zinc-200/80 shadow-xl shadow-black/5"
      >
        <PrimaryButton
          title={isLastQuestion ? 'Save & Go to Notebook' : 'Next Question'}
          disabled={!isAnswered || isSubmitting}
          loading={isSubmitting}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
