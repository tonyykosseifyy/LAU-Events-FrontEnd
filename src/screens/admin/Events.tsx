import { View, Text, Pressable, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { Event, EventStatus } from '../../models/event';
import EventCard from '../../components/EventCard';

const AdminEvents = () => {
  const [dataSource, setDataSource] = React.useState<Event[]>([
    {
      eventName: 'Living the AI Age',
      eventDescription: 'A talk on the future of AI',
      startTime: new Date(),
      endTime: new Date(),
      id: '1',
      clubId: '1',
      status: EventStatus.Active,
      studentsAccepted: [],
    },
  ]);
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Events</TextWrapper>
        <Pressable className="bg-brand px-4 py-2 rounded-lg">
          <TextWrapper className="text-white text-base">Add Event</TextWrapper>
        </Pressable>
      </View>
      <View className="h-fit w-full mt-14">
        <FlatList
          data={dataSource}
          className="w-full"
          renderItem={({ item, index }) => <EventCard event={item} key={index} />}
          //Setting the number of column
          numColumns={1}
          keyExtractor={(item, index) => index + ''}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdminEvents;
