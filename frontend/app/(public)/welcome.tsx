import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { GraduationCap, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Floating animation for the central image
  const floatY = useSharedValue(0);
  
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { rotate: '3deg' }]
  }));

  const floatYDecoration1 = useSharedValue(0);
  const floatYDecoration2 = useSharedValue(0);

  useEffect(() => {
    floatYDecoration1.value = withRepeat(withSequence(withTiming(-20, { duration: 4000 }), withTiming(0, { duration: 4000 })), -1, true);
    floatYDecoration2.value = withRepeat(withSequence(withTiming(-15, { duration: 3500 }), withTiming(0, { duration: 3500 })), -1, true);
  }, []);

  const dec1Style = useAnimatedStyle(() => ({ transform: [{ translateY: floatYDecoration1.value }] }));
  const dec2Style = useAnimatedStyle(() => ({ transform: [{ translateY: floatYDecoration2.value }] }));

  return (
    <View className="flex-1 bg-surface relative">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#fcf8ff', '#f5f2fd', 'rgba(226, 223, 255, 0.2)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <SafeAreaView className="flex-1 z-10">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 48 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          {/* Header */}
          <View className="w-full flex-row justify-center items-center h-[64px]">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
                <GraduationCap size={18} color="#e7e4ff" />
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[24px] leading-[30px] text-primary tracking-tight">Mentor AI</Text>
            </View>
          </View>

          {/* Hero Section */}
          <View className="w-full items-center justify-center">
            <View className="relative w-full aspect-square flex items-center justify-center max-w-[320px] mb-6">
              {/* Decorative floating elements */}
              <Animated.View style={[dec1Style, { position: 'absolute', top: 0, left: 0, width: 64, height: 64, backgroundColor: 'rgba(173, 198, 255, 0.3)', borderRadius: 32 }]} />
              <Animated.View style={[dec2Style, { position: 'absolute', bottom: 40, right: 0, width: 96, height: 96, backgroundColor: 'rgba(88, 86, 214, 0.2)', borderRadius: 48 }]} />

              {/* Main Image */}
              <Animated.View style={[animatedStyle, { width: 280, height: 280, borderRadius: 48, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(228, 225, 236, 0.5)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }]}>
                <Image 
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPZQ55KiOHC2Vqtxuz3OiI6JhDbizff9XZDCvPO7Kmuj3lSQC_TD-aSCQNM2pC0lEwRl9sBPkwYJf2YAoNSPBUMCIfDNYkXgQJhL4K2p8L2Y44pPVNceNtA4aPDP255ccoqkh1Ils9I61dBdxpcjMDt2_mHp2xwHvCudrUJFhSgXDF_M-J8TnalB_w-rh4MjNE7oyDTW9854inhGGKbsujs7kPe_Pkmm6Klsi0NCWvyJuZN9zsmBuo6FXF2n2tD7ubGIybHew4NpY" }}
                  style={{ width: '100%', height: '100%' }}
                />
                
                {/* Overlay Pill */}
                <View className="absolute bottom-6 left-1/2 -ml-[60px] px-4 py-2 rounded-full flex-row items-center gap-2 border border-white/40" style={{ backgroundColor: 'rgba(252, 248, 255, 0.7)' }}>
                  <View className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-on-surface uppercase tracking-widest">TUTOR ONLINE</Text>
                </View>
              </Animated.View>
            </View>
            
            {/* Headlines */}
            <View className="items-center px-4 space-y-4">
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[28px] leading-[34px] text-on-surface text-center tracking-tight max-w-[280px]">
                Master a new language, naturally.
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[17px] leading-[24px] text-on-surface-variant text-center opacity-80 mt-2 max-w-[320px]">
                Join 1M+ learners practicing with their personal AI tutor 24/7.
              </Text>
            </View>
          </View>

          {/* Action Area */}
          <View className="w-full flex-col items-center mt-8">
            {/* Social Proof */}
            <View className="flex-row items-center justify-center mb-6">
              <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvfzEn3yhnQn482gzA5Erpvfoj7a_5z9vfSw2OorOEvJ4UDSZf27qcUNORmtbWa9VD8cKFS4LWcj5dobPhmX5VPCALyERhNx6_kdtXa2RQl4gVMAeVqdky4lg1p3fLHzg4kOnLy7V790uUK52QcpWHj-bInJfWpxfAOHYn1L2LacixCSolfOPM4UMNbC34l97EzTwWPvwP_K7pstPOhSRxwyOUH1T9qgvQRFsG_BQ3Pv2479U5Ze1cWXMMpvomerQ5E37WmAQXq5U" }} className="w-8 h-8 rounded-full border-2 border-surface z-30" />
              <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0lb-W37gLTtjs_BBsxZMrRygOdB57_KAu3O7EQTv1KPeL-WSpeo5a0DcnYFJnUTUfAewSfjd94oiYRlynII6vzJmNcfu2-ztbKth1lEQtp-Lxskcu1hLzgKG_0QXksaqxItgO6zejg-abKJ0cSVEEaHxXwTzWYsg7PZiguY_FUj8P5pTfshhlfZEYUb7oLJecsIElyp5ddsn3xU5eFo9XsG2emUv8AZnsFGviW1wmKAU30d8Nj6rHagfbp6OUE2GxaOc_F5xnAaI" }} className="w-8 h-8 rounded-full border-2 border-surface -ml-2 z-20" />
              <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYy-epXPz2V8AWMShRGO2S6M0aI30BpUfJ6l3jNL27t9UqESLTOQGhIvJdZzh7m7Sk88TU2iHDr1qsbRDMxGMbaE7CKooKEz1cxBkX_mbhx61fgT_1_sIdH5DF04i3GqGPSM60PC8AE5ETde25S2QDoalKArxt5hrQB9ezuwPWcrUOywPE29nrAsim3Mk4VKf9taQI-LvY7uflrCqJ3Cu9SNdWFkoQn4dxBGuPaMvR7C-aHYP1SQq6F0mo52w2cUuYq5lFD82FK9Q" }} className="w-8 h-8 rounded-full border-2 border-surface -ml-2 z-10" />
              <View className="items-center justify-center w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed -ml-2 z-0">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-on-primary-fixed">+1M</Text>
              </View>
            </View>

            {/* Primary Button */}
            <TouchableOpacity 
              className="w-full max-w-[320px] h-[64px] bg-primary-container rounded-full flex-row items-center justify-center mb-6 shadow-lg shadow-primary-container/30"
              activeOpacity={0.8}
              onPress={() => router.push('/(public)/native-language')}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-on-primary-container text-[20px]">Get Started</Text>
              <ArrowRight color="#e7e4ff" size={20} className="ml-2" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[17px] text-primary">I already have an account</Text>
            </TouchableOpacity>

            <View className="mt-12 flex-row gap-4 opacity-40">
              <Text className="text-2xl">🇺🇸</Text>
              <Text className="text-2xl">🇫🇷</Text>
              <Text className="text-2xl">🇪🇸</Text>
              <Text className="text-2xl">🇯🇵</Text>
              <Text className="text-2xl">🇩🇪</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
