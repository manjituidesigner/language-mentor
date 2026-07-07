import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', size = 'md', isLoading, disabled, className = '', ...props }: ButtonProps) {
  const base = 'flex-row items-center justify-center rounded-2xl';
  const sizeMap = { sm: 'py-2 px-4', md: 'py-3 px-6', lg: 'py-4 px-8' };
  const variantMap = {
    primary: 'bg-primary dark:bg-primaryDark',
    secondary: 'bg-gray-100 dark:bg-gray-800',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
    danger: 'bg-danger',
  };
  const textMap = {
    primary: 'text-white', secondary: 'text-textPrimary dark:text-white',
    outline: 'text-primary', ghost: 'text-textSecondary dark:text-gray-300', danger: 'text-white'
  };
  return (
    <TouchableOpacity disabled={disabled || isLoading} activeOpacity={0.8}
      className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${disabled ? 'opacity-50' : ''} ${className}`} {...props}>
      {isLoading ? <ActivityIndicator color={textMap[variant] === 'text-white' ? '#fff' : '#000'} /> : <Text className={`font-semibold text-lg ${textMap[variant]}`}>{title}</Text>}
    </TouchableOpacity>
  );
}
