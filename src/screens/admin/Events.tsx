import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { Event, EventStatus } from '../../models/event';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';
import { useQuery } from '@tanstack/react-query';

const AdminEvents = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const { data: events } = useQuery(
    ['events', session],
    async () => {
      const eventsApi = new EventApi(session);
      try {
        const res = await eventsApi.find();
        if (!res) return [];
        return res;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    {
      enabled: !!session,
      cacheTime: 1000 * 10,
      refetchInterval: 1000 * 10,
      initialData: [],
    }
  );

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Events</TextWrapper>
        <Pressable
          className="bg-brand px-4 py-2 rounded-lg"
          onPress={() => {
            navigation.navigate('AddEvent');
          }}>
          <TextWrapper className="text-white text-base">Add Event</TextWrapper>
        </Pressable>
      </View>
      <View className="h-fit w-full mt-14">
        {events && events.length > 0 ? (
          <FlatList
            data={events}
            className="w-full"
            ItemSeparatorComponent={() => {
              return <View className="h-10" />; // space between items
            }}
            renderItem={({ item, index }) => (
              <EventCard event={item} key={index} navigation={navigation} />
            )}
            //Setting the number of column
            numColumns={1}
            keyExtractor={(item, index) => index + ''}
          />
        ) : (
          <View className="flex flex-row w-full h-full justify-center items-center">
            <TextWrapper className="text-2xl text-gray">No events found</TextWrapper>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminEvents;
