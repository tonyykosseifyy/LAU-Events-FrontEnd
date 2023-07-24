import { View, Image, Pressable } from 'react-native';
import React from 'react';
import TextWrapper from '../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiSvg from '../../assets/confetti.svg';

const logo = require('../../assets/splash.png');
const OnBoarding = ({ navigation }: any) => {
  const pressGetStarted = () => {
    navigation.navigate('Signin');
  };

  return (
    <SafeAreaView className="flex h-full w-full items-center justify-around flex-col bg-brand-lighter pl-12 pr-8">
      <Image
        source={logo}
        style={{
          resizeMode: 'contain',
          width: '100%',
        }}></Image>
      <View className="bg-brand w-full px-4 py-5 rounded-2xl flex items-center justify-between flex-col gap-5 relative">
        <View className="absolute -top-6 left-1/2 w-1 h-1 flex items-center justify-center">
          <ConfettiSvg width={65} height={65}></ConfettiSvg>
        </View>

        <TextWrapper className="text-center text-white text-2xl font-bold">
          Unlock a Vibrant Campus Life!
        </TextWrapper>
        <TextWrapper className="text-center text-white text-xs">
          Your key to unlocking a world of excitement and enriching experiences throughout your
          university journey. 🌟🎉
        </TextWrapper>
        <Pressable
          className="bg-white rounded-3xl px-8 py-3"
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
