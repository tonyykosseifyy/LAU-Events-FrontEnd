import { View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Clubs from './Clubs';
import Events from './Events';
import Dashboard from './Dashboard';
import TextWrapper from '../../components/TextWrapper';
import DashboardSVG from '../../../assets/Icons/dashboard.svg';
import EventsSVG from '../../../assets/Icons/events.svg';
import ClubsSVG from '../../../assets/Icons/clubs.svg';
import TwoLinesSVG from '../../../assets/Icons/two_lines.svg';
import { useAuth } from '../../context/AuthContext';
import Credits from '../Credits';

const Tab = createBottomTabNavigator();

const AdminHome = () => {
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
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center ml-3">
                <DashboardSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-1">Dashboard</TextWrapper>
              </View>
            ) : (
              <View>
                <DashboardSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <EventsSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Events</TextWrapper>
              </View>
            ) : (
              <View>
                <EventsSVG width={20} height={20} color="#AAAAAA" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={Clubs}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <View className="bg-brand p-2 rounded-md flex flex-row items-center">
                <ClubsSVG width={20} height={20} color="#EAF2EF" />
                <TextWrapper className="text-white text-xs pl-2">Clubs</TextWrapper>
              </View>
            ) : (
              <View>
                <ClubsSVG width={20} height={20} color="#AAAAAA" />
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
    </Tab.Navigator>
  );
};

export default AdminHome;
