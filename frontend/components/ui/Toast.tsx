import React from 'react';
import { View, Text } from 'react-native';

export function Toast({ message, visible }: { message: string, visible: boolean }) {
  if (!visible) return null;
  return (
    <View className="absolute top-10 w-full px-4 z-50">
      <View className="bg-gray-900 dark:bg-white rounded-xl p-4 shadow-floating">
        <Text className="text-white dark:text-gray-900 font-medium">{message}</Text>
      </View>
    </View>
  );
}
