import React from 'react';
import { Text, TextProps } from 'react-native';

export default function TextWrapper(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'PT Sans' }]} />;
}
