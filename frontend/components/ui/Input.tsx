import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-textSecondary dark:text-gray-400 mb-1">{label}</Text>}
      <TextInput
        placeholderTextColor="#94A3B8"
        className={`bg-surface dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl px-4 py-3 text-textPrimary dark:text-white ${className}`}
        {...props}
      />
      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}
    </View>
  );
}
