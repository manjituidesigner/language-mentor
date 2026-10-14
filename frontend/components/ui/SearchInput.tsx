import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  containerStyle,
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View
      style={[
        {
          height: 54,
          backgroundColor: '#ffffff',
          borderRadius: 18,
          borderWidth: 1,
          borderColor: 'rgba(228, 228, 231, 0.85)',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 1,
        },
        containerStyle,
      ]}
    >
      <Search size={22} color="#6366f1" strokeWidth={2.2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        style={{
          flex: 1,
          height: '100%',
          marginLeft: 12,
          fontSize: 16,
          color: '#18181b',
          fontFamily: 'Inter_400Regular',
        }}
        autoCorrect={false}
        {...props}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: '#e4e4e7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={15} color="#52525b" strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}
