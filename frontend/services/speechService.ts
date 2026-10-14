import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface MentorVoiceProfile {
  name: string;
  language: string;
  pitch: number;
  rate: number;
  gender: 'female' | 'male';
}

const MENTOR_VOICE_PROFILES: Record<string, MentorVoiceProfile> = {
  sophie: {
    name: 'Sophie',
    language: 'en-US',
    pitch: 1.1,
    rate: 0.92,
    gender: 'female',
  },
  alex: {
    name: 'Alex',
    language: 'en-US',
    pitch: 0.95,
    rate: 0.95,
    gender: 'male',
  },
  liam: {
    name: 'Liam',
    language: 'en-US',
    pitch: 1.0,
    rate: 1.0,
    gender: 'male',
  },
  elara: {
    name: 'Elara',
    language: 'en-US',
    pitch: 1.05,
    rate: 0.85,
    gender: 'female',
  },
};

class SpeechService {
  private activeRecording: Audio.Recording | null = null;
  private recognitionInstance: any = null;
  private isCurrentlySpeaking: boolean = false;

  /**
   * Speak mentor text out loud using natural voice parameters
   */
  async speakMentorResponse(
    text: string,
    mentorName: string = 'Sophie',
    options?: {
      rateModifier?: number; // e.g. 0.75 for slower mode
      language?: string;
      onStart?: () => void;
      onDone?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    try {
      // Stop any existing speech first
      await this.stopSpeaking();

      const profile = MENTOR_VOICE_PROFILES[mentorName.toLowerCase()] || MENTOR_VOICE_PROFILES.sophie;
      const targetLanguage = options?.language || profile.language;
      const effectiveRate = (profile.rate * (options?.rateModifier ?? 1.0));

      this.isCurrentlySpeaking = true;
      options?.onStart?.();

      Speech.speak(text, {
        language: targetLanguage,
        pitch: profile.pitch,
        rate: effectiveRate,
        onDone: () => {
          this.isCurrentlySpeaking = false;
          options?.onDone?.();
        },
        onStopped: () => {
          this.isCurrentlySpeaking = false;
          options?.onDone?.();
        },
        onError: (err) => {
          this.isCurrentlySpeaking = false;
          options?.onError?.(err);
        },
      });
    } catch (error) {
      this.isCurrentlySpeaking = false;
      options?.onError?.(error);
    }
  }

  /**
   * Immediately stops any active audio playback
   */
  async stopSpeaking(): Promise<void> {
    try {
      this.isCurrentlySpeaking = false;
      await Speech.stop();
    } catch {
      // ignore
    }
  }

  /**
   * Check if speech synthesis is currently active
   */
  async isSpeaking(): Promise<boolean> {
    try {
      const expoSpeaking = await Speech.isSpeakingAsync();
      return expoSpeaking || this.isCurrentlySpeaking;
    } catch {
      return this.isCurrentlySpeaking;
    }
  }

  /**
   * Check if Speech-to-Text is supported on this browser/environment
   */
  isSpeechRecognitionSupported(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    }
    return false;
  }

  /**
   * Start real-time microphone speech recognition (Speech-to-Text)
   */
  startSpeechRecognition(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (err: any) => void;
    onEnd?: () => void;
  }): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        callbacks.onError?.('Speech recognition not supported on this device/browser');
        return false;
      }

      try {
        if (this.recognitionInstance) {
          this.recognitionInstance.abort();
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const combined = finalTranscript || interimTranscript;
          const isFinal = Boolean(finalTranscript);
          if (combined.trim()) {
            callbacks.onResult(combined.trim(), isFinal);
          }
        };

        recognition.onerror = (event: any) => {
          callbacks.onError?.(event.error);
        };

        recognition.onend = () => {
          callbacks.onEnd?.();
        };

        recognition.start();
        this.recognitionInstance = recognition;
        return true;
      } catch (err) {
        callbacks.onError?.(err);
        return false;
      }
    }

    callbacks.onError?.('Native voice recognition fallback active');
    return false;
  }

  /**
   * Stop active speech recognition
   */
  stopSpeechRecognition(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }

  /**
   * Start recording audio clip via expo-av
   */
  async startAudioRecording(): Promise<boolean> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.activeRecording = recording;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Stop recording audio clip and return URI and duration
   */
  async stopAudioRecording(): Promise<{ uri: string | null; durationMs: number }> {
    try {
      if (!this.activeRecording) {
        return { uri: null, durationMs: 0 };
      }

      const status = await this.activeRecording.getStatusAsync();
      await this.activeRecording.stopAndUnloadAsync();
      const uri = this.activeRecording.getURI();
      const durationMs = status.durationMillis || 0;
      this.activeRecording = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return { uri, durationMs };
    } catch {
      return { uri: null, durationMs: 0 };
    }
  }
}

export const speechService = new SpeechService();
