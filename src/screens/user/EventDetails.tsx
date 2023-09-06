import { View, ImageBackground, Pressable, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EventApi } from '../../utils/api/crud/events';
import useSession from '../../hooks/useSession';
import { useAuth } from '../../context/AuthContext';
import { Event } from '../../models/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveTopLeftSVG from '../../../assets/wave_top_left.svg';
import WaveRightSVG from '../../../assets/wave_right.svg';
import ArrowRight from '../../../assets/Icons/arrow_right.svg';
import TextWrapper from '../../components/TextWrapper';
import Tag from '../../components/Tag';
import dayjs from 'dayjs';
import { UserEventApi } from '../../utils/api/crud/userEvent';
import { UserEventStatus } from '../../models/userEvents';
import { isAxiosError } from 'axios';
import { getAxiosError } from '../../utils/errors';
import * as Calendar from 'expo-calendar';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../constants';

const event_placeholder = require('../../../assets/event_image_placeholder.png');

export const EventDetails = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const authContext = useAuth();
  const queryClient = useQueryClient();
  const session = useSession(authContext.authState);

  const [event, setEvent] = useState<Event | null>(null);
  useEffect(() => {
    if (!session || !eventId) {
      authContext.signOut();
      return;
    }

    try {
      const getEvent = async () => {
        const res = await new EventApi(session).findOne(eventId);
        setEvent(res);
      };
      getEvent();
    } catch (e) {
      console.log(e);
      authContext.signOut();
    }
  }, []);

  const requestCalendarPermission = async () => {
    // if user is on android, we need only calendar permission
    // if user is on ios, we need calendar and reminders permission

    if (Platform.OS === 'android') {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status === Calendar.PermissionStatus.GRANTED;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    const { status: reminderStatus } = await Calendar.requestRemindersPermissionsAsync();
    return (
      status === Calendar.PermissionStatus.GRANTED &&
      reminderStatus === Calendar.PermissionStatus.GRANTED
    );
  };

  const createUserEventEntry = async (status: UserEventStatus, eventId: string) => {
    try {
      const userEventApi = new UserEventApi(session);
      userEventApi.create({
        eventId,
        status,
      });
      queryClient.invalidateQueries(['declinedEvents']);
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(getAxiosError(e));
      }
    }
  };

  const updateUserEventEntry = async (status: UserEventStatus, userEventId: string) => {
    try {
      const userEventApi = new UserEventApi(session);
      userEventApi.update(userEventId, {
        status,
      });

      queryClient.invalidateQueries(['declinedEvents']);
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(getAxiosError(e));
      }
    }
  };

  const eventControlButtons = () => {
    // if user already accepted the event
    if (event?.userStatus === UserEventStatus.Accepted) {
      return (
        <View className="flex flex-row justify-between mt-10 items-center">
          <TextWrapper className="text-base">Already Accepted this event</TextWrapper>
          <Pressable
            className="bg-error px-6 py-2 rounded-lg"
            onPress={async () => {
              const eventId = event?.id;
              if (!eventId || !event.userEventId) return;
              updateUserEventEntry(UserEventStatus.Declined, event.userEventId);
              // remove event from calendar
              const permission = await requestCalendarPermission();
              if (!permission) {
                return;
              }

              const calendarId = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
              const events = await Calendar.getEventsAsync(
                [calendarId[0].id],
                event.startTime,
                event.endTime
              );

              if (events.length > 0) {
                Calendar.deleteEventAsync(events[0].id);
              }

              navigation.goBack();
            }}>
            <TextWrapper className="text-black text-base">Decline</TextWrapper>
          </Pressable>
        </View>
      );
    }

    // if user already declined the event
    if (event?.userStatus === UserEventStatus.Declined) {
      return (
        <View className="flex flex-row justify-between mt-10 items-center">
          <TextWrapper className="text-base">Already Declined this event</TextWrapper>
          <Pressable
            className="bg-brand px-6 py-2 rounded-lg"
            onPress={async () => {
              const eventId = event?.id;
              if (!eventId || !event.userEventId) return;

              updateUserEventEntry(UserEventStatus.Accepted, event.userEventId);

              const eventDetails = {
                title: event?.eventName,
                startDate: event?.startTime,
                endDate: event?.endTime,
                notes: `Event created by the following Club: ${
                  event.clubs ? event?.clubs[0].clubName : 'Unkown Club'
                }\n\nDescription: ${
                  event.eventDescription
                }\n\nAdded to the calendar by the LAU Events App`,
                alarms: [
                  { relativeOffset: -1 * 24 * 60, method: Calendar.AlarmMethod.ALERT },
                  { relativeOffset: -1 * 60, method: Calendar.AlarmMethod.ALERT },
                ],
              };

              const userEventApi = new UserEventApi(session);
              userEventApi.update(event.userEventId, {
                status: UserEventStatus.Accepted,
              });

              // request permission to access calendar
              const permission = await requestCalendarPermission();
              if (!permission) {
                return;
              }
              const calendarId = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
              const calenderEventId = await Calendar.createEventAsync(
                calendarId.find((calendar) => calendar.allowsModifications)?.id || calendarId[0].id,
                eventDetails
              );
              // Android only
              if (Platform.OS === 'android') {
                Calendar.openEventInCalendar(calenderEventId);
              }
              navigation.goBack();
            }}>
            <TextWrapper className="text-white text-base">Accept</TextWrapper>
          </Pressable>
        </View>
      );
    }

    if (dayjs(event?.startTime).isAfter(dayjs())) {
      return (
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row w-full justify-between items-center mt-10">
            <Pressable
              className="bg-gray/40 px-6 py-2 rounded-lg"
              onPress={() => {
                const eventId = event?.id;
                if (!eventId) return;
                createUserEventEntry(UserEventStatus.Declined, eventId);
                navigation.goBack();
              }}>
              <TextWrapper className="text-black text-base">Decline</TextWrapper>
            </Pressable>
            <View className="w-4" />
            <Pressable
              className="bg-brand px-8 py-2 rounded-lg"
              onPress={async () => {
                const eventId = event?.id;
                if (!eventId) return;
                createUserEventEntry(UserEventStatus.Accepted, eventId);

                const eventDetails = {
                  title: event?.eventName,
                  startDate: event?.startTime,
                  endDate: event?.endTime,
                  notes: `Event created by the following Club: ${
                    event.clubs ? event?.clubs[0].clubName : 'Unkown Club'
                  }\n\nDescription: ${
                    event.eventDescription
                  }\n\nAdded to the calendar by the LAU Events App`,
                  alarms: [
                    { relativeOffset: -1 * 24 * 60, method: Calendar.AlarmMethod.ALERT },
                    { relativeOffset: -1 * 60, method: Calendar.AlarmMethod.ALERT },
                  ],
                };
                // request permission to access calendar
                const permission = await requestCalendarPermission();
                if (!permission) {
                  return;
                }
                const calendarId = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

                const calenderEventId = await Calendar.createEventAsync(
                  // get the first calendar that allows modifications
                  calendarId.find((calendar) => calendar.allowsModifications)?.id ||
                    calendarId[0].id,
                  eventDetails
                );
                // Android only
                if (Platform.OS === 'android') {
                  Calendar.openEventInCalendar(calenderEventId);
                }
                navigation.goBack();
              }}>
              <TextWrapper className="text-white text-base">Accept</TextWrapper>
            </Pressable>
          </View>
        </View>
      );
    } else {
      return (
        <View className="flex flex-row justify-between items-center">
          <TextWrapper className="text-2xl">
            Event have already passed check out other events!
          </TextWrapper>
        </View>
      );
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-brand-lighter relative py-10 px-8 flex justify-between overflow-hidden">
      <View className="absolute top-0 left-0">
        <WaveTopLeftSVG />
      </View>
      <View className="absolute bottom-1/4 right-0">
        <WaveRightSVG />
      </View>
      <View className="w-full flex justify-center items-center relative flex-row">
        <Pressable
          className="absolute left-0 w-10 h-10 flex justify-center items-center"
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowRight
            width={18}
            height={18}
            color="#fff"
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </Pressable>
        <TextWrapper className="text-2xl">Event Details</TextWrapper>
      </View>
      <View className="bg-white w-full px-4 py-4 rounded-lg flex flex-col mt-5 shadow-xl shadow-black">
        <View className="w-full aspect-video">
          <ImageBackground
            source={
              event && event.imagePath
                ? { uri: API_URL + '/' + event.imagePath }
                : event_placeholder
            }
            resizeMode="cover"
            borderRadius={10}
            className="w-full h-full"></ImageBackground>
        </View>
        <TextWrapper className="font-bold text-black text-xl mt-3">{event?.eventName}</TextWrapper>
        <TextWrapper className="text-gray text-base mt-2">
          {event?.startTime ? dayjs(event.startTime).format('MMMM D - HH:mm a') : 'Unkown Date'}
        </TextWrapper>
        <View className="flex flex-row flex-wrap items-center mt-4">
          <TextWrapper className="text-black font-bold text-base mt-2 mr-1">Clubs</TextWrapper>
          {event?.clubs &&
            event.clubs.map((club, index) => <Tag text={club.clubName} key={index} />)}
        </View>
        <TextWrapper className="text-black font-bold text-base mt-2">Description</TextWrapper>
        <TextWrapper className="text-gray text-xs mt-2">{event?.eventDescription}</TextWrapper>
      </View>
      {eventControlButtons()}
    </SafeAreaView>
  );
};
