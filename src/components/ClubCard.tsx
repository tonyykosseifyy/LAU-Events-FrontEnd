import { View, Text, Pressable } from 'react-native';
import React, { FC } from 'react';
import TextWrapper from './TextWrapper';
import { Club, ClubStatus } from '../models/club';
import ArrowTopRightSVG from '../../assets/Icons/arrow_top_right.svg';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';

const ClubCard: FC<{ club: Club; navigation: any }> = ({ club, navigation }) => {
  const pressOnClub = (club: Club) => {
    navigation.navigate('ClubDetails', {
      clubId: club.id,
    });
  };

  console.log(club);
  return (
    <View
      className={clsx(
        'rounded-lg shadow-lg p-4 w-full flex flex-row justify-between items-center',
        {
          'bg-gray-300': club.status === ClubStatus.INACTIVE,
          'bg-white': club.status === ClubStatus.ACTIVE,
        }
      )}>
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
