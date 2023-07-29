import { View, Text } from 'react-native';
import React, { FC } from 'react';
import TextWrapper from './TextWrapper';
import clsx from 'clsx';

const Tag: FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <View
      className={clsx(
        'bg-success rounded-full px-3 py-1 flex items-center justify-center mx-1',
        className
      )}>
      <TextWrapper className="text-black text-xs">{text}</TextWrapper>
    </View>
  );
};

export default Tag;
