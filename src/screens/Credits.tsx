import { View, Text, Linking } from 'react-native';
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
          By the Software Engineering Club
        </TextWrapper>
        <View className="w-full flex flex-row justify-between mt-4">
          <View className="flex flex-col">
            <TextWrapper className="text-black text-xl mt-5 ">Frontend Devs</TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://github.com/Murf-y');
              }}>
              - Charbel Fayad
            </TextWrapper>
          </View>
          <View className="w-[1px] h-full bg-black/10 rounded-full"></View>
          <View className="flex flex-col">
            <TextWrapper className="text-black text-xl mt-5">Backend Devs</TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://github.com/JeanPaulBassil');
              }}>
              - JeanPaul
            </TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://github.com/tonyykosseifyy');
              }}>
              - Tony
            </TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://github.com/Pdaaboul');
              }}>
              - Peter Daaboul
            </TextWrapper>
          </View>
        </View>
        <TextWrapper className="text-black font-bold text-xl mt-12">Special Thanks to:</TextWrapper>
        <TextWrapper
          className="text-black text-base mt-2 ml-5 underline"
          onPress={() => {
            Linking.openURL('https://github.com/Ghantoos7');
          }}>
          - Georgio Ghnatios
        </TextWrapper>
        <TextWrapper
          className="text-black text-base mt-2 ml-5 underline"
          onPress={() => {
            Linking.openURL('https://github.com/Murf-y');
          }}>
          - Salim
        </TextWrapper>
      </View>
    </SafeAreaView>
  );
};

export default Credits;
