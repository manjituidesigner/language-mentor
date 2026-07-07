import React from 'react';
import { View, Text } from 'react-native';

export function ChatBubble({ text, isUser }: { text: string, isUser: boolean }) {
  return (
    <View className={max-w-[80%] rounded-2xl p-4 mb-2 }>
      <Text className={isUser ? 'text-white' : 'text-textPrimary dark:text-white'}>{text}</Text>
    </View>
  );
}
