import { View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TextWrapper from '../../components/TextWrapper';
import HomeSVG from '../../../assets/Icons/home.svg';
import DeclinedSVG from '../../../assets/Icons/declined_events.svg';
import LogoutSVG from '../../../assets/Icons/logout.svg';
import TwoLinesSVG from '../../../assets/Icons/two_lines.svg';
import { useAuth } from '../../context/AuthContext';
import Credits from '../Credits';
import DeclinedEvent from './DeclinedEvent';
import Home from './Home';
import Logout from './Logout';

const Tab = createBottomTabNavigator();

const UserHome = () => {
  const { authState } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#F6F6F6',
          borderTopColor: '#006E58',
          borderTopWidth: 8,
          height: 75,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <HomeSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Home</TextWrapper>
              </View>
            ) : (
              <View>
                <HomeSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="DeclinedEvent"
        component={DeclinedEvent}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <DeclinedSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Declined Events</TextWrapper>
              </View>
            ) : (
              <View>
                <DeclinedSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Credits"
        component={Credits}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <TwoLinesSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Credits</TextWrapper>
              </View>
            ) : (
              <View>
                <TwoLinesSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <LogoutSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Logout</TextWrapper>
              </View>
            ) : (
              <View>
                <LogoutSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default UserHome;
