import { View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import TextWrapper from '../components/TextWrapper';
import LogoNoText from '../../assets/logo_no_text.svg';

const Signin = () => {
  return (
    <SafeAreaView className="flex h-full w-full items-start gap-6 flex-col bg-brand-lighter pl-4 pr-8 pt-10">
      <LogoNoText width={250} height={93}></LogoNoText>
    </SafeAreaView>
  );
};

export default Signin;
