import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export function Header({ title, onBack }: { title: string, onBack?: () => void }) {
  return (
    <View className="flex-row items-center p-4 bg-surface dark:bg-gray-900 border-b border-border dark:border-gray-800">
      {onBack && <TouchableOpacity onPress={onBack} className="mr-3"><ArrowLeft size={24} color="#111827" /></TouchableOpacity>}
      <Text className="text-xl font-bold text-textPrimary dark:text-white">{title}</Text>
    </View>
  );
}
