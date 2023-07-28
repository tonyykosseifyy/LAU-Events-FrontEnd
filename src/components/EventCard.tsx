import { View, Text, ImageBackground, Pressable } from 'react-native';
import React, { FC } from 'react';
import { Event } from '../models/event';
import TextWrapper from './TextWrapper';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';
import ArrowRightSVG from '../../assets/Icons/arrow_right.svg';

const event_placeholder = require('../../assets/event_image_placeholder.png');
const EventCard: FC<{ event: Event }> = ({ event }) => {
  return (
    <View className="w-full bg-white rounded-lg h-72 py-3 px-4">
      <View className="w-full h-[81%]">
        <ImageBackground
          source={event_placeholder}
          resizeMode="stretch"
          borderRadius={15}
          className="w-full h-full">
          <View className="w-full h-full flex justify-end">
            <BlurView intensity={100} className="h-16 rounded-b-lg">
              <BlurView intensity={100} className="w-full h-full">
                <BlurView intensity={100} className="w-full h-full  py-2 px-4">
                  <TextWrapper className="text-base font-bold text-black">
                    {event.eventName}
                  </TextWrapper>
                  <TextWrapper className="text-xs text-black">
                    {dayjs(event.startTime).format('DD/MM/YYYY - HH:mm')}
                  </TextWrapper>
                </BlurView>
              </BlurView>
            </BlurView>
          </View>
        </ImageBackground>
      </View>
      <View className="flex flex-row justify-between items-center mt-2 flex-wrap">
        <View className="flex items-center flex-row ">
          <View className="bg-success py-2 px-2 rounded-xl">
            <TextWrapper className="text-xs text-brand-dark">American Society Club</TextWrapper>
          </View>
        </View>
        <Pressable
          className="bg-brand py-2 px-3 rounded-2xl flex justify-between items-center flex-row"
          onPress={() => {}}>
          <TextWrapper className="text-white">Details</TextWrapper>
          <View className="w-5 h-1 bg-brand"></View>
          <ArrowRightSVG width={12} height={12} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

export default EventCard;
