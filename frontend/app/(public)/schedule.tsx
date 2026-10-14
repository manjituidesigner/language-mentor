import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Bell, Calendar, Clock, Flame, Shield, Check } from 'lucide-react-native';
import { BackButton, PrimaryButton } from '../../components';

const REMINDER_TIMES = [
  { id: 't1', label: 'Morning Commute', time: '8:30 AM', icon: '🌅' },
  { id: 't2', label: 'Lunch Break', time: '1:15 PM', icon: '🥪' },
  { id: 't3', label: 'Evening Relax', time: '7:30 PM', icon: '🌆' },
  { id: 't4', label: 'Bedtime Practice', time: '10:00 PM', icon: '🌙' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, completeOnboarding } = useAuthStore();

  const [selectedTime, setSelectedTime] = useState('t3');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [smartReminders, setSmartReminders] = useState(true);
  const [streakProtection, setStreakProtection] = useState(true);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    router.push('/(public)/notification-setup');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/goal-setup" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Daily Schedule
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
            Build a consistent habit
          </Text>
        </View>

        <View className="flex-col items-end gap-1">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-600 uppercase">
            Step 3 of 5
          </Text>
          <View className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <View className="w-[60%] h-full bg-indigo-600 rounded-full" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="items-center mb-6">
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 mb-2 tracking-tight text-center"
          >
            When do you prefer to practice?
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500 text-center px-2"
          >
            Just 10-15 minutes a day builds fluency 3x faster than weekend cramming.
          </Text>
        </View>

        {/* Reminder Time Slots */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Preferred Daily Time
        </Text>
        <View className="flex-col gap-2.5 mb-6">
          {REMINDER_TIMES.map((slot) => {
            const isSelected = selectedTime === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() => setSelectedTime(slot.id)}
                activeOpacity={0.8}
                className={`flex-row items-center justify-between p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-600 shadow-sm shadow-indigo-100'
                    : 'bg-white border-zinc-200/70 shadow-sm shadow-black/[0.02]'
                }`}
              >
                <View className="flex-row items-center gap-3.5">
                  <Text className="text-2xl">{slot.icon}</Text>
                  <View>
                    <Text
                      style={{ fontFamily: 'Inter_700Bold' }}
                      className={`text-[16px] ${isSelected ? 'text-indigo-950' : 'text-zinc-900'}`}
                    >
                      {slot.label}
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_500Medium' }}
                      className={`text-[13px] ${isSelected ? 'text-indigo-700' : 'text-zinc-500'}`}
                    >
                      {slot.time}
                    </Text>
                  </View>
                </View>

                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-indigo-600 items-center justify-center">
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                  </View>
                ) : (
                  <View className="w-6 h-6 rounded-full border border-zinc-300" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Days of Week */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mb-3"
        >
          Practice Days
        </Text>
        <View className="flex-row justify-between mb-6">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                activeOpacity={0.8}
                className={`w-11 h-12 rounded-2xl items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 shadow-sm shadow-indigo-600/30'
                    : 'bg-white border-zinc-200/70 shadow-sm shadow-black/[0.02]'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Inter_700Bold' }}
                  className={`text-[13px] ${isSelected ? 'text-white' : 'text-zinc-700'}`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Extra Habit Settings */}
        <View className="bg-white rounded-2xl p-4.5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-col gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                <Bell size={20} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Smart Daily Reminders
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Friendly nudge when it's time to speak.
                </Text>
              </View>
            </View>
            <Switch
              value={smartReminders}
              onValueChange={setSmartReminders}
              trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
            />
          </View>

          <View className="h-[1px] bg-zinc-100" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
                <Flame size={20} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Streak Protection Freeze
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Save your streak if you miss an unexpected day.
                </Text>
              </View>
            </View>
            <Switch
              value={streakProtection}
              onValueChange={setStreakProtection}
              trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5"
      >
        <PrimaryButton
          title="Next: Setup Reminders"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
