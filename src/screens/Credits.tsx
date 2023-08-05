import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopLeftSVG from '../../assets/wave_top_left.svg';
import TextWrapper from '../components/TextWrapper';
const Credits = () => {
  return (
    <SafeAreaView className="w-full h-full bg-brand-lighter relative py-10 px-6">
      <View className="absolute top-0 left-0">
        <WaveTopLeftSVG />
      </View>
      <View className="w-full flex justify-center items-center relative flex-row">
        <TextWrapper className="text-2xl">Credits</TextWrapper>
      </View>
      <View className="w-full mt-12 flex flex-col">
        <TextWrapper className="text-black text-xl font-bold">
          Software Engineering Club
        </TextWrapper>
        {/* byllet point list in react native */}
        <TextWrapper className="text-black text-xl mt-5">Frontend</TextWrapper>
        <TextWrapper className="text-black text-base mt-2 ml-5">- Charbel Fayad</TextWrapper>
        <TextWrapper className="text-black text-xl mt-5">Backend</TextWrapper>
        <TextWrapper className="text-black text-base mt-2 ml-5">- JeanPaul</TextWrapper>
        <TextWrapper className="text-black text-base mt-2 ml-5">- Tony</TextWrapper>
        <TextWrapper className="text-black text-base mt-2 ml-5">- Peter Daaboul</TextWrapper>
      </View>
    </SafeAreaView>
  );
};

export default Credits;
