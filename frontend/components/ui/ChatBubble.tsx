import React from 'react';
import { View, Text } from 'react-native';

export function ChatBubble({ text, isUser }: { text: string, isUser: boolean }) {
  return (
    <View
      className={`max-w-[80%] rounded-2xl p-4 mb-2 ${
        isUser
          ? 'self-end bg-primary rounded-tr-sm'
          : 'self-start bg-surface-container-low border border-outline-variant/20 rounded-tl-sm'
      }`}
    >
      <Text className={isUser ? 'text-white' : 'text-on-surface'}>{text}</Text>
    </View>
  );
}
