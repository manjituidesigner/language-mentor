import React from 'react';
import { View, ViewProps } from 'react-native';

export function Card({ className = '', children, ...props }: ViewProps) {
  return (
    <View className={g-surface dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-border dark:border-gray-800 } {...props}>
      {children}
    </View>
  );
}
