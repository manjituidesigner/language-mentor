import React from 'react';
import { TouchableOpacity } from 'react-native';

export function VoiceButton({ isRecording, onPress }: { isRecording: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className={w-16 h-16 rounded-full items-center justify-center }>
    </TouchableOpacity>
  );
}
