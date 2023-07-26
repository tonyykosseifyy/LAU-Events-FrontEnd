import { View, Text, ImageBackground } from 'react-native';
import React, { FC } from 'react';
import { Event } from '../models/event';
import TextWrapper from './TextWrapper';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';

const event_placeholder = require('../../assets/event_image_placeholder.png');
const EventCard: FC<{ event: Event }> = ({ event }) => {
  return (
    <View className="w-full bg-white rounded-lg h-72 py-3 px-4">
      <View className="w-full h-5/6">
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
                    {dayjs(event.startTime).format('DD/MM/YYYY HH:mm')}
                  </TextWrapper>
                </BlurView>
              </BlurView>
            </BlurView>
          </View>
        </ImageBackground>
      </View>
      <Text>EventCard</Text>
    </View>
  );
};

export default EventCard;
