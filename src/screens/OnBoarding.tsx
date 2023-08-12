import { View, Image, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import TextWrapper from '../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiSvg from '../../assets/confetti.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../assets/splash.png');

const OnBoarding = ({ navigation }: any) => {
  useEffect(() => {
    AsyncStorage.setItem('appLaunched', 'false');
  }, []);
  const pressGetStarted = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView className="flex h-full w-full items-center justify-around flex-col bg-brand-lighter px-8">
      <Image
        source={logo}
        style={{
          resizeMode: 'contain',
          width: '100%',
        }}></Image>
      <View className="bg-brand w-full px-6 py-5 rounded-2xl flex items-center justify-between flex-col relative">
        <View className="absolute -top-6 left-[55%] w-5 h-5 flex items-center justify-center">
          <ConfettiSvg width={65} height={65}></ConfettiSvg>
        </View>

        <TextWrapper className="text-center text-white text-2xl font-bold mt-5">
          Unlock a Vibrant Campus Life!
        </TextWrapper>
        <TextWrapper className="text-center text-white text-xs  mt-5">
          Your key to unlocking a world of excitement and enriching experiences throughout your
          university journey. 🌟🎉
        </TextWrapper>
        <Pressable
          className="bg-white rounded-3xl px-8 py-3  mt-5"
          onPress={() => {
            pressGetStarted();
          }}>
          <TextWrapper className="text-center text-brand text-xl">Get Started</TextWrapper>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding;
