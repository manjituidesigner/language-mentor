import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';

export function AIAvatar({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <View className={w-16 h-16 rounded-full items-center justify-center bg-primary/20 }>
      <User color="#2563EB" size={32} />
    </View>
  );
}
