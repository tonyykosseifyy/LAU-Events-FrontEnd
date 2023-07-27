import { View, Text, Pressable } from 'react-native';
import React, { FC } from 'react';
import TextWrapper from './TextWrapper';
import { Event } from '../models/event';
import ArrowTopRightSVG from '../../assets/Icons/arrow_top_right.svg';
import { useNavigation } from '@react-navigation/native';

const SmallEventCard: FC<{ event: Event; navigation: any }> = ({ event, navigation }) => {
  const pressOnEvent = (event: Event) => {};

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-row justify-between items-center">
      <TextWrapper className="text-2xl text-black">{event.eventName}</TextWrapper>
      <Pressable className="p-4 bg-brand rounded-full" onPress={() => {}}>
        <ArrowTopRightSVG width={12} height={12} color="#fff" />
      </Pressable>
    </View>
  );
};

export default SmallEventCard;
