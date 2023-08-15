import { View, Pressable, FlatList, Modal, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { ClubRequest, ClubStatus } from '../../models/club';
import ClubCard from '../../components/ClubCard';
import { TextInput } from 'react-native-gesture-handler';
import { ClubApi } from '../../utils/api/crud/clubs';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { isAxiosError } from 'axios';
import { getAxiosError } from '../../utils/errors';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '@env';

const event_placeholder = require('../../../assets/event_image_placeholder.png');

const AdminClubs = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubNameError, setClubNameError] = useState<string | null>(null);
  const [clubImageError, setClubImageError] = useState<string | null>(null);

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const { data: clubs, isLoading } = useQuery(
    ['AdminClubs'],
    async () => {
      try {
        const clubApi = new ClubApi(session);
        const res = await clubApi.find();
        if (!res) return [];
        return res;
      } catch (e) {
        console.log(e);
        authContext.signOut();
      }
    },
    {
      enabled: !!session,
      cacheTime: 1000 * 10,
      refetchInterval: 1000 * 10,
    }
  );

  const addClub = async () => {
    if (!clubName || clubName.length < 3) {
      setClubNameError('Please enter a valid club name');
      return;
    }

    if (image === null) {
      setClubImageError('Please select an image');
      return;
    }

    if (image.fileSize && image.fileSize > 5 * 1024 * 1024) {
      setClubImageError('Please select an image less than 5mb');
      return;
    }

    let imageUrl: string | null = null;

    try {
      const res = await FileSystem.uploadAsync(API_URL + '/upload', image.uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.status !== 200) {
        setClubImageError('Could not upload image, please try again');
        return;
      }
      const body: any = JSON.parse(res.body);
      imageUrl = body.imageUrl;
    } catch (e) {
      if (isAxiosError(e)) {
        setClubImageError(getAxiosError(e));
      } else {
        console.log(e);
        setClubImageError('Could not upload image, please try again');
      }
      return;
    }

    if (!imageUrl) {
      setClubImageError('Could not upload image, please try again');
      return;
    }

    const newClub: ClubRequest = {
      clubName: clubName.trim(),
      status: ClubStatus.ACTIVE,
      imagePath: imageUrl,
    };

    try {
      const clubApi = new ClubApi(session);
      await clubApi.create(newClub);
      queryClient.invalidateQueries(['AdminClubs']);
      queryClient.refetchQueries(['AdminClubs']);
      setModalVisible(false);
      setClubName('');
      setClubNameError(null);
    } catch (e) {
      if (isAxiosError(e)) {
        setClubNameError(getAxiosError(e));
      } else {
        setClubNameError('Something went wrong, club already exists');
      }
    }
  };

  const clickedOnAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      // re request
      clickedOnAddImage();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        selectionLimit: 1,
      });
      if (!result.canceled) {
        if (result.assets[0].type !== 'image') {
          setClubImageError('Please select an image');
          return;
        }
        setImage(result.assets[0]);
        setClubImageError(null);
      }
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
          <View className="bg-brand-lighter w-5/6 h-fit rounded-lg py-4 px-6 flex flex-col justify-between">
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
              <View className="flex flex-col">
                <TextWrapper className="text-base text-black">Club Image</TextWrapper>
                <Pressable
                  className="w-full bg-white-700 flex items-center justify-center flex-col p-4 border-[1px] border-brand-light/25 rounded-lg mt-2"
                  onPress={() => {
                    clickedOnAddImage();
                  }}>
                  {image === null ? (
                    <>
                      <View className="w-16 h-16 border-2 border-brand-light rounded-lg flex items-center justify-center">
                        <TextWrapper className="text-2xl text-gray">+</TextWrapper>
                      </View>
                      <TextWrapper className="text-gray mt-2">Click to Add an Image</TextWrapper>
                    </>
                  ) : (
                    <Pressable
                      className="w-32 h-32"
                      onPress={() => {
                        clickedOnAddImage();
                      }}>
                      <ImageBackground
                        source={{ uri: image.uri }}
                        resizeMode="cover"
                        className="w-full h-full"
                        borderRadius={5}
                      />
                    </Pressable>
                  )}
                </Pressable>
                {clubImageError && (
                  <TextWrapper className="text-sm text-red-500">{clubImageError}</TextWrapper>
                )}
              </View>
            </View>
            <View className="flex flex-row w-full justify-end items-center mt-10">
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
        {!clubs || isLoading ? (
          <View className="mt-16 flex items-center justify-center">
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : clubs.length > 0 ? (
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
        ) : (
          <View className="flex items-center justify-center h-full">
            <TextWrapper className="text-2xl text-gray"> No Clubs Found</TextWrapper>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminClubs;
