import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';
import { useAuth } from '../../context/AuthContext';

const Logout = ({ navigation }: any) => {
  const authContext = useAuth();
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6 flex items-center justify-center">
      <View className="bg-white p-8 flex justify-between flex-col">
        <TextWrapper className="text-black text-xl">Are you sure you want to logout?</TextWrapper>
        <View className="flex flex-row w-full justify-between items-center mt-10">
          <Pressable
            className="bg-white-600 px-6 py-2 rounded-lg"
            onPress={() => {
              navigation.goBack();
            }}>
            <TextWrapper className="text-black text-base">Go back</TextWrapper>
          </Pressable>
          <View className="w-4" />
          <Pressable
            className="bg-error px-8 py-2 rounded-lg"
            onPress={() => {
              authContext.signOut();
            }}>
            <TextWrapper className="text-white text-base">Logout</TextWrapper>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Logout;
