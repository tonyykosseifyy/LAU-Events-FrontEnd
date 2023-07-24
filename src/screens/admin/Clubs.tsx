import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from '../../components/TextWrapper';

const AdminClubs = () => {
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full">
      <TextWrapper>Clubs</TextWrapper>
    </SafeAreaView>
  );
};

export default AdminClubs;
