import React from 'react';
import { TouchableOpacity } from 'react-native';

export function IconButton({ icon: Icon, onPress }: { icon: any, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
      <Icon size={24} color="#6B7280" />
    </TouchableOpacity>
  );
}
