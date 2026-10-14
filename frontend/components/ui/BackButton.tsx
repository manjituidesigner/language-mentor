import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

interface BackButtonProps {
  onPress?: () => void;
  fallbackRoute?: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
}

export function BackButton({
  onPress,
  fallbackRoute,
  style,
  color = '#09090b',
  size = 26,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: 'rgba(228, 228, 231, 0.85)',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <ChevronLeft size={size} color={color} strokeWidth={2.5} style={{ marginLeft: -2 }} />
    </TouchableOpacity>
  );
}
