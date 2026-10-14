import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: any;
  showArrow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function PrimaryButton({
  title,
  onPress,
  icon: Icon,
  showArrow = true,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary',
}: PrimaryButtonProps) {
  let bgColor = '#4f46e5';
  let textColor = '#ffffff';
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    bgColor = '#ffffff';
    textColor = '#4f46e5';
    borderWidth = 1;
    borderColor = 'rgba(79, 70, 229, 0.3)';
  } else if (variant === 'outline') {
    bgColor = 'transparent';
    textColor = '#4f46e5';
    borderWidth = 1.5;
    borderColor = '#4f46e5';
  } else if (variant === 'danger') {
    bgColor = '#dc2626';
    textColor = '#ffffff';
  }

  if (disabled) {
    bgColor = '#e4e4e7';
    textColor = '#a1a1aa';
    borderWidth = 0;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        {
          width: '100%',
          height: 56,
          backgroundColor: bgColor,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth,
          borderColor,
          shadowColor: variant === 'primary' && !disabled ? '#4f46e5' : '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variant === 'primary' && !disabled ? 0.25 : 0.04,
          shadowRadius: 8,
          elevation: variant === 'primary' && !disabled ? 4 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {Icon && (
            <Icon
              size={20}
              color={textColor}
              strokeWidth={2.2}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              {
                fontSize: 17,
                fontFamily: 'Inter_700Bold',
                color: textColor,
                letterSpacing: 0.2,
                marginRight: showArrow ? 6 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {showArrow && !Icon && (
            <ArrowRight size={20} color={textColor} strokeWidth={2.5} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
