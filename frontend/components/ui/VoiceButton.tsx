import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Mic, Square } from 'lucide-react-native';

export function VoiceButton({ isRecording, onPress }: { isRecording: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-16 h-16 rounded-full items-center justify-center shadow-lg ${
        isRecording ? 'bg-danger' : 'bg-primary'
      }`}
    >
      {isRecording ? <Square size={24} color="#ffffff" fill="#ffffff" /> : <Mic size={28} color="#ffffff" />}
    </TouchableOpacity>
  );
}
