import React from 'react';
import { View, Text } from 'react-native';

export function Badge({ text, variant = 'primary' }: { text: string, variant?: 'primary'|'success'|'warning'|'danger' }) {
  const vMap = { primary: 'bg-primary/10 text-primary', success: 'bg-success/10 text-success', warning: 'bg-warning/10 text-warning', danger: 'bg-danger/10 text-danger' };
  return (
    <View className={px-2 py-1 rounded-full }>
      <Text className={	ext-xs font-bold }>{text}</Text>
    </View>
  );
}
