import React from 'react';
import { View, Text } from 'react-native';

export function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-bold text-textPrimary dark:text-white mb-2">{title}</Text>
      <Text className="text-center text-textSecondary dark:text-gray-400">{description}</Text>
    </View>
  );
}
