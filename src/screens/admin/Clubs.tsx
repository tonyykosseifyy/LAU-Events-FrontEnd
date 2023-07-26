import { View, Text, Pressable, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { Club } from '../../models/club';
import ClubCard from '../../components/ClubCard';

const AdminClubs = () => {
  const [clubs, setClubs] = React.useState<Club[]>([
    {
      clubName: 'Club 1',
      id: '1',
    },
    {
      clubName: 'Club 2',
      id: '2',
    },
    {
      clubName: 'Club 3',
      id: '3',
    },
  ]);
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Clubs</TextWrapper>
        <Pressable className="bg-brand px-4 py-2 rounded-lg">
          <TextWrapper className="text-white text-base">Add Club</TextWrapper>
        </Pressable>
      </View>
      <View className="h-fit w-full mt-14">
        <FlatList
          data={clubs}
          className="w-full"
          ItemSeparatorComponent={() => {
            return <View className="h-6" />; // space between items
          }}
          renderItem={({ item, index }) => <ClubCard club={item} key={index} />}
          //Setting the number of column
          numColumns={1}
          keyExtractor={(item, index) => index + ''}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdminClubs;
