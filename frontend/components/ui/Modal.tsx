import React from 'react';
import { View, Text, Modal as RNModal } from 'react-native';

export function Modal({ visible, children }: { visible: boolean, children: React.ReactNode }) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        <View className="w-full bg-surface dark:bg-gray-900 rounded-3xl p-6 shadow-modal">
          {children}
        </View>
      </View>
    </RNModal>
  );
}
