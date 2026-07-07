import React from 'react';
import { View, SafeAreaView } from 'react-native';

export function ScreenContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-gray-950">
      <View className={lex-1 }>{children}</View>
    </SafeAreaView>
  );
}
