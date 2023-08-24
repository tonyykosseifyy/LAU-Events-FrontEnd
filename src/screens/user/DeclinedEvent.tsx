import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { EventApi } from '../../utils/api/crud/events';
import { Event } from '../../models/event';
import WaveTopRightSVG from '../../../assets/wave_top_right.svg';
import { isAxiosError } from '../../utils/errors/helpers';

const DeclinedEvent = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const { data: events, isLoading } = useQuery(
    ['declinedEvents', session],
    async () => {
      const eventsApi = new EventApi(session);
      try {
        const res: Event[] = await eventsApi.findDeclined();
        if (!res) return [];
        return res;
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.status === 404 || e.status === 401) {
            authContext.signOut();
          }
        }
        return [];
      }
    },
    {
      enabled: !!session,
      cacheTime: 1000 * 10,
      refetchInterval: 1000 * 10,
    }
  );

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="absolute top-0 right-0">
        <WaveTopRightSVG />
      </View>
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Declined Events</TextWrapper>
      </View>
      <View className="h-fit w-full mt-14">
        {!events || isLoading ? (
          <View className="mt-16 flex items-center justify-center">
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : events.length > 0 ? (
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
            <TextWrapper className="text-2xl text-gray">No Declined Events found</TextWrapper>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DeclinedEvent;
