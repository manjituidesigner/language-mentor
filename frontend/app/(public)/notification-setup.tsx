import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, BellRing, Flame, Award, Shield, Sparkles } from 'lucide-react-native';
import { BackButton, PrimaryButton } from '../../components';

export default function NotificationSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sessionReminders, setSessionReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleContinue = () => {
    router.push('/(public)/setup-complete');
  };

  const handleSkip = () => {
    router.push('/(public)/setup-complete');
  };

  return (
    <View className="flex-1 bg-[#F2F2F7] relative">
      {/* Top Header with Safe Area */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full pb-3 px-5 bg-[#F2F2F7]/95 border-b border-zinc-200/80 z-50 flex-row items-center justify-between"
      >
        <BackButton fallbackRoute="/(public)/schedule" />

        <View className="flex-col items-center">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[17px] text-zinc-900">
            Notifications
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-500">
            Stay on track
          </Text>
        </View>

        <View className="flex-col items-end gap-1">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-600 uppercase">
            Step 4 of 5
          </Text>
          <View className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <View className="w-[80%] h-full bg-indigo-600 rounded-full" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Math.max(insets.bottom, 20) + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Visual Card */}
        <View className="items-center my-4">
          <View className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200/70 items-center justify-center mb-3.5 shadow-sm shadow-indigo-100/50">
            <BellRing size={36} color="#4f46e5" />
          </View>
          <Text
            style={{ fontFamily: 'Inter_700Bold' }}
            className="text-[26px] leading-[32px] text-zinc-900 text-center mb-2 tracking-tight"
          >
            Never miss a daily session
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular' }}
            className="text-[15px] leading-[22px] text-zinc-500 text-center px-2"
          >
            Learners with smart nudges are <Text style={{ fontFamily: 'Inter_700Bold', color: '#4f46e5' }}>4.2x more likely</Text> to achieve conversational fluency in 90 days.
          </Text>
        </View>

        {/* Live Notification Preview Card */}
        <View className="my-2 p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-row items-center gap-3.5">
          <View className="w-10 h-10 rounded-xl bg-indigo-600 items-center justify-center shadow-sm">
            <Sparkles size={18} color="#ffffff" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[13px] text-zinc-900">
                Mentor Sophie
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-zinc-400">
                Just now
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-600 mt-0.5">
              "Ready for a quick 5-min talk? Your daily coffee chat is waiting!"
            </Text>
          </View>
        </View>

        {/* Preferences Toggles */}
        <Text
          style={{ fontFamily: 'Inter_700Bold' }}
          className="text-[13px] text-zinc-400 uppercase tracking-widest ml-1 mt-6 mb-3"
        >
          Notification Preferences
        </Text>

        <View className="bg-white rounded-2xl p-4.5 border border-zinc-200/70 shadow-sm shadow-black/[0.02] flex-col gap-4">
          {/* Item 1 */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                <Bell size={19} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Daily Class Reminders
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Gentle alert 10 mins before your selected time.
                </Text>
              </View>
            </View>
            <Switch
              value={sessionReminders}
              onValueChange={setSessionReminders}
              trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
            />
          </View>

          <View className="h-[1px] bg-zinc-100" />

          {/* Item 2 */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
                <Flame size={19} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Streak Danger Alert
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Evening warning if your streak is about to reset.
                </Text>
              </View>
            </View>
            <Switch
              value={streakAlerts}
              onValueChange={setStreakAlerts}
              trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
            />
          </View>

          <View className="h-[1px] bg-zinc-100" />

          {/* Item 3 */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center">
                <Award size={19} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[15px] text-zinc-900">
                  Weekly Fluency Digest
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[12px] text-zinc-500">
                  Sunday review of new words learned & grammar gains.
                </Text>
              </View>
            </View>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{ false: '#e4e4e7', true: '#4f46e5' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 w-full px-5 pt-3 bg-[#F2F2F7]/95 border-t border-zinc-200/80 shadow-lg shadow-black/5"
      >
        <PrimaryButton
          title="Enable Notifications"
          onPress={handleContinue}
          style={{ marginBottom: 8 }}
        />

        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          className="py-1.5 items-center justify-center"
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[14px] text-zinc-500">
            Maybe Later
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
