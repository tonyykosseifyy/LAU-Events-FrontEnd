import { View, Text, Platform } from 'react-native';
import React from 'react';
import TextWrapper from '../../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const authContext = useAuth();

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full">
      <TextWrapper>Dashboard signed in as {authContext.user?.email}</TextWrapper>
    </SafeAreaView>
  );
};

export default Dashboard;
