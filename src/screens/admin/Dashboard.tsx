import { View, Text, Platform } from 'react-native';
import React from 'react';
import TextWrapper from '../../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full">
      <TextWrapper>Dashboard</TextWrapper>
    </SafeAreaView>
  );
};

export default Dashboard;
