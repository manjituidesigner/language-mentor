import React from 'react';
import { View } from 'react-native';

export function ProgressBar({ progress, color = 'bg-primary' }: { progress: number, color?: string }) {
  return (
    <View className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
      <View className={h-full } style={{ width: ${progress}% }} />
    </View>
  );
}
