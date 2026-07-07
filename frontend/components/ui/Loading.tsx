import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-background dark:bg-gray-950">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}
