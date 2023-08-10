import { View, Text, ImageBackground, Pressable, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EventApi } from '../../utils/api/crud/events';
import useSession from '../../hooks/useSession';
import { useAuth } from '../../context/AuthContext';
import { Event, EventStatus } from '../../models/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopLeftSVG from '../../../assets/wave_top_left.svg';
import WaveRightSVG from '../../../assets/wave_right.svg';
import ArrowRight from '../../../assets/Icons/arrow_right.svg';
import TextWrapper from '../../components/TextWrapper';
import Tag from '../../components/Tag';
import dayjs from 'dayjs';
import { UserEventApi } from '../../utils/api/crud/userEvent';
import { UserEventStatus } from '../../models/userEvents';

const event_placeholder = require('../../../assets/event_image_placeholder.png');

export const EventDetails = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [event, setEvent] = useState<Event | null>(null);
  useEffect(() => {
    if (!session || !eventId) {
      authContext.signOut();
      return;
    }

    try {
      const getEvent = async () => {
        const res = await new EventApi(session).findOneWithDetails(eventId);
        setEvent(res);
      };
      getEvent();
    } catch (e) {
      console.log(e);
      authContext.signOut();
    }
  }, []);

  return (
    <SafeAreaView className="w-full h-full bg-brand-lighter relative py-10 px-8 flex justify-between">
      <View className="absolute top-0 left-0">
        <WaveTopLeftSVG />
      </View>
      <View className="absolute bottom-1/4 right-0">
        <WaveRightSVG />
      </View>
      <View className="w-full flex justify-center items-center relative flex-row">
        <Pressable
          className="absolute left-0 w-10 h-10 flex justify-center items-center"
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowRight width={18} height={18} color="#fff" rotation={180}></ArrowRight>
        </Pressable>
        <TextWrapper className="text-2xl">Event Details</TextWrapper>
      </View>
      <View className="bg-white w-full px-4 py-4 rounded-lg flex flex-col mt-5 shadow-xl shadow-black">
        <View className="w-full aspect-video">
          <ImageBackground
            source={event_placeholder}
            resizeMode="cover"
            borderRadius={10}
            className="w-full h-full"></ImageBackground>
        </View>
        <TextWrapper className="font-bold text-black text-xl mt-3">{event?.eventName}</TextWrapper>
        <TextWrapper className="text-gray text-base mt-2">
          {event?.startTime ? dayjs(event.startTime).format('MMMM D - HH:mm a') : 'Unkown Date'}
        </TextWrapper>
        <View className="flex flex-row flex-wrap items-center mt-4">
          <TextWrapper className="text-black font-bold text-base mt-2 mr-1">Clubs</TextWrapper>
          {event?.Clubs &&
            event.Clubs.map((club, index) => <Tag text={club.clubName} key={index} />)}
        </View>
        <TextWrapper className="text-black font-bold text-base mt-2">Description</TextWrapper>
        <TextWrapper className="text-gray text-xs mt-2">{event?.eventDescription}</TextWrapper>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row w-full justify-between items-center mt-10">
          <Pressable
            className="bg-gray/40 px-6 py-2 rounded-lg"
            onPress={() => {
              const userId = authContext.authState.user?.id;
              const eventId = event?.id;
              if (!userId || !eventId) return;

              const userEventApi = new UserEventApi(session);
              userEventApi.create({
                userId,
                eventId,
                status: UserEventStatus.Declined,
              });
              navigation.goBack();
            }}>
            <TextWrapper className="text-black text-base">Decline</TextWrapper>
          </Pressable>
          <View className="w-4" />
          <Pressable
            className="bg-brand px-8 py-2 rounded-lg"
            onPress={() => {
              const userId = authContext.authState.user?.id;
              const eventId = event?.id;
              if (!userId || !eventId) return;

              const userEventApi = new UserEventApi(session);
              userEventApi.create({
                userId,
                eventId,
                status: UserEventStatus.Accepted,
              });
            }}>
            <TextWrapper className="text-white text-base">Accept</TextWrapper>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
