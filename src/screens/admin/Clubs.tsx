import { View, Text, Pressable, FlatList, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { Club, ClubRequest } from '../../models/club';
import ClubCard from '../../components/ClubCard';
import { TextInput } from 'react-native-gesture-handler';
import { ClubApi } from '../../utils/api/crud/clubs';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';

const AdminClubs = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);
  const [modalVisible, setModalVisible] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubNameError, setClubNameError] = useState<string | null>(null);

  const [clubs, setClubs] = React.useState<Club[]>([]);

  useEffect(() => {
    const getClubs = async () => {
      try {
        const clubApi = new ClubApi(session);
        const res = await clubApi.find();
        console.log(res);
        setClubs(res);
      } catch (e) {
        console.log(e);
        authContext.signOut();
      }
    };
    getClubs();
  }, []);

  const addClub = async () => {
    if (!clubName || clubName.length < 3) {
      setClubNameError('Please enter a valid club name');
      return;
    }

    const newClub: ClubRequest = {
      clubName: clubName.trim(),
    };

    try {
      const clubApi = new ClubApi(session);
      const res = await clubApi.create(newClub);
      console.log(res);
      setClubs([...clubs, res]);
      setModalVisible(false);
      setClubName('');
      setClubNameError(null);
    } catch (e) {
      setClubNameError('Something went wrong, club already exists');
    }
  };

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="w-full h-full flex justify-center items-center bg-brand/20">
          <View className="bg-brand-lighter w-5/6 h-72 rounded-lg py-4 px-6 flex flex-col justify-between">
            <View className="flex flex-col">
              <View className="flex flex-row justify-between items-center w-full">
                <TextWrapper className="text-xl text-black">Add Club</TextWrapper>
                <Pressable
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <TextWrapper className="text-xl text-black">x</TextWrapper>
                </Pressable>
              </View>
              <View className="h-6" />
              <View className="flex flex-col">
                <TextWrapper className="text-base text-black">Club Name</TextWrapper>
                <View className="h-2" />
                <TextInput
                  className="bg-white border-[1px] border-gray-300 text-black rounded p-2 focus:border-gray-400"
                  cursorColor="green"
                  placeholder="Club Name"
                  onChangeText={(text) => {
                    setClubName(text);
                    setClubNameError(null);
                  }}
                  value={clubName}
                />
                <View className="h-2" />
                {clubNameError && (
                  <TextWrapper className="text-sm text-red-500">{clubNameError}</TextWrapper>
                )}
              </View>
            </View>
            <View className="flex flex-row w-full justify-end items-center">
              <Pressable
                className="bg-gray/40 px-6 py-2 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                  setClubName('');
                }}>
                <TextWrapper className="text-black text-base">Cancel</TextWrapper>
              </Pressable>
              <View className="w-4" />
              <Pressable
                className="bg-brand px-8 py-2 rounded-lg"
                onPress={() => {
                  addClub();
                }}>
                <TextWrapper className="text-white text-base">Add</TextWrapper>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Clubs</TextWrapper>
        <Pressable
          className="bg-brand px-4 py-2 rounded-lg"
          onPress={() => {
            setModalVisible(true);
          }}>
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
          renderItem={({ item, index }) => (
            <ClubCard club={item} key={index} navigation={navigation} />
          )}
          //Setting the number of column
          numColumns={1}
          keyExtractor={(item, index) => index + ''}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdminClubs;
