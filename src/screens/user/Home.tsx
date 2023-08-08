import { View, Text, TextInput, Pressable } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopRightSVG from '../../../assets/wave_top_right.svg';
import TextWrapper from '../../components/TextWrapper';
import dayjs from 'dayjs';
import SearchSVG from '../../../assets/Icons/search.svg';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';
import { FlatList } from 'react-native-gesture-handler';
import EventCard from '../../components/EventCard';

enum Fitler {
  ALL = 'all',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
}

const Home = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [filterUsed, setFilterUsed] = useState<Fitler>(Fitler.ALL);

  const { data: events } = useQuery(
    ['events', session],
    async () => {
      const eventsApi = new EventApi(session);
      const res = await eventsApi.find();
      // filter the old events out
      if (!res) return [];
      return res.filter((event) => {
        return dayjs(event.startTime).isAfter(dayjs());
      });
    },
    {
      enabled: !!session,
      cacheTime: 1000 * 10, // 10 seconds
      refetchInterval: 1000 * 10,
      initialData: [],
    }
  );

  const filteredEvents = useMemo(() => {
    if (!session) return [];
    if (filterUsed === Fitler.ALL) return events;
    if (filterUsed === Fitler.TODAY) {
      return events.filter((event) => {
        return dayjs(event.startTime).isSame(dayjs(), 'day');
      });
    }
    if (filterUsed === Fitler.TOMORROW) {
      return events.filter((event) => {
        return dayjs(event.startTime).isSame(dayjs().add(1, 'day'), 'day');
      });
    }
    return events;
  }, [filterUsed, events]);

  const filters = useMemo(() => {
    return [
      {
        name: 'All',
        value: Fitler.ALL,
      },
      {
        name: 'Today',
        value: Fitler.TODAY,
      },
      {
        name: 'Tomorrow',
        value: Fitler.TOMORROW,
      },
    ];
  }, []);

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="absolute top-0 right-0">
        <WaveTopRightSVG />
      </View>
      <TextWrapper className="text-black text-2xl">Scheduled Events</TextWrapper>
      <TextWrapper className="text-gray text-xl">
        {dayjs().format('dddd, MMMM D, YYYY')}
      </TextWrapper>

      <View className="w-full relative">
        <TextInput
          className="bg-white-600 px-4 py-4 rounded-full w-full mt-14 relative"
          placeholder="Search by Event"
          cursorColor="green"></TextInput>
        <Pressable className="bg-brand absolute bottom-2 right-2 rounded-full p-3 flex items-center justify-center">
          <SearchSVG color="white" />
        </Pressable>
      </View>

      <TextWrapper className="text-base mt-5">Upcoming Events</TextWrapper>
      <View className="mt-5 flex flex-row items-center">
        {filters.map((filter) => (
          <Pressable
            key={filter.value}
            className={`px-4 py-2 rounded-full mr-2 ${
              filterUsed === filter.value ? 'bg-brand text-white' : 'bg-white'
            }`}
            onPress={() => {
              setFilterUsed(filter.value);
            }}>
            <TextWrapper
              className={`text-sm ${filterUsed === filter.value ? 'text-white' : 'text-gray'}`}>
              {filter.name}
            </TextWrapper>
          </Pressable>
        ))}
      </View>
      {filteredEvents && filteredEvents.length > 0 ? (
        <FlatList
          data={events.filter((event) => {
            if (filterUsed === Fitler.ALL) return true;
            if (filterUsed === Fitler.TODAY) {
              return dayjs(event.startTime).isSame(dayjs(), 'day');
            }
            if (filterUsed === Fitler.TOMORROW) {
              return dayjs(event.startTime).isSame(dayjs().add(1, 'day'), 'day');
            }
            return true;
          })}
          className="w-full mt-6"
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
        <View className="mt-16 flex items-center justify-center">
          <TextWrapper className="text-2xl text-gray">No events found</TextWrapper>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
