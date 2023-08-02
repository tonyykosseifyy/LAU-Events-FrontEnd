import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { Event, EventStatus } from '../../models/event';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';

const AdminEvents = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);
  const [dataSource, setDataSource] = useState<Event[]>([]);

  useEffect(() => {
    if (!session) return;

    const getEvents = async () => {
      try {
        const eventApi = new EventApi(session);
        const res = await eventApi.find();
        setDataSource(res);
      } catch (e) {
        console.log(e);
        authContext.signOut();
      }
    };
    getEvents();
  }, []);

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
        {dataSource && dataSource.length > 0 ? (
          <FlatList
            data={dataSource}
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
