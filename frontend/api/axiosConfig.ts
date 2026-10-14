import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return 'https://language-mentor-backend.vercel.app/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging
    return Promise.reject(error);
  }
);
