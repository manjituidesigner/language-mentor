import React from 'react';
import { View, Text } from 'react-native';

export function BottomSheet({ visible, children }: { visible: boolean, children: React.ReactNode }) {
  if (!visible) return null;
  return (
    <View className="absolute bottom-0 w-full bg-surface dark:bg-gray-900 rounded-t-3xl p-6 shadow-bottomSheet">
      <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
      {children}
    </View>
  );
}
