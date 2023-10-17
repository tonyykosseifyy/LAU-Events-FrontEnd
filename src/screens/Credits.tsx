import { View, Text, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopLeftSVG from '../../assets/wave_top_left.svg';
import TextWrapper from '../components/TextWrapper';
import ClubLogoSVG from '../../assets/club_logo.svg';

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
        <View className="flex flex-row items-center justify-center">
          <ClubLogoSVG width={55} height={55}></ClubLogoSVG>
          <View className="w-3"></View>
          <TextWrapper className="text-black text-xl font-bold">
            Software Engineering Club
          </TextWrapper>
        </View>
        <View className="w-full flex flex-row justify-between mt-2">
          <View className="flex flex-col border-b-[1px] border-black/10 pb-8">
            <TextWrapper className="text-black text-xl mt-2">Frontend Devs</TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://github.com/Murf-y');
              }}>
              - Charbel Fayad
            </TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/in/peter-chahid-55991b262');
              }}>
              - Peter Daaboul
            </TextWrapper>
          </View>
          <View className="w-[1px] h-full bg-black/10 rounded-full"></View>
          <View className="flex flex-col border-b-[1px] border-black/10">
            <TextWrapper className="text-black text-xl mt-2">Backend Devs</TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/in/jean-paul-bassil');
              }}>
              - Jean-Paul Bassil
            </TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/in/tonyy-kosseifyy/');
              }}>
              - Tony Kosseify
            </TextWrapper>
          </View>
        </View>
        <View className="w-full flex flex-row justify-between mt-5">
          <View className="flex flex-col">
            <TextWrapper className="text-black text-xl mt-2">Security Audit</TextWrapper>
            <TextWrapper
              className="text-black text-base mt-2 ml-5 underline"
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/in/elio-anthony-chukri/');
              }}>
              - Elio Chukri
            </TextWrapper>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Credits;
