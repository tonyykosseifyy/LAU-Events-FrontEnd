import { View, Text, Pressable, ImageBackground, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';
import { Event } from '../../models/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import WaveTopLeftSVG from '../../../assets/wave_top_left.svg';
import WaveRightSVG from '../../../assets/wave_right.svg';
import ArrowRight from '../../../assets/Icons/arrow_right.svg';
import dayjs from 'dayjs';
import Tag from '../../components/Tag';

const event_placeholder = require('../../../assets/event_image_placeholder.png');

const EventDetails = ({ route, navigation }: any) => {
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

  const getUsernameFromLAUEmail = (email: string) => {
    const left = email.split('@')[0];
    const username = left.split('.').join(' ');
    // remove number from username
    const usernameWithoutNumber = username.replace(/[0-9]/g, '');
    return usernameWithoutNumber;
  };
  return (
    <SafeAreaView className="w-full h-full bg-brand-lighter relative py-10 px-8">
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

        <View className="flex flex-row w-full justify-between items-center mt-5">
          <TextWrapper className="text-black font-bold text-base">Acceptance Count</TextWrapper>
          <TextWrapper>{event?.Users?.length ?? 0}</TextWrapper>
        </View>
        <View className="flex flex-row w-full justify-between items-center mt-2">
          <TextWrapper className="text-black font-bold text-base">Decline Count</TextWrapper>
          <TextWrapper>{event?.declinedUsers ?? 0}</TextWrapper>
        </View>
      </View>

      <View className="mt-8 w-full flex flex-col">
        <TextWrapper className="text-black font-bold text-base">Accepted Students</TextWrapper>
        {event?.Users && event.Users.length > 0 ? (
          <FlatList
            data={event.Users}
            renderItem={({ item }) => (
              <TextWrapper className="text-gray text-sm mt-2" key={item.id}>
                - {getUsernameFromLAUEmail(item.email)}
              </TextWrapper>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <TextWrapper className="text-gray text-sm mt-2">
            No students have accepted this event yet.
          </TextWrapper>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventDetails;
