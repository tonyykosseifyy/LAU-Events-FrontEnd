import { View, Text, Pressable } from 'react-native';
import React, { FC } from 'react';
import TextWrapper from './TextWrapper';
import { Club } from '../models/club';
import ArrowTopRightSVG from '../../assets/Icons/arrow_top_right.svg';

const ClubCard: FC<{ club: Club }> = ({ club }) => {
  const pressOnClub = (club: Club) => {};
  return (
    <View className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-row justify-between items-center">
      <TextWrapper className="text-2xl text-black">{club.clubName}</TextWrapper>
      <Pressable
        className="p-4 bg-brand rounded-full"
        onPress={() => {
          pressOnClub(club);
        }}>
        <ArrowTopRightSVG width={12} height={12} color="#fff" />
      </Pressable>
    </View>
  );
};

export default ClubCard;
