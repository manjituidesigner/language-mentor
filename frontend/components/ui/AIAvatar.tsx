import React from 'react';
import { View } from 'react-native';
import { Bot } from 'lucide-react-native';

export function AIAvatar({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <View className={`w-16 h-16 rounded-full items-center justify-center bg-primary/10 border-2 ${isSpeaking ? 'border-primary' : 'border-transparent'}`}>
      <Bot color="#3f3bbd" size={32} />
    </View>
  );
}
