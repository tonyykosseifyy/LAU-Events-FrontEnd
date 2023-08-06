import * as yup from 'yup';
import { View, Text, Pressable, TextInput, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowRight from '../../../assets/Icons/arrow_right.svg';
import TextWrapper from '../../components/TextWrapper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalenderSVG from '../../../assets/Icons/calender.svg';
import dayjs from 'dayjs';
import MultiselectDropdown from '../../components/MultiselectDropdown';
import { Club } from '../../models/club';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { ClubApi } from '../../utils/api/crud/clubs';
import { ScrollView } from 'react-native-gesture-handler';
import { EventApi } from '../../utils/api/crud/events';
import { EventStatus } from '../../models/event';
import { useQueryClient } from '@tanstack/react-query';

type EventForm = {
  eventName: string;
  eventDescription: string;
  startDate: Date;
  endDate: Date;
};

const EventFormSchema = yup.object().shape({
  eventName: yup.string().required('Event name is required'),
  eventDescription: yup.string().required('Event description is required'),
  startDate: yup
    .date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(new Date(), 'End date cannot be in the past')
    .min(yup.ref('startDate'), 'End date cannot be before start date'),
});

const AddEvent = ({ navigation }: any) => {
  const queryClient = useQueryClient();
  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<EventForm>({
    resolver: yupResolver(EventFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    if (!session) return;
    const fetchClubs = async () => {
      const res = await new ClubApi(session).find();
      setClubs(res);
    };
    fetchClubs();
  }, []);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);
  const [clubsError, setClubsError] = useState<string | null>(null);

  const toggleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
  };
  const toggleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
  };

  const onSubmit = async (data: EventForm) => {
    if (selectedClubs.length === 0) {
      setClubsError('Select at least one club');
      return;
    }

    try {
      const clubIds = selectedClubs.map((i) => i.id);
      const res = await new EventApi(session).create({
        clubIds,
        endTime: data.endDate,
        startTime: data.startDate,
        eventDescription: data.eventDescription,
        eventName: data.eventName,
        status: EventStatus.Active,
      });

      if (res) {
        queryClient.refetchQueries(['events']);
        queryClient.invalidateQueries(['events']);
        queryClient.fetchQuery(['events']);
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView className="bg-brand-lighter w-full h-full py-10 px-6">
        <View className="w-full flex justify-center items-center relative flex-row">
          <Pressable
            className="absolute left-4 w-10 h-10 flex justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}>
            <ArrowRight width={18} height={18} color="#006E58" rotation={180}></ArrowRight>
          </Pressable>
          <TextWrapper className="text-2xl">Add Event</TextWrapper>
        </View>

        <View className="flex flex-col mt-10">
          <Controller
            control={control}
            name="eventName"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black ">Event Name</TextWrapper>
                <View className="h-2" />
                <TextInput
                  className="bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400"
                  cursorColor="green"
                  onBlur={onBlur}
                  placeholder="Event Name"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
                <View className="h-2" />
                {errors.eventName && (
                  <TextWrapper className="text-error text-sm">
                    {errors.eventName.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="eventDescription"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">Event Description</TextWrapper>
                <View className="h-2" />
                <TextInput
                  className="bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400"
                  cursorColor="green"
                  onBlur={onBlur}
                  placeholder="Event Description"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View className="h-2" />
                {errors.eventName && (
                  <TextWrapper className="text-error text-sm">
                    {errors.eventName.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <View className="z-20">
            <TextWrapper className="text-base text-black mt-3">Clubs</TextWrapper>
            <View className="h-2" />
            <MultiselectDropdown
              options={clubs}
              onChange={setSelectedClubs}
              selectedOptions={selectedClubs}
            />
            <View className="h-2" />
            {clubsError && <TextWrapper className="text-error text-sm">{clubsError}</TextWrapper>}
          </View>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">Start Date</TextWrapper>
                <View className="h-2" />
                <DateTimePickerModal
                  onCancel={toggleStartDatePicker}
                  isVisible={showStartDatePicker}
                  mode="datetime"
                  onConfirm={(date) => {
                    onChange(date);
                    toggleStartDatePicker();
                  }}
                  date={value}
                  minimumDate={new Date()}
                />
                <Pressable
                  onPress={toggleStartDatePicker}
                  className="flex flex-row justify-between items-center bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400">
                  <CalenderSVG width={20} height={20} />
                  <View className="w-2" />
                  <TextInput
                    className="flex-1 text-black"
                    cursorColor="green"
                    onBlur={onBlur}
                    placeholder="Start Date"
                    value={dayjs(value).format('DD MMM YYYY hh:mm A')}
                    editable={false}
                  />
                </Pressable>
                <View className="h-2" />
                {errors.startDate && (
                  <TextWrapper className="text-error text-sm">
                    {errors.startDate.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">End Date</TextWrapper>
                <View className="h-2" />
                <DateTimePickerModal
                  onCancel={toggleEndDatePicker}
                  isVisible={showEndDatePicker}
                  mode="datetime"
                  onConfirm={(date) => {
                    toggleEndDatePicker();
                    onChange(date);
                  }}
                  date={value}
                  minimumDate={getValues('endDate') ?? new Date()}
                />
                <Pressable
                  onPress={toggleEndDatePicker}
                  className="flex flex-row justify-between items-center bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400">
                  <CalenderSVG width={20} height={20} />
                  <View className="w-2" />
                  <TextInput
                    className="flex-1 text-black"
                    cursorColor="green"
                    onBlur={onBlur}
                    placeholder="End Date"
                    value={dayjs(value).format('DD MMM YYYY hh:mm A')}
                    editable={false}
                  />
                </Pressable>
                <View className="h-2" />
                {errors.endDate && (
                  <TextWrapper className="text-error text-sm">{errors.endDate.message}</TextWrapper>
                )}
              </>
            )}
          />
        </View>
        <View className="flex flex-row w-full justify-between items-center mt-10">
          <Pressable
            className="bg-gray/40 px-6 py-2 rounded-lg"
            onPress={() => {
              navigation.goBack();
            }}>
            <TextWrapper className="text-black text-base">Cancel</TextWrapper>
          </Pressable>
          <View className="w-4" />
          <Pressable
            className="bg-brand px-8 py-2 rounded-lg"
            onPress={() => {
              trigger();
              if (isValid) {
                const vals = getValues();
                onSubmit(vals);
              }
            }}>
            <TextWrapper className="text-white text-base">Add</TextWrapper>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEvent;
