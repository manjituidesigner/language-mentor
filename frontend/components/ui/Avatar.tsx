import React from 'react';
import { Image, View, Text } from 'react-native';

export function Avatar({ url, initials, size = 'md', className = '' }: { url?: string, initials?: string, size?: 'sm'|'md'|'lg', className?: string }) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <View className={`rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden ${sizeMap[size]} ${className}`}>
      {url ? (
        <Image source={{ uri: url }} className="w-full h-full" resizeMode="cover" />
      ) : (
        <Text className="font-semibold text-textSecondary dark:text-white">{initials}</Text>
      )}
    </View>
  );
}
