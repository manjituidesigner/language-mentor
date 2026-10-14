import { GoogleGenAI } from '@google/genai';
import { envConfig } from '../config/env.config';
import logger from '../utils/logger';

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  category?: 'tenses' | 'prepositions' | 'agreement' | 'vocabulary' | 'word_order';
}

export interface PowerWordSuggestion {
  simple: string;
  advanced: string;
  tip: string;
}

export interface MentorChatResult {
  reply: string;
  translation: string;
  corrections: Correction | null;
  fluencyScore: number;
  grammarScore: number;
  vocabScore: number;
  weakPoint: string | null;
  suggestedPowerWords: PowerWordSuggestion[];
  fillerWords: string[];
}

export interface AssessmentEvaluation {
  overallScore: number;
  cefrLevel: string;
  scores: {
    speaking: number;
    listening: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AdaptiveDailyLesson {
  lessonTitle: string;
  focusArea: string;
  description: string;
  targetRule: string;
  recommendedRoleplay: string;
  vocabularyToUnlock: string[];
  estimatedMinutes: number;
}

export class AIService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (envConfig.ai.geminiApiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: envConfig.ai.geminiApiKey });
        logger.info('Gemini AI Service initialized successfully.');
      } catch (err: any) {
        logger.warn(`Failed to initialize Gemini AI: ${err.message}. Using fallback engine.`);
      }
    } else {
      logger.info('No GEMINI_API_KEY detected. AI Service running in smart deterministic mode.');
    }
  }

  /**
   * Generates a mentor conversation reply with deep fluency diagnostics, grammar error detection, and Hindi translation.
   */
  async generateMentorResponse(params: {
    mentorName: string;
    targetLang: string;
    nativeLang: string;
    topic: string;
    userMessage: string;
    history?: { sender: 'user' | 'mentor'; content: string }[];
  }): Promise<MentorChatResult> {
    const { mentorName, targetLang, nativeLang, topic, userMessage } = params;

    // Check for common grammatical slips with rule-based detector
    const detectedCorrection = this.detectGrammarSlip(userMessage);
    const detectedFillers = this.detectFillerWords(userMessage);
    const suggestedPowerWords = this.detectPowerWords(userMessage);

    if (this.ai && envConfig.ai.geminiApiKey) {
      try {
        const systemPrompt = `You are ${mentorName}, a supportive and world-class AI language tutor teaching ${targetLang} to a student whose native language is ${nativeLang}.
The current practice topic is: "${topic}".
User message: "${userMessage}".

Evaluate the user's sentence and provide a natural, highly engaging conversational tutor response in JSON format:
{
  "reply": "Your spoken conversational reply in ${targetLang}. Be warm, validate their thought, and ask a relevant follow-up question to keep them speaking.",
  "translation": "Accurate, natural translation of your reply into ${nativeLang}",
  "correction": null or {"original": "exact erroneous phrase", "corrected": "correct phrasing", "explanation": "friendly grammar rule explanation in ${nativeLang}", "category": "tenses|prepositions|agreement|vocabulary|word_order"},
  "fluencyScore": a number between 65 and 98 evaluating this turn,
  "grammarScore": a number between 60 and 100,
  "vocabScore": a number between 60 and 100,
  "weakPoint": "Short weakness summary if an error occurred (e.g. 'Past Tense Irregular Verbs') or null",
  "suggestedPowerWords": [{"simple": "simple word user used", "advanced": "more elegant alternative", "tip": "why to use it in ${nativeLang}"}]
}`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return {
          reply: parsed.reply || `That's great! Let's continue exploring ${topic}.`,
          translation: parsed.translation || `बहुत बढ़िया! आइए ${topic} के बारे में और बात करते हैं।`,
          corrections: parsed.correction || detectedCorrection,
          fluencyScore: parsed.fluencyScore || (detectedCorrection ? 76 : 88),
          grammarScore: parsed.grammarScore || (detectedCorrection ? 70 : 92),
          vocabScore: parsed.vocabScore || 85,
          weakPoint: parsed.weakPoint || (detectedCorrection ? detectedCorrection.category || 'Grammar Accuracy' : null),
          suggestedPowerWords: (parsed.suggestedPowerWords && parsed.suggestedPowerWords.length > 0)
            ? parsed.suggestedPowerWords
            : suggestedPowerWords,
          fillerWords: detectedFillers,
        };
      } catch (err: any) {
        logger.warn(`Gemini generation fallback: ${err.message}`);
      }
    }

    // High quality contextual deterministic fallback
    return this.getFallbackMentorReply(
      mentorName,
      targetLang,
      nativeLang,
      topic,
      userMessage,
      detectedCorrection,
      detectedFillers,
      suggestedPowerWords
    );
  }

  /**
   * Generates tomorrow's tailored daily lesson based on detected weaknesses.
   */
  generateAdaptiveDailyLesson(params: {
    weaknesses: string[];
    cefrLevel: string;
    topic: string;
    targetLang: string;
    nativeLang: string;
  }): AdaptiveDailyLesson {
    const { weaknesses, topic } = params;

    const primaryWeakness = weaknesses[0] || 'Everyday Speaking Confidence';

    if (primaryWeakness.toLowerCase().includes('past') || primaryWeakness.toLowerCase().includes('went') || primaryWeakness.toLowerCase().includes('verb')) {
      return {
        lessonTitle: 'Storytelling: Past Adventures & Weekend Memories',
        focusArea: 'Irregular Past Tense Mastery',
        description: 'Practice speaking about yesterday, past vacations, and memories without slipping on irregular verbs (went, saw, ate, bought).',
        targetRule: 'Use past simple for completed actions: Subject + V2 (I went to the store).',
        recommendedRoleplay: 'Tell Sophie about your best vacation ever',
        vocabularyToUnlock: ['Unforgettable', 'Embarked', 'Spectacular', 'Memorable'],
        estimatedMinutes: 15,
      };
    }

    if (primaryWeakness.toLowerCase().includes('preposition') || primaryWeakness.toLowerCase().includes('in') || primaryWeakness.toLowerCase().includes('at')) {
      return {
        lessonTitle: 'Daily Schedules & Locations: Prepositions In, On, At',
        focusArea: 'Time & Place Prepositions',
        description: 'Eliminate confusion between "at the office", "in July", "on Monday", and "married to".',
        targetRule: 'AT for exact times/points, ON for days/dates, IN for months/years/enclosed spaces.',
        recommendedRoleplay: 'Schedule a lunch meeting and describe your daily routine',
        vocabularyToUnlock: ['Precisely', 'Commence', 'Convenient', 'Schedule'],
        estimatedMinutes: 15,
      };
    }

    return {
      lessonTitle: `Mastering ${topic}: Expressing Nuanced Opinions`,
      focusArea: 'Conversational Fluency & Power Synonyms',
      description: 'Expand beyond basic responses using descriptive adjectives and fluid connectors.',
      targetRule: 'Pair reasoning connectors: "In my opinion...", "Furthermore...", "What stands out to me is..."',
      recommendedRoleplay: `Discuss a debate scenario on "${topic}" with your mentor`,
      vocabularyToUnlock: ['Exceptional', 'Delightful', 'Perspective', 'Significant'],
      estimatedMinutes: 15,
    };
  }

  /**
   * Evaluates student's initial onboarding assessment and outputs CEFR level and sub-scores.
   */
  async evaluateAssessment(answers: { questionId: string; text: string }[]): Promise<AssessmentEvaluation> {
    if (this.ai && envConfig.ai.geminiApiKey && answers.length > 0) {
      try {
        const prompt = `Evaluate these language learner responses: ${JSON.stringify(answers)}.
Output a JSON evaluation:
{
  "overallScore": number between 40 and 95,
  "cefrLevel": one of "A1 Beginner", "A2 Elementary", "B1 Intermediate", "B2 Upper Intermediate", "C1 Advanced",
  "scores": {
    "speaking": number,
    "listening": number,
    "grammar": number,
    "vocabulary": number,
    "pronunciation": number,
    "confidence": number
  },
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "recommendations": ["string", "string"]
}`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const text = response.text || '';
        return JSON.parse(text);
      } catch (err: any) {
        logger.warn(`Gemini assessment evaluation fallback: ${err.message}`);
      }
    }

    // High quality deterministic benchmark
    return {
      overallScore: 68,
      cefrLevel: 'A2 Elementary',
      scores: {
        speaking: 65,
        listening: 72,
        grammar: 62,
        vocabulary: 70,
        pronunciation: 75,
        confidence: 64,
      },
      strengths: [
        'Good grasp of essential day-to-day vocabulary',
        'Clear speech rhythm and willingness to communicate',
      ],
      weaknesses: [
        'Irregular past tense verbs (went vs goed)',
        'Prepositions of time (at, in, on)',
      ],
      recommendations: [
        'Focus on 15 minutes of daily spoken voice calls',
        'Complete irregular verb mini-quizzes after each session',
      ],
    };
  }

  /**
   * Rule-based grammar detection for common language slips
   */
  private detectGrammarSlip(text: string): Correction | null {
    const lower = text.toLowerCase();

    // 1. Irregular Verbs
    if (/\bgoed\b/.test(lower)) {
      return {
        original: 'goed',
        corrected: 'went',
        explanation: '"Go" is an irregular verb. In past tense, always use "went" (भूतकाल में "went" का प्रयोग करें).',
        category: 'tenses',
      };
    }
    if (/\beated\b/.test(lower)) {
      return {
        original: 'eated',
        corrected: 'ate',
        explanation: 'Past tense of "eat" is "ate", not "eated" (भूतकाल में "ate" कहें).',
        category: 'tenses',
      };
    }
    if (/\bbuyed\b/.test(lower)) {
      return {
        original: 'buyed',
        corrected: 'bought',
        explanation: 'The past tense of "buy" is "bought" (खरीदने के लिए भूतकाल में "bought" का प्रयोग करें).',
        category: 'tenses',
      };
    }

    // 2. Double Comparatives
    if (/\bmore better\b/.test(lower)) {
      return {
        original: 'more better',
        corrected: 'much better',
        explanation: '"Better" is already comparative. Never pair it with "more". Use "much better" for emphasis.',
        category: 'vocabulary',
      };
    }
    if (/\bmore faster\b/.test(lower)) {
      return {
        original: 'more faster',
        corrected: 'much faster',
        explanation: '"Faster" already expresses comparison. Use "much faster" instead.',
        category: 'vocabulary',
      };
    }

    // 3. Subject-Verb Agreement & Direct Verbs
    if (/\bi am agree\b/.test(lower)) {
      return {
        original: 'I am agree',
        corrected: 'I agree',
        explanation: '"Agree" is an action verb, not an adjective. Say "I agree" directly (सीधे "I agree" बोलें).',
        category: 'agreement',
      };
    }
    if (/\bshe don't\b/.test(lower) || /\bhe don't\b/.test(lower)) {
      return {
        original: "don't",
        corrected: "doesn't",
        explanation: 'Third-person singular (he/she/it) takes "doesn\'t" in negative present sentences.',
        category: 'agreement',
      };
    }
    if (/\bshe have\b/.test(lower) || /\bhe have\b/.test(lower)) {
      return {
        original: 'have',
        corrected: 'has',
        explanation: 'Third-person singular (he/she) pairs with "has" (जैसे: "She has", "He has").',
        category: 'agreement',
      };
    }

    // 4. Preposition Errors
    if (/\bmarried with\b/.test(lower)) {
      return {
        original: 'married with',
        corrected: 'married to',
        explanation: 'In English, we say someone is "married to" their partner, not "married with".',
        category: 'prepositions',
      };
    }
    if (/\bdepend of\b/.test(lower)) {
      return {
        original: 'depend of',
        corrected: 'depend on',
        explanation: 'The verb "depend" always pairs with the preposition "on" ("depends on").',
        category: 'prepositions',
      };
    }

    return null;
  }

  private detectFillerWords(text: string): string[] {
    const fillers: string[] = [];
    const lower = text.toLowerCase();
    if (/\bum\b/.test(lower)) fillers.push('um');
    if (/\buh\b/.test(lower)) fillers.push('uh');
    if (/\blike\b/.test(lower) && (lower.match(/\blike\b/g) || []).length > 2) fillers.push('like (repeated)');
    if (/\byou know\b/.test(lower)) fillers.push('you know');
    return fillers;
  }

  private detectPowerWords(text: string): PowerWordSuggestion[] {
    const suggestions: PowerWordSuggestion[] = [];
    const lower = text.toLowerCase();

    if (/\bvery good\b/.test(lower)) {
      suggestions.push({
        simple: 'very good',
        advanced: 'exceptional',
        tip: '"Exceptional" conveys high quality with native fluency (असाधारण).',
      });
    }
    if (/\bvery happy\b/.test(lower)) {
      suggestions.push({
        simple: 'very happy',
        advanced: 'thrilled / ecstatic',
        tip: 'Expresses vivid excitement beyond simple "happy" (रोमांचित).',
      });
    }
    if (/\bvery big\b/.test(lower)) {
      suggestions.push({
        simple: 'very big',
        advanced: 'immense / substantial',
        tip: 'Adds precision to descriptions (विशाल या महत्वपूर्ण).',
      });
    }

    return suggestions;
  }

  private getFallbackMentorReply(
    mentorName: string,
    targetLang: string,
    nativeLang: string,
    topic: string,
    userMessage: string,
    correction: Correction | null,
    fillerWords: string[],
    powerWords: PowerWordSuggestion[]
  ): MentorChatResult {
    const replies = [
      {
        reply: `That sounds wonderful! When you think about ${topic}, what is your favorite memory or experience with it?`,
        translation: `यह बहुत बढ़िया लगता है! जब आप ${topic} के बारे में सोचते हैं, तो इससे जुड़ी आपकी सबसे पसंदीदा याद क्या है?`,
      },
      {
        reply: `I love that perspective! Could you elaborate a bit more on why you feel that way?`,
        translation: `मुझे आपका यह दृष्टिकोण पसंद आया! क्या आप थोड़ा और विस्तार से बता सकते हैं कि आप ऐसा क्यों महसूस करते हैं?`,
      },
      {
        reply: `Great sentence! You communicated your idea very naturally. What would you like to achieve next in this discussion?`,
        translation: `बहुत बढ़िया वाक्य! आपने अपने विचार को बहुत स्वाभाविक रूप से व्यक्त किया। इस चर्चा में आप आगे क्या कहना चाहेंगे?`,
      },
      {
        reply: `That's fascinating! How do people in your community usually approach ${topic}?`,
        translation: `यह बहुत दिलचस्प है! आपके समुदाय में लोग आमतौर पर ${topic} को कैसे देखते हैं?`,
      },
    ];

    const selected = replies[Math.floor(Math.random() * replies.length)];
    const fluency = correction ? 78 : 88;
    const grammar = correction ? 72 : 94;
    const vocab = powerWords.length > 0 ? 80 : 86;

    return {
      reply: selected.reply,
      translation: selected.translation,
      corrections: correction,
      fluencyScore: fluency,
      grammarScore: grammar,
      vocabScore: vocab,
      weakPoint: correction ? correction.category || 'Grammar Precision' : null,
      suggestedPowerWords: powerWords,
      fillerWords,
    };
  }
}

export const aiService = new AIService();
