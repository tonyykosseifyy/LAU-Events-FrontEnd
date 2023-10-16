import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopRightSVG from '../../../assets/wave_top_right.svg';
import TextWrapper from '../../components/TextWrapper';
import dayjs from 'dayjs';
import SearchSVG from '../../../assets/Icons/search.svg';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';
import { FlatList } from 'react-native-gesture-handler';
import EventCard from '../../components/EventCard';
import { Event } from '../../models/event';
import { isAxiosError } from '../../utils/errors/helpers';
import * as Notifications from 'expo-notifications';

enum Fitler {
  ALL = 'all',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
}

const Home = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filterUsed, setFilterUsed] = useState<Fitler>(Fitler.ALL);
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

  const { data: events, isLoading } = useQuery(
    ['events', session],
    async () => {
      const eventsApi = new EventApi(session);
      try {
        const res = await eventsApi.find();
        // filter the old events out

        return res.filter((event) => {
          return dayjs(event.startTime).isAfter(dayjs());
        });
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
      cacheTime: 1000 * 10, // 10 seconds
      refetchInterval: 1000 * 10,
      onSuccess: (data) => {
        setFilteredEvents(data);
      },
    }
  );

  const updateFilters = (filterValue?: Fitler) => {
    if (!session || !events) {
      setFilteredEvents([]);
      return;
    }

    if (search && search.length > 0 && !filterValue) {
      setFilteredEvents(
        events.filter((event) => {
          return event.eventName.toLowerCase().includes(search.toLowerCase());
        })
      );
    } else if (filterValue === Fitler.ALL) setFilteredEvents(events);
    else if (filterValue === Fitler.TODAY) {
      setFilteredEvents(
        events.filter((event) => {
          return dayjs(event.startTime).isSame(dayjs(), 'day');
        })
      );
    } else if (filterValue === Fitler.TOMORROW) {
      setFilteredEvents(
        events.filter((event) => {
          return dayjs(event.startTime).isSame(dayjs().add(1, 'day'), 'day');
        })
      );
    } else {
      setFilteredEvents(events);
    }
  };

  const responseListener = useRef<any>();

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (!data) {
        return;
      }

      // navigate to event details
      if (data.eventId) {
        if (authContext.authState.authenticated) {
          navigation.navigate('EventDetails', { eventId: data.eventId });
        } else {
          navigation.navigate('Signin');
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full">
      {isLoading || !events ? (
        <View className="mt-16 flex items-center justify-center">
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <FlatList
          ListHeaderComponent={() => {
            return (
              <>
                <TextWrapper className="text-black text-2xl">Scheduled Events</TextWrapper>
                <TextWrapper className="text-gray text-xl">
                  {dayjs().format('dddd, MMMM D, YYYY')}
                </TextWrapper>
                <View className="w-full relative">
                  <TextInput
                    className="bg-white-600 px-4 py-4 rounded-full w-full mt-14 relative"
                    placeholder="Search by Event"
                    placeholderTextColor="#AAAAAA"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.nativeEvent.text);
                    }}
                    onSubmitEditing={() => {
                      updateFilters();
                      // reset the search
                      setSearch('');
                    }}
                    cursorColor="green"></TextInput>
                  <Pressable
                    className="bg-brand absolute bottom-2 right-2 rounded-full p-3 flex items-center justify-center"
                    onPress={() => {
                      updateFilters();
                      // reset the search
                      setSearch('');
                    }}>
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
                        updateFilters(filter.value);
                      }}>
                      <TextWrapper
                        className={`text-sm ${
                          filterUsed === filter.value ? 'text-white' : 'text-gray'
                        }`}>
                        {filter.name}
                      </TextWrapper>
                    </Pressable>
                  ))}
                </View>
                <View className="h-5"></View>
              </>
            );
          }}
          ListFooterComponent={() => {
            return <View className="h-16"></View>;
          }}
          data={filteredEvents.length > 0 ? filteredEvents : events}
          className="w-full relative h-full px-6 py-10"
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
